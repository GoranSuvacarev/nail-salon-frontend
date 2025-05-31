// src/components/appointments/BookingForm.tsx
'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { format, addDays, setHours, setMinutes, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isAfter, isBefore, startOfToday } from 'date-fns';
import { User, Service } from '@/types';
import { Loader2, Calendar, Clock, User as UserIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';

const schema = yup.object({
    staffId: yup.number().required('Please select a staff member'),
    serviceId: yup.number().required('Please select a service'),
    appointmentDate: yup.string().required('Please select a date'),
    startTime: yup.string().required('Please select a time'),
});

type FormData = yup.InferType<typeof schema>;

interface BookingFormProps {
    staff: User[];
    services: Service[];
    preselectedStaffId?: number;
    customerId: number;
    onSubmit: (data: FormData) => Promise<void>;
}

// Calendar Component
function DatePicker({ value, onChange }: { value: string | null; onChange: (date: string) => void }) {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const today = startOfToday();
    const maxDate = addDays(today, 30);

    const days = eachDayOfInterval({
        start: startOfMonth(currentMonth),
        end: endOfMonth(currentMonth),
    });

    const previousMonth = () => {
        setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1));
    };

    const nextMonth = () => {
        setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1));
    };

    const isDateDisabled = (date: Date) => {
        return date.getDay() === 0 || // Sunday
            isBefore(date, today) ||
            isAfter(date, maxDate);
    };

    const isDateSelected = (date: Date) => {
        return value ? isSameDay(date, new Date(value)) : false;
    };

    // Pad the calendar with empty cells for days before the first day of month
    const firstDayOfMonth = days[0].getDay();
    const emptyDays = Array.from({ length: firstDayOfMonth }, (_, i) => i);

    return (
        <div className="bg-white border border-gray-300 rounded-lg p-4">
            {/* Month Navigation */}
            <div className="flex items-center justify-between mb-4">
                <button
                    type="button"
                    onClick={previousMonth}
                    className="p-1 hover:bg-gray-100 rounded transition-colors"
                >
                    <ChevronLeft className="h-5 w-5" />
                </button>
                <h3 className="text-lg font-semibold">
                    {format(currentMonth, 'MMMM yyyy')}
                </h3>
                <button
                    type="button"
                    onClick={nextMonth}
                    className="p-1 hover:bg-gray-100 rounded transition-colors"
                >
                    <ChevronRight className="h-5 w-5" />
                </button>
            </div>

            {/* Day Names */}
            <div className="grid grid-cols-7 mb-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="text-center text-xs font-medium text-gray-600 py-2">
                        {day}
                    </div>
                ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-1">
                {/* Empty cells for padding */}
                {emptyDays.map(day => (
                    <div key={`empty-${day}`} />
                ))}

                {/* Actual days */}
                {days.map(day => {
                    const disabled = isDateDisabled(day);
                    const selected = isDateSelected(day);
                    const isToday = isSameDay(day, today);

                    return (
                        <button
                            key={day.toISOString()}
                            type="button"
                            onClick={() => !disabled && onChange(format(day, 'yyyy-MM-dd'))}
                            disabled={disabled}
                            className={`
                p-2 text-sm rounded-lg transition-colors
                ${disabled ? 'text-gray-300 cursor-not-allowed' : 'hover:bg-primary-50 cursor-pointer'}
                ${selected ? 'bg-primary-500 text-white hover:bg-primary-600' : ''}
                ${isToday && !selected ? 'font-bold text-primary-600' : ''}
                ${!isSameMonth(day, currentMonth) ? 'text-gray-300' : ''}
              `}
                        >
                            {format(day, 'd')}
                        </button>
                    );
                })}
            </div>

            <div className="mt-3 text-xs text-gray-500 text-center">
                Select a date within the next 30 days (Sundays unavailable)
            </div>
        </div>
    );
}

export default function BookingForm({
                                        staff,
                                        services,
                                        preselectedStaffId,
                                        customerId,
                                        onSubmit
                                    }: BookingFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedService, setSelectedService] = useState<Service | null>(null);

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm<FormData>({
        resolver: yupResolver(schema),
        defaultValues: {
            staffId: preselectedStaffId,
        },
    });

    const selectedServiceId = watch('serviceId');
    const selectedDate = watch('appointmentDate');
    const selectedTime = watch('startTime');
    const selectedStaffId = watch('staffId');

    const [bookedSlots, setBookedSlots] = useState<string[]>([]);
    const [loadingSlots, setLoadingSlots] = useState(false);

    useEffect(() => {
        if (selectedServiceId) {
            const service = services.find(s => s.id === Number(selectedServiceId));
            setSelectedService(service || null);
        }
    }, [selectedServiceId, services]);

    // Fetch booked slots when staff and date are selected
    useEffect(() => {
        if (selectedStaffId && selectedDate) {
            fetchBookedSlots();
        } else {
            setBookedSlots([]);
        }
    }, [selectedStaffId, selectedDate]);

    const fetchBookedSlots = async () => {
        try {
            setLoadingSlots(true);
            const { appointmentsApi } = await import('@/lib/api/appointments');
            const appointments = await appointmentsApi.getStaffAppointmentsByDate(
                Number(selectedStaffId),
                selectedDate
            );

            // Create a list of all blocked time slots
            const blockedSlots = new Set<string>();

            appointments
                .filter(apt => apt.status !== 'CANCELLED')
                .forEach(apt => {
                    // Add the appointment start time
                    blockedSlots.add(apt.startTime);

                    // Also block all slots during the appointment duration
                    const startHour = parseInt(apt.startTime.split(':')[0]);
                    const startMinute = parseInt(apt.startTime.split(':')[1]);
                    const endHour = parseInt(apt.endTime.split(':')[0]);
                    const endMinute = parseInt(apt.endTime.split(':')[1]);

                    // Calculate total minutes
                    const startTotalMinutes = startHour * 60 + startMinute;
                    const endTotalMinutes = endHour * 60 + endMinute;

                    // Block all 30-minute slots within the appointment
                    for (let minutes = startTotalMinutes; minutes < endTotalMinutes; minutes += 30) {
                        const hour = Math.floor(minutes / 60);
                        const minute = minutes % 60;
                        const timeSlot = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
                        blockedSlots.add(timeSlot);
                    }
                });

            setBookedSlots(Array.from(blockedSlots));
        } catch (error) {
            console.error('Error fetching booked slots:', error);
            toast.error('Failed to load availability');
        } finally {
            setLoadingSlots(false);
        }
    };

    // Generate time slots (9 AM to 5 PM, every 30 minutes)
    const timeSlots = Array.from({ length: 16 }, (_, i) => {
        const hour = Math.floor(i / 2) + 9;
        const minute = (i % 2) * 30;
        return format(setMinutes(setHours(new Date(), hour), minute), 'HH:mm');
    });

    const isTimeSlotAvailable = (time: string): boolean => {
        if (!selectedService) return true;

        // Check if the start time is already booked
        if (bookedSlots.includes(time)) return false;

        // Check if any part of the appointment would overlap with existing bookings
        const [hour, minute] = time.split(':').map(Number);
        const startMinutes = hour * 60 + minute;
        const endMinutes = startMinutes + selectedService.durationMinutes;

        // Check each 30-minute block that this appointment would occupy
        for (let minutes = startMinutes; minutes < endMinutes; minutes += 30) {
            const checkHour = Math.floor(minutes / 60);
            const checkMinute = minutes % 60;
            const checkTime = `${checkHour.toString().padStart(2, '0')}:${checkMinute.toString().padStart(2, '0')}`;

            if (bookedSlots.includes(checkTime)) {
                return false;
            }

            // Also check if this would go past business hours (6 PM)
            if (checkHour >= 18) {
                return false;
            }
        }

        return true;
    };

    const onFormSubmit = async (data: FormData) => {
        setIsSubmitting(true);
        try {
            await onSubmit(data);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
            {/* Staff Selection */}
            <div>
                <label className="label">Select Staff Member</label>
                <select
                    {...register('staffId', { valueAsNumber: true })}
                    className={`input ${errors.staffId ? 'input-error' : ''}`}
                    disabled={isSubmitting}
                >
                    <option value="">Choose a staff member</option>
                    {staff.map((member) => (
                        <option key={member.id} value={member.id}>
                            {member.firstName} {member.lastName}
                        </option>
                    ))}
                </select>
                {errors.staffId && (
                    <p className="mt-1 text-sm text-red-600">{errors.staffId.message}</p>
                )}
            </div>

            {/* Service Selection */}
            <div>
                <label className="label">Select Service</label>
                <select
                    {...register('serviceId', { valueAsNumber: true })}
                    className={`input ${errors.serviceId ? 'input-error' : ''}`}
                    disabled={isSubmitting}
                >
                    <option value="">Choose a service</option>
                    {services.map((service) => (
                        <option key={service.id} value={service.id}>
                            {service.name} - ${service.price} ({service.durationMinutes} min)
                        </option>
                    ))}
                </select>
                {errors.serviceId && (
                    <p className="mt-1 text-sm text-red-600">{errors.serviceId.message}</p>
                )}
            </div>

            {/* Date Selection with Calendar */}
            <div>
                <label className="label flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    Select Date
                </label>
                <input type="hidden" {...register('appointmentDate')} />
                <DatePicker
                    value={selectedDate}
                    onChange={(date) => setValue('appointmentDate', date)}
                />
                {selectedDate && (
                    <p className="mt-2 text-sm text-gray-600">
                        Selected: {format(new Date(selectedDate), 'EEEE, MMMM d, yyyy')}
                    </p>
                )}
                {errors.appointmentDate && (
                    <p className="mt-1 text-sm text-red-600">{errors.appointmentDate.message}</p>
                )}
            </div>

            {/* Time Selection */}
            <div>
                <label className="label flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    Select Time
                    {loadingSlots && <Loader2 className="h-3 w-3 ml-2 animate-spin" />}
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {timeSlots.map((time) => {
                        const isAvailable = isTimeSlotAvailable(time);
                        const isSelected = selectedTime === time;
                        const isDisabled = !isAvailable || isSubmitting || !selectedDate || !selectedStaffId || !selectedService;

                        return (
                            <button
                                key={time}
                                type="button"
                                disabled={isDisabled}
                                onClick={() => !isDisabled && setValue('startTime', time)}
                                className={`
                  px-3 py-2 text-sm rounded-lg border transition-all
                  ${!isAvailable
                                    ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed line-through'
                                    : isSelected
                                        ? 'bg-primary-500 text-white border-primary-500'
                                        : 'bg-white text-gray-700 border-gray-300 hover:border-primary-300 hover:bg-primary-50'
                                }
                  ${(!selectedDate || !selectedStaffId || !selectedService) && isAvailable ? 'opacity-50 cursor-not-allowed' : ''}
                `}
                            >
                                {time}
                            </button>
                        );
                    })}
                </div>
                <input type="hidden" {...register('startTime')} />
                {!selectedStaffId && (
                    <p className="mt-2 text-xs text-gray-500">Select a staff member to see available times</p>
                )}
                {!selectedDate && selectedStaffId && (
                    <p className="mt-2 text-xs text-gray-500">Select a date to see available times</p>
                )}
                {!selectedService && selectedStaffId && selectedDate && (
                    <p className="mt-2 text-xs text-gray-500">Select a service to see accurate availability</p>
                )}
                {errors.startTime && (
                    <p className="mt-1 text-sm text-red-600">{errors.startTime.message}</p>
                )}
            </div>

            {/* Summary */}
            {selectedService && (
                <div className="card bg-primary-50 border-primary-200">
                    <h3 className="font-semibold text-gray-900 mb-2">Booking Summary</h3>
                    <div className="space-y-1 text-sm">
                        {selectedStaffId && (
                            <p><span className="font-medium">Staff:</span> {
                                staff.find(s => s.id === Number(selectedStaffId))?.firstName
                            } {
                                staff.find(s => s.id === Number(selectedStaffId))?.lastName
                            }</p>
                        )}
                        <p><span className="font-medium">Service:</span> {selectedService.name}</p>
                        <p><span className="font-medium">Duration:</span> {selectedService.durationMinutes} minutes</p>
                        <p><span className="font-medium">Price:</span> ${selectedService.price}</p>
                        {selectedDate && (
                            <p><span className="font-medium">Date:</span> {format(new Date(selectedDate), 'EEEE, MMMM d, yyyy')}</p>
                        )}
                        {selectedTime && (
                            <p><span className="font-medium">Time:</span> {selectedTime}</p>
                        )}
                    </div>
                </div>
            )}

            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full btn-primary py-3 flex items-center justify-center"
            >
                {isSubmitting ? (
                    <>
                        <Loader2 className="animate-spin h-5 w-5 mr-2" />
                        Booking...
                    </>
                ) : (
                    'Book Appointment'
                )}
            </button>
        </form>
    );
}