export type Theme = "light" | "nord" | "gruvbox";

export type StatusPost = "active" | "inactive" | "draft";

export type filterPostOptions = "all" | "active" | "inactive" | "draft";

export type PostFields =
  | "id"
  | "title"
  | "content"
  | "created_at"
  | "updated_at"
  | "cover"
  | "status";

export interface StackItem {
  name: string;
  image: string;
}

export interface SkillCategory {
  name: string;
  technologies: Array<{
    iconName: string;
  }>;
}

export interface ExperienceItem {
  img: string;
  title: string;
  startDate: string;
  endDate: string | undefined;
  technologies: Array<{
    iconName: string;
  }>;
  details: {
    description: string;
    website: string;
  };
}

export interface ProjectItem {
  img: string;
  title: string;
  date?: string;
  startDate?: string;
  endDate?: string;
  status: "progress" | "indeterminate" | "finished";
  technologies: Array<{
    iconName: string;
  }>;
  source: {
    img: string;
    name: string;
    url: string;
  };
  details: {
    description: string;
    website: string;
  };
}

export interface CertificateItem {
  img: string;
  title: string;
  url: string;
  aptitudes: Array<{
    source: string;
    name: string;
    type: "img" | "icon";
    size: string;
  }>;
}

export interface FreelanceItem {
  name: string;
  image: string;
  url: string;
  comment: {
    title: string;
    text: string;
    rating: number;
  } | null;
}

export interface HomePageData {
  name: string;
  tags: string[];
  description: string;
  socials: Array<{ platform: string; url: string; iconName: string }>;
  logoUrl: string | null;
  photoUrl: string | null;
  stack: StackItem[];
  skillCategories: SkillCategory[];
  experience: ExperienceItem[];
  projects: ProjectItem[];
  certificates: CertificateItem[];
  freelance: FreelanceItem[];
  showContactForm: {
    socials: boolean;
    freelance: boolean;
  };
}
