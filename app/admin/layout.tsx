import { redirect } from 'next/navigation'
import { isAdmin } from '@/lib/utils/auth'
import AdminSidebar from '@/components/admin/AdminSidebar'
import AdminTopBar from '@/components/admin/AdminTopBar'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const admin = await isAdmin()

  if (!admin) {
    redirect('/')
  }

  return (
    <div className="min-h-screen bg-[#1a1b1e]">
      <AdminSidebar />
      <div className="lg:pl-64">
        <AdminTopBar />

        {/* Main content */}
        <main className="py-6">
          <div className="px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

