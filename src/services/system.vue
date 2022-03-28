<script lang="ts">
import { Storage } from "@ionic/storage";
const storage = new Storage();
storage.create();
import { toastController, loadingController } from "@ionic/vue";
import systemService from "./system.vue";

interface Toast {
  message: string;
  color: string;
  position?: "top" | "bottom" | "middle";
  duration?: number;
}

export default function () {
  async function getTheme() {
    return await storage.get("darkMode");
  }
  async function setTheme(darkMode: boolean | null) {
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
  async function saveTheme(status: boolean | null) {
    await storage.set("darkMode", status);
  }
  async function detectToggleTheme() {
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
  }: Toast) {
    const toast = await toastController.create({
      message,
      duration,
      color,
      position,
    });
    return toast.present();
  }

  function getBaseURL() {
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
  return {
    getTheme,
    setTheme,
    openToast,
    detectToggleTheme,
    getBaseURL,
    presentLoading,
  };
}
</script>
