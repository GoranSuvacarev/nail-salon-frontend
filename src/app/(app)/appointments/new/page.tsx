// src/app/(app)/appointments/new/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { User, Service } from '@/types';
import { appointmentsApi } from '@/lib/api/appointments';
import { servicesApi } from '@/lib/api/services';
import { usersApi } from '@/lib/api/users';
import BookingForm from '@/components/appointments/BookingForm';
import { Loader2, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function NewAppointmentPage() {
    const { user } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const preselectedStaffId = searchParams.get('staffId');

    const [staff, setStaff] = useState<User[]>([]);
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            router.push('/login');
            return;
        }

        if (user.role !== 'CUSTOMER') {
            toast.error('Only customers can book appointments');
            router.push('/appointments');
            return;
        }

        fetchData();
    }, [user, router]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [staffData, servicesData] = await Promise.all([
                usersApi.getUsersByRole('STAFF'),
                servicesApi.getAllServices(),
            ]);
            setStaff(staffData);
            setServices(servicesData);
        } catch (error) {
            toast.error('Failed to load booking information');
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (data: any) => {
        if (!user) return;

        try {
            const appointmentData = {
                ...data,
                customerId: user.id,
            };

            await appointmentsApi.createAppointment(appointmentData);
            toast.success('Appointment booked successfully!');
            router.push('/appointments');
        } catch (error: any) {
            const message = error.response?.data?.error || 'Failed to book appointment';
            toast.error(message);
        }
    };

    if (loading || !user) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
            </div>
        );
    }

    return (
        <div className="container-app py-8">
            <div className="max-w-2xl mx-auto">
                <Link
                    href="/appointments"
                    className="inline-flex items-center text-gray-600 hover:text-primary-600 mb-6"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to appointments
                </Link>

                <div className="card">
                    <h1 className="text-2xl font-bold text-gray-900 mb-6">Book New Appointment</h1>

                    <BookingForm
                        staff={staff}
                        services={services}
                        preselectedStaffId={preselectedStaffId ? Number(preselectedStaffId) : undefined}
                        customerId={user.id}
                        onSubmit={handleSubmit}
                    />
                </div>
            </div>
        </div>
    );
}