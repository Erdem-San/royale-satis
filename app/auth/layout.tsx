export default function AuthLayout({
    children,
}: {
    children: React.ReactNode
}) {
    // Auth pages have no header/footer - just the content
    return <>{children}</>
}
