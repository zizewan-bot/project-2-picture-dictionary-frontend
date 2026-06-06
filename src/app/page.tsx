"use client";

import { FormEvent, useEffect, useState } from "react";

import { getWord, retryWordImage, searchWord, type WordLookup } from "@/lib/api";
import { PronunciationButton } from "@/components/PronunciationButton";
import { PronunciationLine } from "@/components/PronunciationLine";
import { WordImage } from "@/components/WordImage";

export default function Home() {
  const [word, setWord] = useState("");
  const [result, setResult] = useState<WordLookup | null>(null);
  const [loading, setLoading] = useState(false);
  const [retryingImage, setRetryingImage] = useState(false);
  const [error, setError] = useState("");
  const [imageRetryMessage, setImageRetryMessage] = useState("");
  const [demoCode, setDemoCode] = useState("");

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDemoCode(window.localStorage.getItem("pictureDictionaryDemoCode") ?? "");
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const pendingResultId = result?.image_status === "pending" ? result.id : null;

  useEffect(() => {
    if (!pendingResultId) {
      return;
    }

    let attempts = 0;
    let active = true;
    const timer = window.setInterval(async () => {
      attempts += 1;
      try {
        const refreshedWord = await getWord(String(pendingResultId));
        if (!active) {
          return;
        }
        setResult(refreshedWord);
        if (refreshedWord.image_status !== "pending" || attempts >= 30) {
          window.clearInterval(timer);
        }
      } catch {
        if (attempts >= 30) {
          window.clearInterval(timer);
        }
      }
    }, 3000);

    return () => {
      active = false;
      window.clearInterval(timer);
    };
  }, [pendingResultId]);

  function handleDemoCodeChange(value: string) {
    setDemoCode(value);
    window.localStorage.setItem("pictureDictionaryDemoCode", value);
  }

  async function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setImageRetryMessage("");
    setResult(null);
    setLoading(true);
    try {
      const savedWord = await searchWord(word, demoCode.trim());
      setResult(savedWord);
      setWord("");
    } catch (caughtError) {
      const message = caughtError instanceof Error ? caughtError.message : "Search failed.";
      if (message.includes("reliable picture")) {
        setError("We could not create a safe and reliable picture for this word yet. Please try again.");
      } else {
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleRetryImage() {
    if (!result || retryingImage) {
      return;
    }

    setRetryingImage(true);
    setImageRetryMessage("");
    try {
      const refreshedWord = await retryWordImage(String(result.id), demoCode.trim());
      setResult(refreshedWord);
      setImageRetryMessage(refreshedWord.retry_message ?? "");
    } catch (caughtError) {
      setImageRetryMessage(caughtError instanceof Error ? caughtError.message : "Please try again later.");
    } finally {
      setRetryingImage(false);
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
              {loading ? "Creating your picture..." : "Search"}
            </button>
          </div>
          <p className="mt-3 text-sm text-stone-600">
            Try one word, like &apos;cat&apos;, or a short phrase, like &apos;ice cream&apos;.
          </p>
          <div className="mt-4 border-t border-stone-200 pt-4">
            <label className="text-sm font-bold text-stone-700" htmlFor="demo-code">
              Enter demo code
            </label>
            <input
              id="demo-code"
              value={demoCode}
              onChange={(event) => handleDemoCodeChange(event.target.value)}
              type="password"
              autoComplete="off"
              className="mt-2 min-h-11 w-full rounded-md border border-stone-300 px-3 text-base outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
            />
            <p className="mt-2 text-sm text-stone-600">
              This public demo requires an access code to create new picture words.
            </p>
          </div>
        </form>

        {loading && (
          <p className="rounded-md bg-white/80 p-3 text-sm font-semibold text-stone-700">
            This can take a moment the first time a word is searched.
          </p>
        )}

        {error && <p className="rounded-md border border-red-200 bg-red-50 p-3 font-semibold text-red-700">{error}</p>}
      </section>

      {result && (
        <aside className="overflow-hidden rounded-lg border border-stone-200 bg-white shadow-sm">
          <div className="aspect-[4/3] bg-stone-100">
            <WordImage
              src={result.image_url}
              status={result.image_status}
              word={result.word}
              isAiGenerated={result.image_is_ai_generated}
              isRetrying={retryingImage}
              retryMessage={imageRetryMessage}
              onRetry={result.image_status === "failed" ? handleRetryImage : undefined}
            />
          </div>
          <div className="space-y-4 p-5">
            <div>
              {result.part_of_speech && (
                <p className="text-sm font-bold uppercase tracking-wide text-teal-700">{result.part_of_speech}</p>
              )}
              <h2 className="mt-1 text-3xl font-black capitalize">{result.word}</h2>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <PronunciationLine ipaUs={result.ipa_us} ipaUk={result.ipa_uk} />
              <PronunciationButton word={result.word} />
            </div>
            {result.primary_sense && (
              <div className="rounded-md border border-teal-100 bg-teal-50 p-3">
                <p className="text-sm font-bold text-teal-800">Primary meaning</p>
                <p className="mt-1 leading-7 text-stone-800">{result.primary_sense}</p>
              </div>
            )}
            <p className="leading-7 text-stone-700">{result.simple_definition}</p>
            <p className="rounded-md bg-stone-100 p-3 text-stone-800">{result.example_sentence}</p>
            {result.other_senses.length > 0 && (
              <section className="space-y-2 rounded-md border border-stone-200 p-3">
                <h3 className="font-black text-stone-900">Other common meanings</h3>
                <div className="space-y-3">
                  {result.other_senses.map((sense, index) => (
                    <div key={`${sense.part_of_speech}-${index}`} className="text-sm leading-6">
                      {sense.part_of_speech && <p className="font-bold text-teal-700">{sense.part_of_speech}</p>}
                      <p className="text-stone-800">{sense.definition}</p>
                      {sense.example_sentence && <p className="mt-1 text-stone-600">{sense.example_sentence}</p>}
                    </div>
                  ))}
                </div>
              </section>
            )}
            <div className="rounded-md border border-stone-200 p-3 text-sm">
              <p className="font-bold text-stone-500">Times searched</p>
              <p className="text-2xl font-black">{result.lookup_count}</p>
            </div>
          </div>
        </aside>
      )}
    </div>
  );
}
