import { useFreelanceCommentStore } from "@/store/freelanceCommentStore";
import { storeToRefs } from "pinia";
import APIController from "./APIController";
import ServerConfig from "./serverConfigController";
import Cookies from "js-cookie";
import type { FreelanceComment } from "@/services/types";
import { ToastController } from "./toastController";

const userToken = Cookies.get("user-token");
const config = new ServerConfig({
  baseUrl: import.meta.env.VITE_API_URL,
  accessToken: userToken ?? "",
});
const api = new APIController(config);

interface FreelanceCommentsResponse {
  freelanceComments: FreelanceComment[];
}

interface FreelanceCommentResponse {
  freelanceComment: FreelanceComment;
}

export default class FreelanceCommentController {
  private commentStore = useFreelanceCommentStore();
  private toastController = new ToastController();

  async loadFreelanceComments(): Promise<FreelanceComment[]> {
    this.commentStore.setLoading(true);
    try {
      const data = await api.get<FreelanceCommentsResponse>({
        url: "freelance-comments",
      });
      this.commentStore.setFreelanceComments(data.freelanceComments || []);
      return data.freelanceComments || [];
    } catch (error) {
      console.error("Error loading freelance comments:", error);
      this.commentStore.setFreelanceComments([]);
      return [];
    } finally {
      this.commentStore.setLoading(false);
    }
  }

  getFreelanceComments(): FreelanceComment[] {
    return this.commentStore.freelanceComments;
  }

  async addFreelanceComment(comment: FreelanceComment): Promise<boolean> {
    try {
      await api.post<FreelanceCommentResponse>({
        url: "admin/freelance-comments",
        data: comment,
      });

      await this.loadFreelanceComments();

      const toast = await this.toastController.presentToast({
        message: "Comentario agregado correctamente",
        duration: 2000,
        color: "success",
      });
      await toast.present();
      return true;
    } catch (error) {
      console.error("Error adding freelance comment:", error);
      const toast = await this.toastController.presentToast({
        message: "Error al agregar el comentario",
        duration: 2000,
        color: "danger",
      });
      await toast.present();
      return false;
    }
  }

  async updateFreelanceComment(id: number, comment: FreelanceComment): Promise<boolean> {
    try {
      await api.post<FreelanceCommentResponse>({
        url: `admin/freelance-comments/${id}`,
        data: comment,
      });

      await this.loadFreelanceComments();

      const toast = await this.toastController.presentToast({
        message: "Comentario actualizado correctamente",
        duration: 2000,
        color: "success",
      });
      await toast.present();
      return true;
    } catch (error) {
      console.error("Error updating freelance comment:", error);
      const toast = await this.toastController.presentToast({
        message: "Error al actualizar el comentario",
        duration: 2000,
        color: "danger",
      });
      await toast.present();
      return false;
    }
  }

  async deleteFreelanceComment(id: number): Promise<boolean> {
    try {
      await api.delete({
        url: `admin/freelance-comments/${id}`,
      });

      await this.loadFreelanceComments();

      const toast = await this.toastController.presentToast({
        message: "Comentario eliminado correctamente",
        duration: 2000,
        color: "success",
      });
      await toast.present();
      return true;
    } catch (error) {
      console.error("Error deleting freelance comment:", error);
      const toast = await this.toastController.presentToast({
        message: "Error al eliminar el comentario",
        duration: 2000,
        color: "danger",
      });
      await toast.present();
      return false;
    }
  }

  get freelanceComments() {
    return storeToRefs(this.commentStore).freelanceComments;
  }
}