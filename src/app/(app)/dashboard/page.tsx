import { auth } from "@/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { DashboardClient } from "./dashboard-client";
import type { Application } from "@/types";

function dbToApp(d: {
  id: string;
  userId: string;
  companyName: string;
  roleTitle: string;
  jobLink: string | null;
  source: string | null;
  location: string | null;
  workMode: string | null;
  jobType: string | null;
  sponsorship: string | null;
  salaryMin: number | null;
  salaryMax: number | null;
  appliedDate: Date | null;
  deadline: Date | null;
  currentStage: string;
  priority: string | null;
  outcome: string | null;
  notes: string | null;
  followUpDate: Date | null;
  recruiterName: string | null;
  recruiterEmail: string | null;
  resumeVersion: string | null;
  coverLetterVersion: string | null;
  createdAt: Date;
  updatedAt: Date;
}): Application {
  return {
    id: d.id,
    user_id: d.userId,
    company_name: d.companyName,
    role_title: d.roleTitle,
    job_link: d.jobLink ?? undefined,
    source: d.source as Application["source"],
    location: d.location ?? undefined,
    work_mode: d.workMode as Application["work_mode"],
    job_type: d.jobType as Application["job_type"],
    sponsorship: d.sponsorship as Application["sponsorship"],
    salary_min: d.salaryMin ?? undefined,
    salary_max: d.salaryMax ?? undefined,
    applied_date: d.appliedDate?.toISOString().slice(0, 10),
    deadline: d.deadline?.toISOString().slice(0, 10),
    current_stage: d.currentStage as Application["current_stage"],
    priority: d.priority as Application["priority"],
    outcome: d.outcome ?? undefined,
    notes: d.notes ?? undefined,
    follow_up_date: d.followUpDate?.toISOString().slice(0, 10),
    recruiter_name: d.recruiterName ?? undefined,
    recruiter_email: d.recruiterEmail ?? undefined,
    resume_version: d.resumeVersion ?? undefined,
    cover_letter_version: d.coverLetterVersion ?? undefined,
    created_at: d.createdAt.toISOString(),
    updated_at: d.updatedAt.toISOString(),
  };
}

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  let applications: Awaited<ReturnType<typeof db.application.findMany>> = [];
  try {
    applications = await db.application.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("Dashboard fetch error:", error);
  }

  const displayName = session.user.name || session.user.email?.split("@")[0] || "there";

  return (
    <DashboardClient
      initialApplications={applications.map(dbToApp)}
      displayName={displayName}
    />
  );
}
