"use client";

import { FormEvent, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { StatusBadge } from "@/components/StatusBadge";
import { WordImage } from "@/components/WordImage";
import { deleteWord, getWord, updateWord, type LearningStatus, type WordLookup } from "@/lib/api";

export default function WordDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [word, setWord] = useState<WordLookup | null>(null);
  const [form, setForm] = useState({
    simple_definition: "",
    example_sentence: "",
    learning_status: "new" as LearningStatus,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    getWord(params.id)
      .then((loadedWord) => {
        setWord(loadedWord);
        setForm({
          simple_definition: loadedWord.simple_definition,
          example_sentence: loadedWord.example_sentence,
          learning_status: loadedWord.learning_status,
        });
      })
      .catch((caughtError) => setError(caughtError instanceof Error ? caughtError.message : "Word could not load."))
      .finally(() => setLoading(false));
  }, [params.id]);

  async function handleUpdate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");
    try {
      const updatedWord = await updateWord(params.id, form);
      setWord(updatedWord);
      setMessage("Word record updated.");
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Update failed.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!word) return;
    setDeleting(true);
    setError("");
    try {
      await deleteWord(params.id);
      router.push(`/day/${word.lookup_date}`);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Delete failed.");
      setDeleting(false);
    }
  }

  if (loading) {
    return <p className="rounded-md bg-white p-4 font-semibold">Loading word record...</p>;
  }

  if (!word) {
    return <p className="rounded-md border border-red-200 bg-red-50 p-4 font-semibold text-red-700">{error || "Word not found."}</p>;
  }

  return (
    <section className="grid gap-6 lg:grid-cols-[380px_1fr]">
      <aside className="overflow-hidden rounded-lg border border-stone-200 bg-white shadow-sm">
        <div className="aspect-[4/3] bg-stone-100">
          <WordImage src={word.image_url} word={word.word} />
        </div>
        <div className="space-y-4 p-5">
          <div className="flex items-center justify-between gap-3">
            <h1 className="text-3xl font-black capitalize">{word.word}</h1>
            <StatusBadge status={word.learning_status} />
          </div>
          <p className="leading-7 text-stone-700">{word.simple_definition}</p>
          <p className="rounded-md bg-stone-100 p-3 text-stone-800">{word.example_sentence}</p>
          <dl className="grid gap-3 text-sm">
            <div className="rounded-md border border-stone-200 p-3">
              <dt className="font-bold text-stone-500">Lookup count</dt>
              <dd className="text-2xl font-black">{word.lookup_count}</dd>
            </div>
            <div className="rounded-md border border-stone-200 p-3">
              <dt className="font-bold text-stone-500">First searched</dt>
              <dd>{new Date(word.first_searched_at).toLocaleString()}</dd>
            </div>
            <div className="rounded-md border border-stone-200 p-3">
              <dt className="font-bold text-stone-500">Last searched</dt>
              <dd>{new Date(word.last_searched_at).toLocaleString()}</dd>
            </div>
          </dl>
        </div>
      </aside>

      <form onSubmit={handleUpdate} className="space-y-5 rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-teal-700">Edit word record</p>
          <h2 className="text-3xl font-black">Learning notes</h2>
        </div>

        {error && <p className="rounded-md border border-red-200 bg-red-50 p-3 font-semibold text-red-700">{error}</p>}
        {message && <p className="rounded-md border border-emerald-200 bg-emerald-50 p-3 font-semibold text-emerald-700">{message}</p>}

        <label className="grid gap-2 font-bold">
          Simple definition
          <textarea
            value={form.simple_definition}
            onChange={(event) => setForm({ ...form, simple_definition: event.target.value })}
            className="min-h-28 rounded-md border border-stone-300 p-3 font-normal outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
          />
        </label>

        <label className="grid gap-2 font-bold">
          Example sentence
          <textarea
            value={form.example_sentence}
            onChange={(event) => setForm({ ...form, example_sentence: event.target.value })}
            className="min-h-24 rounded-md border border-stone-300 p-3 font-normal outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
          />
        </label>

        <label className="grid gap-2 font-bold">
          Learning status
          <select
            value={form.learning_status}
            onChange={(event) => setForm({ ...form, learning_status: event.target.value as LearningStatus })}
            className="min-h-12 rounded-md border border-stone-300 px-3 font-normal outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
          >
            <option value="new">New</option>
            <option value="learning">Learning</option>
            <option value="mastered">Mastered</option>
          </select>
        </label>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="submit"
            disabled={saving}
            className="min-h-12 rounded-md bg-teal-700 px-5 font-bold text-white transition hover:bg-teal-800 disabled:bg-stone-300"
          >
            {saving ? "Saving..." : "Save changes"}
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="min-h-12 rounded-md border border-red-300 px-5 font-bold text-red-700 transition hover:bg-red-50 disabled:text-stone-400"
          >
            {deleting ? "Deleting..." : "Delete word lookup"}
          </button>
        </div>
      </form>
    </section>
  );
}
