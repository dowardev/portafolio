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
  id: string;
  name: string;
  image: string;
}

export interface SkillCategory {
  id: string;
  name: string;
  technologies: Array<{
    iconName: string;
    name?: string;
  }>;
}

export interface ExperienceItem {
  id: string;
  img: string;
  title: string;
  date?: string;
  startDate: string;
  endDate: string | undefined;
  technologies: TechnologyItem[];
  details: {
    description: string;
    website: string;
  };
}

export interface TechnologyItem {
  id?: number;
  iconName: string;
  category?: string;
  image?: string;
}

export interface ProjectItem {
  id: string;
  img: string;
  title: string;
  date?: string;
  startDate?: string;
  endDate?: string;
  status: "progress" | "indeterminate" | "finished";
  technologies: TechnologyItem[];
  source: {
    name: string;
    url: string;
  };
  details: {
    description: string;
    website: string;
  };
}

export interface CertificateItem {
  id: string;
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
  id: string;
  name: string;
  image: string;
  url: string;
  comment: {
    title: string;
    text: string;
    rating: number;
  } | null;
}

export interface FreelancePlatform {
  id: string;
  name: string;
  image: string;
  url: string;
}

export interface FreelanceComment {
  id: string;
  platformName: string;
  title: string;
  text: string;
  rating: number;
}

export interface TagItem {
  id?: number;
  name: string;
  sort_order?: number;
}

export interface SocialItem {
  id?: number;
  platform: string;
  url: string;
  iconName: string;
}

export interface HomePageData {
  name: string;
  tags: TagItem[];
  description: string;
  socials: SocialItem[];
  logoUrl: string | null;
  photoUrl: string | null;
  stack: StackItem[];
  skillCategories: SkillCategory[];
  experience: ExperienceItem[];
  projects: ProjectItem[];
  certificates: CertificateItem[];
  freelance: FreelanceItem[];
  freelancePlatforms?: FreelancePlatform[];
  freelanceComments?: FreelanceComment[];
  showContactForm: {
    socials: boolean;
    freelance: boolean;
  };
}
