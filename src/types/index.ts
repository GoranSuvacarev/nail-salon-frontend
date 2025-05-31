// src/types/index.ts

// User types matching your backend User entity
export interface User {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
    role: 'CUSTOMER' | 'STAFF';
    createdAt?: string;
    updatedAt?: string;
}

// Auth types matching your DTOs
export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone: string;
}

export interface AuthResponse {
    id: number;
    token: string;
    refreshToken: string;
    email: string;
    role: string;
    firstName: string;
    lastName: string;
}

export interface TokenRefreshResponse {
    accessToken: string;
    tokenType: string;
}

// Service types matching your backend Service entity
export interface Service {
    id: number;
    name: string;
    description: string;
    price: number;
    durationMinutes: number;
    category: ServiceCategory;
    createdAt?: string;
}

export type ServiceCategory = 'MANICURE' | 'PEDICURE' | 'GEL' | 'NAIL_ART' | 'TREATMENT';

// Appointment types matching your backend
export interface Appointment {
    id: number;
    customer: User;
    staff: User;
    service: Service;
    appointmentDate: string;
    startTime: string;
    endTime: string;
    status: AppointmentStatus;
    createdAt?: string;
}

export type AppointmentStatus = 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';

export interface AppointmentRequest {
    customerId: number;
    staffId: number;
    serviceId: number;
    appointmentDate: string;
    startTime: string;
}

// Staff Availability types
export interface StaffAvailability {
    id: number;
    staff: User;
    dayOfWeek: DayOfWeek;
    startTime: string;
    endTime: string;
    isAvailable: boolean;
}

export type DayOfWeek = 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY';

export interface StaffAvailabilityRequest {
    staffId: number;
    dayOfWeek: DayOfWeek;
    startTime: string;
    endTime: string;
}

// Profile update types
export interface UpdateProfileRequest {
    firstName: string;
    lastName: string;
    phone: string;
}

export interface ChangePasswordRequest {
    oldPassword: string;
    newPassword: string;
}

// API Error type
export interface ApiError {
    error: string;
    message?: string;
    status?: number;
}