import APIController from "./APIController";
import ServerConfig from "./serverConfigController";
import Cookies from "js-cookie";
import type { FreelancePlatform, FreelanceComment, FreelanceItem } from "@/services/types";
import { useFreelanceStore } from "@/store/freelanceStore";

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
  private freelanceStore = useFreelanceStore();

  async loadFreelance(): Promise<FreelanceData> {
    this.freelanceStore.setLoading(true);
    try {
      const data = await api.get<{ freelance: FreelanceItem[] }>({
        url: "get-freelance",
      });

      const freelanceItems = data.freelance || [];
      const platforms: FreelancePlatform[] = freelanceItems.map(item => ({
        id: item.id || crypto.randomUUID(),
        name: item.name,
        image: item.image,
        url: item.url,
      }));
      const comments: FreelanceComment[] = freelanceItems
        .filter(item => !!item.comment)
        .map(item => ({
          id: crypto.randomUUID(),
          platformName: item.name,
          title: item.comment!.title,
          text: item.comment!.text,
          rating: item.comment!.rating,
        }));

      this.freelanceStore.setPlatforms(platforms);
      this.freelanceStore.setComments(comments);

      return { freelancePlatforms: platforms, freelanceComments: comments };
    } catch (error) {
      console.error("Error loading freelance:", error);
      return { freelancePlatforms: [], freelanceComments: [] };
    } finally {
      this.freelanceStore.setLoading(false);
    }
  }

  async saveFreelance(
    platforms: FreelancePlatform[],
    comments: FreelanceComment[],
    files?: Record<string, File>,
  ): Promise<void> {
    this.freelanceStore.setSaving(true);
    try {
      const formData = new FormData();
      formData.append("freelance", JSON.stringify(
        platforms.map((platform) => ({
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

      this.freelanceStore.setPlatforms(platforms);
      this.freelanceStore.setComments(comments);
    } catch (error) {
      console.error("Error saving freelance:", error);
    } finally {
      this.freelanceStore.setSaving(false);
    }
  }

  async addFreelance(freelance: FreelanceItem, imageFile?: File | null): Promise<FreelanceData> {
    this.freelanceStore.setSaving(true);
    try {
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

      return this.setStoreFromData(data.freelance || []);
    } finally {
      this.freelanceStore.setSaving(false);
    }
  }

  async updateFreelance(id: string, freelance: FreelanceItem, imageFile?: File | null): Promise<FreelanceData> {
    this.freelanceStore.setSaving(true);
    try {
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

      return this.setStoreFromData(data.freelance || []);
    } finally {
      this.freelanceStore.setSaving(false);
    }
  }

  async deleteFreelance(id: string): Promise<FreelanceData> {
    this.freelanceStore.setSaving(true);
    try {
      const data = await api.post<{ freelance: FreelanceItem[] }>({
        url: "admin/delete-freelance",
        data: { id },
      });

      return this.setStoreFromData(data.freelance || []);
    } finally {
      this.freelanceStore.setSaving(false);
    }
  }

  private setStoreFromData(items: FreelanceItem[]): FreelanceData {
    const platforms: FreelancePlatform[] = items.map(item => ({
      id: item.id || crypto.randomUUID(),
      name: item.name,
      image: item.image,
      url: item.url,
    }));
    const comments: FreelanceComment[] = items
      .filter(item => !!item.comment)
      .map(item => ({
        id: crypto.randomUUID(),
        platformName: item.name,
        title: item.comment!.title,
        text: item.comment!.text,
        rating: item.comment!.rating,
      }));

    this.freelanceStore.setPlatforms(platforms);
    this.freelanceStore.setComments(comments);

    return { freelancePlatforms: platforms, freelanceComments: comments };
  }
}