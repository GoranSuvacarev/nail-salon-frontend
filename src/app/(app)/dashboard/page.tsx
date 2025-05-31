// src/app/(app)/dashboard/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { Appointment } from '@/types';
import { appointmentsApi } from '@/lib/api/appointments';
import { Calendar, Clock, Users, DollarSign, Loader2, CheckCircle } from 'lucide-react';
import { format, isToday, isTomorrow, startOfToday } from 'date-fns';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function DashboardPage() {
    const { user } = useAuth();
    const router = useRouter();
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        todayCount: 0,
        weekCount: 0,
        totalRevenue: 0,
        completedCount: 0,
    });

    useEffect(() => {
        if (!user || user.role !== 'STAFF') {
            router.push('/appointments');
            return;
        }
        fetchAppointments();
    }, [user, router]);

    const fetchAppointments = async () => {
        if (!user) return;

        try {
            setLoading(true);
            const data = await appointmentsApi.getStaffAppointments(user.id);
            setAppointments(data);
            calculateStats(data);
        } catch (error) {
            toast.error('Failed to load appointments');
            console.error('Error fetching appointments:', error);
        } finally {
            setLoading(false);
        }
    };

    const calculateStats = (appointments: Appointment[]) => {
        const today = startOfToday();
        const weekFromNow = new Date(today);
        weekFromNow.setDate(weekFromNow.getDate() + 7);

        const stats = appointments.reduce((acc, apt) => {
            const aptDate = new Date(apt.appointmentDate);

            if (isToday(aptDate) && apt.status === 'SCHEDULED') {
                acc.todayCount++;
            }

            if (aptDate >= today && aptDate <= weekFromNow && apt.status === 'SCHEDULED') {
                acc.weekCount++;
            }

            if (apt.status === 'COMPLETED') {
                acc.completedCount++;
                acc.totalRevenue += Number(apt.service.price);
            }

            return acc;
        }, {
            todayCount: 0,
            weekCount: 0,
            totalRevenue: 0,
            completedCount: 0,
        });

        setStats(stats);
    };

    const handleComplete = async (appointmentId: number) => {
        try {
            await appointmentsApi.completeAppointment(appointmentId);
            toast.success('Appointment marked as completed');
            fetchAppointments();
        } catch (error) {
            toast.error('Failed to complete appointment');
            console.error('Error completing appointment:', error);
        }
    };

    const getTodayAppointments = () => {
        return appointments
            .filter(apt => isToday(new Date(apt.appointmentDate)) && apt.status === 'SCHEDULED')
            .sort((a, b) => a.startTime.localeCompare(b.startTime));
    };

    const getUpcomingAppointments = () => {
        const today = startOfToday();
        return appointments
            .filter(apt => {
                const aptDate = new Date(apt.appointmentDate);
                return aptDate > today && apt.status === 'SCHEDULED';
            })
            .sort((a, b) => {
                const dateCompare = a.appointmentDate.localeCompare(b.appointmentDate);
                return dateCompare !== 0 ? dateCompare : a.startTime.localeCompare(b.startTime);
            })
            .slice(0, 5); // Show only next 5
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
            </div>
        );
    }

    const todayAppointments = getTodayAppointments();
    const upcomingAppointments = getUpcomingAppointments();

    return (
        <div className="container-app py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Staff Dashboard</h1>
                <p className="text-gray-600 mt-2">Welcome back, {user?.firstName}!</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="card">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Today's Appointments</p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">{stats.todayCount}</p>
                        </div>
                        <Calendar className="h-8 w-8 text-primary-500" />
                    </div>
                </div>

                <div className="card">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">This Week</p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">{stats.weekCount}</p>
                        </div>
                        <Clock className="h-8 w-8 text-blue-500" />
                    </div>
                </div>

                <div className="card">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Completed</p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">{stats.completedCount}</p>
                        </div>
                        <Users className="h-8 w-8 text-green-500" />
                    </div>
                </div>

                <div className="card">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Total Revenue</p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">${stats.totalRevenue}</p>
                        </div>
                        <DollarSign className="h-8 w-8 text-yellow-500" />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Today's Schedule */}
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold text-gray-900">Today's Schedule</h2>
                        <Link href="/schedule" className="text-primary-600 hover:text-primary-700 text-sm">
                            View Full Schedule →
                        </Link>
                    </div>

                    {todayAppointments.length > 0 ? (
                        <div className="space-y-3">
                            {todayAppointments.map((appointment) => (
                                <div key={appointment.id} className="card">
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-gray-900">
                          {appointment.startTime} - {appointment.endTime}
                        </span>
                                                <span className="text-sm text-gray-500">
                          ({appointment.service.durationMinutes} min)
                        </span>
                                            </div>
                                            <p className="text-sm text-gray-600">
                                                {appointment.customer.firstName} {appointment.customer.lastName}
                                            </p>
                                            <p className="text-sm font-medium text-primary-600">
                                                {appointment.service.name}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => handleComplete(appointment.id)}
                                            className="btn-primary text-sm py-1 px-3 flex items-center"
                                        >
                                            <CheckCircle className="h-3 w-3 mr-1" />
                                            Complete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="card text-center py-8 text-gray-500">
                            No appointments scheduled for today
                        </div>
                    )}
                </div>

                {/* Upcoming Appointments */}
                <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Upcoming Appointments</h2>

                    {upcomingAppointments.length > 0 ? (
                        <div className="space-y-3">
                            {upcomingAppointments.map((appointment) => {
                                const aptDate = new Date(appointment.appointmentDate);
                                const dateLabel = isTomorrow(aptDate)
                                    ? 'Tomorrow'
                                    : format(aptDate, 'EEEE, MMM d');

                                return (
                                    <div key={appointment.id} className="card">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">{dateLabel}</p>
                                                <p className="text-sm text-gray-600">
                                                    {appointment.startTime} - {appointment.service.name}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    {appointment.customer.firstName} {appointment.customer.lastName}
                                                </p>
                                            </div>
                                            <span className="text-sm font-medium text-primary-600">
                        ${appointment.service.price}
                      </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="card text-center py-8 text-gray-500">
                            No upcoming appointments
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}