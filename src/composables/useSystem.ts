import { modalController, toastController } from "@ionic/vue";
import { alertCircleOutline, closeOutline } from "ionicons/icons";
import FeedbackPage from "../components/feedback/FeedbackPage.vue";
import { ReportError } from "../services/interfaces";

export const useSystem = () => {
  async function reportError(params: ReportError) {
    const type = params.type;
    const error = params.error;

    const modal = await modalController.create({
      component: FeedbackPage,
      componentProps: {
        dataProp: { type, error },
      },
    });
    await modal.present();
  }

  async function openToastError(error: object) {
    const toast = await toastController.create({
      header: "Ocurrio un error",
      message: "¿Quieres reportar el error?",
      icon: alertCircleOutline,
      position: "bottom",
      color: "danger",
      buttons: [
        {
          text: "Reportar",
          handler: () => {
            reportError({ error, type: "error" });
          },
        },
        {
          icon: closeOutline,
          role: "cancel",
          handler: () => {
            // console.log("Cancel clicked");
          },
        },
      ],
    });
    await toast.present();
  }

  return {
    reportError,
    openToastError,
  };
};
