"use client";

/* eslint-disable @next/next/no-img-element */
import { useState } from "react";

import type { ImageStatus } from "@/lib/api";

type WordImageProps = {
  src?: string | null;
  word: string;
  status?: ImageStatus;
  isAiGenerated?: boolean;
  className?: string;
};

export function WordImage({ src, word, status = "ready", isAiGenerated = true, className = "" }: WordImageProps) {
  const [failed, setFailed] = useState(false);

  if (status === "pending") {
    return (
      <div
        className={`flex h-full w-full flex-col items-center justify-center bg-teal-50 p-6 text-center ${className}`}
        role="status"
        aria-label={`AI-generated learning picture for ${word} is being created`}
      >
        <div className="h-9 w-9 animate-spin rounded-full border-4 border-teal-200 border-t-teal-700" aria-hidden="true" />
        <p className="mt-3 text-lg font-black text-teal-900">You found a new word!</p>
        <p className="mt-2 max-w-sm text-sm leading-6 text-teal-800">AI-generated picture is being created.</p>
      </div>
    );
  }

  if (status === "failed" || failed || !src) {
    return (
      <div className={`flex h-full w-full flex-col items-center justify-center bg-stone-100 p-6 text-center ${className}`}>
        <p className="max-w-sm text-sm font-bold leading-6 text-stone-700">
          AI-generated picture is not available right now.
        </p>
      </div>
    );
  }

  return (
    <figure
      className={`relative h-full w-full ${className}`}
      aria-label={isAiGenerated ? `AI-generated learning picture for ${word}` : `Learning picture for ${word}`}
    >
      <img
        src={src}
        alt={isAiGenerated ? `AI-generated learning picture for ${word}` : `Learning picture for ${word}`}
        width={512}
        height={384}
        onError={() => setFailed(true)}
        className="aspect-[4/3] h-full w-full object-cover"
      />
      {isAiGenerated && (
        <>
          <span className="absolute right-2 top-2 rounded-full bg-stone-950/70 px-2 py-1 text-xs font-black text-white">
            AI
          </span>
          <figcaption className="sr-only">AI-generated learning picture</figcaption>
        </>
      )}
    </figure>
  );
}
