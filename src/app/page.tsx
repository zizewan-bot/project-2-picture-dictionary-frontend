"use client";

import { FormEvent, useState } from "react";

import { searchWord, type WordLookup } from "@/lib/api";
import { StatusBadge } from "@/components/StatusBadge";
import { WordImage } from "@/components/WordImage";

export default function Home() {
  const [word, setWord] = useState("");
  const [result, setResult] = useState<WordLookup | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setResult(null);
    setLoading(true);
    try {
      const savedWord = await searchWord(word);
      setResult(savedWord);
      setWord("");
    } catch (caughtError) {
      const message = caughtError instanceof Error ? caughtError.message : "Search failed.";
      if (message.includes("reliable picture")) {
        setError("We could not create a reliable picture for this word yet. Please try again.");
      } else {
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_420px]">
      <section className="space-y-6">
        <div className="space-y-3">
          <p className="text-sm font-bold uppercase tracking-wide text-teal-700">Picture Dictionary</p>
          <h1 className="max-w-3xl text-4xl font-black text-stone-950 sm:text-5xl">
            Learn English words with clear pictures.
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-stone-700">
            Search a word or common phrase to see a simple meaning, a short example, and a clear picture.
          </p>
        </div>

        <form onSubmit={handleSearch} className="rounded-lg border border-stone-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row">
            <label className="sr-only" htmlFor="word">
              English word
            </label>
            <input
              id="word"
              value={word}
              onChange={(event) => setWord(event.target.value)}
              placeholder="Search a word or short phrase..."
              className="min-h-12 flex-1 rounded-md border border-stone-300 px-4 text-base outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
            />
            <button
              type="submit"
              disabled={loading || !word.trim()}
              className="min-h-12 rounded-md bg-teal-700 px-5 font-bold text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:bg-stone-300"
            >
              {loading ? "Searching..." : "Search"}
            </button>
          </div>
          <p className="mt-3 text-sm text-stone-600">
            Try one word, like &apos;cat&apos;, or a short phrase, like &apos;ice cream&apos;.
          </p>
        </form>

        {error && <p className="rounded-md border border-red-200 bg-red-50 p-3 font-semibold text-red-700">{error}</p>}

        {!result && !loading && (
          <div className="rounded-lg border border-dashed border-stone-300 bg-white/70 p-8 text-center text-stone-600">
            Search your first word.
          </div>
        )}
      </section>

      {result && (
        <aside className="overflow-hidden rounded-lg border border-stone-200 bg-white shadow-sm">
          <div className="aspect-[4/3] bg-stone-100">
            <WordImage src={result.image_url} word={result.word} />
          </div>
          <div className="space-y-4 p-5">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-3xl font-black capitalize">{result.word}</h2>
              <StatusBadge status={result.learning_status} />
            </div>
            <p className="leading-7 text-stone-700">{result.simple_definition}</p>
            <p className="rounded-md bg-stone-100 p-3 text-stone-800">{result.example_sentence}</p>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-md border border-stone-200 p-3">
                <p className="font-bold text-stone-500">Times searched</p>
                <p className="text-2xl font-black">{result.lookup_count}</p>
              </div>
              <div className="rounded-md border border-stone-200 p-3">
                <p className="font-bold text-stone-500">Learning status</p>
                <p className="text-2xl font-black capitalize">{result.learning_status}</p>
              </div>
            </div>
          </div>
        </aside>
      )}
    </div>
  );
}
