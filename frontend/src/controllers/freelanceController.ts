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
      url: "admin/get-homepage-info",
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
        name: item.name,
        image: item.image,
        url: item.url,
      });

      if (item.comment) {
        comments.push({
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
    formData.append("freelancePlatforms", JSON.stringify(platforms));
    formData.append("freelanceComments", JSON.stringify(comments));

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

  async deleteFreelanceItem(
    type: "platform" | "comment",
    index: number,
  ): Promise<void> {
    await api.post({
      url: "admin/delete-freelance-item",
      data: { type, index },
    });
  }
}