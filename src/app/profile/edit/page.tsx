"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";

export default function EditProfilePage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push("/login?redirect=/profile/edit");
      return;
    }
    (async () => {
      try {
        const supabase = createClient();
        const { data: profile } = await supabase
          .from("users")
          .select("full_name, phone")
          .eq("id", user.id)
          .single();
        setFullName(profile?.full_name ?? user.user_metadata?.full_name ?? "");
        setPhone(profile?.phone ?? "");
      } catch {
        router.push("/login?redirect=/profile/edit");
      } finally {
        setInitialLoading(false);
      }
    })();
  }, [user, authLoading, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("users")
        .update({ full_name: fullName || null, phone: phone || null })
        .eq("id", user.id);
      if (error) {
        toast.error(error.message ?? "Something went wrong");
        return;
      }
      toast.success("Profile updated");
      router.push("/profile");
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  if (authLoading || initialLoading) {
    return (
      <Container className="py-12 sm:py-16">
        <div className="mx-auto max-w-md">
          <div className="animate-pulse rounded-2xl bg-slate-100 p-8 h-64" />
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-12 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-md">
        <Card className="overflow-hidden border-0 bg-white/90 shadow-2xl shadow-slate-200/50 backdrop-blur-xl">
          <CardHeader className="text-center sm:text-left">
            <CardTitle className="text-2xl font-bold text-slate-900 sm:text-3xl">
              Edit Profile
            </CardTitle>
            <p className="mt-2 text-sm text-slate-600">
              Update your name and phone number.
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
                type="tel"
                label="Phone Number"
                placeholder="10-digit mobile number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                autoComplete="tel"
              />
              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                isLoading={loading}
              >
                Save Changes
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </Container>
  );
}
