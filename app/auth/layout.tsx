export default function AuthLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen w-full relative flex items-center justify-center bg-[#0a0a0c] overflow-hidden">
            {/* Background Image */}
            <div
                className="absolute inset-0 z-0"
                style={{
                    backgroundImage: `url('/login-bg.webp')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                }}
            />

            {/* Dark Overlay for better text contrast */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] z-0" />

            {/* Content Container */}
            <div className="relative z-10 w-full max-w-md px-4 py-8">
                {children}
            </div>
        </div>
    )
}
