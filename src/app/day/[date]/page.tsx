"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import { getDay, type LookupDay } from "@/lib/api";

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(`${date}T00:00:00`));
}

export default function DayPage() {
  const params = useParams<{ date: string }>();
  const [day, setDay] = useState<LookupDay | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getDay(params.date)
      .then(setDay)
      .catch((caughtError) => setError(caughtError instanceof Error ? caughtError.message : "Day could not load."))
      .finally(() => setLoading(false));
  }, [params.date]);

  return (
    <section className="space-y-6">
      <div>
        <p className="text-sm font-bold uppercase tracking-wide text-teal-700">Words searched on</p>
        <h1 className="text-4xl font-black">{formatDate(params.date)}</h1>
      </div>

      {loading && <p className="rounded-md bg-white p-4 font-semibold">Loading words...</p>}
      {error && <p className="rounded-md border border-red-200 bg-red-50 p-4 font-semibold text-red-700">{error}</p>}

      {!loading && !error && day?.word_lookups.length === 0 && (
        <div className="rounded-lg border border-dashed border-stone-300 bg-white/70 p-8 text-center text-stone-600">
          No words searched for this day yet.
        </div>
      )}

      {!loading && !error && day && day.word_lookups.length > 0 && (
        <div className="overflow-hidden rounded-lg border border-stone-200 bg-white shadow-sm">
          <div className="grid grid-cols-[minmax(0,1fr)_96px] gap-4 bg-stone-100 px-4 py-3 text-xs font-black uppercase tracking-wide text-stone-600 sm:grid-cols-[minmax(0,1fr)_140px]">
            <span>Word</span>
            <span>Times searched</span>
          </div>
          <div className="divide-y divide-stone-200">
            {day.word_lookups.map((word) => (
              <Link
                key={word.id}
                href={`/words/${word.id}`}
                className="grid grid-cols-[minmax(0,1fr)_96px] items-center gap-4 px-4 py-4 transition hover:bg-teal-50 sm:grid-cols-[minmax(0,1fr)_140px]"
              >
                <h2 className="truncate text-lg font-black capitalize text-stone-950">{word.word}</h2>
                <p className="text-right text-lg font-black text-stone-900">{word.lookup_count}</p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
