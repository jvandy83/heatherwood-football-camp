import Image from "next/image";
import Link from "next/link";
import { PurchaseConversion } from "./PurchaseConversion";

export default function RegisterSuccessPage() {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <PurchaseConversion />
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
          </Link>
          <Link
            href="/"
            className="text-sm font-medium text-sky-600 hover:text-sky-700"
          >
            Back to camp info
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-6 py-16 text-center sm:px-8">
        <div className="rounded-2xl border border-sky-200 bg-sky-50/50 px-8 py-12">
          <h1 className="mb-3 text-2xl font-bold text-slate-800">
            You&apos;re registered
          </h1>
          <p className="mb-8 text-slate-600">
            Thank you for registering. Payment was successful. See you at camp!
          </p>
          <Link
            href="/"
            className="inline-block rounded-xl bg-sky-500 px-6 py-3 font-semibold text-white shadow-md transition hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2"
          >
            Back to camp info
          </Link>
        </div>
      </main>
    </div>
  );
}
