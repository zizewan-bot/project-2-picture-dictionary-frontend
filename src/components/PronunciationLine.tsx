export function PronunciationLine({ ipaUs, ipaUk }: { ipaUs?: string; ipaUk?: string }) {
  if (!ipaUs && !ipaUk) {
    return null;
  }

  return (
    <p className="text-sm font-semibold text-stone-600">
      {ipaUs && <span>US {ipaUs}</span>}
      {ipaUs && ipaUk && <span className="px-2 text-stone-300">|</span>}
      {ipaUk && <span>UK {ipaUk}</span>}
    </p>
  );
}
