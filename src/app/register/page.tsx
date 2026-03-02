"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const AGES = [8, 9, 10, 11, 12] as const;

type RegistrationType = "first" | "sibling";

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [parentName, setParentName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [childName, setChildName] = useState("");
  const [childAge, setChildAge] = useState<number | "">("");
  const [registrationType, setRegistrationType] = useState<RegistrationType>("first");
  const [emergencyName, setEmergencyName] = useState("");
  const [emergencyPhone, setEmergencyPhone] = useState("");
  const [medicalNotes, setMedicalNotes] = useState("");
  const [agreedToWaiver, setAgreedToWaiver] = useState(false);
  const [waiverModalOpen, setWaiverModalOpen] = useState(false);

  useEffect(() => {
    if (!waiverModalOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setWaiverModalOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [waiverModalOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!parentName.trim()) {
      setError("Parent/guardian name is required.");
      return;
    }
    if (!email.trim()) {
      setError("Email is required.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!phone.trim()) {
      setError("Phone number is required.");
      return;
    }
    if (!childName.trim()) {
      setError("Child's name is required.");
      return;
    }
    if (childAge === "" || childAge < 8 || childAge > 12) {
      setError("Please select child's age (8–12).");
      return;
    }
    if (!emergencyName.trim()) {
      setError("Emergency contact name is required.");
      return;
    }
    if (!emergencyPhone.trim()) {
      setError("Emergency contact phone is required.");
      return;
    }
    if (!agreedToWaiver) {
      setError("You must agree to the waiver and release.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          parentName: parentName.trim(),
          email: email.trim(),
          phone: phone.trim(),
          childName: childName.trim(),
          childAge: Number(childAge),
          registrationType,
          emergencyName: emergencyName.trim(),
          emergencyPhone: emergencyPhone.trim(),
          medicalNotes: medicalNotes.trim() || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message ?? "Something went wrong. Please try again.");
        return;
      }

      if (data.url) {
        window.location.href = data.url;
        return;
      }
      setError("No payment link received. Please try again.");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
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
            <span className="font-semibold text-slate-800">Register</span>
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
          Camp registration
        </h1>
        <p className="mb-8 text-slate-600">
          Complete the form below. You&apos;ll be taken to secure payment after
          submitting. $300 first child · $250 sibling.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div
              role="alert"
              className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
            >
              {error}
            </div>
          )}

          <fieldset className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6">
            <legend className="text-lg font-semibold text-slate-800">
              Parent / guardian
            </legend>
            <div>
              <label htmlFor="parentName" className="mb-1 block text-sm font-medium text-slate-700">
                Name *
              </label>
              <input
                id="parentName"
                type="text"
                required
                value={parentName}
                onChange={(e) => setParentName(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
              />
            </div>
            <div>
              <label htmlFor="email" className="mb-1 block text-sm font-medium text-slate-700">
                Email *
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
              />
            </div>
            <div>
              <label htmlFor="phone" className="mb-1 block text-sm font-medium text-slate-700">
                Phone *
              </label>
              <input
                id="phone"
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
              />
            </div>
          </fieldset>

          <fieldset className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6">
            <legend className="text-lg font-semibold text-slate-800">
              Camper
            </legend>
            <div>
              <label htmlFor="childName" className="mb-1 block text-sm font-medium text-slate-700">
                Child&apos;s name *
              </label>
              <input
                id="childName"
                type="text"
                required
                value={childName}
                onChange={(e) => setChildName(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
              />
            </div>
            <div>
              <label htmlFor="childAge" className="mb-1 block text-sm font-medium text-slate-700">
                Age (8–12) *
              </label>
              <select
                id="childAge"
                required
                value={childAge === "" ? "" : String(childAge)}
                onChange={(e) => setChildAge(e.target.value === "" ? "" : Number(e.target.value))}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
              >
                <option value="">Select age</option>
                {AGES.map((age) => (
                  <option key={age} value={age}>
                    {age}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <span className="mb-2 block text-sm font-medium text-slate-700">
                Registration type *
              </span>
              <div className="flex gap-4">
                <label className="flex cursor-pointer items-center gap-2">
                  <input
                    type="radio"
                    name="registrationType"
                    checked={registrationType === "first"}
                    onChange={() => setRegistrationType("first")}
                    className="h-4 w-4 border-slate-300 text-sky-600 focus:ring-sky-500"
                  />
                  <span>First child — $300</span>
                </label>
                <label className="flex cursor-pointer items-center gap-2">
                  <input
                    type="radio"
                    name="registrationType"
                    checked={registrationType === "sibling"}
                    onChange={() => setRegistrationType("sibling")}
                    className="h-4 w-4 border-slate-300 text-sky-600 focus:ring-sky-500"
                  />
                  <span>Sibling — $250</span>
                </label>
              </div>
            </div>
          </fieldset>

          <fieldset className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6">
            <legend className="text-lg font-semibold text-slate-800">
              Emergency contact
            </legend>
            <div>
              <label htmlFor="emergencyName" className="mb-1 block text-sm font-medium text-slate-700">
                Name *
              </label>
              <input
                id="emergencyName"
                type="text"
                required
                value={emergencyName}
                onChange={(e) => setEmergencyName(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
              />
            </div>
            <div>
              <label htmlFor="emergencyPhone" className="mb-1 block text-sm font-medium text-slate-700">
                Phone *
              </label>
              <input
                id="emergencyPhone"
                type="tel"
                required
                value={emergencyPhone}
                onChange={(e) => setEmergencyPhone(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
              />
            </div>
          </fieldset>

          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <label htmlFor="medicalNotes" className="mb-1 block text-sm font-medium text-slate-700">
              Medical notes / allergies (optional)
            </label>
            <textarea
              id="medicalNotes"
              rows={3}
              value={medicalNotes}
              onChange={(e) => setMedicalNotes(e.target.value)}
              placeholder="Anything we should know?"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 placeholder:text-slate-400 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
            />
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
            <label className="flex cursor-pointer gap-3">
              <input
                type="checkbox"
                checked={agreedToWaiver}
                onChange={(e) => setAgreedToWaiver(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
              />
              <span className="text-sm text-slate-700">
                I agree to the{" "}
                <button
                  type="button"
                  onClick={() => setWaiverModalOpen(true)}
                  className="font-medium text-sky-600 underline hover:text-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2 rounded"
                >
                  waiver and release of liability
                </button>
                , and I authorize emergency medical care for my child. I have
                read the camp details and safety information. *
              </span>
            </label>
          </div>

          {waiverModalOpen && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
              role="dialog"
              aria-modal="true"
              aria-labelledby="waiver-title"
              onClick={() => setWaiverModalOpen(false)}
            >
              <div
                className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-xl"
                onClick={(e) => e.stopPropagation()}
              >
                <h2
                  id="waiver-title"
                  className="mb-4 text-lg font-bold text-slate-800"
                >
                  Liability Waiver and Medical Authorization
                </h2>
                <div className="space-y-4 text-sm text-slate-700 leading-relaxed">
                  <p>
                    I understand that participation in the Heatherwood Summer
                    Football Camp involves physical activity and outdoor play
                    that carry inherent risks, including but not limited to
                    falls, collisions, strains, and other injuries. I
                    voluntarily assume all risks associated with my child&apos;s
                    participation.
                  </p>
                  <p>
                    On behalf of myself and my child, I release and hold harmless
                    the camp organizer, coaches, assistants, volunteers, and the
                    use of the Heatherwood Elementary School facilities from any
                    and all claims, liabilities, damages, or expenses arising
                    out of or related to participation in the camp, except in
                    cases of gross negligence or willful misconduct.
                  </p>
                  <p>
                    I confirm that my child is physically able to participate and
                    I authorize camp staff to provide basic first aid and to
                    obtain emergency medical care if necessary. I agree to be
                    responsible for any resulting medical costs.
                  </p>
                  <p>
                    By signing below, I acknowledge that I have read and agree to
                    this waiver and consent to my child&apos;s participation.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setWaiverModalOpen(false)}
                  className="mt-6 w-full rounded-xl bg-sky-500 py-2.5 font-semibold text-white hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2"
                >
                  Close
                </button>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-sky-500 py-3 font-semibold text-white shadow-md transition hover:bg-sky-600 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2"
          >
            {loading ? "Taking you to payment…" : "Continue to payment"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Already registered?{" "}
          <Link href="/register/pay" className="font-medium text-sky-600 hover:underline">
            Complete payment here
          </Link>
          {" · "}
          Questions?{" "}
          <a
            href="mailto:heatherwoodfootballcamp@gmail.com"
            className="font-medium text-sky-600 hover:underline"
          >
            Email us
          </a>
        </p>
      </main>
    </div>
  );
}
