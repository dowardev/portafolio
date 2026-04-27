import { useCategoriesStore } from "@/store/categoriesStore";
import type { CategoryItem } from "@/store/categoriesStore";
import { ToastController } from "./toastController";
import APIController from "./APIController";
import ServerConfig from "./serverConfigController";
import Cookies from "js-cookie";
import { storeToRefs } from "pinia";

const userToken = Cookies.get("user-token");
const config = new ServerConfig({
  baseUrl: import.meta.env.VITE_API_URL,
  accessToken: userToken ?? "",
});
const api = new APIController(config);

interface CategoriesResponse {
  categories: CategoryItem[];
}

interface CategoryResponse {
  category: CategoryItem;
}

export default class CategoriesController {
  categoriesStore = useCategoriesStore();
  private toastController = new ToastController();

  async loadCategories(): Promise<CategoryItem[]> {
    if (this.categoriesStore.loaded && this.categoriesStore.categories.length > 0) {
      return this.categoriesStore.categories;
    }
    this.categoriesStore.setLoading(true);
    try {
      const data = await api.get<CategoriesResponse>({ url: "categories" });
      this.categoriesStore.setCategories(data.categories || []);
      return data.categories || [];
    } catch (error) {
      console.error("Error loading categories:", error);
      this.categoriesStore.setCategories([]);
      return [];
    } finally {
      this.categoriesStore.setLoading(false);
    }
  }

  async reloadCategories(): Promise<CategoryItem[]> {
    this.categoriesStore.setLoading(true);
    this.categoriesStore.resetCategories();
    try {
      const data = await api.get<CategoriesResponse>({ url: "categories" });
      this.categoriesStore.setCategories(data.categories || []);
      return data.categories || [];
    } catch (error) {
      console.error("Error reloading categories:", error);
      this.categoriesStore.setCategories([]);
      return [];
    } finally {
      this.categoriesStore.setLoading(false);
    }
  }

  getCategories(): CategoryItem[] {
    return this.categoriesStore.categories;
  }

  getCategory(index: number): CategoryItem | undefined {
    return this.categoriesStore.getCategories()[index];
  }

  async addCategory(category: CategoryItem): Promise<boolean> {
    try {
      const formData = new FormData();
      formData.append("name", category.name);
      if (category.sort_order !== undefined) {
        formData.append("sort_order", String(category.sort_order));
      }
      if (category.technologies) {
        formData.append("technologies", JSON.stringify(category.technologies));
      }

      await api.post<CategoryResponse>({
        url: "admin/categories",
        data: formData,
        contentType: "multipart/form-data",
      });

      await this.loadCategories();

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

  async deleteCategory(id: number): Promise<boolean> {
    try {
      await api.delete({
        url: `admin/categories/${id}`,
      });

      await this.loadCategories();

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

  async updateCategory(id: number, category: CategoryItem): Promise<boolean> {
    try {
      const formData = new FormData();
      formData.append("name", category.name);
      if (category.sort_order !== undefined) {
        formData.append("sort_order", String(category.sort_order));
      }
      if (category.technologies) {
        formData.append("technologies", JSON.stringify(category.technologies));
      }

      await api.post<CategoryResponse>({
        url: `admin/categories/${id}`,
        data: formData,
        contentType: "multipart/form-data",
      });

      await this.loadCategories();

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

  get categories() {
    return storeToRefs(this.categoriesStore).categories;
  }

  get categoriesLoading() {
    return storeToRefs(this.categoriesStore).loading;
  }
}