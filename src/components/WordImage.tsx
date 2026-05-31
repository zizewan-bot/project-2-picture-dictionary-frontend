"use client";

/* eslint-disable @next/next/no-img-element */
import { useState } from "react";

type WordImageProps = {
  src: string;
  word: string;
  className?: string;
};

export function WordImage({ src, word, className = "" }: WordImageProps) {
  const [failed, setFailed] = useState(false);
  const fallback = `https://placehold.co/600x400?text=${encodeURIComponent(word || "word")}`;

  return (
    <img
      src={failed ? fallback : src}
      alt={`Visual explanation for ${word}`}
      onError={() => setFailed(true)}
      className={`h-full w-full object-cover ${className}`}
    />
  );
}
