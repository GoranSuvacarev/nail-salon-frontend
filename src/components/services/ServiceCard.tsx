// src/components/services/ServiceCard.tsx
import { Service } from '@/types';
import { Clock, DollarSign } from 'lucide-react';

interface ServiceCardProps {
    service: Service;
    onSelect?: (service: Service) => void;
}

export default function ServiceCard({ service, onSelect }: ServiceCardProps) {
    const categoryColors = {
        MANICURE: 'bg-pink-100 text-pink-800',
        PEDICURE: 'bg-purple-100 text-purple-800',
        GEL: 'bg-blue-100 text-blue-800',
        NAIL_ART: 'bg-green-100 text-green-800',
        TREATMENT: 'bg-yellow-100 text-yellow-800',
    };

    return (
        <div
            className={`card-hover ${onSelect ? 'cursor-pointer' : ''}`}
            onClick={() => onSelect?.(service)}
        >
            <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold text-gray-900">{service.name}</h3>
                <span className={`badge ${categoryColors[service.category]}`}>
          {service.category.toLowerCase()}
        </span>
            </div>

            <p className="text-gray-600 mb-4">{service.description}</p>

            <div className="flex justify-between items-center">
                <div className="flex items-center text-gray-500">
                    <Clock className="h-4 w-4 mr-1" />
                    <span className="text-sm">{service.durationMinutes} min</span>
                </div>
                <div className="flex items-center text-primary-600 font-semibold">
                    <DollarSign className="h-4 w-4" />
                    <span>{service.price}</span>
                </div>
            </div>
        </div>
    );
}