export { cn } from "./cn";

import { format, formatDistanceToNow, isAfter, isBefore, parseISO } from "date-fns";
import type { Application, AnalyticsSummary, SourcePerformance } from "@/types";

export function formatDate(dateStr?: string | null): string {
  if (!dateStr) return "—";
  try {
    return format(parseISO(dateStr), "MMM d, yyyy");
  } catch {
    return dateStr;
  }
}

export function formatRelative(dateStr?: string | null): string {
  if (!dateStr) return "—";
  try {
    return formatDistanceToNow(parseISO(dateStr), { addSuffix: true });
  } catch {
    return dateStr;
  }
}

export function isOverdue(dateStr?: string | null): boolean {
  if (!dateStr) return false;
  try {
    return isBefore(parseISO(dateStr), new Date());
  } catch {
    return false;
  }
}

export function isUpcoming(dateStr?: string | null, days = 7): boolean {
  if (!dateStr) return false;
  try {
    const date = parseISO(dateStr);
    const future = new Date();
    future.setDate(future.getDate() + days);
    return isAfter(date, new Date()) && isBefore(date, future);
  } catch {
    return false;
  }
}

export function computeAnalytics(apps: Application[]): AnalyticsSummary {
  const total = apps.length;
  const applied = apps.filter((a) => a.current_stage !== "saved").length;
  const interviews = apps.filter((a) =>
    ["interview_1", "interview_2", "final_round"].includes(a.current_stage)
  ).length;
  const offers = apps.filter((a) => a.current_stage === "offer").length;
  const rejections = apps.filter((a) => a.current_stage === "rejected").length;
  const ghosted = apps.filter((a) => a.current_stage === "ghosted").length;

  return {
    total,
    applied,
    interviews,
    offers,
    rejections,
    ghosted,
    responseRate: applied > 0 ? Math.round((interviews / applied) * 100) : 0,
    offerRate: applied > 0 ? Math.round((offers / applied) * 100) : 0,
    interviewRate: applied > 0 ? Math.round((interviews / applied) * 100) : 0,
  };
}

export function computeSourcePerformance(apps: Application[]): SourcePerformance[] {
  const map: Record<string, { total: number; interviews: number; offers: number }> = {};

  apps.forEach((a) => {
    const src = a.source ?? "other";
    if (!map[src]) map[src] = { total: 0, interviews: 0, offers: 0 };
    map[src].total++;
    if (["interview_1", "interview_2", "final_round", "offer"].includes(a.current_stage)) {
      map[src].interviews++;
    }
    if (a.current_stage === "offer") {
      map[src].offers++;
    }
  });

  return Object.entries(map).map(([source, data]) => ({
    source,
    ...data,
    responseRate: data.total > 0 ? Math.round((data.interviews / data.total) * 100) : 0,
  }));
}

export function getSalaryDisplay(min?: number | null, max?: number | null): string {
  if (!min && !max) return "—";
  const fmt = (n: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
  if (min && max) return `${fmt(min)} – ${fmt(max)}`;
  if (min) return `${fmt(min)}+`;
  return `Up to ${fmt(max!)}`;
}
