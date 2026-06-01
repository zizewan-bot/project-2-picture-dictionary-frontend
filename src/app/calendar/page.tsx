"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { getCalendar, type CalendarDay } from "@/lib/api";

function dateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function parseDateKey(key: string) {
  return new Date(`${key}T00:00:00`);
}

function formatDate(key: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(parseDateKey(key));
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
  const lookupDays = useMemo(
    () =>
      days
        .filter((day) => day.unique_words_count > 0 || day.total_lookup_count > 0)
        .sort((a, b) => b.date.localeCompare(a.date)),
    [days],
  );
  const calendarMonth = useMemo(() => {
    if (lookupDays.length === 0) {
      return new Date();
    }
    return parseDateKey(lookupDays[0].date);
  }, [lookupDays]);
  const visibleDates = useMemo(() => {
    const start = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), 1);
    const firstGridDay = new Date(start);
    firstGridDay.setDate(start.getDate() - start.getDay());
    return Array.from({ length: 42 }, (_, index) => {
      const date = new Date(firstGridDay);
      date.setDate(firstGridDay.getDate() + index);
      return date;
    });
  }, [calendarMonth]);

  const monthTitle = new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" }).format(calendarMonth);

  return (
    <section className="space-y-6">
      <div>
        <p className="text-sm font-bold uppercase tracking-wide text-teal-700">Your Word Calendar</p>
        <h1 className="text-4xl font-black">{monthTitle}</h1>
      </div>

      {loading && <p className="rounded-md bg-white p-4 font-semibold">Loading calendar...</p>}
      {error && <p className="rounded-md border border-red-200 bg-red-50 p-4 font-semibold text-red-700">{error}</p>}

      {!loading && !error && (
        <>
          {lookupDays.length > 0 && (
            <Link
              href={`/day/${lookupDays[0].date}`}
              className="block rounded-lg border border-teal-200 bg-teal-50 p-4 shadow-sm transition hover:border-teal-400"
            >
              <p className="text-sm font-bold uppercase tracking-wide text-teal-800">Latest lookup day</p>
              <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
                <h2 className="text-2xl font-black text-stone-950">{formatDate(lookupDays[0].date)}</h2>
                <div className="flex flex-wrap gap-2 text-sm font-bold text-teal-900">
                  <span className="rounded-md bg-white px-3 py-2">{lookupDays[0].unique_words_count} unique words</span>
                  <span className="rounded-md bg-white px-3 py-2">{lookupDays[0].total_lookup_count} times searched</span>
                </div>
              </div>
            </Link>
          )}

          <div className="overflow-hidden rounded-lg border border-stone-200 bg-white shadow-sm">
            <div className="grid grid-cols-7 bg-stone-100 text-center text-[0.68rem] font-black uppercase text-stone-600 sm:text-xs">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((weekday) => (
                <div className="px-1 py-2 sm:px-2 sm:py-3" key={weekday}>
                  {weekday}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7">
              {visibleDates.map((date) => {
                const key = dateKey(date);
                const summary = dayMap.get(key);
                const hasRecords = Boolean(summary && (summary.unique_words_count > 0 || summary.total_lookup_count > 0));
                const isCurrentMonth = date.getMonth() === calendarMonth.getMonth();
                return (
                  <Link
                    key={key}
                    href={`/day/${key}`}
                    className={`min-h-24 border-t border-stone-200 p-2 transition hover:bg-teal-50 sm:min-h-32 sm:p-3 [&:not(:nth-child(7n))]:border-r ${
                      hasRecords
                        ? "bg-teal-50 text-stone-950 ring-2 ring-inset ring-teal-300"
                        : isCurrentMonth
                          ? "bg-white text-stone-700"
                          : "bg-stone-50 text-stone-400"
                    }`}
                  >
                    <p className="text-base font-black sm:text-lg">{date.getDate()}</p>
                    {hasRecords ? (
                      <div className="mt-2 space-y-1 text-[0.68rem] font-bold text-teal-900 sm:mt-4 sm:text-sm">
                        <p>{summary?.unique_words_count} unique</p>
                        <p>{summary?.total_lookup_count} searched</p>
                      </div>
                    ) : (
                      <p className="mt-2 hidden text-xs text-stone-400 sm:block">0 searched</p>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        </>
      )}
    </section>
  );
}
