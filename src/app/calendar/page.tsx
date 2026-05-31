"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { getCalendar, type CalendarDay } from "@/lib/api";

function dateKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

export default function CalendarPage() {
  const [days, setDays] = useState<CalendarDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getCalendar()
      .then(setDays)
      .catch((caughtError) => setError(caughtError instanceof Error ? caughtError.message : "Calendar could not load."))
      .finally(() => setLoading(false));
  }, []);

  const dayMap = useMemo(() => new Map(days.map((day) => [day.date, day])), [days]);
  const visibleDates = useMemo(() => {
    const today = new Date();
    const start = new Date(today.getFullYear(), today.getMonth(), 1);
    const firstGridDay = new Date(start);
    firstGridDay.setDate(start.getDate() - start.getDay());
    return Array.from({ length: 42 }, (_, index) => {
      const date = new Date(firstGridDay);
      date.setDate(firstGridDay.getDate() + index);
      return date;
    });
  }, []);

  const monthTitle = new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" }).format(new Date());

  return (
    <section className="space-y-6">
      <div>
        <p className="text-sm font-bold uppercase tracking-wide text-teal-700">Your Word Calendar</p>
        <h1 className="text-4xl font-black">{monthTitle}</h1>
      </div>

      {loading && <p className="rounded-md bg-white p-4 font-semibold">Loading calendar...</p>}
      {error && <p className="rounded-md border border-red-200 bg-red-50 p-4 font-semibold text-red-700">{error}</p>}

      {!loading && !error && (
        <div className="overflow-hidden rounded-lg border border-stone-200 bg-white shadow-sm">
          <div className="grid grid-cols-7 bg-stone-100 text-center text-xs font-black uppercase text-stone-600">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((weekday) => (
              <div className="px-2 py-3" key={weekday}>
                {weekday}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-7">
            {visibleDates.map((date) => {
              const key = dateKey(date);
              const summary = dayMap.get(key);
              const isCurrentMonth = date.getMonth() === new Date().getMonth();
              return (
                <Link
                  key={key}
                  href={`/day/${key}`}
                  className={`min-h-32 border-t border-stone-200 p-3 transition hover:bg-teal-50 sm:border-r ${
                    isCurrentMonth ? "bg-white" : "bg-stone-50 text-stone-400"
                  }`}
                >
                  <p className="text-lg font-black">{date.getDate()}</p>
                  <div className="mt-4 space-y-1 text-sm">
                    <p>{summary?.unique_words_count ?? 0} unique words</p>
                    <p>{summary?.total_lookup_count ?? 0} total searches</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}
