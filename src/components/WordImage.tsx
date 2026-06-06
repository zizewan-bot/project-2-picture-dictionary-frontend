"use client";

/* eslint-disable @next/next/no-img-element */
import { useState } from "react";

import type { ImageFeedbackValue, ImageStatus } from "@/lib/api";

type WordImageProps = {
  src?: string | null;
  word: string;
  status?: ImageStatus;
  isAiGenerated?: boolean;
  isRetrying?: boolean;
  retryMessage?: string | null;
  onRetry?: () => void;
  currentFeedback?: ImageFeedbackValue | null;
  isSubmittingFeedback?: boolean;
  feedbackMessage?: string | null;
  onFeedback?: (feedback: ImageFeedbackValue) => void;
  className?: string;
};

export function WordImage({
  src,
  word,
  status = "ready",
  isAiGenerated = true,
  isRetrying = false,
  retryMessage,
  onRetry,
  currentFeedback,
  isSubmittingFeedback = false,
  feedbackMessage,
  onFeedback,
  className = "",
}: WordImageProps) {
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
        {onRetry && status === "failed" && (
          <button
            type="button"
            onClick={onRetry}
            disabled={isRetrying}
            className="mt-4 inline-flex min-h-10 items-center justify-center rounded-md bg-teal-700 px-4 text-sm font-bold text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:bg-stone-300"
            aria-label={`Try creating the AI-generated picture for ${word} again`}
          >
            {isRetrying ? "Trying again..." : "Try again"}
          </button>
        )}
        {retryMessage && <p className="mt-3 max-w-sm text-xs leading-5 text-stone-600">{retryMessage}</p>}
      </div>
    );
  }

  const feedbackButtonClass = (feedback: ImageFeedbackValue) =>
    `inline-flex min-h-9 items-center justify-center rounded-md border px-3 text-xs font-bold transition disabled:cursor-not-allowed disabled:opacity-60 ${
      currentFeedback === feedback
        ? "border-teal-700 bg-teal-700 text-white"
        : "border-stone-300 bg-white text-stone-700 hover:border-teal-600"
    }`;

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
          {onFeedback && status === "ready" && src && !failed && (
            <div className="absolute bottom-2 left-2 right-2 rounded-md bg-white/92 p-2 shadow-sm backdrop-blur">
              <p className="text-xs font-bold text-stone-600">How is this picture?</p>
              <div className="mt-2 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => onFeedback("like")}
                  disabled={isSubmittingFeedback}
                  className={feedbackButtonClass("like")}
                  aria-pressed={currentFeedback === "like"}
                >
                  Like
                </button>
                <button
                  type="button"
                  onClick={() => onFeedback("not_a_good_picture")}
                  disabled={isSubmittingFeedback}
                  className={feedbackButtonClass("not_a_good_picture")}
                  aria-pressed={currentFeedback === "not_a_good_picture"}
                >
                  Not a good picture
                </button>
              </div>
              {feedbackMessage && <p className="mt-2 text-xs leading-5 text-stone-600">{feedbackMessage}</p>}
            </div>
          )}
          <figcaption className="sr-only">AI-generated learning picture</figcaption>
        </>
      )}
    </figure>
  );
}
