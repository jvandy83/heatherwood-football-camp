import Image from "next/image";
import Link from "next/link";
import { getRegistrationClosedMessage } from "@/lib/registration";

type Props = {
  title: string;
};

export function RegistrationClosed({ title }: Props) {
  const message = getRegistrationClosedMessage();

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
            <span className="font-semibold text-slate-800">{title}</span>
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
        <div className="rounded-2xl border border-slate-200 bg-white px-6 py-8 shadow-sm sm:px-8">
          <h1 className="mb-3 text-2xl font-bold text-slate-800">
            Registration closed
          </h1>
          <p className="text-slate-700 leading-relaxed">{message}</p>
          <p className="mt-6 text-sm text-slate-600">
            Questions?{" "}
            <a
              href="mailto:heatherwoodfootballcamp@gmail.com"
              className="font-medium text-sky-600 underline hover:text-sky-700"
            >
              Get in touch
            </a>
          </p>
        </div>
      </main>
    </div>
  );
}
