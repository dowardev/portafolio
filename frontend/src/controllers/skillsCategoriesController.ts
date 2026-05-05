import { useSkillsCategoriesStore } from "@/store/skillsCategoriesStore";
import type { SkillsCategoryItem } from "@/store/skillsCategoriesStore";
import { storeToRefs } from "pinia";
import { ToastController } from "./toastController";
import { getApiConnector } from "@/apiConnector";
import type { HttpClient } from "@tu-org/sso-client";

interface SkillsCategoriesResponse {
  skillsCategories: SkillsCategoryItem[];
}

interface SkillsCategoryResponse {
  skillsCategory: SkillsCategoryItem;
}

export default class SkillsCategoriesController {
  skillsCategoriesStore = useSkillsCategoriesStore();
  private toastController = new ToastController();

  async loadSkillsCategories(): Promise<SkillsCategoryItem[]> {
    if (this.skillsCategoriesStore.loaded && this.skillsCategoriesStore.skillsCategories.length > 0) {
      return this.skillsCategoriesStore.skillsCategories;
    }
    this.skillsCategoriesStore.setLoading(true);
    try {
      const data = await getApiConnector().get<SkillsCategoriesResponse>("skills-categories");
      this.skillsCategoriesStore.setSkillsCategories(data.skillsCategories || []);
      return data.skillsCategories || [];
    } catch (error) {
      console.error("Error loading skills categories:", error);
      this.skillsCategoriesStore.setSkillsCategories([]);
      return [];
    } finally {
      this.skillsCategoriesStore.setLoading(false);
    }
  }

  async reloadSkillsCategories(): Promise<SkillsCategoryItem[]> {
    this.skillsCategoriesStore.setLoading(true);
    this.skillsCategoriesStore.resetSkillsCategories();
    try {
      const data = await getApiConnector().get<SkillsCategoriesResponse>("skills-categories");
      this.skillsCategoriesStore.setSkillsCategories(data.skillsCategories || []);
      return data.skillsCategories || [];
    } catch (error) {
      console.error("Error reloading skills categories:", error);
      this.skillsCategoriesStore.setSkillsCategories([]);
      return [];
    } finally {
      this.skillsCategoriesStore.setLoading(false);
    }
  }

  getSkillsCategories(): SkillsCategoryItem[] {
    return this.skillsCategoriesStore.skillsCategories;
  }

  getSkillsCategory(index: number): SkillsCategoryItem | undefined {
    return this.skillsCategoriesStore.getSkillsCategories()[index];
  }

  async addSkillsCategory(skillsCategory: SkillsCategoryItem): Promise<boolean> {
    try {
      const formData = new FormData();
      formData.append("name", skillsCategory.name);
      if (skillsCategory.sort_order !== undefined) {
        formData.append("sort_order", String(skillsCategory.sort_order));
      }
      if (skillsCategory.technologies) {
        formData.append("technologies", JSON.stringify(skillsCategory.technologies));
      }

      await getApiConnector().post<SkillsCategoryResponse>(
        "admin/skills-categories",
        formData,
      );

      await this.loadSkillsCategories();

      const toast = await this.toastController.presentToast({
        message: "Categoría de skills agregada correctamente",
        duration: 2000,
        color: "success",
      });
      await toast.present();
      return true;
    } catch (error) {
      console.error("Error adding skills category:", error);
      const toast = await this.toastController.presentToast({
        message: "Error al agregar la categoría de skills",
        duration: 2000,
        color: "danger",
      });
      await toast.present();
      return false;
    }
  }

async deleteSkillsCategory(id: number): Promise<boolean> {
try {
      await getApiConnector().delete(`admin/skills-categories/${id}`);

await this.reloadSkillsCategories();

      const toast = await this.toastController.presentToast({
        message: "Categoría de skills eliminada correctamente",
        duration: 2000,
        color: "success",
      });
      await toast.present();
      return true;
    } catch (error) {
      console.error("Error deleting skills category:", error);
      const toast = await this.toastController.presentToast({
        message: "Error al eliminar la categoría de skills",
        duration: 2000,
        color: "danger",
      });
      await toast.present();
      return false;
    }
  }

  async updateSkillsCategory(id: number, skillsCategory: SkillsCategoryItem): Promise<boolean> {
    try {
      const formData = new FormData();
      formData.append("name", skillsCategory.name);
      if (skillsCategory.sort_order !== undefined) {
        formData.append("sort_order", String(skillsCategory.sort_order));
      }
      if (skillsCategory.technologies) {
        formData.append("technologies", JSON.stringify(skillsCategory.technologies));
      }

      await getApiConnector().post<SkillsCategoryResponse>(
        `admin/skills-categories/${id}`,
        formData,
      );

      await this.loadSkillsCategories();

      const toast = await this.toastController.presentToast({
        message: "Categoría de skills actualizada correctamente",
        duration: 2000,
        color: "success",
      });
      await toast.present();
      return true;
    } catch (error) {
      console.error("Error updating skills category:", error);
      const toast = await this.toastController.presentToast({
        message: "Error al actualizar la categoría de skills",
        duration: 2000,
        color: "danger",
      });
      await toast.present();
      return false;
    }
  }

  get skillsCategories() {
    return storeToRefs(this.skillsCategoriesStore).skillsCategories;
  }

  get skillsCategoriesLoading() {
    return storeToRefs(this.skillsCategoriesStore).loading;
  }
}