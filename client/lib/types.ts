export type AuthUser = {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  avatar_url?: string | null;
  avatar_public_id?: string | null;
  role: 'mentee' | 'mentor' | 'admin';
  created_at: string;
};

export type MentorRoleProfile = {
  user_id: string;
  title: string | null;
  bio: string | null;
  experience_level?: string | null;
  industries?: string[];
  cv_url?: string | null;
  expertise: string[];
  career_preferences: string[];
  languages: string[];
  availability: string[];
  updated_at: string;
};

export type MentorDirectoryEntry = AuthUser & {
  name: string;
  title: string | null;
  bio: string | null;
  experience_level?: string | null;
  industries?: string[];
  cv_url?: string | null;
  expertise: string[];
  career_preferences: string[];
  languages: string[];
  availability: string[];
  updated_at: string;
};

export type MenteeRoleProfile = {
  user_id: string;
  career_path: string | null;
  goals: string | null;
  experience_level?: string | null;
  industry_preferences?: string[];
  education_status?: string | null;
  desired_skills: string[];
  languages: string[];
  availability: string[];
  updated_at: string;
};

export type MenteeDirectoryEntry = AuthUser & {
  name: string;
  career_path: string | null;
  goals: string | null;
  experience_level?: string | null;
  industry_preferences?: string[];
  education_status?: string | null;
  desired_skills: string[];
  languages: string[];
  availability: string[];
  updated_at: string;
};

export type SessionResponse = {
  user: AuthUser | null;
  csrfToken?: string | null;
};

export type DirectoryPageInfo = {
  hasMore: boolean;
  nextCursor: string | null;
};
