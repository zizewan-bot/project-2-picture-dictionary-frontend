"use client";

/* eslint-disable @next/next/no-img-element */
import { useState } from "react";

type WordImageProps = {
  src?: string | null;
  word: string;
  className?: string;
};

export function WordImage({ src, word, className = "" }: WordImageProps) {
  const [failed, setFailed] = useState(false);
  const fallback = `https://placehold.co/600x400?text=${encodeURIComponent(word || "word")}`;

  return (
    <img
      src={failed || !src ? fallback : src}
      alt={`Visual explanation for ${word}`}
      width={512}
      height={384}
      onError={() => setFailed(true)}
      className={`aspect-[4/3] h-full w-full object-cover ${className}`}
    />
  );
}
