import type { LearningStatus } from "@/lib/api";

const statusLabels: Record<LearningStatus, string> = {
  new: "New",
  learning: "Learning",
  mastered: "Mastered",
};

const statusClasses: Record<LearningStatus, string> = {
  new: "bg-sky-100 text-sky-800",
  learning: "bg-amber-100 text-amber-900",
  mastered: "bg-emerald-100 text-emerald-800",
};

export function StatusBadge({ status }: { status: LearningStatus }) {
  return (
    <span className={`rounded-md px-2.5 py-1 text-xs font-bold ${statusClasses[status]}`}>
      {statusLabels[status]}
    </span>
  );
}
