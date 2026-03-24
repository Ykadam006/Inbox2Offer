import Link from "next/link";
import {
  BarChart3,
  Zap,
  Target,
  TrendingUp,
  Bell,
  Shield,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Leaf,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: Target,
    title: "Track Every Application",
    description:
      "Log company, role, source, stage, salary, visa sponsorship, deadlines, and recruiter info — all in one place.",
  },
  {
    icon: BarChart3,
    title: "Analytics That Matter",
    description:
      "See response rates by platform, resume version performance, rejection patterns, and where you lose momentum.",
  },
  {
    icon: TrendingUp,
    title: "Smart Insights",
    description:
      "Find out which job boards waste your time, which resume version gets more interviews, and where you stall.",
  },
  {
    icon: Bell,
    title: "Follow-up Reminders",
    description:
      "Never ghost an application. Alerts for overdue follow-ups, interview deadlines, and stale applications.",
  },
  {
    icon: Shield,
    title: "Kanban Board",
    description:
      "Visualize your entire pipeline — Saved to Offer — with a beautiful drag-and-drop board.",
  },
  {
    icon: Sparkles,
    title: "Reflection Tracker",
    description:
      "Log what went well, what went wrong, interview questions asked, and skills you need to sharpen.",
  },
];

const stages = ["Saved", "Applied", "OA", "Screen", "Interview", "Final Round"];

const stats = [
  { value: "11 stages", label: "Full pipeline" },
  { value: "10+", label: "Analytics metrics" },
  { value: "Free", label: "Open-source stack" },
  { value: "Neon DB", label: "Powered by Postgres" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-forest-800 to-forest-600">
              <Zap className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-forest-800 to-forest-500 dark:from-forest-400 dark:to-forest-300 bg-clip-text text-transparent">
              ApplyVibe
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/login">Log in</Link>
            </Button>
            <Button variant="gradient" size="sm" asChild>
              <Link href="/signup">Get started free</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden px-6 py-28 text-center">
        <div className="absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-0 -translate-x-1/2 h-[600px] w-[700px] rounded-full bg-gradient-to-b from-forest-400/20 to-transparent blur-3xl" />
        </div>
        <div className="mx-auto max-w-4xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-forest-200 dark:border-forest-800 bg-forest-100/50 dark:bg-forest-900/50 px-4 py-1.5 text-sm text-forest-700 dark:text-forest-400">
            <Leaf className="h-3.5 w-3.5" />
            Free-first · Open-source stack · Auth.js + Prisma + Neon
          </div>
          <h1 className="mb-6 text-5xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl">
            Track applications.
            <br />
            <span className="bg-gradient-to-r from-forest-700 to-forest-500 dark:from-forest-400 dark:to-forest-300 bg-clip-text text-transparent">
              Learn what works.
            </span>
            <br />
            Land better, faster.
          </h1>
          <p className="mb-10 text-lg text-muted-foreground sm:text-xl max-w-2xl mx-auto">
            Stop guessing why you&apos;re not getting callbacks. ApplyVibe gives you the data to
            understand your job search, fix weak spots, and stay consistent until you land.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button variant="gradient" size="lg" asChild className="w-full sm:w-auto">
              <Link href="/signup">
                Start tracking for free
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild className="w-full sm:w-auto">
              <Link href="/login">Already have an account</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y bg-forest-100/40 dark:bg-forest-900/30 px-6 py-12">
        <div className="mx-auto max-w-4xl grid grid-cols-2 gap-8 sm:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl font-bold bg-gradient-to-r from-forest-700 to-forest-500 dark:from-forest-400 dark:to-forest-300 bg-clip-text text-transparent">
                {stat.value}
              </div>
              <div className="mt-1 text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Pipeline */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold mb-3">Your entire pipeline, visualized</h2>
            <p className="text-muted-foreground">
              11 stages from Saved to Offer — see exactly where every application stands
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {stages.map((stage, i) => (
              <div key={stage} className="flex items-center gap-2">
                <div className="rounded-xl border border-forest-200 dark:border-forest-800 bg-card px-4 py-2 text-sm font-medium shadow-sm hover:border-primary/50 hover:shadow-md transition-all">
                  {stage}
                </div>
                {i < stages.length - 1 && (
                  <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
                )}
              </div>
            ))}
            <div className="flex items-center gap-2">
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
              <div className="rounded-xl border border-forest-400 bg-forest-100 dark:bg-forest-900/50 dark:border-forest-700 px-4 py-2 text-sm font-medium text-forest-800 dark:text-forest-300 shadow-sm">
                Offer 🎉
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 py-20 bg-forest-100/30 dark:bg-forest-900/20">
        <div className="mx-auto max-w-5xl">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold mb-3">Everything you need to run your job search</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Not just a spreadsheet — a system that tells you what&apos;s working and what to fix
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="rounded-2xl border border-forest-100 dark:border-forest-800 bg-card p-6 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-forest-100 dark:bg-forest-900/60 border border-forest-200 dark:border-forest-800">
                  <Icon className="h-5 w-5 text-forest-600 dark:text-forest-400" />
                </div>
                <h3 className="mb-2 font-semibold">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Insights */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold mb-3">Insights that feel like a coach</h2>
            <p className="text-muted-foreground">
              The app analyzes your data and surfaces what you need to hear
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              "Your LinkedIn applications have a 3% response rate, but referrals are 18%.",
              "Resume V2 performs better for frontend roles — 2x more interview invites.",
              "Most rejections are from backend roles requiring 3+ years of experience.",
              "You haven't followed up on 11 applications in over 7 days.",
              "You apply more on weekends, but weekday applications get better outcomes.",
              "You're losing momentum after the OA stage — 68% of OAs never progress.",
            ].map((insight) => (
              <div
                key={insight}
                className="flex items-start gap-3 rounded-2xl border border-forest-200 dark:border-forest-800 bg-forest-50/50 dark:bg-forest-900/30 p-4 shadow-sm"
              >
                <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-forest-500" />
                <p className="text-sm leading-relaxed">{insight}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stack callout */}
      <section className="px-6 py-16 bg-forest-900 dark:bg-forest-950 text-white">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-2xl font-bold mb-3 text-forest-100">100% free, open-source stack</h2>
          <p className="text-forest-300 mb-8 max-w-xl mx-auto">
            Built with Next.js, Auth.js, Prisma, and Neon PostgreSQL. No subscriptions, no lock-in.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {["Next.js 16", "Auth.js v5", "Prisma ORM", "Neon Postgres", "Vercel Hobby", "Tailwind CSS"].map(
              (t) => (
                <span
                  key={t}
                  className="rounded-full border border-forest-700 bg-forest-800/50 px-3 py-1 text-sm text-forest-300"
                >
                  {t}
                </span>
              )
            )}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden px-6 py-28 text-center">
        <div className="absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[800px] rounded-full bg-gradient-to-b from-forest-400/15 to-forest-600/10 blur-3xl" />
        </div>
        <div className="mx-auto max-w-2xl">
          <h2 className="mb-4 text-4xl font-extrabold tracking-tight">
            Ready to take control of your job search?
          </h2>
          <p className="mb-8 text-lg text-muted-foreground">
            Free to use. No credit card. Start tracking in under 2 minutes.
          </p>
          <Button variant="gradient" size="lg" asChild>
            <Link href="/signup">
              Create your free account
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <div className="mt-8 flex items-center justify-center gap-6 text-sm text-muted-foreground">
            {["No credit card required", "Free forever", "Open-source"].map((item) => (
              <div key={item} className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-forest-500" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t px-6 py-8">
        <div className="mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-br from-forest-800 to-forest-600">
              <Zap className="h-3 w-3 text-white" />
            </div>
            <span className="font-semibold text-sm">ApplyVibe</span>
          </div>
          <p className="text-xs text-muted-foreground">
            © 2026 ApplyVibe. Built with Next.js · Auth.js · Prisma · Neon · Vercel
          </p>
        </div>
      </footer>
    </div>
  );
}
