'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { profileApi } from '@/lib/api/profile';
import { User, Mail, Phone, Lock, Loader2, Save, Key } from 'lucide-react';
import toast from 'react-hot-toast';
import Modal from '@/components/ui/Modal';

const profileSchema = yup.object({
    firstName: yup.string().required('First name is required'),
    lastName: yup.string().required('Last name is required'),
    phone: yup.string().matches(/^[0-9-+() ]+$/, 'Invalid phone number').required('Phone is required'),
});

const passwordSchema = yup.object({
    oldPassword: yup.string().required('Current password is required'),
    newPassword: yup.string().min(6, 'Password must be at least 6 characters').required('New password is required'),
    confirmPassword: yup.string()
        .oneOf([yup.ref('newPassword')], 'Passwords must match')
        .required('Please confirm your password'),
});

type ProfileFormData = yup.InferType<typeof profileSchema>;
type PasswordFormData = yup.InferType<typeof passwordSchema>;

export default function ProfilePage() {
    const { user, refreshUser } = useAuth();
    const [isUpdating, setIsUpdating] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);

    const {
        register: registerProfile,
        handleSubmit: handleProfileSubmit,
        formState: { errors: profileErrors },
    } = useForm<ProfileFormData>({
        resolver: yupResolver(profileSchema),
        defaultValues: {
            firstName: user?.firstName || '',
            lastName: user?.lastName || '',
            phone: user?.phone || '',
        },
    });

    const {
        register: registerPassword,
        handleSubmit: handlePasswordSubmit,
        formState: { errors: passwordErrors },
        reset: resetPasswordForm,
    } = useForm<PasswordFormData>({
        resolver: yupResolver(passwordSchema),
    });

    const onProfileSubmit = async (data: ProfileFormData) => {
        setIsUpdating(true);
        try {
            await profileApi.updateProfile(data);
            await refreshUser(); // Refresh user data in context
            toast.success('Profile updated successfully');
        } catch (error: any) {
            toast.error(error.response?.data?.error || 'Failed to update profile');
        } finally {
            setIsUpdating(false);
        }
    };

    const onPasswordSubmit = async (data: PasswordFormData) => {
        setIsChangingPassword(true);
        try {
            await profileApi.changePassword({
                oldPassword: data.oldPassword,
                newPassword: data.newPassword,
            });
            toast.success('Password changed successfully');
            setShowPasswordModal(false);
            resetPasswordForm();
        } catch (error: any) {
            toast.error(error.response?.data?.error || 'Failed to change password');
        } finally {
            setIsChangingPassword(false);
        }
    };

    if (!user) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
            </div>
        );
    }

    return (
        <div className="container-app py-8">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">My Profile</h1>

                {/* Account Info Card */}
                <div className="card mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Account Information</h2>
                    <div className="space-y-3">
                        <div className="flex items-center text-gray-600">
                            <Mail className="h-4 w-4 mr-3 text-gray-400" />
                            <span className="text-sm">Email:</span>
                            <span className="ml-2 font-medium">{user.email}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                            <User className="h-4 w-4 mr-3 text-gray-400" />
                            <span className="text-sm">Role:</span>
                            <span className="ml-2 font-medium capitalize">{user.role.toLowerCase()}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                            <Key className="h-4 w-4 mr-3 text-gray-400" />
                            <span className="text-sm">Password:</span>
                            <button
                                onClick={() => setShowPasswordModal(true)}
                                className="ml-2 text-primary-600 hover:text-primary-700 text-sm font-medium"
                            >
                                Change Password
                            </button>
                        </div>
                    </div>
                </div>

                {/* Profile Form */}
                <div className="card">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Personal Information</h2>
                    <form onSubmit={handleProfileSubmit(onProfileSubmit)} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="label">First Name</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <User className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        {...registerProfile('firstName')}
                                        type="text"
                                        className={`input pl-10 ${profileErrors.firstName ? 'input-error' : ''}`}
                                        disabled={isUpdating}
                                    />
                                </div>
                                {profileErrors.firstName && (
                                    <p className="mt-1 text-sm text-red-600">{profileErrors.firstName.message}</p>
                                )}
                            </div>

                            <div>
                                <label className="label">Last Name</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <User className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        {...registerProfile('lastName')}
                                        type="text"
                                        className={`input pl-10 ${profileErrors.lastName ? 'input-error' : ''}`}
                                        disabled={isUpdating}
                                    />
                                </div>
                                {profileErrors.lastName && (
                                    <p className="mt-1 text-sm text-red-600">{profileErrors.lastName.message}</p>
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="label">Phone</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Phone className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    {...registerProfile('phone')}
                                    type="tel"
                                    className={`input pl-10 ${profileErrors.phone ? 'input-error' : ''}`}
                                    disabled={isUpdating}
                                />
                            </div>
                            {profileErrors.phone && (
                                <p className="mt-1 text-sm text-red-600">{profileErrors.phone.message}</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={isUpdating}
                            className="btn-primary flex items-center"
                        >
                            {isUpdating ? (
                                <>
                                    <Loader2 className="animate-spin h-4 w-4 mr-2" />
                                    Updating...
                                </>
                            ) : (
                                <>
                                    <Save className="h-4 w-4 mr-2" />
                                    Update Profile
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>

            {/* Change Password Modal */}
            <Modal
                isOpen={showPasswordModal}
                onClose={() => {
                    setShowPasswordModal(false);
                    resetPasswordForm();
                }}
                title="Change Password"
            >
                <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="space-y-4">
                    <div>
                        <label className="label">Current Password</label>
                        <input
                            {...registerPassword('oldPassword')}
                            type="password"
                            className={`input ${passwordErrors.oldPassword ? 'input-error' : ''}`}
                            disabled={isChangingPassword}
                        />
                        {passwordErrors.oldPassword && (
                            <p className="mt-1 text-sm text-red-600">{passwordErrors.oldPassword.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="label">New Password</label>
                        <input
                            {...registerPassword('newPassword')}
                            type="password"
                            className={`input ${passwordErrors.newPassword ? 'input-error' : ''}`}
                            disabled={isChangingPassword}
                        />
                        {passwordErrors.newPassword && (
                            <p className="mt-1 text-sm text-red-600">{passwordErrors.newPassword.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="label">Confirm New Password</label>
                        <input
                            {...registerPassword('confirmPassword')}
                            type="password"
                            className={`input ${passwordErrors.confirmPassword ? 'input-error' : ''}`}
                            disabled={isChangingPassword}
                        />
                        {passwordErrors.confirmPassword && (
                            <p className="mt-1 text-sm text-red-600">{passwordErrors.confirmPassword.message}</p>
                        )}
                    </div>

                    <div className="flex gap-3 justify-end pt-4">
                        <button
                            type="button"
                            onClick={() => {
                                setShowPasswordModal(false);
                                resetPasswordForm();
                            }}
                            className="btn-secondary"
                            disabled={isChangingPassword}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn-primary flex items-center"
                            disabled={isChangingPassword}
                        >
                            {isChangingPassword ? (
                                <>
                                    <Loader2 className="animate-spin h-4 w-4 mr-2" />
                                    Changing...
                                </>
                            ) : (
                                'Change Password'
                            )}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}