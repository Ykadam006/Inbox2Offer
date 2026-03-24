"use client";

import { useState, useEffect, useCallback } from "react";
import type { Application } from "@/types";
import { toast } from "sonner";

function dbToApp(d: Record<string, unknown>): Application {
  return {
    id: d.id as string,
    user_id: d.userId as string,
    company_name: d.companyName as string,
    role_title: d.roleTitle as string,
    job_link: d.jobLink as string | undefined,
    source: d.source as Application["source"],
    location: d.location as string | undefined,
    work_mode: d.workMode as Application["work_mode"],
    job_type: d.jobType as Application["job_type"],
    sponsorship: d.sponsorship as Application["sponsorship"],
    salary_min: d.salaryMin as number | undefined,
    salary_max: d.salaryMax as number | undefined,
    applied_date: d.appliedDate ? (d.appliedDate as string).slice(0, 10) : undefined,
    deadline: d.deadline ? (d.deadline as string).slice(0, 10) : undefined,
    current_stage: d.currentStage as Application["current_stage"],
    priority: d.priority as Application["priority"],
    outcome: d.outcome as string | undefined,
    notes: d.notes as string | undefined,
    follow_up_date: d.followUpDate ? (d.followUpDate as string).slice(0, 10) : undefined,
    recruiter_name: d.recruiterName as string | undefined,
    recruiter_email: d.recruiterEmail as string | undefined,
    resume_version: d.resumeVersion as string | undefined,
    cover_letter_version: d.coverLetterVersion as string | undefined,
    created_at: d.createdAt as string,
    updated_at: d.updatedAt as string,
  };
}

export function useApplications() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchApplications = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/applications");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setApplications(data.map(dbToApp));
    } catch {
      toast.error("Failed to load applications");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  async function createApplication(
    data: Omit<Application, "id" | "user_id" | "created_at" | "updated_at">
  ) {
    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? "Failed to create");
      }
      const newApp = dbToApp(await res.json());
      setApplications((prev) => [newApp, ...prev]);
      toast.success("Application added!");
      return newApp;
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to add application");
      return null;
    }
  }

  async function updateApplication(id: string, data: Partial<Application>) {
    try {
      const res = await fetch(`/api/applications/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update");
      const updated = dbToApp(await res.json());
      setApplications((prev) => prev.map((a) => (a.id === id ? updated : a)));
      toast.success("Application updated!");
      return updated;
    } catch {
      toast.error("Failed to update application");
      return null;
    }
  }

  async function deleteApplication(id: string) {
    try {
      const res = await fetch(`/api/applications/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      setApplications((prev) => prev.filter((a) => a.id !== id));
      toast.success("Application deleted");
      return true;
    } catch {
      toast.error("Failed to delete application");
      return false;
    }
  }

  async function updateStage(id: string, stage: Application["current_stage"]) {
    return updateApplication(id, { current_stage: stage });
  }

  return {
    applications,
    isLoading,
    refetch: fetchApplications,
    createApplication,
    updateApplication,
    deleteApplication,
    updateStage,
  };
}
