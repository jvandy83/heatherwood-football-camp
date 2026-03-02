"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

type RegistrationType = "first" | "sibling";

export default function PayOnlyPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState<RegistrationType | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handlePay = async (type: RegistrationType) => {
    setError(null);
    setLoading(type);
    try {
      const res = await fetch("/api/pay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim() || undefined,
          registrationType: type,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message ?? "Something went wrong.");
        return;
      }
      if (data.url) {
        window.location.href = data.url;
        return;
      }
      setError("No payment link received.");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <header className="border-b border-slate-200 bg-sky-50/80 px-6 py-6 sm:px-8">
        <div className="mx-auto flex max-w-2xl items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/football_camp_logo.png"
              alt="Heatherwood Football Camp"
              width={120}
              height={52}
              className="h-10 w-auto"
            />
            <span className="font-semibold text-slate-800">Complete payment</span>
          </Link>
          <Link
            href="/"
            className="text-sm font-medium text-sky-600 hover:text-sky-700"
          >
            ← Back to camp info
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-6 py-10 sm:px-8 sm:py-12">
        <h1 className="mb-2 text-2xl font-bold text-slate-800">
          Already registered? Complete your payment
        </h1>
        <p className="mb-8 text-slate-600">
          If you already filled out the registration form and only need to pay,
          choose the option below. Your email will be prefilled on the payment
          page if you enter it.
        </p>

        <div className="space-y-6">
          {error && (
            <div
              role="alert"
              className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
            >
              {error}
            </div>
          )}

          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <label htmlFor="pay-email" className="mb-2 block text-sm font-medium text-slate-700">
              Your email (optional — we&apos;ll prefill it on the payment page)
            </label>
            <input
              id="pay-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 placeholder:text-slate-400 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
            />
          </div>

          <div className="flex flex-col gap-4 sm:flex-row">
            <button
              type="button"
              onClick={() => handlePay("first")}
              disabled={loading !== null}
              className="flex-1 rounded-xl bg-sky-500 py-3 font-semibold text-white shadow-md transition hover:bg-sky-600 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2"
            >
              {loading === "first" ? "Redirecting…" : "Pay $300 — First child"}
            </button>
            <button
              type="button"
              onClick={() => handlePay("sibling")}
              disabled={loading !== null}
              className="flex-1 rounded-xl border-2 border-sky-500 bg-white py-3 font-semibold text-sky-600 transition hover:bg-sky-50 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2"
            >
              {loading === "sibling" ? "Redirecting…" : "Pay $250 — Sibling"}
            </button>
          </div>
        </div>

        <p className="mt-8 text-center text-sm text-slate-500">
          New to registration?{" "}
          <Link href="/register" className="font-medium text-sky-600 hover:underline">
            Register here
          </Link>
        </p>
      </main>
    </div>
  );
}
