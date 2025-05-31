// src/app/page.tsx
'use client';

import { useAuth } from '@/lib/auth';

export default function Home() {
    const { user, isLoading } = useAuth();

    return (
        <div className="container-app py-8">
            <h1 className="text-4xl font-bold text-primary-500 mb-4">
                Auth Context Test
            </h1>

            <div className="card mb-4">
                <h2 className="text-xl font-semibold mb-2">Auth Status:</h2>
                {isLoading ? (
                    <p>Loading...</p>
                ) : user ? (
                    <div>
                        <p>Logged in as: {user.firstName} {user.lastName}</p>
                        <p>Email: {user.email}</p>
                        <p>Role: {user.role}</p>
                    </div>
                ) : (
                    <p>Not logged in</p>
                )}
            </div>

            <div className="flex gap-4">
                <button className="btn-primary">Primary Button</button>
                <button className="btn-secondary">Secondary Button</button>
            </div>
        </div>
    )
}