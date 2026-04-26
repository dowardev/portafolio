import { useIntroStore } from "@/store/introStore";
import { useStackStore } from "@/store/stackStore";
import APIController from "./APIController";
import ServerConfig from "./serverConfigController";
import Cookies from "js-cookie";
import { ToastController } from "./toastController";

const userToken = Cookies.get("user-token");
const config = new ServerConfig({
  baseUrl: import.meta.env.VITE_API_URL,
  accessToken: userToken ?? "",
});
const api = new APIController(config);

export interface IntroData {
  name: string | null;
  tags: string[];
  description: string | null;
  socials: Array<{ platform: string; url: string; iconName: string }>;
  logoUrl: string | null;
  photoUrl: string | null;
  stack: Array<{ name: string; image: string }>;
  showContactForm: {
    socials: boolean;
    freelance: boolean;
  };
}

export default class IntroController {
  private introStore = useIntroStore();
  private stackStore = useStackStore();
  private toastController = new ToastController();

  async loadIntro(): Promise<IntroData> {
    this.introStore.setLoading(true);
    try {
      const data = await api.get<IntroData>({ url: "get-intro" });
      this.introStore.setData(data);
      this.stackStore.setStack(data.stack || []);
      return data;
    } catch (error) {
      console.error("Error loading intro:", error);
      return {
        name: null,
        tags: [],
        description: null,
        socials: [],
        logoUrl: null,
        photoUrl: null,
        stack: [],
        showContactForm: { socials: false, freelance: false },
      };
    }
  }

  async saveIntro(intro: IntroData, files?: Record<string, File>): Promise<IntroData> {
    try {
      const formData = new FormData();
      formData.append("intro", JSON.stringify({
        name: intro.name,
        tags: intro.tags,
        description: intro.description,
        socials: intro.socials,
        showContactForm: intro.showContactForm,
        stack: intro.stack,
      }));

      if (files) {
        Object.entries(files).forEach(([key, file]) => {
          formData.append(key, file);
        });
      }

      const data = await api.post<IntroData>({
        url: "admin/update-intro",
        data: formData,
        contentType: "multipart/form-data",
      });

      this.introStore.setData(data);
      this.stackStore.setStack(data.stack || []);

      const toast = await this.toastController.presentToast({
        message: "Guardado correctamente",
        duration: 2000,
        color: "success",
      });
      await toast.present();
      return data;
    } catch (error) {
      console.error("Error saving intro:", error);
      const toast = await this.toastController.presentToast({
        message: "Error al guardar",
        duration: 2000,
        color: "danger",
      });
      await toast.present();
      return intro;
    }
  }
}