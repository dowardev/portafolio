<script lang="ts">
import { Storage } from "@ionic/storage";
const storage = new Storage();
storage.create();
import {
  toastController,
  loadingController,
  alertController,
} from "@ionic/vue";
import systemService from "./system.vue";
import axios from "axios";
import {
  AlertConfirmation,
  Loading,
  ModalFeedback,
  Theme,
  Toast,
} from "./interfaces.vue";
import { alertCircleOutline, closeOutline } from "ionicons/icons";
import FeedbackPage from "../components/feedback/FeedbackPage.vue";
import { modalController } from "@ionic/vue";

export default function () {
  async function getTheme(): Promise<boolean | null> {
    return await storage.get("darkMode");
  }

  async function setTheme({ status }: Theme): Promise<void> {
    if (status) {
      document.getElementsByTagName("body")[0].classList.add("dark");
    }
    if (status == false) {
      document.getElementsByTagName("body")[0].classList.remove("dark");
    }
    if (status == null) {
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        document.getElementsByTagName("body")[0].classList.add("dark");
      }
      if (window.matchMedia("(prefers-color-scheme: dark)").matches == false) {
        document.getElementsByTagName("body")[0].classList.remove("dark");
      }
    }
    saveTheme({ status });
  }

  async function saveTheme({ status }: Theme): Promise<void> {
    await storage.set("darkMode", status);
  }

  async function detectToggleTheme(): Promise<void> {
    window.matchMedia("(prefers-color-scheme: dark)").addListener(async (e) => {
      const darkMode = await systemService().getTheme();
      if (darkMode == null) {
        if (e.matches) {
          setTheme({ status: true });
          saveTheme({ status: null });
        } else {
          saveTheme({ status: false });
          setTheme({ status: null });
        }
      }
    });
  }

  async function openToast(params: Toast): Promise<void> {
    const duration = params.duration == undefined ? 2000 : params.duration;
    const position = params.position == undefined ? "bottom" : params.position;

    const toast = await toastController.create({
      message: params.message,
      duration,
      color: params.color,
      position,
    });
    return toast.present();
  }

  function getBaseURL(): string {
    const mode = process.env.NODE_ENV;
    if (mode == "development") {
      return "http://localhost:8000/";
    } else {
      return "https://dowar.xyz/blog/";
    }
  }
  async function presentLoading(params: Loading) {
    const loading = await loadingController.create({
      cssClass: "my-custom-class",
      message: params.message,
    });
    return loading;
  }

  async function getImageAPI(): Promise<object> {
    try {
      return await axios.get("http://127.0.0.1:8000/api/get-image", {
        params: {
          name: "624bb168328e71649127784.webp",
        },
        headers: {
          Accept: "application/json",
        },
      });
    } catch (e: any) {
      if (e.graphQLErrors) throw new Error(e.graphQLErrors[0].debugMessage);
      throw new Error(e.message);
    }
  }

  async function presentAlertConfirmation(
    params: AlertConfirmation
  ): Promise<boolean> {
    const alert = await alertController.create({
      cssClass: "my-custom-class",
      header: "Confirmacion",
      message: params.message,
      buttons: [
        {
          text: "Cancelar",
          role: "cancel",
          cssClass: "secondary",
          id: "cancel-button",
        },
        {
          text: "Confirmar",
          id: "confirm-button",
          role: "confirm",
        },
      ],
    });
    await alert.present();

    const { role } = await alert.onDidDismiss();
    return role == "confirm" ? true : false;
  }

  async function openToastErrror(error: object) {
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
            openModalFeedback({ error, type: "error" });
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

  async function openModalFeedback(data: ModalFeedback) {
    const modal = await modalController.create({
      component: FeedbackPage,
      // cssClass: "my-custom-class",
      componentProps: {
        dataProp: data,
      },
    });
    await modal.present();
  }

  return {
    getTheme,
    setTheme,
    openToast,
    detectToggleTheme,
    getBaseURL,
    presentLoading,
    getImageAPI,
    presentAlertConfirmation,
    openToastErrror,
    openModalFeedback,
  };
}
</script>
