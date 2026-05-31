export default function AboutPage() {
  return (
    <section className="max-w-3xl space-y-5 rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
      <p className="text-sm font-bold uppercase tracking-wide text-teal-700">About this project</p>
      <h1 className="text-4xl font-black">Picture Dictionary</h1>
      <p className="leading-8 text-stone-700">
        Picture Dictionary is a visual English dictionary for building a personal lookup notebook. A search saves the word to today&apos;s history, shows a simple definition, adds an example sentence, and displays the shared AI-generated image for that word.
      </p>
      <p className="leading-8 text-stone-700">
        The calendar is generated from saved lookup records, so users cannot manually create or edit calendar days. Word records can be edited for definition, sentence, and learning status, while image URLs and lookup counts stay managed by the system.
      </p>
    </section>
  );
}
