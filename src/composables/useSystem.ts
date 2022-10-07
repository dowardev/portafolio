import { modalController, toastController } from "@ionic/vue";
import { alertCircleOutline, closeOutline } from "ionicons/icons";
import { storeToRefs } from "pinia";
import FeedbackPage from "../components/feedback/FeedbackPage.vue";
import { ReportError } from "../services/interfaces";
import { useSystemStore } from "../store/systemStore";

export const useSystem = () => {
  const systemStore = useSystemStore();
  const systemRefs = storeToRefs(systemStore);

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

  function changeMenuCollapse(params: { option: boolean }) {
    const option = params.option;
    useSystemStore().changeMenuCollapse({ option });
  }

  function detectMenuCollapse() {
    return systemRefs.menuCollapse;
  }

  return {
    reportError,
    openToastError,
    changeMenuCollapse,
    detectMenuCollapse,
  };
};
