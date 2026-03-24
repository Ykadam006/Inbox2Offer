import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { z } from "zod";

const profileSchema = z.object({
  name: z.string().min(2).optional(),
  jobGoal: z.string().max(200).optional(),
  targetRole: z.string().max(100).optional(),
  weeklyApplicationGoal: z.number().min(1).max(100).optional(),
});

export async function PATCH(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = profileSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const data = parsed.data;

    const updated = await db.user.update({
      where: { id: session.user.id },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.jobGoal !== undefined && { jobGoal: data.jobGoal }),
        ...(data.targetRole !== undefined && { targetRole: data.targetRole }),
        ...(data.weeklyApplicationGoal !== undefined && {
          weeklyApplicationGoal: data.weeklyApplicationGoal,
        }),
      },
      select: { id: true, name: true, email: true },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
