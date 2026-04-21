import APIController from "@/controllers/APIController";
import ServerConfig from "@/controllers/serverConfigController";
import Cookies from "js-cookie";
import type { FreelanceItem } from "@/services/types";

const userToken = Cookies.get("user-token");
const config = new ServerConfig({
  baseUrl: import.meta.env.VITE_API_URL,
  accessToken: userToken ?? "",
});
const api = new APIController(config);

export default class FreelanceController {
  async loadFreelance(): Promise<FreelanceItem[]> {
    const data = await api.get<{ freelance: FreelanceItem[] }>({
      url: "admin/get-homepage-info",
    });
    return data.freelance || [];
  }

  async saveFreelance(
    items: FreelanceItem[],
    files?: Record<string, File>,
  ): Promise<void> {
    const formData = new FormData();
    formData.append("freelance", JSON.stringify(items));

    if (files) {
      Object.entries(files).forEach(([key, file]) => {
        formData.append(key, file);
      });
    }

    await api.post({
      url: "admin/update-freelance-items",
      data: formData,
      contentType: "multipart/form-data",
    });
  }

  async deleteFreelance(index: number): Promise<void> {
    await api.post({
      url: "admin/delete-freelance-item",
      data: { index },
    });
  }
}