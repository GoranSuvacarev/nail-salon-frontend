import axiosInstance from '@/lib/axios';
import { Service, ServiceCategory } from '@/types';

export const servicesApi = {
    // Get all services
    getAllServices: async (): Promise<Service[]> => {
        const response = await axiosInstance.get<Service[]>('/services');
        return response.data;
    },

    // Get service by ID
    getServiceById: async (id: number): Promise<Service> => {
        const response = await axiosInstance.get<Service>(`/services/${id}`);
        return response.data;
    },

    // Get services by category
    getServicesByCategory: async (category: ServiceCategory): Promise<Service[]> => {
        const response = await axiosInstance.get<Service[]>(`/services/category/${category}`);
        return response.data;
    },

    // Create service (staff only)
    createService: async (service: Omit<Service, 'id' | 'createdAt'>): Promise<Service> => {
        const response = await axiosInstance.post<Service>('/services', service);
        return response.data;
    },

    // Update service (staff only)
    updateService: async (id: number, service: Partial<Service>): Promise<Service> => {
        const response = await axiosInstance.put<Service>(`/services/${id}`, service);
        return response.data;
    },

    // Delete service (staff only)
    deleteService: async (id: number): Promise<void> => {
        await axiosInstance.delete(`/services/${id}`);
    },
};