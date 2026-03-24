"use client";

import { useMemo } from "react";
import Link from "next/link";
import {
  TrendingUp,
  Target,
  Trophy,
  XCircle,
  Clock,
  Plus,
  ArrowRight,
  Sparkles,
  MessageSquare,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StageBadge } from "@/components/applications/stage-badge";
import type { Application } from "@/types";
import { computeAnalytics, computeSourcePerformance, formatDate, formatRelative, isUpcoming } from "@/lib/utils";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { format, subDays, parseISO, isAfter, startOfWeek } from "date-fns";
import { SOURCE_LABELS, STAGE_COLORS } from "@/types";

interface DashboardClientProps {
  initialApplications: Application[];
  displayName: string;
}

function generateInsights(apps: Application[]): string[] {
  const insights: string[] = [];
  if (apps.length === 0) return ["Add your first application to start getting insights."];

  const applied = apps.filter((a) => a.current_stage !== "saved");
  const withInterviews = applied.filter((a) =>
    ["interview_1", "interview_2", "final_round", "offer"].includes(a.current_stage)
  );
  const responseRate = applied.length > 0 ? (withInterviews.length / applied.length) * 100 : 0;

  if (responseRate < 5 && applied.length > 5) {
    insights.push(`Your response rate is ${responseRate.toFixed(0)}%. Consider refining your resume or targeting better-fit roles.`);
  } else if (responseRate >= 15) {
    insights.push(`Great response rate of ${responseRate.toFixed(0)}%! Keep applying to similar roles.`);
  }

  const overdueFollowups = apps.filter(
    (a) =>
      a.follow_up_date &&
      isAfter(new Date(), parseISO(a.follow_up_date)) &&
      !["rejected", "withdrawn", "offer"].includes(a.current_stage)
  );
  if (overdueFollowups.length > 0) {
    insights.push(
      `You have ${overdueFollowups.length} overdue follow-up${overdueFollowups.length > 1 ? "s" : ""}. Send a check-in to stay on their radar.`
    );
  }

  const referralApps = apps.filter((a) => a.source === "referral");
  const referralInterviews = referralApps.filter((a) =>
    ["interview_1", "interview_2", "final_round", "offer"].includes(a.current_stage)
  );
  const referralRate = referralApps.length > 0 ? (referralInterviews.length / referralApps.length) * 100 : 0;
  const linkedinApps = apps.filter((a) => a.source === "linkedin");
  const linkedinInterviews = linkedinApps.filter((a) =>
    ["interview_1", "interview_2", "final_round", "offer"].includes(a.current_stage)
  );
  const linkedinRate = linkedinApps.length > 0 ? (linkedinInterviews.length / linkedinApps.length) * 100 : 0;

  if (referralApps.length >= 2 && linkedinApps.length >= 2 && referralRate > linkedinRate) {
    insights.push(
      `Referrals have a ${referralRate.toFixed(0)}% response rate vs LinkedIn at ${linkedinRate.toFixed(0)}%. Reach out to your network more.`
    );
  }

  const stuckOA = apps.filter(
    (a) => a.current_stage === "oa"
  );
  if (stuckOA.length >= 3) {
    insights.push(`${stuckOA.length} applications are stuck at OA. Prep your coding skills to break through.`);
  }

  if (insights.length === 0) {
    insights.push("Keep applying consistently. Your data will surface patterns soon.");
  }

  return insights.slice(0, 4);
}

export function DashboardClient({ initialApplications, displayName }: DashboardClientProps) {
  const analytics = useMemo(() => computeAnalytics(initialApplications), [initialApplications]);
  const sourcePerformance = useMemo(() => computeSourcePerformance(initialApplications), [initialApplications]);
  const insights = useMemo(() => generateInsights(initialApplications), [initialApplications]);

  const recentApps = initialApplications.slice(0, 5);
  const upcoming = initialApplications.filter(
    (a) => a.deadline && isUpcoming(a.deadline, 7)
  ).slice(0, 3);

  // Weekly activity chart data
  const weeklyData = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const date = subDays(new Date(), 6 - i);
      const dateStr = format(date, "yyyy-MM-dd");
      const count = initialApplications.filter(
        (a) => a.applied_date && a.applied_date.startsWith(dateStr)
      ).length;
      return { day: format(date, "EEE"), count };
    });
  }, [initialApplications]);

  // Stage distribution for pie chart
  const stageData = useMemo(() => {
    const counts: Record<string, number> = {};
    initialApplications.forEach((a) => {
      counts[a.current_stage] = (counts[a.current_stage] || 0) + 1;
    });
    return Object.entries(counts).map(([stage, value]) => ({
      name: stage,
      value,
      color: STAGE_COLORS[stage as keyof typeof STAGE_COLORS] || "#94A3B8",
    }));
  }, [initialApplications]);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  const thisWeekCount = useMemo(() => {
    const weekStart = startOfWeek(new Date());
    return initialApplications.filter((a) => {
      if (!a.applied_date) return false;
      return parseISO(a.applied_date) >= weekStart;
    }).length;
  }, [initialApplications]);

  const statCards = [
    {
      label: "Total Applications",
      value: analytics.total,
      icon: Target,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      change: thisWeekCount > 0 ? `+${thisWeekCount} this week` : null,
    },
    {
      label: "Interviews",
      value: analytics.interviews,
      icon: TrendingUp,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
    },
    {
      label: "Offers",
      value: analytics.offers,
      icon: Trophy,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
    },
    {
      label: "Rejections",
      value: analytics.rejections,
      icon: XCircle,
      color: "text-red-400",
      bg: "bg-red-500/10",
    },
    {
      label: "Response Rate",
      value: `${analytics.responseRate}%`,
      icon: Clock,
      color: "text-forest-500",
      bg: "bg-forest-500/10",
    },
  ];

  return (
    <div className="p-6 space-y-6 animate-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{greeting}, {displayName} 👋</h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            Here&apos;s your job search overview
          </p>
        </div>
        <Button variant="gradient" size="sm" asChild>
          <Link href="/applications">
            <Plus className="h-4 w-4" />
            Add Application
          </Link>
        </Button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {statCards.map(({ label, value, icon: Icon, color, bg, change }) => (
          <Card key={label} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className={`mb-3 inline-flex h-9 w-9 items-center justify-center rounded-xl ${bg}`}>
                <Icon className={`h-4 w-4 ${color}`} />
              </div>
              <div className="text-2xl font-bold">{value}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{label}</div>
              {change && (
                <div className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-1">
                  {change}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Activity Chart */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">7-Day Application Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={weeklyData}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#538d22" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#538d22" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="day" className="text-xs" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} className="text-xs" tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    background: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "12px",
                    fontSize: "12px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="#538d22"
                  strokeWidth={2}
                  fill="url(#colorCount)"
                  name="Applications"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Stage Distribution */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Pipeline Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            {stageData.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={140}>
                  <PieChart>
                    <Pie
                      data={stageData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={65}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {stageData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        background: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "12px",
                        fontSize: "12px",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-2 space-y-1.5">
                  {stageData.slice(0, 4).map((item) => (
                    <div key={item.name} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <div
                          className="h-2 w-2 rounded-full"
                          style={{ background: item.color }}
                        />
                        <span className="text-muted-foreground capitalize">{item.name.replaceAll("_", " ")}</span>
                      </div>
                      <span className="font-medium">{item.value}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="flex h-[180px] items-center justify-center text-sm text-muted-foreground">
                No data yet
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Source performance + Insights */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Source Performance */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Source Performance</CardTitle>
          </CardHeader>
          <CardContent>
            {sourcePerformance.length > 0 ? (
              <div className="space-y-3">
                {sourcePerformance
                  .sort((a, b) => b.responseRate - a.responseRate)
                  .slice(0, 5)
                  .map((src) => (
                    <div key={src.source} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">{SOURCE_LABELS[src.source] || src.source}</span>
                        <span className="text-muted-foreground text-xs">
                          {src.interviews}/{src.total} interviews • {src.responseRate}%
                        </span>
                      </div>
                      <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-forest-700 to-forest-500 transition-all"
                          style={{ width: `${Math.min(src.responseRate, 100)}%` }}
                        />
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Add applications with source info to see performance data.</p>
            )}
          </CardContent>
        </Card>

        {/* Smart Insights */}
        <Card className="border-forest-200 dark:border-forest-800/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-forest-500" />
              Smart Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {insights.map((insight, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2.5 rounded-xl bg-forest-500/5 border border-forest-500/10 p-3"
                >
                  <MessageSquare className="mt-0.5 h-3.5 w-3.5 shrink-0 text-forest-500" />
                  <p className="text-sm leading-relaxed">{insight}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent + Upcoming */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Recent Applications */}
        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-base">Recent Applications</CardTitle>
            <Button variant="ghost" size="sm" asChild className="text-xs">
              <Link href="/applications">
                View all <ArrowRight className="h-3 w-3" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {recentApps.length > 0 ? (
              <div className="space-y-3">
                {recentApps.map((app) => (
                  <div
                    key={app.id}
                    className="flex items-center justify-between gap-3 py-1"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{app.company_name}</p>
                      <p className="text-xs text-muted-foreground truncate">{app.role_title}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <StageBadge stage={app.current_stage} />
                      <span className="text-xs text-muted-foreground hidden sm:block">
                        {formatRelative(app.created_at)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-6 text-center">
                <p className="text-sm text-muted-foreground mb-3">No applications yet</p>
                <Button variant="gradient" size="sm" asChild>
                  <Link href="/applications">
                    <Plus className="h-4 w-4" />
                    Add your first
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Upcoming Deadlines */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Upcoming Deadlines</CardTitle>
          </CardHeader>
          <CardContent>
            {upcoming.length > 0 ? (
              <div className="space-y-3">
                {upcoming.map((app) => (
                  <div key={app.id} className="flex items-center justify-between gap-3 py-1">
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{app.company_name}</p>
                      <p className="text-xs text-muted-foreground truncate">{app.role_title}</p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-xs font-medium text-amber-600 dark:text-amber-400">
                        {formatDate(app.deadline)}
                      </p>
                      <p className="text-xs text-muted-foreground">{formatRelative(app.deadline)}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground py-2">
                No upcoming deadlines in the next 7 days.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
