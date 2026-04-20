import APIController from "@/controllers/APIController";
import ServerConfig from "@/controllers/serverConfigController";
import Cookies from "js-cookie";
import type { HomePageData } from "@/services/types";

const userToken = Cookies.get("user-token");
const config = new ServerConfig({
  baseUrl: import.meta.env.VITE_API_URL,
  accessToken: userToken ?? "",
});
const api = new APIController(config);

export default class HomeEditorController {
  async loadPublicData(): Promise<HomePageData> {
    return await api.get<HomePageData>({ url: "get-homepage-info" });
  }

  async loadData(): Promise<HomePageData> {
    return await api.get<HomePageData>({ url: "admin/get-homepage-info" });
  }

  async save(formData: FormData): Promise<void> {
    await api.post<HomePageData>({
      url: "admin/update-homepage-info",
      data: formData,
      contentType: "multipart/form-data",
    });
  }
}