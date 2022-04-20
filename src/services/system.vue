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

interface Toast {
  message: string;
  color: string;
  position?: "top" | "bottom" | "middle";
  duration?: number;
}

export default function () {
  async function getTheme(): Promise<boolean | null> {
    return await storage.get("darkMode");
  }

  async function setTheme(darkMode: boolean | null): Promise<void> {
    if (darkMode) {
      document.getElementsByTagName("body")[0].classList.add("dark");
    }
    if (darkMode == false) {
      document.getElementsByTagName("body")[0].classList.remove("dark");
    }
    if (darkMode == null) {
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        document.getElementsByTagName("body")[0].classList.add("dark");
      }
      if (window.matchMedia("(prefers-color-scheme: dark)").matches == false) {
        document.getElementsByTagName("body")[0].classList.remove("dark");
      }
    }
    saveTheme(darkMode);
  }

  async function saveTheme(status: boolean | null): Promise<void> {
    await storage.set("darkMode", status);
  }

  async function detectToggleTheme(): Promise<void> {
    window.matchMedia("(prefers-color-scheme: dark)").addListener(async (e) => {
      const darkMode = await systemService().getTheme();
      if (darkMode == null) {
        if (e.matches) {
          setTheme(true);
          saveTheme(null);
        } else {
          saveTheme(false);
          setTheme(null);
        }
      }
    });
  }

  async function openToast({
    message,
    color,
    position = "bottom",
    duration = 2000,
  }: Toast): Promise<void> {
    const toast = await toastController.create({
      message,
      duration,
      color,
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
  async function presentLoading(message: string) {
    const loading = await loadingController.create({
      cssClass: "my-custom-class",
      message,
    });
    return loading;
  }

  async function getImageAPI(): Promise<object> {
    return axios.get("http://127.0.0.1:8000/api/get-image", {
      params: {
        name: "624bb168328e71649127784.webp",
      },
      headers: {
        Accept: "application/json",
      },
    });
  }

  async function presentAlertConfirmation(data: {
    message: string;
  }): Promise<boolean> {
    const alert = await alertController.create({
      cssClass: "my-custom-class",
      header: "Confirmacion",
      message: data.message,
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
    if (role == "confirm") {
      return true;
    } else {
      return false;
    }
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
  };
}
</script>
