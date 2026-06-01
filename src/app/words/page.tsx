"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { getWordSummary, type WordSummary } from "@/lib/api";
import { PronunciationButton } from "@/components/PronunciationButton";
import { PronunciationLine } from "@/components/PronunciationLine";
import { WordImage } from "@/components/WordImage";

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
        <div className="grid gap-4">
          {words.map((word) => (
            <article
              key={word.global_word_id}
              className="grid overflow-hidden rounded-lg border border-stone-200 bg-white shadow-sm sm:grid-cols-[192px_1fr]"
            >
              <div className="aspect-[4/3] bg-stone-100">
                <WordImage src={word.image_url} word={word.display_word} />
              </div>
              <div className="space-y-3 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h2 className="text-2xl font-bold capitalize text-stone-950">{word.display_word}</h2>
                  <PronunciationButton word={word.display_word} />
                </div>
                <PronunciationLine ipaUs={word.ipa_us} ipaUk={word.ipa_uk} />
                <p className="text-sm leading-6 text-stone-700">{word.simple_definition}</p>
                <div className="grid gap-2 text-sm font-semibold text-stone-800 sm:grid-cols-2">
                  <p>Total times searched: {word.total_lookup_count}</p>
                  <p>Last searched: {formatDate(word.last_searched_at)}</p>
                </div>
                {word.latest_word_lookup_id && (
                  <Link href={`/words/${word.latest_word_lookup_id}`} className="inline-flex text-sm font-bold text-teal-800 hover:text-teal-950">
                    View details
                  </Link>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
