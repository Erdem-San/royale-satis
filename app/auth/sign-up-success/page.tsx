import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Page() {
  return (
    <div className="bg-[#121212] border border-[#FCD34D]/30 rounded-2xl p-8 shadow-2xl shadow-black/80 relative overflow-hidden w-full max-w-sm text-center">
      {/* Decorative corner glow */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#FCD34D]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="mb-6 flex justify-center">
        <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center border border-green-500/20">
          <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      </div>

      <h1 className="text-2xl font-bold text-[#FCD34D] mb-2 tracking-tight">
        Kayıt Başarılı!
      </h1>

      <p className="text-gray-400 text-sm mb-8">
        Hesabınız oluşturuldu. Lütfen giriş yapmadan önce e-posta adresinize gönderilen doğrulama linkine tıklayın.
      </p>

      <Link href="/auth/login" className="block w-full">
        <Button
          className="w-full h-12 bg-[#4b5563] hover:bg-[#374151] text-white font-bold text-lg rounded-lg transition-all"
        >sf
          Giriş Yap
        </Button>
      </Link>
    </div>
  );
}
