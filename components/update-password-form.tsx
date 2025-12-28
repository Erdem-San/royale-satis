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
import { useRouter } from "next/navigation";
import { useState } from "react";

export function UpdatePasswordForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      // Update this route to redirect to an authenticated route. The user already has an active session.
      router.push("/");
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
          <h1 className="text-3xl font-bold text-green-600 tracking-tight">Yeni Şifre Belirle</h1>
          <p className="text-gray-400 text-sm">
            Lütfen yeni şifrenizi aşağıya girin.
          </p>
        </div>

        <form onSubmit={handleForgotPassword} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="password" className="text-gray-300 font-medium">Yeni Şifre</Label>
            <Input
              id="password"
              type="password"
              placeholder="Yeni şifreniz"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
            {isLoading ? "Kaydediliyor..." : "Şifreyi Kaydet"}
          </Button>
        </form>
      </div>
    </div>
  );
}
