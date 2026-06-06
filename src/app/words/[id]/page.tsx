"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import { PronunciationButton } from "@/components/PronunciationButton";
import { PronunciationLine } from "@/components/PronunciationLine";
import { WordImage } from "@/components/WordImage";
import { getWord, retryWordImage, type WordLookup } from "@/lib/api";

export default function WordPage() {
  const params = useParams<{ id: string }>();
  const [word, setWord] = useState<WordLookup | null>(null);
  const [loading, setLoading] = useState(true);
  const [retryingImage, setRetryingImage] = useState(false);
  const [imageRetryMessage, setImageRetryMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    getWord(params.id)
      .then(setWord)
      .catch((caughtError) => setError(caughtError instanceof Error ? caughtError.message : "Word could not load."))
      .finally(() => setLoading(false));
  }, [params.id]);

  useEffect(() => {
    if (word?.image_status !== "pending") {
      return;
    }

    let attempts = 0;
    let active = true;
    const timer = window.setInterval(async () => {
      attempts += 1;
      try {
        const refreshedWord = await getWord(params.id);
        if (!active) {
          return;
        }
        setWord(refreshedWord);
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
  }, [params.id, word?.image_status]);

  async function handleRetryImage() {
    if (retryingImage) {
      return;
    }

    setRetryingImage(true);
    setImageRetryMessage("");
    const demoCode = window.localStorage.getItem("pictureDictionaryDemoCode") ?? "";
    try {
      const refreshedWord = await retryWordImage(params.id, demoCode.trim());
      setWord(refreshedWord);
      setImageRetryMessage(refreshedWord.retry_message ?? "");
    } catch (caughtError) {
      setImageRetryMessage(caughtError instanceof Error ? caughtError.message : "Please try again later.");
    } finally {
      setRetryingImage(false);
    }
  }

  if (loading) {
    return <p className="rounded-md bg-white p-4 font-semibold">Loading word...</p>;
  }

  if (!word) {
    return <p className="rounded-md border border-red-200 bg-red-50 p-4 font-semibold text-red-700">{error || "Word not found."}</p>;
  }

  return (
    <section className="mx-auto max-w-3xl">
      <article className="overflow-hidden rounded-lg border border-stone-200 bg-white shadow-sm">
        <div className="aspect-[4/3] bg-stone-100">
          <WordImage
            src={word.image_url}
            status={word.image_status}
            word={word.word}
            isAiGenerated={word.image_is_ai_generated}
            isRetrying={retryingImage}
            retryMessage={imageRetryMessage}
            onRetry={word.image_status === "failed" ? handleRetryImage : undefined}
          />
        </div>
        <div className="space-y-5 p-5 sm:p-6">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-teal-700">Picture word card</p>
            <h1 className="mt-1 text-4xl font-black capitalize text-stone-950">{word.word}</h1>
            {word.part_of_speech && <p className="mt-2 text-base font-bold text-teal-700">{word.part_of_speech}</p>}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <PronunciationLine ipaUs={word.ipa_us} ipaUk={word.ipa_uk} />
            <PronunciationButton word={word.word} />
          </div>

          <div className="space-y-3">
            {word.primary_sense && (
              <div className="rounded-md border border-teal-100 bg-teal-50 p-4">
                <p className="text-sm font-bold text-teal-800">Primary meaning</p>
                <p className="mt-1 leading-8 text-stone-800">{word.primary_sense}</p>
              </div>
            )}
            <p className="text-lg leading-8 text-stone-700">{word.simple_definition}</p>
            <p className="rounded-md bg-stone-100 p-4 text-stone-800">{word.example_sentence}</p>
          </div>

          {word.other_senses.length > 0 && (
            <section className="space-y-3 rounded-md border border-stone-200 p-4">
              <h2 className="text-lg font-black text-stone-950">Other common meanings</h2>
              <div className="space-y-4">
                {word.other_senses.map((sense, index) => (
                  <div key={`${sense.part_of_speech}-${index}`} className="leading-7">
                    {sense.part_of_speech && <p className="font-bold text-teal-700">{sense.part_of_speech}</p>}
                    <p className="text-stone-800">{sense.definition}</p>
                    {sense.example_sentence && <p className="mt-1 text-sm text-stone-600">{sense.example_sentence}</p>}
                  </div>
                ))}
              </div>
            </section>
          )}

          <div className="rounded-md border border-stone-200 p-3 text-sm">
            <p className="font-bold text-stone-500">Times searched</p>
            <p className="text-2xl font-black">{word.lookup_count}</p>
          </div>
        </div>
      </article>
    </section>
  );
}
