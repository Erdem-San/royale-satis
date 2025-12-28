import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import PaymentForm from '@/components/payment/PaymentForm'

export default async function PaymentPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/giris?redirect=/odeme')
  }

  return (
    <div className="min-h-screen bg-[#1a1b1e] py-8">
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold text-white mb-8">Ödeme</h1>
        <PaymentForm user={user} />
      </div>
    </div>
  )
}
