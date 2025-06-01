'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth } from '@/lib/auth';
import { Loader2, Mail, Lock } from 'lucide-react';

const schema = yup.object({
    email: yup.string().email('Invalid email').required('Email is required'),
    password: yup.string().required('Password is required'),
});

type FormData = yup.InferType<typeof schema>;

export default function LoginPage() {
    const { login } = useAuth();
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
            await login(data);
        } catch (error) {
            // Error is handled in the auth context
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-xl p-8 animate-fadeIn">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Welcome Back</h1>
                <p className="text-gray-600 mt-2">Sign in to your account</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                            Signing in...
                        </>
                    ) : (
                        'Sign In'
                    )}
                </button>
            </form>

            <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                    Don't have an account?{' '}
                    <Link
                        href="/register"
                        className="font-medium text-primary-600 hover:text-primary-500 transition-colors"
                    >
                        Sign up
                    </Link>
                </p>
            </div>

            <div className="mt-8 border-t pt-6">
                <p className="text-xs text-gray-500 text-center">
                    Test Credentials:<br />
                    Staff: olivia@nailsalon.com / nailsalon<br />
                    Customer: test@gmail.com / testtest
                </p>
            </div>
        </div>
    );
}