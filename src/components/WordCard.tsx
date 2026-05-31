import Link from "next/link";

import type { WordLookup } from "@/lib/api";
import { StatusBadge } from "@/components/StatusBadge";
import { WordImage } from "@/components/WordImage";

export function WordCard({ word }: { word: WordLookup }) {
  return (
    <Link
      href={`/words/${word.id}`}
      className="group grid overflow-hidden rounded-lg border border-stone-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:grid-cols-[180px_1fr]"
    >
      <div className="aspect-[3/2] bg-stone-100 sm:aspect-auto">
        <WordImage src={word.image_url} word={word.word} />
      </div>
      <div className="space-y-3 p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-2xl font-bold capitalize text-stone-950 group-hover:text-teal-700">
            {word.word}
          </h2>
          <StatusBadge status={word.learning_status} />
        </div>
        <p className="text-sm leading-6 text-stone-700">{word.simple_definition}</p>
        <p className="text-sm font-semibold text-stone-900">Lookups: {word.lookup_count}</p>
      </div>
    </Link>
  );
}
