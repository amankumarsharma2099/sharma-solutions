import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?redirect=/profile");

  const { data: profile } = await supabase
    .from("users")
    .select("full_name, phone, avatar_url")
    .eq("id", user.id)
    .single();

  const fullName =
    profile?.full_name ??
    user.user_metadata?.full_name ??
    user.email?.split("@")[0] ??
    "User";
  const phone = profile?.phone ?? "";
  const avatarUrl = profile?.avatar_url ?? null;

  return (
    <Container className="py-12 sm:py-16 lg:py-20">
      <div className="text-center sm:text-left">
        <h1 className="text-4xl font-bold text-slate-900 sm:text-5xl">
          Profile
        </h1>
        <p className="mt-4 text-lg text-slate-600">
          Manage your account details.
        </p>
      </div>

      <Card className="mt-12">
        <CardContent className="py-10">
          <div className="flex flex-col items-center gap-8 sm:flex-row sm:items-start">
            <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-2xl bg-slate-200 ring-2 ring-slate-100">
              {avatarUrl ? (
                <Image
                  src={avatarUrl}
                  alt="Profile"
                  fill
                  className="object-cover"
                  unoptimized
                />
              ) : (
                <span className="flex h-full w-full items-center justify-center text-4xl font-bold text-slate-600">
                  {fullName.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-2xl font-semibold text-slate-900">{fullName}</h2>
              <p className="mt-2 text-slate-600">{user.email}</p>
              {phone && (
                <p className="mt-1 text-slate-600">{phone}</p>
              )}
              <Link href="/profile/edit" className="mt-6 inline-block">
                <Button variant="outline" size="lg">
                  Edit Profile
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </Container>
  );
}
