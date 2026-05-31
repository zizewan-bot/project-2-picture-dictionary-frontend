"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import { WordCard } from "@/components/WordCard";
import { getDay, type LookupDay } from "@/lib/api";

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
        <p className="text-sm font-bold uppercase tracking-wide text-teal-700">Daily word list</p>
        <h1 className="text-4xl font-black">{params.date}</h1>
      </div>

      {loading && <p className="rounded-md bg-white p-4 font-semibold">Loading words...</p>}
      {error && <p className="rounded-md border border-red-200 bg-red-50 p-4 font-semibold text-red-700">{error}</p>}

      {!loading && !error && day?.word_lookups.length === 0 && (
        <div className="rounded-lg border border-dashed border-stone-300 bg-white/70 p-8 text-center text-stone-600">
          No words searched for this day yet.
        </div>
      )}

      {!loading && !error && day && day.word_lookups.length > 0 && (
        <div className="grid gap-4">
          {day.word_lookups.map((word) => (
            <WordCard key={word.id} word={word} />
          ))}
        </div>
      )}
    </section>
  );
}
