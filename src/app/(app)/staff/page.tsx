// src/app/(app)/staff/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { User } from '@/types';
import { usersApi } from '@/lib/api/users';
import StaffCard from '@/components/staff/StaffCard';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function StaffPage() {
    const [staff, setStaff] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        fetchStaff();
    }, []);

    const fetchStaff = async () => {
        try {
            setLoading(true);
            const data = await usersApi.getUsersByRole('STAFF');
            setStaff(data);
        } catch (error) {
            toast.error('Failed to load staff members');
            console.error('Error fetching staff:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStaffSelect = (selectedStaff: User) => {
        // Navigate to booking page with selected staff
        router.push(`/appointments/new?staffId=${selectedStaff.id}`);
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
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Our Staff</h1>
                <p className="text-gray-600 max-w-2xl mx-auto">
                    Meet our professional nail technicians ready to provide you with exceptional service
                </p>
            </div>

            {staff.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {staff.map((member) => (
                        <StaffCard
                            key={member.id}
                            staff={member}
                            onSelect={handleStaffSelect}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-12">
                    <p className="text-gray-500">No staff members available at the moment.</p>
                </div>
            )}
        </div>
    );
}