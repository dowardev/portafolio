<script lang="ts">
import { Storage } from "@ionic/storage";
const storage = new Storage();
storage.create();
import { toastController } from "@ionic/vue";

export default function () {
  async function getTheme() {
    const darkMode = await storage.get("darkMode");
    if (darkMode != null) {
      return darkMode;
    } else {
      return null;
    }
  }
  async function saveTheme(status: boolean | null) {
    await storage.set("darkMode", status);
  }
  async function setTheme(darkMode: boolean | null) {
    if (darkMode != null) {
      if (darkMode) {
        document.documentElement.setAttribute("data-theme", "dark");
        saveTheme(true);
      } else {
        saveTheme(false);
        document.documentElement.setAttribute("data-theme", "light");
      }
    } else {
      const value = window.matchMedia("(prefers-color-scheme: dark)").matches;
      saveTheme(null);
      if (value) {
        document.documentElement.setAttribute("data-theme", "dark");
      } else {
        document.documentElement.setAttribute("data-theme", "light");
      }
    }
  }
  async function openToast(message: string, color: string) {
    const toast = await toastController.create({
      message,
      duration: 2000,
      color,
      position: "bottom",
    });
    return toast.present();
  }
  function detectToggleTheme() {
    window.matchMedia("(prefers-color-scheme: dark)").addListener((e) => {
      if (e.matches) {
        setTheme(true);
        saveTheme(true);
      } else {
        saveTheme(false);
        setTheme(false);
      }
    });
  }
  return {
    getTheme,
    setTheme,
    openToast,
    detectToggleTheme,
  };
}
</script>
