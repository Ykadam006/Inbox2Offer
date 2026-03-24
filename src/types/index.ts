export type ApplicationStage =
  | "saved"
  | "applied"
  | "oa"
  | "recruiter_screen"
  | "interview_1"
  | "interview_2"
  | "final_round"
  | "offer"
  | "rejected"
  | "ghosted"
  | "withdrawn";

export type ApplicationSource =
  | "linkedin"
  | "handshake"
  | "referral"
  | "company_site"
  | "recruiter"
  | "indeed"
  | "other";

export type WorkMode = "remote" | "hybrid" | "onsite";

export type JobType = "internship" | "full_time" | "contract" | "part_time" | "co_op";

export type Priority = "high" | "medium" | "low";

export type Sponsorship = "yes" | "no" | "unknown";

export interface Application {
  id: string;
  user_id: string;
  company_name: string;
  role_title: string;
  job_link?: string;
  source?: ApplicationSource;
  location?: string;
  work_mode?: WorkMode;
  job_type?: JobType;
  sponsorship?: Sponsorship;
  salary_min?: number;
  salary_max?: number;
  applied_date?: string;
  deadline?: string;
  current_stage: ApplicationStage;
  priority?: Priority;
  outcome?: string;
  notes?: string;
  follow_up_date?: string;
  recruiter_name?: string;
  recruiter_email?: string;
  resume_version?: string;
  cover_letter_version?: string;
  created_at: string;
  updated_at: string;
}

export interface ApplicationEvent {
  id: string;
  application_id: string;
  old_stage?: ApplicationStage;
  new_stage: ApplicationStage;
  changed_at: string;
  note?: string;
}

export interface Reflection {
  id: string;
  application_id: string;
  what_went_well?: string;
  what_went_wrong?: string;
  missing_skills?: string;
  next_step?: string;
  interview_questions?: string;
  created_at: string;
  updated_at: string;
}

export interface Reminder {
  id: string;
  application_id: string;
  user_id: string;
  title: string;
  due_date: string;
  status: "pending" | "done" | "dismissed";
  created_at: string;
}

export interface Profile {
  id: string;
  full_name?: string;
  avatar_url?: string;
  job_goal?: string;
  target_role?: string;
  weekly_application_goal?: number;
  created_at: string;
  updated_at: string;
}

export interface AnalyticsSummary {
  total: number;
  applied: number;
  interviews: number;
  offers: number;
  rejections: number;
  ghosted: number;
  responseRate: number;
  offerRate: number;
  interviewRate: number;
}

export interface StageCount {
  stage: ApplicationStage;
  count: number;
}

export interface SourcePerformance {
  source: string;
  total: number;
  interviews: number;
  offers: number;
  responseRate: number;
}

export const STAGE_LABELS: Record<ApplicationStage, string> = {
  saved: "Saved",
  applied: "Applied",
  oa: "OA",
  recruiter_screen: "Recruiter Screen",
  interview_1: "Interview 1",
  interview_2: "Interview 2",
  final_round: "Final Round",
  offer: "Offer",
  rejected: "Rejected",
  ghosted: "Ghosted",
  withdrawn: "Withdrawn",
};

export const STAGE_COLORS: Record<ApplicationStage, string> = {
  saved: "#94A3B8",
  applied: "#73a942",   /* forest-500 */
  oa: "#aad576",        /* forest-400 */
  recruiter_screen: "#538d22", /* forest-600 */
  interview_1: "#245501", /* forest-700 */
  interview_2: "#1a4301", /* forest-800 */
  final_round: "#F59E0B",
  offer: "#22C55E",
  rejected: "#F87171",
  ghosted: "#6B7280",
  withdrawn: "#9CA3AF",
};

export const SOURCE_LABELS: Record<string, string> = {
  linkedin: "LinkedIn",
  handshake: "Handshake",
  referral: "Referral",
  company_site: "Company Site",
  recruiter: "Recruiter",
  indeed: "Indeed",
  other: "Other",
};

export const STAGE_ORDER: ApplicationStage[] = [
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
];
