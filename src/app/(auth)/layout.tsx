// src/app/(auth)/layout.tsx
export default function AuthLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-pink-50 to-purple-50">
            <div className="w-full max-w-md px-4">
                {children}
            </div>
        </div>
    );
}