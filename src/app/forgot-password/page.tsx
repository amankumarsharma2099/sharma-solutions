"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email");
      return;
    }
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=reset-password`,
    });
    setLoading(false);
    if (error) {
      toast.error(error.message ?? "Something went wrong");
      return;
    }
    setSent(true);
    toast.success("Check your email for the reset link");
  }

  if (sent) {
    return (
      <div className="min-h-[calc(100vh-12rem)] flex items-center justify-center py-12 sm:py-16">
        <Container>
          <div className="mx-auto max-w-md">
            <Card className="overflow-hidden border-0 bg-white/90 shadow-2xl shadow-slate-200/50 backdrop-blur-xl">
              <CardContent className="py-12 text-center">
                <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-800 border border-emerald-300">
                  <svg
                    className="h-8 w-8"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </span>
                <h2 className="mt-6 text-xl font-bold text-slate-900">
                  Check your email
                </h2>
                <p className="mt-3 text-slate-600">
                  We sent a password reset link to <strong>{email}</strong>.
                  Click the link to set a new password.
                </p>
                <Link href="/login" className="mt-8 inline-block">
                  <Button variant="primary" size="lg">
                    Back to Sign In
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-12rem)] flex items-center justify-center py-12 sm:py-16">
      <Container>
        <div className="mx-auto max-w-md">
          <Card className="overflow-hidden border-0 bg-white/90 shadow-2xl shadow-slate-200/50 backdrop-blur-xl">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-slate-900 sm:text-3xl">
                Forgot Password
              </CardTitle>
              <p className="mt-2 text-sm text-slate-600">
                Enter your email and we&apos;ll send you a link to reset your
                password.
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
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  fullWidth
                  isLoading={loading}
                >
                  Send Reset Link
                </Button>
              </form>
              <p className="mt-6 text-center text-sm text-slate-600">
                <Link
                  href="/login"
                  className="font-semibold text-blue-600 transition-colors hover:text-blue-700 hover:underline"
                >
                  Back to Sign In
                </Link>
              </p>
            </CardContent>
          </Card>
        </div>
      </Container>
    </div>
  );
}
