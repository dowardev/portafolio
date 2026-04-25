import { useCategoriesStore } from "@/store/categoriesStore";
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

export default class CategoriesController {
  private categoriesStore = useCategoriesStore();
  private toastController = new ToastController();

  async loadCategories(): Promise<SkillCategory[]> {
    this.categoriesStore.setLoading(true);
    try {
      const data = await api.get<SkillsResponse>({ url: "get-skills" });
      this.categoriesStore.setSkillCategories(data.skillCategories || []);
      return data.skillCategories || [];
    } catch (error) {
      console.error("Error loading categories:", error);
      this.categoriesStore.setSkillCategories([]);
      return [];
    } finally {
      this.categoriesStore.setLoading(false);
    }
  }

  getSkillCategories(): SkillCategory[] {
    return this.categoriesStore.skillCategories;
  }

  getSkillCategory(index: number): SkillCategory | undefined {
    return this.categoriesStore.getSkillCategory(index);
  }

  async addCategory(category: SkillCategory): Promise<boolean> {
    try {
      this.categoriesStore.setSaving(true);

      const formData = new FormData();
      formData.append("skillCategory", JSON.stringify(category));

      const data = await api.post<SkillsResponse>({
        url: "admin/add-skill-category",
        data: formData,
        contentType: "multipart/form-data",
      });

      this.categoriesStore.setSkillCategories(data.skillCategories || []);
      this.categoriesStore.setSaving(false);
      return true;
    } catch (error) {
      this.categoriesStore.setSaving(false);
      console.error("Error adding category:", error);
      const toast = await this.toastController.presentToast({
        message: "Error al agregar la categoría",
        duration: 2000,
        color: "danger",
      });
      await toast.present();
      return false;
    }
  }

  async deleteCategory(id: string): Promise<boolean> {
    try {
      const data = await api.post<SkillsResponse>({
        url: "admin/delete-skill-category",
        data: { id },
      });

      this.categoriesStore.setSkillCategories(data.skillCategories || []);
      return true;
    } catch (error) {
      console.error("Error deleting category:", error);
      const toast = await this.toastController.presentToast({
        message: "Error al eliminar la categoría",
        duration: 2000,
        color: "danger",
      });
      await toast.present();
      return false;
    }
  }

  async updateCategory(id: string, category: SkillCategory): Promise<boolean> {
    try {
      this.categoriesStore.setSaving(true);

      const formData = new FormData();
      formData.append("id", id);
      formData.append("skillCategory", JSON.stringify(category));

      const data = await api.post<SkillsResponse>({
        url: "admin/update-skill-category",
        data: formData,
        contentType: "multipart/form-data",
      });

      this.categoriesStore.setSkillCategories(data.skillCategories || []);
      this.categoriesStore.setSaving(false);
      return true;
    } catch (error) {
      this.categoriesStore.setSaving(false);
      console.error("Error updating category:", error);
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