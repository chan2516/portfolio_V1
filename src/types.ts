export interface CandidateContact {
  phone: string;
  email: string;
  location: string;
  linkedin: string;
  linkedinUrl: string;
  github: string;
  githubUrl: string;
}

export interface CandidateStats {
  label: string;
  value: string;
  description: string;
}

export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  location: string;
  period: string;
  current: boolean;
  description: string;
  bullets: string[];
  techStack: string[];
  metrics: { label: string; value: string }[];
}

export interface ProjectArchitectureStep {
  title: string;
  desc: string;
  badge: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  subtitle: string;
  category: 'Full-Stack' | 'Microservices' | 'Enterprise';
  summary: string;
  bullets: string[];
  techStack: string[];
  features: string[];
  architectureDetails: ProjectArchitectureStep[];
  githubUrl: string;
  liveUrl?: string;
  metrics?: { label: string; value: string }[];
}

export interface SkillGroup {
  id: string;
  category: string;
  description: string;
  skills: string[];
  featured?: boolean;
}

export interface EducationItem {
  id: string;
  degree: string;
  institution: string;
  location: string;
  period: string;
  cgpa: string;
  highlights: string[];
}

export interface CertificationItem {
  id: string;
  title: string;
  issuer: string;
  year: string;
  credentialUrl?: string;
  skillsCovered: string[];
}

export interface CodeSnippet {
  id: string;
  title: string;
  filename: string;
  language: string;
  description: string;
  code: string;
}
