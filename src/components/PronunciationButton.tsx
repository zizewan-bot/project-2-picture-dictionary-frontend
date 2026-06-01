"use client";

import { useEffect, useState } from "react";

export function PronunciationButton({ word }: { word: string }) {
  const [canSpeak, setCanSpeak] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setCanSpeak("speechSynthesis" in window);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  if (!canSpeak) {
    return null;
  }

  function speak() {
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = "en-US";
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  }

  return (
    <button
      type="button"
      onClick={speak}
      className="rounded-md border border-teal-200 px-3 py-2 text-sm font-bold text-teal-800 transition hover:bg-teal-50"
    >
      Hear word
    </button>
  );
}
