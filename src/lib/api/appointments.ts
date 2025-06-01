import axiosInstance from '@/lib/axios';
import { Appointment, AppointmentRequest } from '@/types';

export const appointmentsApi = {
    // Create appointment
    createAppointment: async (data: AppointmentRequest): Promise<Appointment> => {
        const response = await axiosInstance.post<Appointment>('/appointments', data);
        return response.data;
    },

    // Get appointment by ID
    getAppointmentById: async (id: number): Promise<Appointment> => {
        const response = await axiosInstance.get<Appointment>(`/appointments/${id}`);
        return response.data;
    },

    // Get customer appointments
    getCustomerAppointments: async (customerId: number): Promise<Appointment[]> => {
        const response = await axiosInstance.get<Appointment[]>(`/appointments/customer/${customerId}`);
        return response.data;
    },

    // Get staff appointments
    getStaffAppointments: async (staffId: number): Promise<Appointment[]> => {
        const response = await axiosInstance.get<Appointment[]>(`/appointments/staff/${staffId}`);
        return response.data;
    },

    // Get staff appointments by date
    getStaffAppointmentsByDate: async (staffId: number, date: string): Promise<Appointment[]> => {
        const response = await axiosInstance.get<Appointment[]>(`/appointments/staff/${staffId}/date/${date}`);
        return response.data;
    },

    // Complete appointment (staff only)
    completeAppointment: async (id: number): Promise<Appointment> => {
        const response = await axiosInstance.put<Appointment>(`/appointments/${id}/complete`);
        return response.data;
    },

    // Cancel appointment
    cancelAppointment: async (id: number): Promise<void> => {
        await axiosInstance.put(`/appointments/${id}/cancel`);
    },
};