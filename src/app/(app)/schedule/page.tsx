'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { Appointment } from '@/types';
import { appointmentsApi } from '@/lib/api/appointments';
import AppointmentCard from '@/components/appointments/AppointmentCard';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, isToday } from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function SchedulePage() {
    const { user } = useAuth();
    const router = useRouter();
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentWeek, setCurrentWeek] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());

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
        } catch (error) {
            toast.error('Failed to load schedule');
            console.error('Error fetching appointments:', error);
        } finally {
            setLoading(false);
        }
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

    const weekDays = eachDayOfInterval({
        start: startOfWeek(currentWeek, { weekStartsOn: 1 }), // Start on Monday
        end: endOfWeek(currentWeek, { weekStartsOn: 1 }),
    });

    const getAppointmentsForDate = (date: Date) => {
        return appointments
            .filter(apt => isSameDay(new Date(apt.appointmentDate), date))
            .sort((a, b) => a.startTime.localeCompare(b.startTime));
    };

    const selectedDateAppointments = getAppointmentsForDate(selectedDate);

    const navigateWeek = (direction: 'prev' | 'next') => {
        const newWeek = new Date(currentWeek);
        newWeek.setDate(newWeek.getDate() + (direction === 'next' ? 7 : -7));
        setCurrentWeek(newWeek);

        // Update selected date to stay within the new week
        const newSelectedDate = new Date(selectedDate);
        newSelectedDate.setDate(newSelectedDate.getDate() + (direction === 'next' ? 7 : -7));
        setSelectedDate(newSelectedDate);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
            </div>
        );
    }

    return (
        <div className="container-app py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">My Schedule</h1>

            {/* Week Navigation */}
            <div className="flex items-center justify-between mb-6">
                <button
                    onClick={() => navigateWeek('prev')}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    <ChevronLeft className="h-5 w-5" />
                </button>

                <h2 className="text-lg font-semibold text-gray-900">
                    {format(weekDays[0], 'MMM d')} - {format(weekDays[6], 'MMM d, yyyy')}
                </h2>

                <button
                    onClick={() => navigateWeek('next')}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    <ChevronRight className="h-5 w-5" />
                </button>
            </div>

            {/* Week View */}
            <div className="grid grid-cols-7 gap-2 mb-8">
                {weekDays.map((day) => {
                    const dayAppointments = getAppointmentsForDate(day);
                    const isSelected = isSameDay(day, selectedDate);
                    const hasAppointments = dayAppointments.length > 0;

                    return (
                        <button
                            key={day.toISOString()}
                            onClick={() => setSelectedDate(day)}
                            className={`p-4 rounded-lg border transition-all ${
                                isSelected
                                    ? 'bg-primary-50 border-primary-500'
                                    : isToday(day)
                                        ? 'bg-blue-50 border-blue-300'
                                        : 'bg-white border-gray-200 hover:border-gray-300'
                            }`}
                        >
                            <div className="text-center">
                                <p className="text-xs font-medium text-gray-600">
                                    {format(day, 'EEE')}
                                </p>
                                <p className={`text-lg font-semibold mt-1 ${
                                    isSelected ? 'text-primary-600' :
                                        isToday(day) ? 'text-blue-600' :
                                            'text-gray-900'
                                }`}>
                                    {format(day, 'd')}
                                </p>
                                {hasAppointments && (
                                    <div className="mt-2">
                    <span className={`inline-block w-2 h-2 rounded-full ${
                        isSelected ? 'bg-primary-500' : 'bg-gray-400'
                    }`} />
                                        <p className="text-xs text-gray-600 mt-1">
                                            {dayAppointments.length}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </button>
                    );
                })}
            </div>

            {/* Selected Day Appointments */}
            <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                    <Calendar className="h-5 w-5 mr-2" />
                    {format(selectedDate, 'EEEE, MMMM d, yyyy')}
                    {isToday(selectedDate) && (
                        <span className="ml-2 text-sm font-normal text-primary-600">(Today)</span>
                    )}
                </h3>

                {selectedDateAppointments.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {selectedDateAppointments.map((appointment) => (
                            <AppointmentCard
                                key={appointment.id}
                                appointment={appointment}
                                onComplete={handleComplete}
                                isStaffView={true}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="card text-center py-12">
                        <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">No appointments scheduled for this day</p>
                    </div>
                )}
            </div>
        </div>
    );
}