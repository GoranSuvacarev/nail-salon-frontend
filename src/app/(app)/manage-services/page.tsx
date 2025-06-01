'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { Service, ServiceCategory } from '@/types';
import { servicesApi } from '@/lib/api/services';
import { Plus, Edit2, Trash2, Loader2, X, Save } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const serviceSchema = yup.object({
    name: yup.string().required('Service name is required'),
    description: yup.string().required('Description is required'),
    price: yup.number().positive('Price must be positive').required('Price is required'),
    durationMinutes: yup.number().positive('Duration must be positive').required('Duration is required'),
    category: yup.string().oneOf(['MANICURE', 'PEDICURE', 'GEL', 'NAIL_ART', 'TREATMENT']).required('Category is required'),
});

type ServiceFormData = yup.InferType<typeof serviceSchema>;

export default function ManageServicesPage() {
    const { user } = useAuth();
    const router = useRouter();
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingService, setEditingService] = useState<Service | null>(null);
    const [saving, setSaving] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | 'ALL'>('ALL');

    const categories: ServiceCategory[] = ['MANICURE', 'PEDICURE', 'GEL', 'NAIL_ART', 'TREATMENT'];

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors },
    } = useForm<ServiceFormData>({
        resolver: yupResolver(serviceSchema),
    });

    useEffect(() => {
        if (!user || user.role !== 'STAFF') {
            router.push('/');
            return;
        }
        fetchServices();
    }, [user, router]);

    const fetchServices = async () => {
        try {
            setLoading(true);
            const data = await servicesApi.getAllServices();
            setServices(data);
        } catch (error) {
            toast.error('Failed to load services');
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = () => {
        setEditingService(null);
        reset({
            name: '',
            description: '',
            price: 0,
            durationMinutes: 30,
            category: 'MANICURE',
        });
        setModalOpen(true);
    };

    const handleEdit = (service: Service) => {
        setEditingService(service);
        reset({
            name: service.name,
            description: service.description,
            price: service.price,
            durationMinutes: service.durationMinutes,
            category: service.category,
        });
        setModalOpen(true);
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this service?')) return;

        try {
            await servicesApi.deleteService(id);
            toast.success('Service deleted successfully');
            fetchServices();
        } catch (error) {
            toast.error('Failed to delete service');
        }
    };

    const onSubmit = async (data: ServiceFormData) => {
        setSaving(true);
        try {
            if (editingService) {
                await servicesApi.updateService(editingService.id, data);
                toast.success('Service updated successfully');
            } else {
                await servicesApi.createService({
                    ...data,
                    category: data.category as ServiceCategory,
                });
                toast.success('Service created successfully');
            }
            setModalOpen(false);
            fetchServices();
        } catch (error) {
            toast.error(editingService ? 'Failed to update service' : 'Failed to create service');
        } finally {
            setSaving(false);
        }
    };

    const filteredServices = selectedCategory === 'ALL'
        ? services
        : services.filter(s => s.category === selectedCategory);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
            </div>
        );
    }

    return (
        <div className="container-app py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Manage Services</h1>
                <button onClick={handleAdd} className="btn-primary flex items-center">
                    <Plus className="h-5 w-5 mr-2" />
                    Add Service
                </button>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 mb-6">
                <button
                    onClick={() => setSelectedCategory('ALL')}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                        selectedCategory === 'ALL'
                            ? 'bg-primary-500 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                >
                    All Services
                </button>
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
                        {category.toLowerCase()}
                    </button>
                ))}
            </div>

            {/* Services Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Service
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Category
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Duration
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Price
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                        </th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {filteredServices.map((service) => (
                        <tr key={service.id}>
                            <td className="px-6 py-4">
                                <div>
                                    <div className="text-sm font-medium text-gray-900">{service.name}</div>
                                    <div className="text-sm text-gray-500">{service.description}</div>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className="badge badge-scheduled">{service.category.toLowerCase()}</span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {service.durationMinutes} min
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                ${service.price}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button
                                    onClick={() => handleEdit(service)}
                                    className="text-primary-600 hover:text-primary-900 mr-4"
                                >
                                    <Edit2 className="h-4 w-4" />
                                </button>
                                <button
                                    onClick={() => handleDelete(service.id)}
                                    className="text-red-600 hover:text-red-900"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {/* Add/Edit Modal */}
            <Modal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                title={editingService ? 'Edit Service' : 'Add New Service'}
            >
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label className="label">Service Name</label>
                        <input
                            {...register('name')}
                            type="text"
                            className={`input ${errors.name ? 'input-error' : ''}`}
                            disabled={saving}
                        />
                        {errors.name && (
                            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="label">Description</label>
                        <textarea
                            {...register('description')}
                            className={`input ${errors.description ? 'input-error' : ''}`}
                            rows={3}
                            disabled={saving}
                        />
                        {errors.description && (
                            <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="label">Price ($)</label>
                            <input
                                {...register('price', { valueAsNumber: true })}
                                type="number"
                                step="0.01"
                                className={`input ${errors.price ? 'input-error' : ''}`}
                                disabled={saving}
                            />
                            {errors.price && (
                                <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="label">Duration (minutes)</label>
                            <input
                                {...register('durationMinutes', { valueAsNumber: true })}
                                type="number"
                                className={`input ${errors.durationMinutes ? 'input-error' : ''}`}
                                disabled={saving}
                            />
                            {errors.durationMinutes && (
                                <p className="mt-1 text-sm text-red-600">{errors.durationMinutes.message}</p>
                            )}
                        </div>
                    </div>

                    <div>
                        <label className="label">Category</label>
                        <select
                            {...register('category')}
                            className={`input ${errors.category ? 'input-error' : ''}`}
                            disabled={saving}
                        >
                            {categories.map((cat) => (
                                <option key={cat} value={cat}>
                                    {cat.toLowerCase()}
                                </option>
                            ))}
                        </select>
                        {errors.category && (
                            <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
                        )}
                    </div>

                    <div className="flex gap-3 justify-end pt-4">
                        <button
                            type="button"
                            onClick={() => setModalOpen(false)}
                            className="btn-secondary"
                            disabled={saving}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn-primary flex items-center"
                            disabled={saving}
                        >
                            {saving ? (
                                <>
                                    <Loader2 className="animate-spin h-4 w-4 mr-2" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="h-4 w-4 mr-2" />
                                    {editingService ? 'Update' : 'Create'}
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}