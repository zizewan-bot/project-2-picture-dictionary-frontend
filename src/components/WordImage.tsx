"use client";

/* eslint-disable @next/next/no-img-element */
import { useState } from "react";

import type { ImageStatus } from "@/lib/api";

type WordImageProps = {
  src?: string | null;
  word: string;
  status?: ImageStatus;
  className?: string;
};

export function WordImage({ src, word, status = "ready", className = "" }: WordImageProps) {
  const [failed, setFailed] = useState(false);

  if (status === "pending") {
    return (
      <div className={`flex h-full w-full flex-col items-center justify-center bg-teal-50 p-6 text-center ${className}`}>
        <p className="text-lg font-black text-teal-900">You found a new word!</p>
        <p className="mt-2 max-w-sm text-sm leading-6 text-teal-800">We&apos;re creating its first picture now.</p>
      </div>
    );
  }

  if (status === "failed" || failed || !src) {
    return (
      <div className={`flex h-full w-full flex-col items-center justify-center bg-stone-100 p-6 text-center ${className}`}>
        <p className="max-w-sm text-sm font-bold leading-6 text-stone-700">
          The word is ready, but the picture could not be created yet.
        </p>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={`Visual explanation for ${word}`}
      width={512}
      height={384}
      onError={() => setFailed(true)}
      className={`aspect-[4/3] h-full w-full object-cover ${className}`}
    />
  );
}
