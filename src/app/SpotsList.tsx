"use client";

import { useEffect, useState } from "react";

// Until /api/spots loads: matches sheets.ts getDefaultSpots() (week1 cap 28, weeks 2–3 cap 20, minus reserves)
const DEFAULT_SPOTS = { week1: 25, week2: 15, week3: 17 };

const WEEKS = [
  { key: "week1", label: "Week 1: June 1–5" },
  { key: "week2", label: "Week 2: June 8–12" },
  { key: "week3", label: "Week 3: June 15–19" },
] as const;

export function SpotsList() {
  const [spots, setSpots] = useState<Record<string, number>>(DEFAULT_SPOTS);
  const [week3BlockedUntilWeek2Full, setWeek3BlockedUntilWeek2Full] =
    useState(true);

  useEffect(() => {
    const fetchSpots = () => {
      fetch("/api/spots")
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (!data || typeof data !== "object") return;
          const o = data as Record<string, unknown>;
          const w1 = o.week1;
          const w2 = o.week2;
          const w3 = o.week3;
          if (
            typeof w1 === "number" &&
            typeof w2 === "number" &&
            typeof w3 === "number"
          ) {
            setSpots({ week1: w1, week2: w2, week3: w3 });
          }
          if (typeof o.week3BlockedUntilWeek2Full === "boolean") {
            setWeek3BlockedUntilWeek2Full(o.week3BlockedUntilWeek2Full);
          }
        })
        .catch(() => {});
    };
    fetchSpots();
    const interval = setInterval(fetchSpots, 30000); // refetch every 30s
    return () => clearInterval(interval);
  }, []);

  return (
    <ul className="mb-4 list-inside list-disc space-y-1 text-slate-700">
      {WEEKS.map(({ key, label }) => {
        const blocked = key === "week3" && week3BlockedUntilWeek2Full;
        return (
          <li key={key}>
            {label}
            <span className="ml-1 text-sky-600 font-medium">
              {blocked
                ? "— opens when week 2 is full"
                : `(${spots[key] ?? 0} spots available)`}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
