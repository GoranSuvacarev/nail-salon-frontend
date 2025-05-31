// src/app/(app)/services/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Service, ServiceCategory } from '@/types';
import { servicesApi } from '@/lib/api/services';
import ServiceCard from '@/components/services/ServiceCard';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ServicesPage() {
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | 'ALL'>('ALL');

    const categories: Array<ServiceCategory | 'ALL'> = [
        'ALL',
        'MANICURE',
        'PEDICURE',
        'GEL',
        'NAIL_ART',
        'TREATMENT',
    ];

    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        try {
            setLoading(true);
            const data = await servicesApi.getAllServices();
            setServices(data);
        } catch (error) {
            toast.error('Failed to load services');
            console.error('Error fetching services:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredServices = selectedCategory === 'ALL'
        ? services
        : services.filter(service => service.category === selectedCategory);

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
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Our Services</h1>
                <p className="text-gray-600 max-w-2xl mx-auto">
                    Choose from our wide range of professional nail care services
                </p>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap justify-center gap-2 mb-8">
                {categories.map((category) => (
                    <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                            selectedCategory === category
                                ? 'bg-primary-500 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                    >
                        {category === 'ALL' ? 'All Services' : category.toLowerCase()}
                    </button>
                ))}
            </div>

            {/* Services Grid */}
            {filteredServices.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredServices.map((service) => (
                        <ServiceCard key={service.id} service={service} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-12">
                    <p className="text-gray-500">No services found in this category.</p>
                </div>
            )}
        </div>
    );
}