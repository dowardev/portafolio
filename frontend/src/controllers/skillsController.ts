import { useSkillsStore } from "@/store/skillsStore";
import type { SkillCategory } from "@/services/types";
import { ToastController } from "./toastController";
import APIController from "./APIController";
import ServerConfig from "./serverConfigController";
import Cookies from "js-cookie";

const userToken = Cookies.get("user-token");
const config = new ServerConfig({
  baseUrl: import.meta.env.VITE_API_URL,
  accessToken: userToken ?? "",
});
const api = new APIController(config);

interface SkillsResponse {
  skillCategories: SkillCategory[];
}

export default class SkillsController {
  private skillsStore = useSkillsStore();
  private toastController = new ToastController();

  async loadSkills(): Promise<void> {
    this.skillsStore.setLoading(true);
    try {
      const data = await api.get<SkillsResponse>({ url: "get-homepage-info" });
      this.skillsStore.setSkillCategories(data.skillCategories || []);
    } catch (error) {
      console.error("Error loading skills:", error);
      this.skillsStore.setSkillCategories([]);
    } finally {
      this.skillsStore.setLoading(false);
    }
  }

  getSkillCategories(): SkillCategory[] {
    return this.skillsStore.skillCategories;
  }

  getSkillCategory(index: number): SkillCategory | undefined {
    return this.skillsStore.getSkillCategory(index);
  }

  async saveSkillCategory(category: SkillCategory, index?: number): Promise<boolean> {
    try {
      if (index !== undefined) {
        this.skillsStore.updateSkillCategory(index, category);
      } else {
        this.skillsStore.addSkillCategory(category);
      }

      const formData = new FormData();
      formData.append(
        "payload",
        JSON.stringify({ skillCategories: this.skillsStore.skillCategories })
      );
      await api.post<SkillsResponse>({
        url: "admin/update-homepage-info",
        data: formData,
        contentType: "multipart/form-data",
      });
      return true;
    } catch (error) {
      console.error("Error saving skill category:", error);
      const toast = await this.toastController.presentToast({
        message: "Error al guardar la categoría",
        duration: 2000,
        color: "danger",
      });
      await toast.present();
      return false;
    }
  }

  async deleteSkillCategory(index: number): Promise<boolean> {
    try {
      this.skillsStore.deleteSkillCategory(index);

      const formData = new FormData();
      formData.append(
        "payload",
        JSON.stringify({ skillCategories: this.skillsStore.skillCategories })
      );
      await api.post<SkillsResponse>({
        url: "admin/update-homepage-info",
        data: formData,
        contentType: "multipart/form-data",
      });
      return true;
    } catch (error) {
      console.error("Error deleting skill category:", error);
      const toast = await this.toastController.presentToast({
        message: "Error al eliminar la categoría",
        duration: 2000,
        color: "danger",
      });
      await toast.present();
      return false;
    }
  }

  async addSkillCategory(category: SkillCategory): Promise<boolean> {
    return this.saveSkillCategory(category);
  }
}