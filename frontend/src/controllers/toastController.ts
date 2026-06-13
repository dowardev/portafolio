import { toastController } from "@ionic/vue";

// controllers
import ErrorController from "./errorController";

// interface
import { Toast } from "@/utils/interfaces";

export class ToastController {
  private errorController = new ErrorController();

  async presentToast(params: Toast): Promise<HTMLIonToastElement> {
    try {
      const { message, color = "dark", buttons = [], duration = 2000 } = params;
      return await toastController.create({
        message,
        position: "bottom",
        color,
        duration,
        buttons,
      });
    } catch (error) {
      throw this.errorController.getError({ error });
    }
  }
}
