export type LearningStatus = "new" | "learning" | "mastered";
export type ImageStatus = "pending" | "ready" | "failed";

export type OtherSense = {
  part_of_speech: string;
  definition: string;
  example_sentence: string;
};

export type GlobalWord = {
  id: number;
  normalized_word: string;
  display_word: string;
  simple_definition: string;
  example_sentence: string;
  part_of_speech: string;
  primary_sense: string;
  other_senses: OtherSense[];
  ipa_us: string;
  ipa_uk: string;
  pronunciation_note: string | null;
  image_url: string | null;
  image_public_id: string | null;
  image_status: ImageStatus;
  image_is_ai_generated: boolean;
  image_prompt: string;
  image_style_version: string;
  created_at: string;
  updated_at: string;
};

export type WordLookup = {
  id: number;
  word: string;
  simple_definition: string;
  example_sentence: string;
  part_of_speech: string;
  primary_sense: string;
  other_senses: OtherSense[];
  ipa_us: string;
  ipa_uk: string;
  pronunciation_note: string | null;
  image_url: string | null;
  image_status: ImageStatus;
  image_is_ai_generated: boolean;
  image_retryable?: boolean;
  retry_scheduled?: boolean;
  retry_message?: string | null;
  next_retry_after?: string | null;
  lookup_count: number;
  learning_status: LearningStatus;
  lookup_day_id: number;
  global_word_id: number;
  lookup_date: string;
  first_searched_at: string;
  last_searched_at: string;
  global_word: GlobalWord;
};

export type CalendarDay = {
  date: string;
  unique_words_count: number;
  total_lookup_count: number;
};

export type LookupDay = {
  id: number | null;
  date: string;
  created_at: string;
  word_lookups: WordLookup[];
};

export type WordSummary = {
  global_word_id: number;
  display_word: string;
  normalized_word: string;
  simple_definition: string;
  example_sentence: string;
  part_of_speech: string;
  primary_sense: string;
  other_senses: OtherSense[];
  ipa_us: string;
  ipa_uk: string;
  image_url: string | null;
  image_status: ImageStatus;
  image_is_ai_generated: boolean;
  total_lookup_count: number;
  last_searched_at: string | null;
  latest_word_lookup_id: number | null;
  last_lookup_date: string | null;
  latest_learning_status: LearningStatus | null;
  days_count: number;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!response.ok) {
    let message = "The request could not be completed.";
    try {
      const error = await response.json();
      message = error.detail || message;
    } catch {
      message = response.statusText || message;
    }
    throw new Error(message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}

export function searchWord(word: string, demoCode?: string) {
  return request<WordLookup>(`/search?word=${encodeURIComponent(word)}`, {
    headers: demoCode ? { "X-Demo-Code": demoCode } : undefined,
  });
}

export function getCalendar() {
  return request<CalendarDay[]>("/calendar", { cache: "no-store" });
}

export function getDay(date: string) {
  return request<LookupDay>(`/days/${date}`, { cache: "no-store" });
}

export function getWord(id: string) {
  return request<WordLookup>(`/words/${id}`, { cache: "no-store" });
}

export function retryWordImage(id: string, demoCode?: string) {
  return request<WordLookup>(`/words/${id}/image-retry`, {
    method: "POST",
    headers: demoCode ? { "X-Demo-Code": demoCode } : undefined,
  });
}

export function getWordSummary() {
  return request<WordSummary[]>("/words/summary", { cache: "no-store" });
}

export function updateWord(id: string, payload: Pick<WordLookup, "simple_definition" | "example_sentence" | "learning_status">) {
  return request<WordLookup>(`/words/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function deleteWord(id: string) {
  return request<void>(`/words/${id}`, { method: "DELETE" });
}
