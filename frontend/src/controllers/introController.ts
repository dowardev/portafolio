import APIController from "@/controllers/APIController";
import ServerConfig from "@/controllers/serverConfigController";
import Cookies from "js-cookie";

const userToken = Cookies.get("user-token");
const config = new ServerConfig({
  baseUrl: import.meta.env.VITE_API_URL,
  accessToken: userToken ?? "",
});
const api = new APIController(config);

export interface IntroData {
  name: string | null;
  tags: string[];
  description: string | null;
  socials: Array<{ platform: string; url: string; iconName: string }>;
  logoUrl: string | null;
  photoUrl: string | null;
  stack: Array<{ name: string; image: string }>;
  showContactForm: {
    socials: boolean;
    freelance: boolean;
  };
}

export default class IntroController {
  async loadIntro(): Promise<IntroData> {
    return await api.get<IntroData>({ url: "get-intro" });
  }

  async saveIntro(intro: IntroData, files?: Record<string, File>): Promise<IntroData> {
    const formData = new FormData();
    formData.append("intro", JSON.stringify({
      name: intro.name,
      tags: intro.tags,
      description: intro.description,
      socials: intro.socials,
      showContactForm: intro.showContactForm,
      stack: intro.stack,
    }));

    if (files) {
      Object.entries(files).forEach(([key, file]) => {
        formData.append(key, file);
      });
    }

    return await api.post<IntroData>({
      url: "admin/update-intro",
      data: formData,
      contentType: "multipart/form-data",
    });
  }
}