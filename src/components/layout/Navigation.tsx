'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Navigation() {
    const { user, logout } = useAuth();
    const router = useRouter();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        router.push('/');
        setIsMenuOpen(false); // Close mobile menu
    };

    const closeMenu = () => setIsMenuOpen(false);

    return (
        <nav className="bg-white shadow-sm border-b border-gray-100">
            <div className="container-app">
                <div className="flex justify-between items-center h-16">
                    <Link href="/" className="text-2xl font-bold text-primary-600">
                        NailSalon
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link href="/services" className="text-gray-700 hover:text-primary-600 transition-colors">
                            Services
                        </Link>
                        <Link href="/staff" className="text-gray-700 hover:text-primary-600 transition-colors">
                            Our Staff
                        </Link>

                        {user ? (
                            <>
                                <Link href="/appointments" className="text-gray-700 hover:text-primary-600 transition-colors">
                                    Appointments
                                </Link>
                                {user.role === 'STAFF' && (
                                    <>
                                        <Link href="/dashboard" className="text-gray-700 hover:text-primary-600 transition-colors">
                                            Dashboard
                                        </Link>
                                        <Link href="/schedule" className="text-gray-700 hover:text-primary-600 transition-colors">
                                            Schedule
                                        </Link>
                                    </>
                                )}
                                <Link href="/profile" className="text-gray-700 hover:text-primary-600 transition-colors">
                                    Profile
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="text-gray-700 hover:text-primary-600 transition-colors flex items-center"
                                >
                                    <LogOut className="h-4 w-4 mr-1" />
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link href="/login" className="text-gray-700 hover:text-primary-600 transition-colors">
                                    Login
                                </Link>
                                <Link href="/register" className="btn-primary text-sm">
                                    Sign Up
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="md:hidden"
                        aria-label="Toggle menu"
                    >
                        {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                </div>

                {/* Mobile menu */}
                {isMenuOpen && (
                    <div className="md:hidden py-4 border-t">
                        <div className="flex flex-col space-y-4">
                            <Link href="/services" onClick={closeMenu} className="text-gray-700">
                                Services
                            </Link>
                            <Link href="/staff" onClick={closeMenu} className="text-gray-700">
                                Our Staff
                            </Link>
                            {user ? (
                                <>
                                    <Link href="/appointments" onClick={closeMenu} className="text-gray-700">
                                        Appointments
                                    </Link>
                                    {user.role === 'STAFF' && (
                                        <>
                                            <Link href="/dashboard" onClick={closeMenu} className="text-gray-700">
                                                Dashboard
                                            </Link>
                                            <Link href="/schedule" onClick={closeMenu} className="text-gray-700">
                                                Schedule
                                            </Link>
                                        </>
                                    )}
                                    <Link href="/profile" onClick={closeMenu} className="text-gray-700">
                                        Profile
                                    </Link>
                                    <button onClick={handleLogout} className="text-gray-700 text-left">
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link href="/login" onClick={closeMenu} className="text-gray-700">
                                        Login
                                    </Link>
                                    <Link href="/register" onClick={closeMenu} className="text-gray-700">
                                        Sign Up
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}