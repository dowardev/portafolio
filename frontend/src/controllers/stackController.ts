import { useStackStore } from "@/store/stackStore";
import APIController from "./APIController";
import ServerConfig from "./serverConfigController";
import Cookies from "js-cookie";
import { ToastController } from "./toastController";

const userToken = Cookies.get("user-token");
const config = new ServerConfig({
  baseUrl: import.meta.env.VITE_API_URL,
  accessToken: userToken ?? "",
});
const api = new APIController(config);

export interface StackItem {
  id?: number;
  name: string;
  img?: string;
  sort_order?: number;
}

interface StacksResponse {
  stacks: StackItem[];
}

interface StackResponse {
  stack: StackItem;
}

export default class StackController {
  private stackStore = useStackStore();
  private toastController = new ToastController();

  async loadStack(): Promise<StackItem[]> {
    if (this.stackStore.loaded && this.stackStore.stack.length > 0) {
      return this.stackStore.stack;
    }
    this.stackStore.setLoading(true);
    try {
      const data = await api.get<StacksResponse>({ url: "stacks" });
      this.stackStore.setStack(data.stacks || []);
      return data.stacks || [];
    } catch (error) {
      console.error("Error loading stack:", error);
      this.stackStore.setStack([]);
      return [];
    } finally {
      this.stackStore.setLoading(false);
    }
  }

  getStack(): StackItem[] {
    return this.stackStore.stack;
  }

  async addStack(stack: StackItem, imageFile?: File | null): Promise<boolean> {
    try {
      const formData = new FormData();
      formData.append("name", stack.name);
      if (stack.sort_order !== undefined) {
        formData.append("sort_order", String(stack.sort_order));
      }

      if (imageFile) {
        formData.append("image", imageFile, "stack.png");
      }

      await api.post<StackResponse>({
        url: "admin/stacks",
        data: formData,
        contentType: "multipart/form-data",
      });

      await this.loadStack();

      const toast = await this.toastController.presentToast({
        message: "Stack agregado correctamente",
        duration: 2000,
        color: "success",
      });
      await toast.present();
      return true;
    } catch (error) {
      console.error("Error adding stack:", error);
      const toast = await this.toastController.presentToast({
        message: "Error al agregar el stack",
        duration: 2000,
        color: "danger",
      });
      await toast.present();
      return false;
    }
  }

  async deleteStack(id: number): Promise<boolean> {
    try {
      await api.delete({
        url: `admin/stacks/${id}`,
      });

      await this.loadStack();

      const toast = await this.toastController.presentToast({
        message: "Stack eliminado correctamente",
        duration: 2000,
        color: "success",
      });
      await toast.present();
      return true;
    } catch (error) {
      console.error("Error deleting stack:", error);
      const toast = await this.toastController.presentToast({
        message: "Error al eliminar el stack",
        duration: 2000,
        color: "danger",
      });
      await toast.present();
      return false;
    }
  }

  async updateStack(id: number, stack: StackItem, imageFile?: File | null): Promise<boolean> {
    try {
      const formData = new FormData();
      formData.append("name", stack.name);
      if (stack.sort_order !== undefined) {
        formData.append("sort_order", String(stack.sort_order));
      }

      if (imageFile) {
        formData.append("image", imageFile, "stack.png");
      }

      await api.post<StackResponse>({
        url: `admin/stacks/${id}`,
        data: formData,
        contentType: "multipart/form-data",
      });

      await this.loadStack();

      const toast = await this.toastController.presentToast({
        message: "Stack actualizado correctamente",
        duration: 2000,
        color: "success",
      });
      await toast.present();
      return true;
    } catch (error) {
      console.error("Error updating stack:", error);
      const toast = await this.toastController.presentToast({
        message: "Error al actualizar el stack",
        duration: 2000,
        color: "danger",
      });
      await toast.present();
      return false;
    }
  }
}