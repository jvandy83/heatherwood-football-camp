"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const AGES = [7, 8, 9, 10, 11, 12] as const;

const WEEKS = [
  { value: "week1", label: "Week 1: June 1–5" },
  { value: "week2", label: "Week 2: June 8–12" },
  { value: "week3", label: "Week 3: June 15–19" },
] as const;

const TSHIRT_SIZES = [
  "Youth Small",
  "Youth Medium",
  "Youth Large",
  "Adult Small",
  "Adult Medium",
  "Adult Large",
] as const;

const EXPERIENCE_LEVELS = [
  "1 season football",
  "2 seasons football",
  "3+ seasons football",
  "Playing at home and school",
] as const;

const GRADES = ["2nd", "3rd", "4th", "5th", "6th", "7th"] as const;

const PICKUP_TIMES = ["2:00pm", "2:30pm", "3:00pm", "3:30pm", "4:00pm"] as const;

type RegistrationType = "first" | "sibling";

const FORM_DRAFT_KEY = "campRegisterDraftV1";
const TRAILFUNDS_READY_KEY = "trailfundsUserReadyV1";
const TRAILFUNDS_READY_QUERY_PARAM = "tfUserReady";
const TRAILFUNDS_BASE_URL =
  process.env.NEXT_PUBLIC_TRAILFUNDS_BASE_URL ?? "http://localhost:3000";
const TRAILFUNDS_LOGIN_PATH =
  process.env.NEXT_PUBLIC_TRAILFUNDS_LOGIN_PATH ?? "/api/auth/login";
const TRAILFUNDS_ONBOARDING_PATH =
  process.env.NEXT_PUBLIC_TRAILFUNDS_ONBOARDING_PATH ?? "/onboarding";

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [trailfundsReady, setTrailfundsReady] = useState(false);

  const [parentName, setParentName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [childName, setChildName] = useState("");
  const [childAge, setChildAge] = useState<number | "">("");
  const [registrationType, setRegistrationType] = useState<RegistrationType>("first");
  const [week, setWeek] = useState<string>(WEEKS[0].value);
  const [tshirtSize, setTshirtSize] = useState<string>(TSHIRT_SIZES[0]);
  const [experienceLevel, setExperienceLevel] = useState<string>(EXPERIENCE_LEVELS[0]);
  const [gradeEntering, setGradeEntering] = useState<string>(GRADES[0]);
  const [extendedPickup, setExtendedPickup] = useState<"yes" | "no">("no");
  const [pickupTime, setPickupTime] = useState<string>(PICKUP_TIMES[4]); // 4:00pm default
  const [emergencyName, setEmergencyName] = useState("");
  const [emergencyPhone, setEmergencyPhone] = useState("");
  const [medicalNotes, setMedicalNotes] = useState("");
  const [agreedToWaiver, setAgreedToWaiver] = useState(false);
  const [waiverModalOpen, setWaiverModalOpen] = useState(false);
  const [spots, setSpots] = useState<Record<string, number>>({
    week1: 11,
    week2: 20,
    week3: 20,
  });

  useEffect(() => {
    fetch("/api/spots")
      .then((res) => res.json())
      .then((data) => setSpots(data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!waiverModalOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setWaiverModalOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [waiverModalOpen]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const returnedFromOnboarding =
      params.get(TRAILFUNDS_READY_QUERY_PARAM) === "1";

    if (returnedFromOnboarding) {
      sessionStorage.setItem(TRAILFUNDS_READY_KEY, "1");
      params.delete(TRAILFUNDS_READY_QUERY_PARAM);
      const nextQuery = params.toString();
      const nextUrl = nextQuery
        ? `${window.location.pathname}?${nextQuery}`
        : window.location.pathname;
      window.history.replaceState(null, "", nextUrl);
    }

    setTrailfundsReady(
      returnedFromOnboarding ||
        sessionStorage.getItem(TRAILFUNDS_READY_KEY) === "1",
    );

    const savedDraft = sessionStorage.getItem(FORM_DRAFT_KEY);
    if (!savedDraft) return;
    try {
      const parsed = JSON.parse(savedDraft) as Partial<{
        parentName: string;
        email: string;
        phone: string;
        childName: string;
        childAge: number | "";
        registrationType: RegistrationType;
        week: string;
        tshirtSize: string;
        experienceLevel: string;
        gradeEntering: string;
        extendedPickup: "yes" | "no";
        pickupTime: string;
        emergencyName: string;
        emergencyPhone: string;
        medicalNotes: string;
        agreedToWaiver: boolean;
      }>;

      if (parsed.parentName !== undefined) setParentName(parsed.parentName);
      if (parsed.email !== undefined) setEmail(parsed.email);
      if (parsed.phone !== undefined) setPhone(parsed.phone);
      if (parsed.childName !== undefined) setChildName(parsed.childName);
      if (parsed.childAge !== undefined) setChildAge(parsed.childAge);
      if (parsed.registrationType !== undefined) {
        setRegistrationType(parsed.registrationType);
      }
      if (parsed.week !== undefined) setWeek(parsed.week);
      if (parsed.tshirtSize !== undefined) setTshirtSize(parsed.tshirtSize);
      if (parsed.experienceLevel !== undefined) {
        setExperienceLevel(parsed.experienceLevel);
      }
      if (parsed.gradeEntering !== undefined) {
        setGradeEntering(parsed.gradeEntering);
      }
      if (parsed.extendedPickup !== undefined) {
        setExtendedPickup(parsed.extendedPickup);
      }
      if (parsed.pickupTime !== undefined) setPickupTime(parsed.pickupTime);
      if (parsed.emergencyName !== undefined) setEmergencyName(parsed.emergencyName);
      if (parsed.emergencyPhone !== undefined) {
        setEmergencyPhone(parsed.emergencyPhone);
      }
      if (parsed.medicalNotes !== undefined) setMedicalNotes(parsed.medicalNotes);
      if (parsed.agreedToWaiver !== undefined) {
        setAgreedToWaiver(parsed.agreedToWaiver);
      }
    } catch {
      sessionStorage.removeItem(FORM_DRAFT_KEY);
    }
  }, []);

  const saveDraft = () => {
    const draft = {
      parentName,
      email,
      phone,
      childName,
      childAge,
      registrationType,
      week,
      tshirtSize,
      experienceLevel,
      gradeEntering,
      extendedPickup,
      pickupTime,
      emergencyName,
      emergencyPhone,
      medicalNotes,
      agreedToWaiver,
    };
    sessionStorage.setItem(FORM_DRAFT_KEY, JSON.stringify(draft));
  };

  const startTrailfundsOnboarding = () => {
    saveDraft();

    const returnTo = new URL(window.location.href);
    returnTo.searchParams.set(TRAILFUNDS_READY_QUERY_PARAM, "1");

    const onboardingUrl = new URL(TRAILFUNDS_ONBOARDING_PATH, TRAILFUNDS_BASE_URL);
    onboardingUrl.searchParams.set("returnTo", returnTo.toString());

    if (email.trim()) onboardingUrl.searchParams.set("email", email.trim());

    const [firstName, ...lastNameParts] = parentName.trim().split(/\s+/);
    if (firstName) onboardingUrl.searchParams.set("firstName", firstName);
    if (lastNameParts.length > 0) {
      onboardingUrl.searchParams.set("lastName", lastNameParts.join(" "));
    }

    const loginUrl = new URL(TRAILFUNDS_LOGIN_PATH, TRAILFUNDS_BASE_URL);
    loginUrl.searchParams.set("returnTo", onboardingUrl.toString());
    window.location.href = loginUrl.toString();
  };

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
    if (childAge === "" || childAge < 7 || childAge > 12) {
      setError("Please select child's age (7–12).");
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
    if (!week) {
      setError("Please select a week.");
      return;
    }
    if (!agreedToWaiver) {
      setError("You must agree to the waiver and release.");
      return;
    }
    if (!trailfundsReady) {
      startTrailfundsOnboarding();
      return;
    }

    setLoading(true);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);
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
          week,
          tshirtSize,
          experienceLevel,
          gradeEntering,
          extendedPickup,
          pickupTime: extendedPickup === "yes" ? pickupTime : "",
          emergencyName: emergencyName.trim(),
          emergencyPhone: emergencyPhone.trim(),
          medicalNotes: medicalNotes.trim() || undefined,
        }),
        signal: controller.signal,
      });

      const data = await res.json();
      clearTimeout(timeoutId);

      if (!res.ok) {
        setError(data.message ?? "Something went wrong. Please try again.");
        return;
      }

      if (data.url) {
        sessionStorage.removeItem(FORM_DRAFT_KEY);
        window.location.href = data.url;
        return;
      }
      setError("No payment link received. Please try again.");
    } catch (err) {
      clearTimeout(timeoutId);
      if (err instanceof Error && err.name === "AbortError") {
        setError("Request timed out. Check your connection and try again.");
      } else {
        setError("Something went wrong. Please try again.");
      }
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
          submitting. $325 first child · $250 sibling.
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
                Age (7–12) *
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
                  <span>First child — $325</span>
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
            <div>
              <label htmlFor="week" className="mb-1 block text-sm font-medium text-slate-700">
                Which week? *
              </label>
              <select
                id="week"
                required
                value={week}
                onChange={(e) => setWeek(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
              >
                {WEEKS.map((w) => {
                const available = spots[w.value];
                const spotsLabel =
                  available <= 0 ? " (Full)" : ` (${available} spots available)`;
                return (
                  <option
                    key={w.value}
                    value={w.value}
                    disabled={available <= 0}
                  >
                    {w.label}
                    {spotsLabel}
                  </option>
                );
              })}
              </select>
            </div>
            <div>
              <label htmlFor="tshirtSize" className="mb-1 block text-sm font-medium text-slate-700">
                T-shirt size *
              </label>
              <select
                id="tshirtSize"
                value={tshirtSize}
                onChange={(e) => setTshirtSize(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
              >
                {TSHIRT_SIZES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="experienceLevel" className="mb-1 block text-sm font-medium text-slate-700">
                Camper&apos;s level of experience *
              </label>
              <select
                id="experienceLevel"
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
              >
                {EXPERIENCE_LEVELS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="gradeEntering" className="mb-1 block text-sm font-medium text-slate-700">
                Grade entering in the fall *
              </label>
              <select
                id="gradeEntering"
                value={gradeEntering}
                onChange={(e) => setGradeEntering(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
              >
                {GRADES.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>
          </fieldset>

          <fieldset className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6">
            <legend className="text-lg font-semibold text-slate-800">
              Extended pickup at Coach&apos;s house
            </legend>
            <p className="text-sm text-slate-600">
              Camp is 9am–2pm, with pickup at Heatherwood until 2:30. After-hours pickup is available until 4pm at Coach Jared&apos;s house (2 blocks from the field).
            </p>
            <div>
              <span className="mb-2 block text-sm font-medium text-slate-700">
                Interested in later pickup? *
              </span>
              <div className="flex gap-4">
                <label className="flex cursor-pointer items-center gap-2">
                  <input
                    type="radio"
                    name="extendedPickup"
                    checked={extendedPickup === "yes"}
                    onChange={() => setExtendedPickup("yes")}
                    className="h-4 w-4 border-slate-300 text-sky-600 focus:ring-sky-500"
                  />
                  <span>Yes</span>
                </label>
                <label className="flex cursor-pointer items-center gap-2">
                  <input
                    type="radio"
                    name="extendedPickup"
                    checked={extendedPickup === "no"}
                    onChange={() => setExtendedPickup("no")}
                    className="h-4 w-4 border-slate-300 text-sky-600 focus:ring-sky-500"
                  />
                  <span>No</span>
                </label>
              </div>
            </div>
            {extendedPickup === "yes" && (
              <div>
                <label htmlFor="pickupTime" className="mb-1 block text-sm font-medium text-slate-700">
                  What time would you like to pick up?
                </label>
                <select
                  id="pickupTime"
                  value={pickupTime}
                  onChange={(e) => setPickupTime(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                >
                  {PICKUP_TIMES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
            )}
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

          <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-700">
            {trailfundsReady ? (
              <p>
                Trailfunds account ready. You can continue directly to payment.
              </p>
            ) : (
              <div className="space-y-3">
                <p>
                  Before payment, you&apos;ll sign in and complete a quick
                  Trailfunds profile (first and last name). You&apos;ll return
                  here automatically.
                </p>
                <button
                  type="button"
                  onClick={startTrailfundsOnboarding}
                  className="rounded-lg border border-sky-300 bg-sky-50 px-3 py-2 font-medium text-sky-700 hover:bg-sky-100 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2"
                >
                  Sign in and create Trailfunds profile
                </button>
              </div>
            )}
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
