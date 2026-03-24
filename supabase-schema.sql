-- ApplyVibe Database Schema
-- Run this in your Supabase SQL editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  avatar_url TEXT,
  job_goal TEXT,
  target_role TEXT,
  weekly_application_goal INTEGER DEFAULT 5,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Applications table
CREATE TABLE IF NOT EXISTS public.applications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  company_name TEXT NOT NULL,
  role_title TEXT NOT NULL,
  job_link TEXT,
  source TEXT CHECK (source IN ('linkedin', 'handshake', 'referral', 'company_site', 'recruiter', 'indeed', 'other')),
  location TEXT,
  work_mode TEXT CHECK (work_mode IN ('remote', 'hybrid', 'onsite')),
  job_type TEXT CHECK (job_type IN ('internship', 'full_time', 'contract', 'part_time', 'co_op')),
  sponsorship TEXT CHECK (sponsorship IN ('yes', 'no', 'unknown')) DEFAULT 'unknown',
  salary_min INTEGER,
  salary_max INTEGER,
  applied_date DATE,
  deadline DATE,
  current_stage TEXT NOT NULL DEFAULT 'saved' CHECK (
    current_stage IN (
      'saved', 'applied', 'oa', 'recruiter_screen',
      'interview_1', 'interview_2', 'final_round',
      'offer', 'rejected', 'ghosted', 'withdrawn'
    )
  ),
  priority TEXT CHECK (priority IN ('high', 'medium', 'low')),
  outcome TEXT,
  notes TEXT,
  follow_up_date DATE,
  recruiter_name TEXT,
  recruiter_email TEXT,
  resume_version TEXT,
  cover_letter_version TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Application events (stage history)
CREATE TABLE IF NOT EXISTS public.application_events (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  application_id UUID REFERENCES public.applications(id) ON DELETE CASCADE NOT NULL,
  old_stage TEXT,
  new_stage TEXT NOT NULL,
  changed_at TIMESTAMPTZ DEFAULT NOW(),
  note TEXT
);

-- Reflections per application
CREATE TABLE IF NOT EXISTS public.reflections (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  application_id UUID REFERENCES public.applications(id) ON DELETE CASCADE NOT NULL,
  what_went_well TEXT,
  what_went_wrong TEXT,
  missing_skills TEXT,
  next_step TEXT,
  interview_questions TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reminders
CREATE TABLE IF NOT EXISTS public.reminders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  application_id UUID REFERENCES public.applications(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  due_date DATE NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'done', 'dismissed')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.application_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reflections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reminders ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Applications policies
CREATE POLICY "Users can view their own applications"
  ON public.applications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own applications"
  ON public.applications FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own applications"
  ON public.applications FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own applications"
  ON public.applications FOR DELETE
  USING (auth.uid() = user_id);

-- Application events policies
CREATE POLICY "Users can view events for their applications"
  ON public.application_events FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.applications
      WHERE id = application_events.application_id
        AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert events for their applications"
  ON public.application_events FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.applications
      WHERE id = application_events.application_id
        AND user_id = auth.uid()
    )
  );

-- Reflections policies
CREATE POLICY "Users can manage reflections for their applications"
  ON public.reflections FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.applications
      WHERE id = reflections.application_id
        AND user_id = auth.uid()
    )
  );

-- Reminders policies
CREATE POLICY "Users can manage their own reminders"
  ON public.reminders FOR ALL
  USING (auth.uid() = user_id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, created_at, updated_at)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NOW(),
    NOW()
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_applications_updated_at
  BEFORE UPDATE ON public.applications
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_reflections_updated_at
  BEFORE UPDATE ON public.reflections
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_applications_user_id ON public.applications(user_id);
CREATE INDEX IF NOT EXISTS idx_applications_current_stage ON public.applications(current_stage);
CREATE INDEX IF NOT EXISTS idx_applications_applied_date ON public.applications(applied_date);
CREATE INDEX IF NOT EXISTS idx_application_events_application_id ON public.application_events(application_id);
CREATE INDEX IF NOT EXISTS idx_reminders_user_id ON public.reminders(user_id);
CREATE INDEX IF NOT EXISTS idx_reminders_due_date ON public.reminders(due_date);
