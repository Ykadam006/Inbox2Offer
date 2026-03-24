"use client";

import { useMemo } from "react";
import { useApplications } from "@/hooks/use-applications";
import { computeAnalytics, computeSourcePerformance } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { STAGE_LABELS, STAGE_COLORS, SOURCE_LABELS } from "@/types";
import type { Application, ApplicationStage } from "@/types";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  FunnelChart,
  Funnel,
  LabelList,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
} from "recharts";
import { format, subDays, parseISO, startOfWeek } from "date-fns";
import { TrendingUp, Target, Trophy, XCircle, Clock, BarChart3 } from "lucide-react";

export default function AnalyticsPage() {
  const { applications, isLoading } = useApplications();
  const analytics = useMemo(() => computeAnalytics(applications), [applications]);
  const sourcePerformance = useMemo(
    () => computeSourcePerformance(applications),
    [applications]
  );

  // Stage funnel — true cumulative pipeline (each stage = apps that reached AT LEAST that stage)
  const funnelData = useMemo(() => {
    const stageOrder: ApplicationStage[] = [
      "applied",
      "oa",
      "recruiter_screen",
      "interview_1",
      "offer",
    ];
    const reached = (app: Application, stage: ApplicationStage) => {
      const appIdx = stageOrder.indexOf(app.current_stage as ApplicationStage);
      const targetIdx = stageOrder.indexOf(stage);
      if (appIdx === -1) return false;
      return appIdx >= targetIdx;
    };
    return stageOrder.map((stage) => ({
      name: STAGE_LABELS[stage],
      value: applications.filter((a) => reached(a, stage)).length,
      fill: STAGE_COLORS[stage],
    }));
  }, [applications]);

  // Weekly applications over last 8 weeks
  const weeklyData = useMemo(() => {
    return Array.from({ length: 8 }, (_, i) => {
      const weekStart = startOfWeek(subDays(new Date(), (7 - i) * 7));
      const weekEnd = subDays(weekStart, -7);
      const count = applications.filter((a) => {
        if (!a.applied_date) return false;
        const d = parseISO(a.applied_date);
        return d >= weekStart && d < weekEnd;
      }).length;
      return { week: format(weekStart, "MMM d"), count };
    });
  }, [applications]);

  // Stage distribution bar chart
  const stageDistribution = useMemo(() => {
    const counts: Record<string, number> = {};
    applications.forEach((a) => {
      counts[a.current_stage] = (counts[a.current_stage] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([stage, count]) => ({
        stage: STAGE_LABELS[stage as keyof typeof STAGE_LABELS] || stage,
        count,
        fill: STAGE_COLORS[stage as keyof typeof STAGE_COLORS] || "#94A3B8",
      }))
      .sort((a, b) => b.count - a.count);
  }, [applications]);

  // Work mode distribution
  const workModeData = useMemo(() => {
    const counts: Record<string, number> = {};
    applications.forEach((a) => {
      if (a.work_mode) counts[a.work_mode] = (counts[a.work_mode] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value,
    }));
  }, [applications]);

  const WORK_MODE_COLORS = ["#538d22", "#73a942", "#aad576"];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        Loading analytics...
      </div>
    );
  }

  const kpiCards = [
    {
      label: "Total Applied",
      value: analytics.applied,
      icon: Target,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      sub: `${analytics.total} total (${analytics.total - analytics.applied} saved)`,
    },
    {
      label: "Interview Rate",
      value: `${analytics.interviewRate}%`,
      icon: TrendingUp,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
      sub: `${analytics.interviews} interviews`,
    },
    {
      label: "Offer Rate",
      value: `${analytics.offerRate}%`,
      icon: Trophy,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
      sub: `${analytics.offers} offers received`,
    },
    {
      label: "Rejection Rate",
      value: analytics.applied > 0 ? `${Math.round((analytics.rejections / analytics.applied) * 100)}%` : "0%",
      icon: XCircle,
      color: "text-red-400",
      bg: "bg-red-500/10",
      sub: `${analytics.rejections} rejections`,
    },
    {
      label: "Ghosted",
      value: analytics.ghosted,
      icon: Clock,
      color: "text-gray-400",
      bg: "bg-gray-500/10",
      sub: "No response received",
    },
    {
      label: "Active Pipeline",
      value: applications.filter((a) =>
        ["applied", "oa", "recruiter_screen", "interview_1", "interview_2", "final_round"].includes(a.current_stage)
      ).length,
      icon: BarChart3,
      color: "text-violet-500",
      bg: "bg-violet-500/10",
      sub: "In-progress applications",
    },
  ];

  if (applications.length === 0) {
    return (
      <div className="p-6 animate-in">
        <h1 className="text-2xl font-bold mb-2">Analytics</h1>
        <p className="text-muted-foreground mb-8">Understand your job search performance</p>
        <div className="flex flex-col items-center justify-center rounded-2xl border bg-muted/20 py-24 gap-4">
          <div className="text-5xl">📊</div>
          <p className="font-medium">No data to analyze yet</p>
          <p className="text-sm text-muted-foreground">
            Add applications and their outcomes to see your analytics here
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 animate-in">
      <div>
        <h1 className="text-2xl font-bold">Analytics</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Understand your job search performance
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {kpiCards.map(({ label, value, icon: Icon, color, bg, sub }) => (
          <Card key={label} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className={`mb-3 inline-flex h-9 w-9 items-center justify-center rounded-xl ${bg}`}>
                <Icon className={`h-4 w-4 ${color}`} />
              </div>
              <div className="text-2xl font-bold">{value}</div>
              <div className="text-xs font-medium mt-0.5">{label}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{sub}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pipeline Funnel */}
      {funnelData.some((d) => d.value > 0) && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Application Pipeline Funnel</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <FunnelChart>
                <Tooltip
                  contentStyle={{
                    background: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "12px",
                    fontSize: "12px",
                  }}
                />
                <Funnel dataKey="value" data={funnelData} isAnimationActive>
                  <LabelList
                    position="right"
                    fill="hsl(var(--foreground))"
                    stroke="none"
                    dataKey="name"
                    style={{ fontSize: 12 }}
                  />
                </Funnel>
              </FunnelChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Charts row 1 */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Weekly trend */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Weekly Application Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="week" tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    background: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "12px",
                    fontSize: "12px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#538d22"
                  strokeWidth={2.5}
                  dot={{ fill: "#7C3AED", r: 4 }}
                  name="Applications"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Stage distribution */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Applications by Stage</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={stageDistribution} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" horizontal={false} />
                <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11 }} />
                <YAxis type="category" dataKey="stage" tick={{ fontSize: 11 }} width={90} />
                <Tooltip
                  contentStyle={{
                    background: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "12px",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="count" radius={[0, 6, 6, 0]} name="Applications">
                  {stageDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Charts row 2 */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Source performance */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Source Performance (Response Rate %)</CardTitle>
          </CardHeader>
          <CardContent>
            {sourcePerformance.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart
                  data={sourcePerformance.map((s) => ({
                    ...s,
                    source: SOURCE_LABELS[s.source] || s.source,
                  }))}
                >
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="source" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} unit="%" />
                  <Tooltip
                    contentStyle={{
                      background: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "12px",
                      fontSize: "12px",
                    }}
                  />
                  <Bar dataKey="responseRate" fill="#538d22" radius={[6, 6, 0, 0]} name="Response Rate %" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-sm text-muted-foreground py-4">Add source data to see performance breakdown.</p>
            )}
          </CardContent>
        </Card>

        {/* Work mode pie */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Work Mode Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            {workModeData.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={workModeData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                    label={({ name, percent }: { name?: string; percent?: number }) => `${name ?? ""} ${((percent ?? 0) * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {workModeData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={WORK_MODE_COLORS[index % WORK_MODE_COLORS.length]} />
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
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-sm text-muted-foreground py-4">Add work mode data to see the breakdown.</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Source table */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Source Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/30">
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Source</th>
                  <th className="px-4 py-3 text-right font-medium text-muted-foreground">Total</th>
                  <th className="px-4 py-3 text-right font-medium text-muted-foreground">Interviews</th>
                  <th className="px-4 py-3 text-right font-medium text-muted-foreground">Offers</th>
                  <th className="px-4 py-3 text-right font-medium text-muted-foreground">Response Rate</th>
                </tr>
              </thead>
              <tbody>
                {sourcePerformance
                  .sort((a, b) => b.responseRate - a.responseRate)
                  .map((src) => (
                    <tr key={src.source} className="border-b last:border-0 hover:bg-muted/20">
                      <td className="px-4 py-3 font-medium">
                        {SOURCE_LABELS[src.source] || src.source}
                      </td>
                      <td className="px-4 py-3 text-right text-muted-foreground">{src.total}</td>
                      <td className="px-4 py-3 text-right text-muted-foreground">{src.interviews}</td>
                      <td className="px-4 py-3 text-right text-muted-foreground">{src.offers}</td>
                      <td className="px-4 py-3 text-right">
                        <span
                          className={`font-semibold ${
                            src.responseRate >= 20
                              ? "text-emerald-600"
                              : src.responseRate >= 10
                              ? "text-amber-600"
                              : "text-muted-foreground"
                          }`}
                        >
                          {src.responseRate}%
                        </span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
