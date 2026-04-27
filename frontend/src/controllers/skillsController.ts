import { useSkillsStore } from "@/store/skillsStore";
import APIController from "./APIController";
import ServerConfig from "./serverConfigController";
import Cookies from "js-cookie";
import { ToastController } from "./toastController";
import type { SkillItem } from "@/store/skillsStore";

const userToken = Cookies.get("user-token");
const config = new ServerConfig({
  baseUrl: import.meta.env.VITE_API_URL,
  accessToken: userToken ?? "",
});
const api = new APIController(config);

interface SkillsResponse {
  skills: SkillItem[];
}

interface SkillResponse {
  skill: SkillItem;
}

export default class SkillsController {
  private skillsStore = useSkillsStore();
  private toastController = new ToastController();

  async loadSkills(): Promise<SkillItem[]> {
    if (this.skillsStore.loaded && this.skillsStore.skills.length > 0) {
      return this.skillsStore.skills;
    }
    this.skillsStore.setLoading(true);
    try {
      const data = await api.get<SkillsResponse>({ url: "skills" });
      this.skillsStore.setSkills(data.skills || []);
      return data.skills || [];
    } catch (error) {
      console.error("Error loading skills:", error);
      this.skillsStore.setSkills([]);
      return [];
    } finally {
      this.skillsStore.setLoading(false);
    }
  }

  getSkills(): SkillItem[] {
    return this.skillsStore.skills;
  }

  async addSkill(skill: SkillItem, imageFile?: File | null): Promise<boolean> {
    try {
      const formData = new FormData();
      formData.append("name", skill.name);
      formData.append("category", skill.category);
      if (skill.sort_order !== undefined) {
        formData.append("sort_order", String(skill.sort_order));
      }

      if (imageFile) {
        formData.append("image", imageFile, "skill.png");
      }

      await api.post<SkillResponse>({
        url: "admin/skills",
        data: formData,
        contentType: "multipart/form-data",
      });

      await this.loadSkills();

      const toast = await this.toastController.presentToast({
        message: "Skill agregado correctamente",
        duration: 2000,
        color: "success",
      });
      await toast.present();
      return true;
    } catch (error) {
      console.error("Error adding skill:", error);
      const toast = await this.toastController.presentToast({
        message: "Error al agregar el skill",
        duration: 2000,
        color: "danger",
      });
      await toast.present();
      return false;
    }
  }

  async deleteSkill(id: number): Promise<boolean> {
    try {
      await api.delete({
        url: `admin/skills/${id}`,
      });

      await this.loadSkills();

      const toast = await this.toastController.presentToast({
        message: "Skill eliminado correctamente",
        duration: 2000,
        color: "success",
      });
      await toast.present();
      return true;
    } catch (error) {
      console.error("Error deleting skill:", error);
      const toast = await this.toastController.presentToast({
        message: "Error al eliminar el skill",
        duration: 2000,
        color: "danger",
      });
      await toast.present();
      return false;
    }
  }

  async updateSkill(id: number, skill: SkillItem, imageFile?: File | null): Promise<boolean> {
    try {
      const formData = new FormData();
      formData.append("name", skill.name);
      formData.append("category", skill.category);
      if (skill.sort_order !== undefined) {
        formData.append("sort_order", String(skill.sort_order));
      }

      if (imageFile) {
        formData.append("image", imageFile, "skill.png");
      }

      await api.post<SkillResponse>({
        url: `admin/skills/${id}`,
        data: formData,
        contentType: "multipart/form-data",
      });

      await this.loadSkills();

      const toast = await this.toastController.presentToast({
        message: "Skill actualizado correctamente",
        duration: 2000,
        color: "success",
      });
      await toast.present();
      return true;
    } catch (error) {
      console.error("Error updating skill:", error);
      const toast = await this.toastController.presentToast({
        message: "Error al actualizar el skill",
        duration: 2000,
        color: "danger",
      });
      await toast.present();
      return false;
    }
  }
}