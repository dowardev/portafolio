import APIController from "@/controllers/APIController";
import ServerConfig from "@/controllers/serverConfigController";
import Cookies from "js-cookie";

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

export interface StackItem {
  name: string;
  image: string;
}

export interface SkillCategory {
  name: string;
  technologies: Array<{
    name: string;
    image: string;
    iconName: string;
    size: string;
    type: "img" | "icon";
  }>;
}

export interface ExperienceItem {
  img: string;
  title: string;
  date: string;
  technologies: Array<{
    source: string;
    name: string;
    size: string;
    type: "img" | "icon";
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
    source: string;
    name: string;
    size: string;
    type: "img" | "icon";
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
  comments: Array<{
    image: string;
    title: string;
    comment: string[];
    rating: number;
  }>;
}

const userToken = Cookies.get("user-token");
const config = new ServerConfig({
  baseUrl: import.meta.env.VITE_API_URL,
  accessToken: userToken ?? "",
});
const api = new APIController(config);

export const homeApi = {
  async getPublic(): Promise<HomePageData> {
    return await api.get<HomePageData>({ url: "get-homepage-info" });
  },

  async get(): Promise<HomePageData> {
    return await api.get<HomePageData>({ url: "admin/get-homepage-info" });
  },

  async update(formData: FormData): Promise<HomePageData> {
    return await api.post<HomePageData>({
      url: "admin/update-homepage-info",
      data: formData,
      contentType: "multipart/form-data",
    });
  },
};

export default homeApi;
