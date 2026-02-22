"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/Button";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, signOut } = useAuth();

  async function handleSignOut() {
    setMobileOpen(false);
    await signOut();
    router.push("/");
    router.refresh();
  }

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/80 backdrop-blur-xl supports-[backdrop-filter]:bg-white/70 shadow-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="text-xl font-bold text-slate-900 transition-all duration-300 hover:text-blue-700"
        >
          Sharma Solutions
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-300 ${
                isActive(href)
                  ? "bg-blue-50 text-blue-700"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              {label}
            </Link>
          ))}
          {user ? (
            <>
              <Link href="/orders">
                <Button
                  variant={pathname.startsWith("/orders") ? "primary" : "ghost"}
                  size="sm"
                  className={pathname.startsWith("/orders") ? "" : ""}
                >
                  Orders
                </Button>
              </Link>
              <Link href="/profile">
                <Button
                  variant={pathname.startsWith("/profile") ? "primary" : "ghost"}
                  size="sm"
                >
                  Profile
                </Button>
              </Link>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleSignOut}
                className="ml-2"
              >
                Sign Out
              </Button>
            </>
          ) : (
            <div className="ml-4 flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link href="/signup">
                <Button variant="primary" size="sm">
                  Sign Up
                </Button>
              </Link>
            </div>
          )}
        </nav>

        <button
          type="button"
          className="rounded-xl p-2.5 text-slate-600 transition-all duration-300 hover:bg-slate-100 hover:text-slate-900 md:hidden"
          onClick={() => setMobileOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {mobileOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {mobileOpen && (
        <div className="animate-fade-in border-t border-slate-200/80 bg-white/95 backdrop-blur-xl px-4 py-4 md:hidden">
          <div className="flex flex-col gap-1">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className={`rounded-xl px-4 py-3 text-sm font-semibold transition-all ${
                  isActive(href)
                    ? "bg-blue-50 text-blue-700"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                {label}
              </Link>
            ))}
            {user ? (
              <>
                <Link
                  href="/orders"
                  onClick={() => setMobileOpen(false)}
                  className={`rounded-xl px-4 py-3 text-sm font-semibold ${
                    pathname.startsWith("/orders")
                      ? "bg-blue-50 text-blue-700"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  Orders
                </Link>
                <Link
                  href="/profile"
                  onClick={() => setMobileOpen(false)}
                  className={`rounded-xl px-4 py-3 text-sm font-semibold ${
                    pathname.startsWith("/profile")
                      ? "bg-blue-50 text-blue-700"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  Profile
                </Link>
                <div className="mt-2 pt-2 border-t border-slate-200">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    fullWidth
                    onClick={handleSignOut}
                  >
                    Sign Out
                  </Button>
                </div>
              </>
            ) : (
              <div className="mt-4 flex flex-col gap-2 pt-2 border-t border-slate-200">
                <Link href="/login" onClick={() => setMobileOpen(false)}>
                  <Button variant="outline" size="sm" fullWidth>
                    Sign In
                  </Button>
                </Link>
                <Link href="/signup" onClick={() => setMobileOpen(false)}>
                  <Button variant="primary" size="sm" fullWidth>
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
