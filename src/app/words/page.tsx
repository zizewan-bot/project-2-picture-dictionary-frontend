"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { PronunciationLine } from "@/components/PronunciationLine";
import { getWordSummary, type WordSummary } from "@/lib/api";

function formatDate(date: string | null) {
  if (!date) {
    return "Not searched yet";
  }
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

export default function WordsPage() {
  const [words, setWords] = useState<WordSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getWordSummary()
      .then(setWords)
      .catch((caughtError) => setError(caughtError instanceof Error ? caughtError.message : "Word list could not load."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="space-y-6">
      <div>
        <p className="text-sm font-bold uppercase tracking-wide text-teal-700">Your Word List</p>
        <h1 className="text-4xl font-black">Words by search count</h1>
      </div>

      {loading && <p className="rounded-md bg-white p-4 font-semibold">Loading words...</p>}
      {error && <p className="rounded-md border border-red-200 bg-red-50 p-4 font-semibold text-red-700">{error}</p>}

      {!loading && !error && words.length === 0 && (
        <div className="rounded-lg border border-dashed border-stone-300 bg-white/70 p-8 text-center text-stone-600">
          No words searched yet.
        </div>
      )}

      {!loading && !error && words.length > 0 && (
        <div className="overflow-hidden rounded-lg border border-stone-200 bg-white shadow-sm">
          <div className="hidden grid-cols-[minmax(160px,1.5fr)_minmax(120px,1fr)_120px_160px] gap-4 bg-stone-100 px-4 py-3 text-xs font-black uppercase tracking-wide text-stone-600 md:grid">
            <span>Word</span>
            <span>Pronunciation</span>
            <span>Times searched</span>
            <span>Recently searched</span>
          </div>
          <div className="divide-y divide-stone-200">
            {words.map((word) => {
              const rowHref = word.latest_word_lookup_id ? `/words/${word.latest_word_lookup_id}` : `/day/${word.last_lookup_date ?? ""}`;
              return (
                <Link
                  key={word.global_word_id}
                  href={rowHref}
                  className="grid gap-3 px-4 py-4 transition hover:bg-teal-50 md:grid-cols-[minmax(160px,1.5fr)_minmax(120px,1fr)_120px_160px] md:items-center md:gap-4"
                >
                  <div>
                    <h2 className="text-lg font-black capitalize text-stone-950">{word.display_word}</h2>
                    <p className="mt-1 text-sm text-stone-600">{word.simple_definition}</p>
                  </div>
                  <PronunciationLine ipaUs={word.ipa_us} ipaUk={word.ipa_uk} />
                  <p className="text-sm font-bold text-stone-900">
                    <span className="md:hidden">Total times searched: </span>
                    {word.total_lookup_count}
                  </p>
                  <p className="text-sm font-semibold text-stone-700">
                    <span className="md:hidden">Recently searched: </span>
                    {formatDate(word.last_searched_at)}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}
