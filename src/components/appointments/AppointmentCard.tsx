// src/components/appointments/AppointmentCard.tsx
import { Appointment } from '@/types';
import { format } from 'date-fns';
import { Calendar, Clock, User, DollarSign, X, CheckCircle } from 'lucide-react';

interface AppointmentCardProps {
    appointment: Appointment;
    onCancel?: (id: number) => void;
    onComplete?: (id: number) => void;
    isStaffView?: boolean;
}

export default function AppointmentCard({
                                            appointment,
                                            onCancel,
                                            onComplete,
                                            isStaffView = false
                                        }: AppointmentCardProps) {
    const statusColors = {
        SCHEDULED: 'bg-blue-100 text-blue-800 border-blue-200',
        COMPLETED: 'bg-green-100 text-green-800 border-green-200',
        CANCELLED: 'bg-red-100 text-red-800 border-red-200',
    };

    const canCancel = appointment.status === 'SCHEDULED' && onCancel;
    const canComplete = appointment.status === 'SCHEDULED' && onComplete && isStaffView;

    return (
        <div className={`card ${appointment.status === 'CANCELLED' ? 'opacity-75' : ''}`}>
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                        {appointment.service.name}
                    </h3>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-2 ${statusColors[appointment.status]}`}>
            {appointment.status.toLowerCase()}
          </span>
                </div>
                <div className="text-right">
                    <p className="text-2xl font-bold text-primary-600">${appointment.service.price}</p>
                    <p className="text-sm text-gray-500">{appointment.service.durationMinutes} min</p>
                </div>
            </div>

            <div className="space-y-2 text-sm">
                <div className="flex items-center text-gray-600">
                    <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                    {format(new Date(appointment.appointmentDate), 'EEEE, MMMM d, yyyy')}
                </div>
                <div className="flex items-center text-gray-600">
                    <Clock className="h-4 w-4 mr-2 text-gray-400" />
                    {appointment.startTime} - {appointment.endTime}
                </div>
                <div className="flex items-center text-gray-600">
                    <User className="h-4 w-4 mr-2 text-gray-400" />
                    {isStaffView ? (
                        <span>Customer: {appointment.customer.firstName} {appointment.customer.lastName}</span>
                    ) : (
                        <span>Staff: {appointment.staff.firstName} {appointment.staff.lastName}</span>
                    )}
                </div>
            </div>

            {(canCancel || canComplete) && (
                <div className="flex gap-2 mt-4">
                    {canComplete && (
                        <button
                            onClick={() => onComplete(appointment.id)}
                            className="flex-1 btn-primary py-2 flex items-center justify-center text-sm"
                        >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Mark Complete
                        </button>
                    )}
                    {canCancel && (
                        <button
                            onClick={() => onCancel(appointment.id)}
                            className="flex-1 btn-danger py-2 flex items-center justify-center text-sm"
                        >
                            <X className="h-4 w-4 mr-1" />
                            Cancel
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}