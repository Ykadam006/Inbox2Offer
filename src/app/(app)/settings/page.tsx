"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Loader2, Moon, Sun, Monitor } from "lucide-react";
import { toast } from "sonner";
import { useTheme } from "next-themes";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  jobGoal: z.string().max(200).optional().or(z.literal("")),
  targetRole: z.string().max(100).optional().or(z.literal("")),
  weeklyApplicationGoal: z.number().min(1).max(100).optional(),
});

type ProfileForm = z.infer<typeof profileSchema>;

export default function SettingsPage() {
  const [isSaving, setIsSaving] = useState(false);
  const { data: session, update } = useSession();
  const { theme, setTheme } = useTheme();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
  });

  useEffect(() => {
    if (!session?.user) return;
    fetch("/api/profile")
      .then((r) => r.json())
      .then((data) => {
        reset({
          name: data.name ?? session.user?.name ?? "",
          jobGoal: data.jobGoal ?? "",
          targetRole: data.targetRole ?? "",
          weeklyApplicationGoal: data.weeklyApplicationGoal ?? 5,
        });
      })
      .catch(() => {
        reset({
          name: session.user?.name ?? "",
          jobGoal: "",
          targetRole: "",
          weeklyApplicationGoal: 5,
        });
      });
  }, [session, reset]);

  async function onSubmit(data: ProfileForm) {
    setIsSaving(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to save");
      await update({ name: data.name });
      toast.success("Profile saved!");
    } catch {
      toast.error("Failed to save profile");
    } finally {
      setIsSaving(false);
    }
  }

  const displayName = session?.user?.name || session?.user?.email?.split("@")[0] || "User";
  const initials = displayName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="p-6 space-y-6 animate-in max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Manage your account and preferences</p>
      </div>

      {/* Profile */}
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Update your personal information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="bg-gradient-to-br from-forest-700 to-forest-500 text-white text-lg">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{displayName}</p>
              <p className="text-sm text-muted-foreground">{session?.user?.email}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" placeholder="Your name" {...register("name")} />
              {errors.name && (
                <p className="text-xs text-destructive">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="targetRole">Target Role</Label>
              <Input
                id="targetRole"
                placeholder="e.g. Software Engineer, Product Manager"
                {...register("targetRole")}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="jobGoal">Job Search Goal</Label>
              <Input
                id="jobGoal"
                placeholder="e.g. Land a SWE internship at a top tech company"
                {...register("jobGoal")}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="weeklyApplicationGoal">Weekly Application Goal</Label>
              <Input
                id="weeklyApplicationGoal"
                type="number"
                min={1}
                max={100}
                placeholder="5"
                className="max-w-xs"
                {...register("weeklyApplicationGoal", { valueAsNumber: true })}
              />
              <p className="text-xs text-muted-foreground">
                How many applications do you want to send per week?
              </p>
            </div>

            <Button type="submit" variant="gradient" disabled={isSaving}>
              {isSaving && <Loader2 className="animate-spin" />}
              Save Profile
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Appearance */}
      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>Choose how ApplyVibe looks for you</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            {[
              { value: "light", icon: Sun, label: "Light" },
              { value: "dark", icon: Moon, label: "Dark" },
              { value: "system", icon: Monitor, label: "System" },
            ].map(({ value, icon: Icon, label }) => (
              <button
                key={value}
                onClick={() => setTheme(value)}
                className={`flex flex-1 flex-col items-center gap-2 rounded-xl border p-4 text-sm font-medium transition-all ${
                  theme === value
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border hover:bg-accent"
                }`}
              >
                <Icon className="h-5 w-5" />
                {label}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Stack info */}
      <Card className="border-forest-200 dark:border-forest-800">
        <CardHeader>
          <CardTitle className="text-base">Stack</CardTitle>
          <CardDescription>Open-source, free-first tech</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {[
              "Next.js 16",
              "TypeScript",
              "Tailwind CSS",
              "Auth.js v5",
              "Prisma ORM",
              "Neon PostgreSQL",
              "Vercel Hobby",
              "dnd-kit",
              "Recharts",
            ].map((tech) => (
              <span
                key={tech}
                className="rounded-lg bg-forest-100 dark:bg-forest-900 text-forest-800 dark:text-forest-300 px-2.5 py-1.5 text-xs font-medium text-center"
              >
                {tech}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
