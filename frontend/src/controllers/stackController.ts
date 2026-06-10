import { useStackStore } from "@/store/stackStore";
import { storeToRefs } from "pinia";
import { ToastController } from "./toastController";
import { getApiConnector } from "@/apiConnector";
import type { StackItem } from "@/services/types";

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
    if (this.stackStore.stack.length > 0) {
      return this.stackStore.stack;
    }
    this.stackStore.setLoading(true);
    try {
      const data = await getApiConnector().get<StacksResponse>("stacks");
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

  async reloadStack(): Promise<StackItem[]> {
    this.stackStore.setStack([]);
    this.stackStore.setLoading(true);
    try {
      const data = await getApiConnector().get<StacksResponse>("stacks");
      this.stackStore.setStack(data.stacks || []);
      return data.stacks || [];
    } catch (error) {
      console.error("Error reloading stack:", error);
      this.stackStore.setStack([]);
      return [];
    } finally {
      this.stackStore.setLoading(false);
    }
  }

  async getStack(params: { id: string }): Promise<StackItem | null> {
    const { id } = params;
    try {
      const data = await getApiConnector().get<StackResponse>(`stacks/${id}`);
      return data.stack;
    } catch (error) {
      console.error("Error loading stack:", error);
      return null;
    }
  }

  get stack() {
    return storeToRefs(this.stackStore).stack;
  }

  async addStack(stack: StackItem): Promise<boolean> {
    try {
      const payload: Record<string, unknown> = {
        name: stack.name,
        icon_name: stack.iconName || null,
      };

      await getApiConnector().post<StackResponse>("admin/stacks", payload);

      await this.reloadStack();

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

  async createStack(stack: StackItem): Promise<StackItem | null> {
    try {
      const payload: Record<string, unknown> = {
        name: stack.name,
        icon_name: stack.iconName || null,
      };
      const response = await getApiConnector().post<StackResponse>("admin/stacks", payload);
      await this.reloadStack();
      return response.stack;
    } catch (error) {
      console.error("Error creating stack:", error);
      return null;
    }
  }

  async deleteStack(id: string): Promise<boolean> {
    try {
      await getApiConnector().delete(`admin/stacks/${id}`);

      await this.reloadStack();

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

  async updateStackSave(params: { id: string; stack: StackItem }): Promise<boolean> {
    const { id, stack } = params;
    try {
      const payload: Record<string, unknown> = {
        name: stack.name,
        icon_name: stack.iconName || null,
      };
      await getApiConnector().post<StackResponse>(`admin/stacks/${id}`, payload);
      return true;
    } catch (error) {
      console.error("Error updating stack:", error);
      return false;
    }
  }

  async updateStack(id: string, stack: StackItem): Promise<boolean> {
    try {
      const payload: Record<string, unknown> = {
        name: stack.name,
        icon_name: stack.iconName || null,
      };

      await getApiConnector().post<StackResponse>(`admin/stacks/${id}`, payload);

      await this.reloadStack();

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
