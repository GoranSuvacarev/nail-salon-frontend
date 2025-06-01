
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Calendar, Plus, Loader2, AlertCircle } from 'lucide-react';
import { Appointment } from '@/types';
import { appointmentsApi } from '@/lib/api/appointments';
import AppointmentCard from '@/components/appointments/AppointmentCard';
import Modal from '@/components/ui/Modal';
import toast from 'react-hot-toast';

export default function AppointmentsPage() {
    const { user } = useAuth();
    const router = useRouter();
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'upcoming' | 'past'>('upcoming');
    const [cancelModalOpen, setCancelModalOpen] = useState(false);
    const [appointmentToCancel, setAppointmentToCancel] = useState<number | null>(null);
    const [cancelling, setCancelling] = useState(false);

    useEffect(() => {
        if (user) {
            fetchAppointments();
        }
    }, [user]);

    const fetchAppointments = async () => {
        if (!user) return;

        try {
            setLoading(true);
            const data = await appointmentsApi.getCustomerAppointments(user.id);
            setAppointments(data);
        } catch (error) {
            toast.error('Failed to load appointments');
            console.error('Error fetching appointments:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCancelClick = (appointmentId: number) => {
        setAppointmentToCancel(appointmentId);
        setCancelModalOpen(true);
    };

    const handleCancelConfirm = async () => {
        if (!appointmentToCancel) return;

        try {
            setCancelling(true);
            await appointmentsApi.cancelAppointment(appointmentToCancel);
            toast.success('Appointment cancelled successfully');
            setCancelModalOpen(false);
            setAppointmentToCancel(null);
            fetchAppointments(); // Refresh the list
        } catch (error) {
            toast.error('Failed to cancel appointment');
            console.error('Error cancelling appointment:', error);
        } finally {
            setCancelling(false);
        }
    };

    const filterAppointments = () => {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        switch (filter) {
            case 'upcoming':
                return appointments.filter(apt =>
                    new Date(apt.appointmentDate) >= today &&
                    apt.status === 'SCHEDULED'
                );
            case 'past':
                return appointments.filter(apt =>
                    new Date(apt.appointmentDate) < today ||
                    apt.status === 'COMPLETED' ||
                    apt.status === 'CANCELLED'
                );
            default:
                return appointments;
        }
    };

    const filteredAppointments = filterAppointments();

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
            </div>
        );
    }

    return (
        <div className="container-app py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">My Appointments</h1>
                <Link href="/appointments/new" className="btn-primary flex items-center">
                    <Plus className="h-5 w-5 mr-2" />
                    Book Appointment
                </Link>
            </div>

            {/* Filter Tabs */}
            <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg w-fit">
                {(['upcoming', 'past', 'all'] as const).map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setFilter(tab)}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                            filter === tab
                                ? 'bg-white text-primary-600 shadow-sm'
                                : 'text-gray-600 hover:text-gray-900'
                        }`}
                    >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                ))}
            </div>

            {filteredAppointments.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredAppointments.map((appointment) => (
                        <AppointmentCard
                            key={appointment.id}
                            appointment={appointment}
                            onCancel={handleCancelClick}
                        />
                    ))}
                </div>
            ) : (
                <div className="card text-center py-12">
                    <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-gray-700 mb-2">
                        {filter === 'upcoming' ? 'No upcoming appointments' :
                            filter === 'past' ? 'No past appointments' :
                                'No appointments yet'}
                    </h2>
                    <p className="text-gray-500 mb-6">
                        {filter === 'upcoming' && 'Book your first appointment to get started!'}
                    </p>
                    {filter === 'upcoming' && (
                        <Link href="/appointments/new" className="btn-primary">
                            Book Now
                        </Link>
                    )}
                </div>
            )}

            {/* Cancel Confirmation Modal */}
            <Modal
                isOpen={cancelModalOpen}
                onClose={() => setCancelModalOpen(false)}
                title="Cancel Appointment"
                footer={
                    <div className="flex gap-3 justify-end">
                        <button
                            onClick={() => setCancelModalOpen(false)}
                            className="btn-secondary"
                            disabled={cancelling}
                        >
                            Keep Appointment
                        </button>
                        <button
                            onClick={handleCancelConfirm}
                            className="btn-danger flex items-center"
                            disabled={cancelling}
                        >
                            {cancelling ? (
                                <>
                                    <Loader2 className="animate-spin h-4 w-4 mr-2" />
                                    Cancelling...
                                </>
                            ) : (
                                'Yes, Cancel'
                            )}
                        </button>
                    </div>
                }
            >
                <div className="flex items-start">
                    <AlertCircle className="h-5 w-5 text-yellow-500 mr-3 mt-0.5" />
                    <div>
                        <p className="text-gray-700">
                            Are you sure you want to cancel this appointment?
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                            This action cannot be undone.
                        </p>
                    </div>
                </div>
            </Modal>
        </div>
    );
}