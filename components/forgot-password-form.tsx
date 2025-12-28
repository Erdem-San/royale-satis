"use client";

import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useState } from "react";

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      // The url which will be included in the email. This URL needs to be configured in your redirect URLs in the Supabase dashboard at https://supabase.com/dashboard/project/_/auth/url-configuration
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/update-password`,
      });
      if (error) throw error;
      setSuccess(true);
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      {success ? (
        <div className="bg-[#121212] border border-green-600 rounded-2xl p-8 shadow-2xl shadow-black/80 relative overflow-hidden w-[420px]">
          {/* Decorative corner glow */}
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-green-600/40 rounded-full blur-3xl pointer-events-none" />

          <div className="mb-6 text-center space-y-2">
            <h1 className="text-3xl font-bold text-green-600 tracking-tight">E-postanı Kontrol Et</h1>
            <p className="text-gray-400 text-sm">Şifre sıfırlama talimatları gönderildi</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-300">
              Eğer bu e-posta adresiyle kayıtlı bir hesabınız varsa, şifre sıfırlama bağlantısını içeren bir e-posta alacaksınız.
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-[#121212] border border-green-600 rounded-2xl p-8 shadow-2xl shadow-black/80 relative overflow-hidden w-[420px]">
          {/* Decorative corner glow */}
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-green-600/40 rounded-full blur-3xl pointer-events-none" />

          <div className="mb-8 text-center space-y-2">
            <h1 className="text-3xl font-bold text-green-600 tracking-tight">Şifremi Unuttum</h1>
            <p className="text-gray-400 text-sm">
              E-posta adresinizi girin, size şifrenizi sıfırlamanız için bir bağlantı gönderelim.
            </p>
          </div>

          <form onSubmit={handleForgotPassword} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-300 font-medium">E-posta</Label>
              <Input
                id="email"
                type="email"
                placeholder="ornek@mail.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-[#1E1E1E] border-transparent focus:border-green-600 text-white placeholder-gray-600 h-12 rounded-lg transition-all"
              />
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full h-12 bg-[#4b5563] hover:bg-[#374151] text-white font-bold text-lg rounded-lg transition-all transform active:scale-[0.98]"
              disabled={isLoading}
            >
              {isLoading ? "Gönderiliyor..." : "Sıfırlama Bağlantısı Gönder"}
            </Button>

            <div className="text-center pt-2">
              <span className="text-gray-400 text-sm">Hesabın var mı? </span>
              <Link
                href="/auth/login"
                className="text-green-600 hover:text-green-500 transition-colors font-medium underline-offset-4 hover:underline"
              >
                Giriş Yap
              </Link>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
