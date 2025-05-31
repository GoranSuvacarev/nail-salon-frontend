// src/app/(app)/layout.tsx
import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';

export default function AppLayout({
                                      children,
                                  }: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen flex flex-col">
            <Navigation />
            <main className="flex-grow bg-gray-50">
                {children}
            </main>
            <Footer />
        </div>
    );
}