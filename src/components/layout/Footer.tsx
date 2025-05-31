// src/components/layout/Footer.tsx
import Link from 'next/link';
import { Facebook, Instagram, Twitter, MapPin, Phone, Mail, Clock } from 'lucide-react';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gray-900 text-gray-300">
            <div className="container-app py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* About Section */}
                    <div>
                        <h3 className="text-white text-lg font-semibold mb-4">NailSalon</h3>
                        <p className="text-sm mb-4">
                            Your premier destination for professional nail care and beauty services.
                            Experience luxury and relaxation with our skilled technicians.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="hover:text-primary-400 transition-colors">
                                <Facebook className="h-5 w-5" />
                            </a>
                            <a href="#" className="hover:text-primary-400 transition-colors">
                                <Instagram className="h-5 w-5" />
                            </a>
                            <a href="#" className="hover:text-primary-400 transition-colors">
                                <Twitter className="h-5 w-5" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-white text-lg font-semibold mb-4">Quick Links</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link href="/services" className="hover:text-primary-400 transition-colors">
                                    Our Services
                                </Link>
                            </li>
                            <li>
                                <Link href="/staff" className="hover:text-primary-400 transition-colors">
                                    Our Staff
                                </Link>
                            </li>
                            <li>
                                <Link href="/appointments" className="hover:text-primary-400 transition-colors">
                                    Book Appointment
                                </Link>
                            </li>
                            <li>
                                <Link href="/profile" className="hover:text-primary-400 transition-colors">
                                    My Account
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-white text-lg font-semibold mb-4">Contact Us</h3>
                        <ul className="space-y-3 text-sm">
                            <li className="flex items-start">
                                <MapPin className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                                <span>123 Beauty Street, Nail City, NC 12345</span>
                            </li>
                            <li className="flex items-center">
                                <Phone className="h-4 w-4 mr-2 flex-shrink-0" />
                                <span>(555) 123-4567</span>
                            </li>
                            <li className="flex items-center">
                                <Mail className="h-4 w-4 mr-2 flex-shrink-0" />
                                <span>info@nailsalon.com</span>
                            </li>
                        </ul>
                    </div>

                    {/* Business Hours */}
                    <div>
                        <h3 className="text-white text-lg font-semibold mb-4">Business Hours</h3>
                        <ul className="space-y-2 text-sm">
                            <li className="flex justify-between">
                                <span>Mon - Fri:</span>
                                <span>9:00 AM - 6:00 PM</span>
                            </li>
                            <li className="flex justify-between">
                                <span>Saturday:</span>
                                <span>10:00 AM - 5:00 PM</span>
                            </li>
                            <li className="flex justify-between">
                                <span>Sunday:</span>
                                <span>Closed</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-center">
                    <p>&copy; {currentYear} NailSalon. All rights reserved. | Built for Internet Software Architecture Course</p>
                </div>
            </div>
        </footer>
    );
}