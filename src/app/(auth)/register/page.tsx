'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth } from '@/lib/auth';
import { Loader2, Mail, Lock, User, Phone } from 'lucide-react';

const schema = yup.object({
    email: yup.string().email('Invalid email').required('Email is required'),
    password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
    firstName: yup.string().required('First name is required'),
    lastName: yup.string().required('Last name is required'),
    phone: yup.string().matches(/^[0-9-+() ]+$/, 'Invalid phone number').required('Phone is required'),
});

type FormData = yup.InferType<typeof schema>;

export default function RegisterPage() {
    const { register: registerUser } = useAuth();
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>({
        resolver: yupResolver(schema),
    });

    const onSubmit = async (data: FormData) => {
        setIsLoading(true);
        try {
            await registerUser(data);
        } catch (error) {
            // Error is handled in the auth context
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-xl p-8 animate-fadeIn">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Create Account</h1>
                <p className="text-gray-600 mt-2">Sign up for NailSalon</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="label">First Name</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <User className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                {...register('firstName')}
                                type="text"
                                className={`input pl-10 ${errors.firstName ? 'input-error' : ''}`}
                                placeholder="John"
                                disabled={isLoading}
                            />
                        </div>
                        {errors.firstName && (
                            <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="label">Last Name</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <User className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                {...register('lastName')}
                                type="text"
                                className={`input pl-10 ${errors.lastName ? 'input-error' : ''}`}
                                placeholder="Doe"
                                disabled={isLoading}
                            />
                        </div>
                        {errors.lastName && (
                            <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
                        )}
                    </div>
                </div>

                <div>
                    <label className="label">Email</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Mail className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            {...register('email')}
                            type="email"
                            className={`input pl-10 ${errors.email ? 'input-error' : ''}`}
                            placeholder="you@example.com"
                            disabled={isLoading}
                        />
                    </div>
                    {errors.email && (
                        <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                    )}
                </div>

                <div>
                    <label className="label">Phone</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Phone className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            {...register('phone')}
                            type="tel"
                            className={`input pl-10 ${errors.phone ? 'input-error' : ''}`}
                            placeholder="+1 (555) 123-4567"
                            disabled={isLoading}
                        />
                    </div>
                    {errors.phone && (
                        <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                    )}
                </div>

                <div>
                    <label className="label">Password</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            {...register('password')}
                            type="password"
                            className={`input pl-10 ${errors.password ? 'input-error' : ''}`}
                            placeholder="••••••••"
                            disabled={isLoading}
                        />
                    </div>
                    {errors.password && (
                        <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full btn-primary py-3 flex items-center justify-center"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="animate-spin h-5 w-5 mr-2" />
                            Creating account...
                        </>
                    ) : (
                        'Sign Up'
                    )}
                </button>
            </form>

            <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                    Already have an account?{' '}
                    <Link
                        href="/login"
                        className="font-medium text-primary-600 hover:text-primary-500 transition-colors"
                    >
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
}