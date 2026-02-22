"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get("redirect") || "/services";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in email and password");
      return;
    }
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Signed in successfully");
    router.push(returnUrl);
    router.refresh();
  }

  return (
    <div className="min-h-[calc(100vh-12rem)] flex items-center justify-center py-12 sm:py-16">
      <Container>
        <div className="mx-auto max-w-md">
          <Card className="overflow-hidden border-0 bg-white/90 shadow-2xl shadow-slate-200/50 backdrop-blur-xl">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold text-slate-900 sm:text-3xl">
                  Sign In
                </CardTitle>
                <p className="mt-2 text-sm text-slate-600">
                  Enter your credentials to access your account.
                </p>
              </CardHeader>
              <CardContent className="px-6 pb-8">
                <form onSubmit={handleSubmit} className="space-y-5">
                  <Input
                    type="email"
                    label="Email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    required
                  />
                  <Input
                    type="password"
                    label="Password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    required
                  />
                  <div className="flex justify-end">
                    <Link
                      href="/forgot-password"
                      className="text-sm font-medium text-blue-600 transition-colors hover:text-blue-700 hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    fullWidth
                    isLoading={loading}
                  >
                    Sign In
                  </Button>
                </form>
                <p className="mt-6 text-center text-sm text-slate-600">
                  Don&apos;t have an account?{" "}
                  <Link
                    href={`/signup${returnUrl !== "/services" ? `?redirect=${encodeURIComponent(returnUrl)}` : ""}`}
                    className="font-semibold text-blue-600 transition-colors hover:text-blue-700 hover:underline"
                  >
                    Sign up
                  </Link>
                </p>
              </CardContent>
          </Card>
        </div>
      </Container>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-md px-4 py-12 animate-pulse rounded-2xl bg-slate-100 h-96" />
      }
    >
      <LoginForm />
    </Suspense>
  );
}
