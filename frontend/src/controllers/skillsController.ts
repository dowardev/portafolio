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
      const data = await api.get<SkillsResponse>({ url: "get-skills" });
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

  async addSkillCategory(category: SkillCategory): Promise<boolean> {
    try {
      this.skillsStore.setSaving(true);

      const formData = new FormData();
      formData.append("skillCategory", JSON.stringify(category));

      const data = await api.post<SkillsResponse>({
        url: "admin/add-skill-category",
        data: formData,
        contentType: "multipart/form-data",
      });

      this.skillsStore.setSkillCategories(data.skillCategories || []);
      this.skillsStore.setSaving(false);
      return true;
    } catch (error) {
      this.skillsStore.setSaving(false);
      console.error("Error adding skill category:", error);
      const toast = await this.toastController.presentToast({
        message: "Error al agregar la categoría",
        duration: 2000,
        color: "danger",
      });
      await toast.present();
      return false;
    }
  }

  async deleteSkillCategory(id: string): Promise<boolean> {
    try {
      const data = await api.post<SkillsResponse>({
        url: "admin/delete-skill-category",
        data: { id },
      });

      this.skillsStore.setSkillCategories(data.skillCategories || []);
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

  async updateSkillCategory(id: string, category: SkillCategory): Promise<boolean> {
    try {
      this.skillsStore.setSaving(true);

      const formData = new FormData();
      formData.append("id", id);
      formData.append("skillCategory", JSON.stringify(category));

      const data = await api.post<SkillsResponse>({
        url: "admin/update-skill-category",
        data: formData,
        contentType: "multipart/form-data",
      });

      this.skillsStore.setSkillCategories(data.skillCategories || []);
      this.skillsStore.setSaving(false);
      return true;
    } catch (error) {
      this.skillsStore.setSaving(false);
      console.error("Error updating skill category:", error);
      const toast = await this.toastController.presentToast({
        message: "Error al actualizar la categoría",
        duration: 2000,
        color: "danger",
      });
      await toast.present();
      return false;
    }
  }
}