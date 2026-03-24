"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { applicationSchema, type ApplicationFormData } from "@/lib/validations/application";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Application } from "@/types";
import { STAGE_LABELS } from "@/types";
import { Loader2 } from "lucide-react";

interface ApplicationFormProps {
  defaultValues?: Partial<Application>;
  onSubmit: (data: ApplicationFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export function ApplicationForm({
  defaultValues,
  onSubmit,
  onCancel,
  isLoading,
}: ApplicationFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      company_name: defaultValues?.company_name ?? "",
      role_title: defaultValues?.role_title ?? "",
      job_link: defaultValues?.job_link ?? "",
      source: defaultValues?.source,
      location: defaultValues?.location ?? "",
      work_mode: defaultValues?.work_mode,
      job_type: defaultValues?.job_type,
      sponsorship: defaultValues?.sponsorship,
      salary_min: defaultValues?.salary_min ?? undefined,
      salary_max: defaultValues?.salary_max ?? undefined,
      applied_date: defaultValues?.applied_date ?? "",
      deadline: defaultValues?.deadline ?? "",
      current_stage: defaultValues?.current_stage ?? "saved",
      priority: defaultValues?.priority,
      notes: defaultValues?.notes ?? "",
      follow_up_date: defaultValues?.follow_up_date ?? "",
      recruiter_name: defaultValues?.recruiter_name ?? "",
      recruiter_email: defaultValues?.recruiter_email ?? "",
      resume_version: defaultValues?.resume_version ?? "",
      cover_letter_version: defaultValues?.cover_letter_version ?? "",
    },
  });

  const currentStage = watch("current_stage");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="company_name">Company *</Label>
          <Input
            id="company_name"
            placeholder="Google, Microsoft..."
            {...register("company_name")}
          />
          {errors.company_name && (
            <p className="text-xs text-destructive">{errors.company_name.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="role_title">Role *</Label>
          <Input
            id="role_title"
            placeholder="Software Engineer Intern..."
            {...register("role_title")}
          />
          {errors.role_title && (
            <p className="text-xs text-destructive">{errors.role_title.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="job_link">Job Link</Label>
        <Input
          id="job_link"
          type="url"
          placeholder="https://..."
          {...register("job_link")}
        />
        {errors.job_link && (
          <p className="text-xs text-destructive">{errors.job_link.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label>Stage *</Label>
          <Select
            value={currentStage}
            onValueChange={(v) => setValue("current_stage", v as ApplicationFormData["current_stage"])}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select stage" />
            </SelectTrigger>
            <SelectContent>
              {(Object.entries(STAGE_LABELS) as [ApplicationFormData["current_stage"], string][]).map(
                ([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                )
              )}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label>Source</Label>
          <Select
            defaultValue={defaultValues?.source}
            onValueChange={(v) => setValue("source", v as ApplicationFormData["source"])}
          >
            <SelectTrigger>
              <SelectValue placeholder="Where did you find it?" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="linkedin">LinkedIn</SelectItem>
              <SelectItem value="handshake">Handshake</SelectItem>
              <SelectItem value="referral">Referral</SelectItem>
              <SelectItem value="company_site">Company Site</SelectItem>
              <SelectItem value="recruiter">Recruiter</SelectItem>
              <SelectItem value="indeed">Indeed</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="space-y-1.5">
          <Label>Job Type</Label>
          <Select
            defaultValue={defaultValues?.job_type}
            onValueChange={(v) => setValue("job_type", v as ApplicationFormData["job_type"])}
          >
            <SelectTrigger>
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="full_time">Full-time</SelectItem>
              <SelectItem value="internship">Internship</SelectItem>
              <SelectItem value="co_op">Co-op</SelectItem>
              <SelectItem value="contract">Contract</SelectItem>
              <SelectItem value="part_time">Part-time</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label>Work Mode</Label>
          <Select
            defaultValue={defaultValues?.work_mode}
            onValueChange={(v) => setValue("work_mode", v as ApplicationFormData["work_mode"])}
          >
            <SelectTrigger>
              <SelectValue placeholder="Mode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="remote">Remote</SelectItem>
              <SelectItem value="hybrid">Hybrid</SelectItem>
              <SelectItem value="onsite">On-site</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label>Sponsorship</Label>
          <Select
            defaultValue={defaultValues?.sponsorship}
            onValueChange={(v) => setValue("sponsorship", v as ApplicationFormData["sponsorship"])}
          >
            <SelectTrigger>
              <SelectValue placeholder="Visa?" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="yes">Yes</SelectItem>
              <SelectItem value="no">No</SelectItem>
              <SelectItem value="unknown">Unknown</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            placeholder="New York, NY / Remote..."
            {...register("location")}
          />
        </div>

        <div className="space-y-1.5">
          <Label>Priority</Label>
          <Select
            defaultValue={defaultValues?.priority}
            onValueChange={(v) => setValue("priority", v as ApplicationFormData["priority"])}
          >
            <SelectTrigger>
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="high">🔴 High</SelectItem>
              <SelectItem value="medium">🟡 Medium</SelectItem>
              <SelectItem value="low">🟢 Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="salary_min">Salary Min ($)</Label>
          <Input
            id="salary_min"
            type="number"
            placeholder="80000"
            {...register("salary_min")}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="salary_max">Salary Max ($)</Label>
          <Input
            id="salary_max"
            type="number"
            placeholder="120000"
            {...register("salary_max")}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="applied_date">Date Applied</Label>
          <Input id="applied_date" type="date" {...register("applied_date")} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="deadline">Deadline</Label>
          <Input id="deadline" type="date" {...register("deadline")} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="follow_up_date">Follow-up Date</Label>
          <Input id="follow_up_date" type="date" {...register("follow_up_date")} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="recruiter_name">Recruiter Name</Label>
          <Input
            id="recruiter_name"
            placeholder="Jane Smith"
            {...register("recruiter_name")}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="recruiter_email">Recruiter Email</Label>
          <Input
            id="recruiter_email"
            type="email"
            placeholder="jane@company.com"
            {...register("recruiter_email")}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="resume_version">Resume Version</Label>
          <Input
            id="resume_version"
            placeholder="Resume V2, SWE Resume..."
            {...register("resume_version")}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="cover_letter_version">Cover Letter Version</Label>
          <Input
            id="cover_letter_version"
            placeholder="CL V1, Generic..."
            {...register("cover_letter_version")}
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          placeholder="Add any notes about this application..."
          rows={3}
          {...register("notes")}
        />
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="gradient" disabled={isLoading}>
          {isLoading && <Loader2 className="animate-spin" />}
          {defaultValues?.id ? "Save Changes" : "Add Application"}
        </Button>
      </div>
    </form>
  );
}
