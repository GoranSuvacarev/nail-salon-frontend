// src/app/page.tsx
import Link from 'next/link';
import { Calendar, Users, Star, Clock } from 'lucide-react';

export default function HomePage() {
    // Test if Tailwind is working
    return (
        <div className="p-8">
            <h1 className="text-4xl font-bold text-red-500 bg-blue-200 p-4">
                Test - This should be large, bold, red text on blue background
            </h1>
        </div>
    );

    const features = [
        {
            icon: Calendar,
            title: 'Easy Booking',
            description: 'Book your appointments online anytime',
        },
        {
            icon: Users,
            title: 'Professional Staff',
            description: 'Experienced nail technicians',
        },
        {
            icon: Clock,
            title: 'Flexible Hours',
            description: 'We work around your schedule',
        },
        {
            icon: Star,
            title: 'Quality Service',
            description: 'Premium products and care',
        },
    ];

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="bg-gradient-to-br from-primary-50 via-pink-50 to-purple-50 py-20">
                <div className="container-app">
                    <div className="text-center max-w-3xl mx-auto">
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                            Welcome to <span className="text-primary-500">NailSalon</span>
                        </h1>
                        <p className="text-xl text-gray-600 mb-8">
                            Experience luxury nail care with our professional services
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href="/register" className="btn-primary px-8 py-3 text-lg">
                                Book Appointment
                            </Link>
                            <Link href="/services" className="btn-secondary px-8 py-3 text-lg">
                                View Services
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-16">
                <div className="container-app">
                    <h2 className="text-3xl font-bold text-center mb-12">Why Choose Us</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, index) => {
                            const Icon = feature.icon;
                            return (
                                <div key={index} className="text-center">
                                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-100 text-primary-600 mb-4">
                                        <Icon className="h-8 w-8" />
                                    </div>
                                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                                    <p className="text-gray-600">{feature.description}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-primary-50 py-16">
                <div className="container-app text-center">
                    <h2 className="text-3xl font-bold mb-4">Ready to Book Your Appointment?</h2>
                    <p className="text-lg text-gray-600 mb-8">
                        Join us for a relaxing nail care experience
                    </p>
                    <Link href="/register" className="btn-primary px-8 py-3 text-lg">
                        Get Started
                    </Link>
                </div>
            </section>
        </div>
    );
}