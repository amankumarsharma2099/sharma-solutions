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

function SignUpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in email and password");
      return;
    }
    setLoading(true);
    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName || undefined } },
    });
    setLoading(false);
    if (error) {
      toast.error(error.message ?? "Something went wrong");
      return;
    }
    if (data.user && !data.session) {
      toast.success("Check your email to confirm your account.");
      router.push("/login");
      return;
    }
    toast.success("Account created successfully");
    router.push(redirectTo);
    router.refresh();
  }

  return (
    <div className="min-h-[calc(100vh-12rem)] flex items-center justify-center py-12 sm:py-16">
      <Container>
        <div className="mx-auto max-w-md">
          <Card className="overflow-hidden border-0 bg-white/90 shadow-2xl shadow-slate-200/50 backdrop-blur-xl">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold text-slate-900 sm:text-3xl">
                  Sign Up
                </CardTitle>
                <p className="mt-2 text-sm text-slate-600">
                  Create an account to place orders and manage your profile.
                </p>
              </CardHeader>
              <CardContent className="px-6 pb-8">
                <form onSubmit={handleSubmit} className="space-y-5">
                  <Input
                    type="text"
                    label="Full Name"
                    placeholder="Your name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    autoComplete="name"
                  />
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
                    autoComplete="new-password"
                    required
                    minLength={6}
                  />
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    fullWidth
                    isLoading={loading}
                  >
                    Create Account
                  </Button>
                </form>
                <p className="mt-6 text-center text-sm text-slate-600">
                  Already have an account?{" "}
                  <Link
                    href={`/login${redirectTo !== "/" ? `?redirect=${encodeURIComponent(redirectTo)}` : ""}`}
                    className="font-semibold text-blue-600 transition-colors hover:text-blue-700 hover:underline"
                  >
                    Sign in
                  </Link>
                </p>
              </CardContent>
          </Card>
        </div>
      </Container>
    </div>
  );
}

export default function SignUpPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-md px-4 py-12 animate-pulse rounded-2xl bg-slate-100 h-96" />
      }
    >
      <SignUpForm />
    </Suspense>
  );
}
