import APIController from "@/controllers/APIController";
import ServerConfig from "@/controllers/serverConfigController";
import Cookies from "js-cookie";
import type { FreelancePlatform, FreelanceComment, FreelanceItem } from "@/services/types";

const userToken = Cookies.get("user-token");
const config = new ServerConfig({
  baseUrl: import.meta.env.VITE_API_URL,
  accessToken: userToken ?? "",
});
const api = new APIController(config);

interface FreelanceData {
  freelancePlatforms: FreelancePlatform[];
  freelanceComments: FreelanceComment[];
}

export default class FreelanceController {
  async loadFreelance(): Promise<FreelanceData> {
    const data = await api.get<{ freelance: FreelanceItem[] }>({
      url: "get-freelance",
    });

    const freelanceItems = data.freelance || [];

    return this.convertToSeparatedData(freelanceItems);
  }

  private convertToSeparatedData(
    items: FreelanceItem[],
  ): FreelanceData {
    const platforms: FreelancePlatform[] = [];
    const comments: FreelanceComment[] = [];

    for (const item of items) {
      platforms.push({
        id: item.id || crypto.randomUUID(),
        name: item.name,
        image: item.image,
        url: item.url,
      });

      if (item.comment) {
        comments.push({
          id: crypto.randomUUID(),
          platformName: item.name,
          title: item.comment.title,
          text: item.comment.text,
          rating: item.comment.rating,
        });
      }
    }

    return {
      freelancePlatforms: platforms,
      freelanceComments: comments,
    };
  }

  async saveFreelance(
    platforms: FreelancePlatform[],
    comments: FreelanceComment[],
    files?: Record<string, File>,
  ): Promise<void> {
    const formData = new FormData();
    formData.append("freelance", JSON.stringify(
      platforms.map((platform, index) => ({
        name: platform.name,
        image: platform.image,
        url: platform.url,
        comment: comments.find(c => c.platformName === platform.name) || null,
      }))
    ));

    if (files) {
      Object.entries(files).forEach(([key, file]) => {
        formData.append(key, file);
      });
    }

    await api.post({
      url: "admin/update-freelance",
      data: formData,
      contentType: "multipart/form-data",
    });
  }

  async addFreelance(freelance: FreelanceItem, imageFile?: File | null): Promise<FreelanceData> {
    const formData = new FormData();
    formData.append("freelance", JSON.stringify(freelance));

    if (imageFile) {
      formData.append("image", imageFile, "freelance.jpg");
    }

    const data = await api.post<{ freelance: FreelanceItem[] }>({
      url: "admin/add-freelance",
      data: formData,
      contentType: "multipart/form-data",
    });

    return this.convertToSeparatedData(data.freelance || []);
  }

  async updateFreelance(id: string, freelance: FreelanceItem, imageFile?: File | null): Promise<FreelanceData> {
    const formData = new FormData();
    formData.append("id", id);
    formData.append("freelance", JSON.stringify(freelance));

    if (imageFile) {
      formData.append("image", imageFile, "freelance.jpg");
    }

    const data = await api.post<{ freelance: FreelanceItem[] }>({
      url: "admin/update-freelance",
      data: formData,
      contentType: "multipart/form-data",
    });

    return this.convertToSeparatedData(data.freelance || []);
  }

  async deleteFreelance(id: string): Promise<FreelanceData> {
    const data = await api.post<{ freelance: FreelanceItem[] }>({
      url: "admin/delete-freelance",
      data: { id },
    });

    return this.convertToSeparatedData(data.freelance || []);
  }
}