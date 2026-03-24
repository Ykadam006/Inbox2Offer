import { z } from "zod";

export const applicationSchema = z.object({
  company_name: z.string().min(1, "Company name is required").max(100),
  role_title: z.string().min(1, "Role title is required").max(100),
  job_link: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  source: z
    .enum(["linkedin", "handshake", "referral", "company_site", "recruiter", "indeed", "other"])
    .optional(),
  location: z.string().max(100).optional().or(z.literal("")),
  work_mode: z.enum(["remote", "hybrid", "onsite"]).optional(),
  job_type: z.enum(["internship", "full_time", "contract", "part_time", "co_op"]).optional(),
  sponsorship: z.enum(["yes", "no", "unknown"]).optional(),
  salary_min: z.coerce.number().min(0).optional().nullable(),
  salary_max: z.coerce.number().min(0).optional().nullable(),
  applied_date: z.string().optional().or(z.literal("")),
  deadline: z.string().optional().or(z.literal("")),
  current_stage: z.enum([
    "saved",
    "applied",
    "oa",
    "recruiter_screen",
    "interview_1",
    "interview_2",
    "final_round",
    "offer",
    "rejected",
    "ghosted",
    "withdrawn",
  ]),
  priority: z.enum(["high", "medium", "low"]).optional(),
  notes: z.string().max(2000).optional().or(z.literal("")),
  follow_up_date: z.string().optional().or(z.literal("")),
  recruiter_name: z.string().max(100).optional().or(z.literal("")),
  recruiter_email: z.string().email().optional().or(z.literal("")),
  resume_version: z.string().max(100).optional().or(z.literal("")),
  cover_letter_version: z.string().max(100).optional().or(z.literal("")),
});

export type ApplicationFormData = z.infer<typeof applicationSchema>;
