'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import { User, LoginRequest, RegisterRequest, AuthResponse } from '@/types';
import axiosInstance from './axios';
import toast from 'react-hot-toast';

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: (data: LoginRequest) => Promise<void>;
    register: (data: RegisterRequest) => Promise<void>;
    logout: () => void;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    // Fetch user profile
    const fetchUserProfile = useCallback(async () => {
        try {
            const response = await axiosInstance.get<User>('/profile');
            setUser(response.data);
        } catch (error) {
            console.error('Failed to fetch user profile:', error);
            throw error;
        }
    }, []);

    // Initialize auth on mount
    useEffect(() => {
        const initAuth = async () => {
            const token = Cookies.get('token');

            if (token) {
                try {
                    // Decode token to check if it's valid
                    const decoded = jwtDecode(token);
                    const currentTime = Date.now() / 1000;

                    if (decoded.exp && decoded.exp > currentTime) {
                        // Token is valid, fetch user profile
                        await fetchUserProfile();
                    } else {
                        // Token expired, remove it
                        Cookies.remove('token');
                        Cookies.remove('refreshToken');
                    }
                } catch (error) {
                    console.error('Auth initialization error:', error);
                    Cookies.remove('token');
                    Cookies.remove('refreshToken');
                }
            }

            setIsLoading(false);
        };

        initAuth();
    }, [fetchUserProfile]);

    const login = async (data: LoginRequest) => {
        try {
            const response = await axiosInstance.post<AuthResponse>('/auth/login', data);
            const { token, refreshToken, ...userData } = response.data;

            // Store tokens
            Cookies.set('token', token, { expires: 1 }); // 1 day
            Cookies.set('refreshToken', refreshToken, { expires: 7 }); // 7 days

            // Fetch full user profile
            await fetchUserProfile();

            // Show success message
            toast.success('Welcome back!');

            // Redirect based on role
            if (userData.role === 'STAFF') {
                router.push('/dashboard');
            } else {
                router.push('/appointments');
            }
        } catch (error: any) {
            const message = error.response?.data?.error || 'Invalid email or password';
            toast.error(message);
            throw error;
        }
    };

    const register = async (data: RegisterRequest) => {
        try {
            const response = await axiosInstance.post<AuthResponse>('/auth/register', data);
            const { token, refreshToken, ...userData } = response.data;

            // Store tokens
            Cookies.set('token', token, { expires: 1 });
            Cookies.set('refreshToken', refreshToken, { expires: 7 });

            // Fetch full user profile
            await fetchUserProfile();

            // Show success message
            toast.success('Registration successful! Welcome to NailSalon!');

            // Redirect to appointments page (customers only can register)
            router.push('/appointments');
        } catch (error: any) {
            const message = error.response?.data?.error || 'Registration failed. Please try again.';
            toast.error(message);
            throw error;
        }
    };

    const logout = () => {
        // Clear tokens
        Cookies.remove('token');
        Cookies.remove('refreshToken');

        // Clear user state
        setUser(null);

        // Show message
        toast.success('Logged out successfully');

        // Redirect to home
        router.push('/');
    };

    const refreshUser = async () => {
        await fetchUserProfile();
    };

    return (
        <AuthContext.Provider
            value={{
        user,
            isLoading,
            login,
            register,
            logout,
            refreshUser,
    }}
>
    {children}
    </AuthContext.Provider>
);
}

// Custom hook to use auth context
export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}