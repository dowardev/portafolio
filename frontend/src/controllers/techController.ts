import { useTechStore } from "@/store/techStore";
import type { TechItem } from "@/services/types";
import { storeToRefs } from "pinia";
import { ToastController } from "./toastController";
import { getApiConnector } from "@/apiConnector";

interface TechsResponse {
  techs: TechItem[];
}

interface TechResponse {
  tech: TechItem;
}

export default class TechController {
  private techStore = useTechStore();
  private toastController = new ToastController();

  async loadTechs(): Promise<TechItem[]> {
    if (this.techStore.loaded && this.techStore.techs.length > 0) {
      return this.techStore.techs;
    }
    this.techStore.setLoading(true);
    try {
      const data = await getApiConnector().get<TechsResponse>("techs");
      this.techStore.setTechs(data.techs || []);
      return data.techs || [];
    } catch (error) {
      console.error("Error loading techs:", error);
      this.techStore.setTechs([]);
      return [];
    } finally {
      this.techStore.setLoading(false);
    }
  }

  async reloadTechs(): Promise<TechItem[]> {
    this.techStore.setLoading(true);
    this.techStore.resetTechs();
    try {
      const data = await getApiConnector().get<TechsResponse>("techs");
      this.techStore.setTechs(data.techs || []);
      return data.techs || [];
    } catch (error) {
      console.error("Error reloading techs:", error);
      this.techStore.setTechs([]);
      return [];
    } finally {
      this.techStore.setLoading(false);
    }
  }

  getTechs(): TechItem[] {
    return this.techStore.techs;
  }

  async addTech(tech: TechItem): Promise<boolean> {
    const ok = await this.addTechSave(tech);
    if (ok) {
      await this.reloadTechs();
      const toast = await this.toastController.presentToast({
        message: "Tecnología agregada correctamente",
        duration: 2000,
        color: "success",
      });
      await toast.present();
    } else {
      const toast = await this.toastController.presentToast({
        message: "Error al agregar la tecnología",
        duration: 2000,
        color: "danger",
      });
      await toast.present();
    }
    return ok;
  }

  async addTechSave(tech: TechItem): Promise<boolean> {
    try {
      const payload: Record<string, unknown> = {
        name: tech.name,
        icon_name: tech.iconName || null,
      };
      if (tech.sort_order !== undefined) {
        payload.sort_order = tech.sort_order;
      }
      if (tech.stackId !== undefined) {
        payload.stack_id = tech.stackId;
      }

      await getApiConnector().post<TechResponse>("admin/techs", payload);
      return true;
    } catch (error) {
      console.error("Error adding tech:", error);
      return false;
    }
  }

  async createTech(params: { tech: TechItem }): Promise<TechItem | null> {
    const { tech } = params;
    try {
      const payload: Record<string, unknown> = {
        name: tech.name,
        icon_name: tech.iconName || null,
      };
      if (tech.sort_order !== undefined) {
        payload.sort_order = tech.sort_order;
      }
      if (tech.stackId !== undefined) {
        payload.stack_id = tech.stackId;
      }
      const response = await getApiConnector().post<TechResponse>("admin/techs", payload);
      return response.tech;
    } catch (error) {
      console.error("Error creating tech:", error);
      return null;
    }
  }

  async deleteTech(id: number): Promise<boolean> {
    const ok = await this.deleteTechSave(id);
    if (ok) {
      await this.reloadTechs();
      const toast = await this.toastController.presentToast({
        message: "Tecnología eliminada correctamente",
        duration: 2000,
        color: "success",
      });
      await toast.present();
    } else {
      const toast = await this.toastController.presentToast({
        message: "Error al eliminar la tecnología",
        duration: 2000,
        color: "danger",
      });
      await toast.present();
    }
    return ok;
  }

  async deleteTechSave(id: number): Promise<boolean> {
    try {
      await getApiConnector().delete(`admin/techs/${id}`);
      return true;
    } catch (error) {
      console.error("Error deleting tech:", error);
      return false;
    }
  }

  async updateTech(id: number, tech: TechItem): Promise<boolean> {
    const ok = await this.updateTechSave(id, tech);
    if (ok) {
      await this.reloadTechs();
      const toast = await this.toastController.presentToast({
        message: "Tecnología actualizada correctamente",
        duration: 2000,
        color: "success",
      });
      await toast.present();
    } else {
      const toast = await this.toastController.presentToast({
        message: "Error al actualizar la tecnología",
        duration: 2000,
        color: "danger",
      });
      await toast.present();
    }
    return ok;
  }

  async updateTechSave(id: number, tech: TechItem): Promise<boolean> {
    try {
      const payload: Record<string, unknown> = {
        name: tech.name,
        icon_name: tech.iconName || null,
      };
      if (tech.sort_order !== undefined) {
        payload.sort_order = tech.sort_order;
      }
      if (tech.stackId !== undefined) {
        payload.stack_id = tech.stackId;
      }

      await getApiConnector().post<TechResponse>(`admin/techs/${id}`, payload);
      return true;
    } catch (error) {
      console.error("Error updating tech:", error);
      return false;
    }
  }

  get techs() {
    return storeToRefs(this.techStore).techs;
  }

  get techsLoading() {
    return storeToRefs(this.techStore).loading;
  }
}
