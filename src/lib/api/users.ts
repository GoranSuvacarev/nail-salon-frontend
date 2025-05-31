// src/lib/api/users.ts
import axiosInstance from '@/lib/axios';
import { User } from '@/types';

export const usersApi = {
    // Get all users (staff only)
    getAllUsers: async (): Promise<User[]> => {
        const response = await axiosInstance.get<User[]>('/users');
        return response.data;
    },

    // Get user by ID
    getUserById: async (id: number): Promise<User> => {
        const response = await axiosInstance.get<User>(`/users/${id}`);
        return response.data;
    },

    // Get users by role
    getUsersByRole: async (role: string): Promise<User[]> => {
        const response = await axiosInstance.get<User[]>(`/users/role/${role}`);
        return response.data;
    },

    // Create user (staff only)
    createUser: async (user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> => {
        const response = await axiosInstance.post<User>('/users', user);
        return response.data;
    },

    // Update user
    updateUser: async (id: number, user: Partial<User>): Promise<User> => {
        const response = await axiosInstance.put<User>(`/users/${id}`, user);
        return response.data;
    },

    // Delete user (staff only)
    deleteUser: async (id: number): Promise<void> => {
        await axiosInstance.delete(`/users/${id}`);
    },
};