export type LearningStatus = "new" | "learning" | "mastered";

export type WordLookup = {
  id: number;
  word: string;
  simple_definition: string;
  example_sentence: string;
  image_url: string;
  lookup_count: number;
  learning_status: LearningStatus;
  lookup_day_id: number;
  lookup_date: string;
  first_searched_at: string;
  last_searched_at: string;
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

export function searchWord(word: string) {
  return request<WordLookup>(`/search?word=${encodeURIComponent(word)}`);
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

export function updateWord(id: string, payload: Pick<WordLookup, "simple_definition" | "example_sentence" | "image_url" | "learning_status">) {
  return request<WordLookup>(`/words/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function deleteWord(id: string) {
  return request<void>(`/words/${id}`, { method: "DELETE" });
}
