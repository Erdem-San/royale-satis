import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import PaymentForm from '@/components/payment/PaymentForm'
import Link from 'next/link'

export default async function PaymentPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login?redirect=/odeme')
  }

  return (
    <div className="min-h-screen bg-[#1a1b1e]">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center gap-2 mb-4 text-[11px] font-bold text-gray-400">
          <Link href="/" className="px-3 py-1 bg-[#252830] rounded-lg hover:bg-gray-700 hover:text-white transition-colors">
            Anasayfa
          </Link>
          <span className="text-gray-600">&gt;</span>
          <div className="px-3 py-1 bg-[#252830] rounded-lg text-gray-300">
            Ödeme
          </div>
        </div>
        <h1 className="text-3xl font-bold text-white mb-6">Ödeme</h1>
        <PaymentForm user={user} />
      </div>
    </div>
  )
}
