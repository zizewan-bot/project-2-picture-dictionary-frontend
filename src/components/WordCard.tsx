import Link from "next/link";

import type { WordLookup } from "@/lib/api";
import { PronunciationButton } from "@/components/PronunciationButton";
import { PronunciationLine } from "@/components/PronunciationLine";
import { StatusBadge } from "@/components/StatusBadge";
import { WordImage } from "@/components/WordImage";

export function WordCard({ word }: { word: WordLookup }) {
  return (
    <article className="grid overflow-hidden rounded-lg border border-stone-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:grid-cols-[192px_1fr]">
      <div className="aspect-[4/3] bg-stone-100">
        <WordImage src={word.image_url} word={word.word} />
      </div>
      <div className="space-y-3 p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Link href={`/words/${word.id}`} className="text-2xl font-bold capitalize text-stone-950 hover:text-teal-700">
            {word.word}
          </Link>
          <StatusBadge status={word.learning_status} />
        </div>
        <PronunciationLine ipaUs={word.ipa_us} ipaUk={word.ipa_uk} />
        <p className="text-sm leading-6 text-stone-700">{word.simple_definition}</p>
        <p className="rounded-md bg-stone-100 p-3 text-sm text-stone-800">{word.example_sentence}</p>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm font-semibold text-stone-900">Times searched: {word.lookup_count}</p>
          <PronunciationButton word={word.word} />
        </div>
      </div>
    </article>
  );
}
