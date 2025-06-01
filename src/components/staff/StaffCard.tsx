import { User } from '@/types';
import { User as UserIcon, Mail, Phone } from 'lucide-react';

interface StaffCardProps {
    staff: User;
    onSelect?: (staff: User) => void;
}

export default function StaffCard({ staff, onSelect }: StaffCardProps) {
    return (
        <div
            className={`card-hover ${onSelect ? 'cursor-pointer' : ''}`}
            onClick={() => onSelect?.(staff)}
        >
            <div className="flex items-center mb-4">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mr-4">
                    <UserIcon className="h-8 w-8 text-primary-600" />
                </div>
                <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                        {staff.firstName} {staff.lastName}
                    </h3>
                    <p className="text-sm text-primary-600">Nail Technician</p>
                </div>
            </div>

            <div className="space-y-2">
                <div className="flex items-center text-gray-600">
                    <Mail className="h-4 w-4 mr-2 text-gray-400" />
                    <span className="text-sm">{staff.email}</span>
                </div>
                <div className="flex items-center text-gray-600">
                    <Phone className="h-4 w-4 mr-2 text-gray-400" />
                    <span className="text-sm">{staff.phone}</span>
                </div>
            </div>

            {onSelect && (
                <button className="btn-primary w-full mt-4">
                    Book Appointment
                </button>
            )}
        </div>
    );
}