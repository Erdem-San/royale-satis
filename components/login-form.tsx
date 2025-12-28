"use client";

import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      router.push("/");
      router.refresh();
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="bg-[#121212] border border-green-600 rounded-2xl p-8 shadow-2xl shadow-black/80 relative overflow-hidden w-[420px]">
        {/* Decorative corner glow */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-green-600/40 rounded-full blur-3xl pointer-events-none" />

        <div className="mb-8 text-center space-y-2">
          <h1 className="text-3xl font-bold text-green-600 tracking-tight">Giriş Yap</h1>
          <p className="text-gray-400 text-sm">Hesabınıza erişmek için bilgilerinizi girin</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
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

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-gray-300 font-medium">Şifre</Label>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-[#1E1E1E] border-transparent focus:border-green-600 text-white placeholder-gray-600 h-12 rounded-lg transition-all"
            />
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 cursor-pointer group">
              <div className="w-4 h-4 rounded border border-gray-600 bg-[#1E1E1E] group-hover:border-green-600ansition-colors flex items-center justify-center">
                {/* Fake checkbox check */}
                <div className="w-2 h-2 bg-green-600unded-sm opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <span className="text-gray-400 group-hover:text-gray-300">Beni Hatırla</span>
            </label>
            <Link
              href="/auth/forgot-password"
              className="text-green-600ver:text-[#fbbf24] transition-colors font-medium"
            >
              Şifremi Unuttum
            </Link>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4 pt-2">
            <Button
              type="submit"
              className="w-full h-12 bg-[#4b5563] hover:bg-[#374151] text-white font-bold text-lg rounded-lg transition-all transform active:scale-[0.98]"
              disabled={isLoading}
            >
              {isLoading ? "Giriş Yapılıyor..." : "Giriş Yap"}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-700"></span>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-[#121212] px-2 text-gray-500">ya da</span>
              </div>
            </div>

            <Link href="/auth/sign-up" className="block w-full">
              <Button
                type="button"
                variant="outline"
                className="w-full h-12 border-none bg-[#1E1E1E] hover:bg-[#2A2A2A] text-gray-300 hover:text-white font-bold text-lg rounded-lg transition-all border border-gray-700"
              >
                Üye Ol
              </Button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
