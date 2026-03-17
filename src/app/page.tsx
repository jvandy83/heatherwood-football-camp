import Image from "next/image";
import { SpotsList } from "./SpotsList";

export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      {/* Hero */}
      <header className="relative min-h-[28rem] overflow-hidden sm:min-h-[32rem]">
        <Image
          src="/flag-football-3.webp"
          alt=""
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-slate-900/50" aria-hidden />
        <div className="relative z-10 flex min-h-[28rem] flex-col items-center justify-center px-6 pt-12 pb-16 text-center sm:min-h-[32rem] sm:px-8 sm:pt-16 sm:pb-20">
          <div className="mx-auto max-w-3xl">
            <Image
              src="/football_camp_logo.png"
              alt="Heatherwood Football Camp"
              width={280}
              height={120}
              className="mx-auto mb-6 h-auto w-48 rounded-2xl sm:w-64 drop-shadow-md"
              priority
            />
            <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-sky-200">
              Boulder Summer Youth Football Camp
            </p>
            <h1 className="font-display text-4xl font-bold tracking-tight text-white sm:text-5xl drop-shadow">
              Heatherwood Football Camp
            </h1>
            <p className="mt-4 text-lg text-slate-200 sm:text-xl">
              Small-Group • Skills-Focused • Community-Based
            </p>
            <div className="mt-8 inline-flex flex-wrap items-center justify-center gap-4 rounded-2xl bg-white/90 px-6 py-4 shadow-lg ring-1 ring-white/20 backdrop-blur-sm">
              <span className="font-semibold text-slate-800">Month of June</span>
              <span className="text-slate-400">•</span>
              <span className="text-slate-700">Ages 7–12</span>
              <span className="text-slate-400">•</span>
              <span className="text-slate-700">Non-contact</span>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-12 sm:px-8 sm:py-16">
        {/* Intro */}
        <section className="mb-14">
          <p className="text-lg leading-relaxed text-slate-600">
            This camp started from a simple idea: a youth football option in
            Boulder that prioritizes quality instruction, safety, and small
            groups. We will run the camp based on level of interest and seats
            filled — we run multiple weeks in June and add more as demand grows.
            Full details below.
          </p>
          <p className="mt-4 text-slate-600">
            The program is built around clear structure, age-appropriate
            instruction, and realistic kid energy levels — not a large or
            commercial camp.
          </p>
        </section>

        {/* Coach */}
        <section className="mb-14 overflow-hidden rounded-2xl bg-slate-100 ring-1 ring-slate-200/60">
          <div className="w-full">
            <Image
              src="/jared_profile_pic.jpg"
              alt="Coach Jared"
              width={800}
              height={600}
              className="w-full rounded-t-2xl object-contain object-top"
            />
          </div>
          <div className="px-6 py-6 sm:px-8">
            <h2 className="mb-3 text-xl font-bold text-slate-800">
              Meet Coach Jared
            </h2>
            <p className="text-slate-700 leading-relaxed">
              Jared has coached 4 seasons of flag football, was the head coach for
              10U Boulder Bears and an assistant coach for the Lafayette Bobcats 11U team
              — and can throw a football farther than Uncle Rico. He&apos;s the father of 4 boys and understands the challenges of raising kids in a competitive environment. You can expect your child to have a lot of fun but also learn a lot about football, teamwork and discipline.
            </p>
            <p className="mt-4 text-slate-700 leading-relaxed">
              His 4 boys have all attended Heatherwood Elementary while his
              oldest son, Bronson, is currently in 6th grade at Platt Middle
              School.
            </p>
            <p className="mt-4 text-sm text-slate-600">
              <a
                href="https://www.linkedin.com/in/vanthedev/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-sky-600 hover:underline"
              >
                View Coach Jared&apos;s LinkedIn
              </a>
            </p>
          </div>
        </section>

        {/* Camp Overview */}
        <section className="mb-14">
          <h2 className="mb-6 text-2xl font-bold text-slate-800">
            Camp Overview
          </h2>
          <ul className="space-y-3 text-slate-700">
            <li className="flex gap-3">
              <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-sky-400" />
              <span>
                <strong>Ages:</strong> 7–12
              </span>
            </li>
            <li className="flex gap-3">
              <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-sky-400" />
              <span>
                <strong>Capacity:</strong> 20 kids total (hard cap)
              </span>
            </li>
            <li className="flex gap-3">
              <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-sky-400" />
              <span>
                <strong>Staffing:</strong> Lead coach + 1 assistant
              </span>
            </li>
            <li className="flex gap-3">
              <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-sky-400" />
              <span>
                <strong>Focus:</strong> Football fundamentals, coordination,
                confidence, teamwork
              </span>
            </li>
            <li className="flex gap-3">
              <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-sky-400" />
              <span>
                <strong>Contact level:</strong> Non-contact (no full tackling)
              </span>
            </li>
          </ul>
          <p className="mt-4 text-slate-600">
            Campers will be grouped by age for skill work and may combine for
            controlled, non-contact scrimmage games with close supervision.
          </p>
        </section>

        {/* Dates & Schedule */}
        <section className="mb-14 rounded-2xl bg-sky-50/80 px-6 py-8 ring-1 ring-sky-200/50 sm:px-8">
          <h2 className="mb-6 text-2xl font-bold text-slate-800">
            Dates &amp; Schedule
          </h2>
          <p className="mb-4 text-slate-700">
            <strong>Camp runs through the month of June.</strong> Each week is
            Monday–Friday. Register for one or more weeks; pricing is per week.
          </p>
          <SpotsList />
          <p className="font-medium text-slate-800">
            Daily schedule: <strong>9:00am – 2:00pm</strong>
          </p>
        </section>

        {/* Location */}
        <section className="mb-14">
          <h2 className="mb-6 text-2xl font-bold text-slate-800">Location</h2>
          <p className="text-slate-700">
            <strong>Heatherwood Elementary School</strong> — outdoor grass field.
          </p>
          <p className="mt-3 text-slate-700">
            Restrooms provided. Shade tent will be available.
          </p>
        </section>

        {/* Daily Itinerary */}
        <section className="mb-14">
          <h2 className="mb-6 text-2xl font-bold text-slate-800">
            Daily Itinerary
          </h2>
          <ol className="space-y-3 text-slate-700">
            <li className="flex gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-sky-200 text-sm font-semibold text-sky-800">
                1
              </span>
              Dynamic warm-up &amp; movement drills
            </li>
            <li className="flex gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-sky-200 text-sm font-semibold text-sky-800">
                2
              </span>
              Skill stations (throwing, catching, footwork, agility)
            </li>
            <li className="flex gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-sky-200 text-sm font-semibold text-sky-800">
                3
              </span>
              Water + snack break
            </li>
            <li className="flex gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-sky-200 text-sm font-semibold text-sky-800">
                4
              </span>
              Position fundamentals &amp; team drills
            </li>
            <li className="flex gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-sky-200 text-sm font-semibold text-sky-800">
                5
              </span>
              Non-contact scrimmage games
            </li>
            <li className="flex gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-sky-200 text-sm font-semibold text-sky-800">
                6
              </span>
              Cool-down and pickup window
            </li>
          </ol>
          <p className="mt-4 text-slate-600">
            The day is structured, active, and paced with frequent water breaks.
          </p>
        </section>

        {/* What to Bring */}
        <section className="mb-14 rounded-2xl bg-sky-50/80 px-6 py-8 ring-1 ring-sky-200/50 sm:px-8">
          <h2 className="mb-6 text-2xl font-bold text-slate-800">
            Refreshments &amp; What to Bring
          </h2>
          <p className="mb-4 text-slate-700">
            Water and light snacks will be provided. Campers who may need
            additional food are welcome to bring a small, labeled lunch or snack
            from home.
          </p>
          <p className="mb-2 font-medium text-slate-800">Campers should bring:</p>
          <ul className="list-inside list-disc space-y-1 text-slate-700">
            <li>Refillable water bottle</li>
            <li>Athletic shoes (cleats optional)</li>
            <li>Sun protection (hat, sunscreen)</li>
          </ul>
        </section>

        {/* Pricing */}
        <section className="mb-14">
          <h2 className="mb-6 text-2xl font-bold text-slate-800">Pricing</h2>
          <div className="rounded-2xl border-2 border-sky-200 bg-white px-6 py-6 shadow-sm sm:px-8">
            <p className="text-2xl font-bold text-slate-800">
              $325 <span className="text-lg font-normal text-slate-600">per child (full week)</span>
            </p>
            <p className="mt-2 text-slate-700">
              $250 for sibling registrations (each additional child)
            </p>
            <p className="mt-4 text-slate-600">
              Pricing reflects small group size, strong supervision, and a
              community-scale camp.
            </p>
          </div>
        </section>

        {/* Extended Supervision */}
        <section className="mb-14">
          <h2 className="mb-6 text-2xl font-bold text-slate-800">
            Pickup &amp; Optional Extended Supervision
          </h2>
          <p className="mb-4 text-slate-700">
            Standard pickup at camp end time (2:00pm). Camp pickup may run until
            2:30 while we wrap up equipment.
          </p>
          <p className="mb-4 text-slate-700">
            <strong>Optional extended supervision:</strong> After camp, we will
            wrap up equipment and walk as a group back to the coach&apos;s
            house, located 2 blocks away. Kids may stay until 4:00pm for later
            pickup. Calm, supervised downtime (snack / rest). No additional
            charge.
          </p>
          <p className="text-slate-700">
            <strong>Pickup at Coach Jared&apos;s house:</strong>
            <br />
            <a
              href="https://www.google.com/maps/search/?api=1&query=4783+Dorchester+Cir,+Boulder,+CO+80301"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sky-600 font-medium hover:underline"
            >
              4783 Dorchester Cir, Boulder, CO 80301
            </a>
          </p>
        </section>

        {/* Safety */}
        <section className="mb-14 rounded-2xl bg-slate-50 px-6 py-8 ring-1 ring-slate-200 sm:px-8">
          <h2 className="mb-6 text-2xl font-bold text-slate-800">
            Safety, Insurance &amp; Waivers
          </h2>
          <p className="mb-4 text-slate-700">
            Camp will carry youth sports liability insurance. Parents will
            complete:
          </p>
          <ul className="list-inside list-disc space-y-1 text-slate-700">
            <li>Liability waiver</li>
            <li>Emergency contact form</li>
            <li>Medical authorization</li>
          </ul>
          <p className="mt-4 text-slate-700">
            Clear safety rules and behavior expectations will be reviewed on Day
            1.
          </p>
        </section>

        {/* Next Steps / CTA */}
        <section className="rounded-2xl bg-gradient-to-br from-sky-100 to-sky-50 px-6 py-10 ring-1 ring-sky-200/60 sm:px-10 sm:py-12">
          <h2 className="mb-6 text-2xl font-bold text-slate-800">Register</h2>
          <p className="mb-6 text-slate-700">
            Fill out the form and complete payment in one flow. We&apos;ll follow
            up with waiver forms and any final details.
          </p>
          <a
            href="/register"
            className="inline-block rounded-xl bg-sky-500 px-6 py-3 font-semibold text-white shadow-md transition hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2"
          >
            Register →
          </a>
          <p className="mt-4 text-sm text-slate-600">
            Already registered and need to pay?{" "}
            <a
              href="/register/pay"
              className="font-medium text-sky-600 underline hover:text-sky-700"
            >
              Complete payment here
            </a>
          </p>
          <p className="mt-6 text-sm text-slate-600">
            Questions?{" "}
            <a
              href="mailto:heatherwoodfootballcamp@gmail.com"
              className="font-medium text-sky-600 underline hover:text-sky-700"
            >
              Get in touch
            </a>
          </p>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-slate-50/50 px-6 py-8 text-center text-sm text-slate-500 sm:px-8">
        <p>Heatherwood Football Camp • Boulder, CO • Summer 2025</p>
      </footer>
    </div>
  );
}
