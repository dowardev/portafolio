import { useFreelanceCommentStore } from "@/store/freelanceCommentStore";
import { storeToRefs } from "pinia";
import type { FreelanceComment } from "@/services/types";
import { ToastController } from "./toastController";
import { getApiConnector } from "@/apiConnector";

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
      const data = await getApiConnector().get<FreelanceCommentsResponse>(
        "freelance-comments",
      );
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
      await getApiConnector().post<FreelanceCommentResponse>(
        "admin/freelance-comments",
        comment,
      );

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
      await getApiConnector().post<FreelanceCommentResponse>(
        `admin/freelance-comments/${id}`,
        comment,
      );

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
      await getApiConnector().delete(`admin/freelance-comments/${id}`);

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