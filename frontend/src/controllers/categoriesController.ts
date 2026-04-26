import { useCategoriesStore } from "@/store/categoriesStore";
import { storeToRefs } from "pinia";
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

const categoriesStore = useCategoriesStore();

interface SkillsResponse {
  skillCategories: SkillCategory[];
}

export default class CategoriesController {
  private categoriesStore = categoriesStore;
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
      const formData = new FormData();
      formData.append("skillCategory", JSON.stringify(category));

      await api.post<SkillsResponse>({
        url: "admin/add-skill-category",
        data: formData,
        contentType: "multipart/form-data",
      });

      this.categoriesStore.addSkillCategory(category);
      this.categoriesStore.setSkillCategories([...this.categoriesStore.skillCategories]);

      const toast = await this.toastController.presentToast({
        message: "Categoría agregada correctamente",
        duration: 2000,
        color: "success",
      });
      await toast.present();
      return true;
    } catch (error) {
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
      const index = this.categoriesStore.skillCategories.findIndex(
        (c) => c.id === id
      );
      if (index === -1) return false;

      await api.post<SkillsResponse>({
        url: "admin/delete-skill-category",
        data: { id },
      });

      this.categoriesStore.deleteSkillCategory(index);
      this.categoriesStore.setSkillCategories([...this.categoriesStore.skillCategories]);

      const toast = await this.toastController.presentToast({
        message: "Categoría eliminada correctamente",
        duration: 2000,
        color: "success",
      });
      await toast.present();
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
      const index = this.categoriesStore.skillCategories.findIndex((c) => c.id === id);
      if (index === -1) return false;

      const formData = new FormData();
      formData.append("id", id);
      formData.append("skillCategory", JSON.stringify(category));

      await api.post<SkillsResponse>({
        url: "admin/update-skill-category",
        data: formData,
        contentType: "multipart/form-data",
      });

      this.categoriesStore.updateSkillCategory(index, category);
      this.categoriesStore.setSkillCategories([...this.categoriesStore.skillCategories]);

      const toast = await this.toastController.presentToast({
        message: "Categoría actualizada correctamente",
        duration: 2000,
        color: "success",
      });
      await toast.present();
      return true;
    } catch (error) {
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

export const { skillCategories } = storeToRefs(categoriesStore);
export const { loading: categoriesLoading } = storeToRefs(categoriesStore);