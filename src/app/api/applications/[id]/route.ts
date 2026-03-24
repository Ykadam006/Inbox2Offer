import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { applicationSchema } from "@/lib/validations/application";

async function getOwnedApplication(applicationId: string, userId: string) {
  return db.application.findFirst({
    where: { id: applicationId, userId },
  });
}

const patchSchema = applicationSchema.partial();

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

    // Validate all incoming fields against the schema (partial — all fields optional)
    const parsed = patchSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const data = parsed.data;

    // Build update payload — only include fields that were actually sent
    const updateData: Record<string, unknown> = {};

    if (data.current_stage !== undefined) updateData.currentStage = data.current_stage;
    if (data.company_name !== undefined) updateData.companyName = data.company_name;
    if (data.role_title !== undefined) updateData.roleTitle = data.role_title;
    if (data.job_link !== undefined) updateData.jobLink = data.job_link || null;
    if (data.source !== undefined) updateData.source = data.source || null;
    if (data.location !== undefined) updateData.location = data.location || null;
    if (data.work_mode !== undefined) updateData.workMode = data.work_mode || null;
    if (data.job_type !== undefined) updateData.jobType = data.job_type || null;
    if (data.sponsorship !== undefined) updateData.sponsorship = data.sponsorship || "unknown";
    if (data.salary_min !== undefined) updateData.salaryMin = data.salary_min ?? null;
    if (data.salary_max !== undefined) updateData.salaryMax = data.salary_max ?? null;
    if (data.applied_date !== undefined) updateData.appliedDate = data.applied_date ? new Date(data.applied_date) : null;
    if (data.deadline !== undefined) updateData.deadline = data.deadline ? new Date(data.deadline) : null;
    if (data.priority !== undefined) updateData.priority = data.priority || null;
    if (data.notes !== undefined) updateData.notes = data.notes || null;
    if (data.follow_up_date !== undefined) updateData.followUpDate = data.follow_up_date ? new Date(data.follow_up_date) : null;
    if (data.recruiter_name !== undefined) updateData.recruiterName = data.recruiter_name || null;
    if (data.recruiter_email !== undefined) updateData.recruiterEmail = data.recruiter_email || null;
    if (data.resume_version !== undefined) updateData.resumeVersion = data.resume_version || null;
    if (data.cover_letter_version !== undefined) updateData.coverLetterVersion = data.cover_letter_version || null;
    if (data.outcome !== undefined) updateData.outcome = data.outcome || null;

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
    }

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

  try {
    await db.application.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete application error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
