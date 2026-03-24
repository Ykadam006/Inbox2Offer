import { cn } from "@/lib/utils";
import type { ApplicationStage } from "@/types";
import { STAGE_LABELS } from "@/types";

interface StageBadgeProps {
  stage: string;
  className?: string;
}

const stageStyles: Record<ApplicationStage, string> = {
  saved: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
  applied: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  oa: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  recruiter_screen: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",
  interview_1: "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400",
  interview_2: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  final_round: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  offer: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  rejected: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  ghosted: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
  withdrawn: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400",
};

const FALLBACK_STYLE = "bg-muted text-muted-foreground";

export function StageBadge({ stage, className }: StageBadgeProps) {
  const style = stageStyles[stage as ApplicationStage] ?? FALLBACK_STYLE;
  const label = STAGE_LABELS[stage as ApplicationStage] ?? stage.replace(/_/g, " ");

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize",
        style,
        className
      )}
    >
      {label}
    </span>
  );
}
