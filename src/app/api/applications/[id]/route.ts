import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { applicationSchema } from "@/lib/validations/application";

async function getOwnedApplication(applicationId: string, userId: string) {
  return db.application.findFirst({
    where: { id: applicationId, userId },
  });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const existing = await getOwnedApplication(id, session.user.id);
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  try {
    const body = await request.json();

    // Support partial updates (stage-only, full form, etc.)
    const updateData: Record<string, unknown> = {};

    if (body.current_stage !== undefined) updateData.currentStage = body.current_stage;
    if (body.company_name !== undefined) updateData.companyName = body.company_name;
    if (body.role_title !== undefined) updateData.roleTitle = body.role_title;
    if (body.job_link !== undefined) updateData.jobLink = body.job_link || null;
    if (body.source !== undefined) updateData.source = body.source || null;
    if (body.location !== undefined) updateData.location = body.location || null;
    if (body.work_mode !== undefined) updateData.workMode = body.work_mode || null;
    if (body.job_type !== undefined) updateData.jobType = body.job_type || null;
    if (body.sponsorship !== undefined) updateData.sponsorship = body.sponsorship || "unknown";
    if (body.salary_min !== undefined) updateData.salaryMin = body.salary_min || null;
    if (body.salary_max !== undefined) updateData.salaryMax = body.salary_max || null;
    if (body.applied_date !== undefined) updateData.appliedDate = body.applied_date ? new Date(body.applied_date) : null;
    if (body.deadline !== undefined) updateData.deadline = body.deadline ? new Date(body.deadline) : null;
    if (body.priority !== undefined) updateData.priority = body.priority || null;
    if (body.notes !== undefined) updateData.notes = body.notes || null;
    if (body.follow_up_date !== undefined) updateData.followUpDate = body.follow_up_date ? new Date(body.follow_up_date) : null;
    if (body.recruiter_name !== undefined) updateData.recruiterName = body.recruiter_name || null;
    if (body.recruiter_email !== undefined) updateData.recruiterEmail = body.recruiter_email || null;
    if (body.resume_version !== undefined) updateData.resumeVersion = body.resume_version || null;
    if (body.cover_letter_version !== undefined) updateData.coverLetterVersion = body.cover_letter_version || null;
    if (body.outcome !== undefined) updateData.outcome = body.outcome || null;

    const updated = await db.application.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Update application error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const existing = await getOwnedApplication(id, session.user.id);
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await db.application.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
