import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { applicationSchema } from "@/lib/validations/application";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const applications = await db.application.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(applications);
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = applicationSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const data = parsed.data;

    const application = await db.application.create({
      data: {
        userId: session.user.id,
        companyName: data.company_name,
        roleTitle: data.role_title,
        jobLink: data.job_link || null,
        source: data.source || null,
        location: data.location || null,
        workMode: data.work_mode || null,
        jobType: data.job_type || null,
        sponsorship: data.sponsorship || "unknown",
        salaryMin: data.salary_min || null,
        salaryMax: data.salary_max || null,
        appliedDate: data.applied_date ? new Date(data.applied_date) : null,
        deadline: data.deadline ? new Date(data.deadline) : null,
        currentStage: data.current_stage,
        priority: data.priority || null,
        notes: data.notes || null,
        followUpDate: data.follow_up_date ? new Date(data.follow_up_date) : null,
        recruiterName: data.recruiter_name || null,
        recruiterEmail: data.recruiter_email || null,
        resumeVersion: data.resume_version || null,
        coverLetterVersion: data.cover_letter_version || null,
      },
    });

    return NextResponse.json(application, { status: 201 });
  } catch (error) {
    console.error("Create application error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
