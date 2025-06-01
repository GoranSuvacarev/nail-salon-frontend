import axiosInstance from '@/lib/axios';
import { User, UpdateProfileRequest, ChangePasswordRequest, Appointment } from '@/types';

export const profileApi = {
    // Get current user profile
    getProfile: async (): Promise<User> => {
        const response = await axiosInstance.get<User>('/profile');
        return response.data;
    },

    // Update profile
    updateProfile: async (data: UpdateProfileRequest): Promise<User> => {
        const response = await axiosInstance.put<User>('/profile', data);
        return response.data;
    },

    // Change password
    changePassword: async (data: ChangePasswordRequest): Promise<void> => {
        await axiosInstance.put('/profile/password', data);
    },

    // Get user's appointments
    getMyAppointments: async (): Promise<Appointment[]> => {
        const response = await axiosInstance.get<Appointment[]>('/profile/appointments');
        return response.data;
    },
};