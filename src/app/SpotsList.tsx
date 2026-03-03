"use client";

import { useEffect, useState } from "react";

const DEFAULT_SPOTS = { week1: 9, week2: 20, week3: 20 }; // 20 - 10 reserved; sheet rows (Paid/Pending) counted separately

const WEEKS = [
  { key: "week1", label: "Week 1: June 1–5" },
  { key: "week2", label: "Week 2: June 8–12" },
  { key: "week3", label: "Week 3: June 15–19" },
] as const;

export function SpotsList() {
  const [spots, setSpots] = useState<Record<string, number>>(DEFAULT_SPOTS);

  useEffect(() => {
    const fetchSpots = () => {
      fetch("/api/spots")
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data && typeof data === "object") setSpots(data);
        })
        .catch(() => {});
    };
    fetchSpots();
    const interval = setInterval(fetchSpots, 30000); // refetch every 30s
    return () => clearInterval(interval);
  }, []);

  return (
    <ul className="mb-4 list-inside list-disc space-y-1 text-slate-700">
      {WEEKS.map(({ key, label }) => (
        <li key={key}>
          {label}
          <span className="ml-1 text-sky-600 font-medium">
            ({spots[key] ?? 0} spots available)
          </span>
        </li>
      ))}
    </ul>
  );
}
