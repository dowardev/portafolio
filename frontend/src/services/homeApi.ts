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
}

const userToken = Cookies.get("user-token");
const config = new ServerConfig({
  baseUrl: import.meta.env.VITE_API_URL,
  accessToken: userToken ?? "",
});
const api = new APIController(config);

export const homeApi = {
  // Público (sin auth) - para la página de inicio
  async getPublic(): Promise<HomePageData> {
    return await api.get<HomePageData>({ url: "get-homepage-info" });
  },

  // Admin (con auth) - para el panel de administración
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
