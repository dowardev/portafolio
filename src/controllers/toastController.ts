import { toastController } from "@ionic/vue";

// controllers
import ErrorController from "./errorController";

// interface
import { Toast } from "@/services/interfaces";

export class ToastController {
  private errorController = new ErrorController();

  async presentToast(params: Toast): Promise<HTMLIonToastElement> {
    try {
      const { message, color = "dark", buttons = [] } = params;
      return await toastController.create({
        message,
        position: "bottom",
        color,
        buttons,
      });
    } catch (error) {
      throw this.errorController.getError({ error });
    }
  }
}
