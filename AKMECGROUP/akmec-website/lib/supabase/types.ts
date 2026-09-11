export interface Job {
  id: string;
  slug: string;
  title: string;
  department: string;
  location: string;
  employment_type: string;
  experience_level: string | null;
  summary: string;
  description: string;
  requirements: string[];
  status: 'open' | 'closed';
  posted_at: string;
}

export interface Profile {
  id: string;
  full_name: string;
  phone: string | null;
  headline: string | null;
}

export type ApplicationStatus = 'submitted' | 'reviewing' | 'shortlisted' | 'rejected' | 'hired';

export interface Application {
  id: string;
  candidate_id: string;
  job_id: string;
  cover_note: string | null;
  resume_path: string | null;
  status: ApplicationStatus;
  created_at: string;
  jobs?: Pick<Job, 'title' | 'slug' | 'department' | 'location'>;
}
