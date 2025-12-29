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
import { useRouter } from "next/navigation";
import { useState } from "react";

export function SignUpForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    if (password !== repeatPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
        },
      });
      if (error) throw error;
      router.push("/auth/sign-up-success");
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
          <h1 className="text-3xl font-bold text-green-600 tracking-tight">Üye Ol</h1>
          <p className="text-gray-400 text-sm">Hemen aramıza katıl ve ayrıcalıklardan yararlan</p>
        </div>

        <form onSubmit={handleSignUp} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-300 font-medium">E-posta</Label>
            <Input
              id="email"
              type="email"
              placeholder="ornek@mail.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-[#1E1E1E] border-transparent focus:border-green-600/50 text-white placeholder-gray-600 h-12 rounded-lg transition-all"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-gray-300 font-medium">Şifre</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-[#1E1E1E] border-transparent focus:border-green-600/50 text-white placeholder-gray-600 h-12 rounded-lg transition-all"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="repeat-password" className="text-gray-300 font-medium">Şifre Tekrar</Label>
            <Input
              id="repeat-password"
              type="password"
              placeholder="••••••••"
              required
              value={repeatPassword}
              onChange={(e) => setRepeatPassword(e.target.value)}
              className="bg-[#1E1E1E] border-transparent focus:border-green-600/50 text-white placeholder-gray-600 h-12 rounded-lg transition-all"
            />
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4 pt-2">
            <Button
              type="submit"
              className="w-full h-12 bg-[#4b5563] hover:bg-green-600 text-white font-bold text-lg rounded-lg transition-all transform active:scale-[0.98]"
              disabled={isLoading}
            >
              {isLoading ? "Kayıt Oluyor..." : "Üye Ol"}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-700"></span>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-[#121212] px-2 text-gray-500">ya da</span>
              </div>
            </div>

            <Link href="/auth/login" className="block w-full">
              <Button
                type="button"
                variant="outline"
                className="w-full h-12 border-none bg-[#1E1E1E] hover:bg-[#2A2A2A] text-gray-300 hover:text-white font-bold text-lg rounded-lg transition-all border border-gray-700"
              >
                Giriş Yap
              </Button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
