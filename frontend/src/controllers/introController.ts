import { useIntroStore } from "@/store/introStore";
import { storeToRefs } from "pinia";
import type { TagItem } from "@/services/types";
import { ToastController } from "./toastController";
import { getApiConnector } from "@/apiConnector";

export interface IntroData {
  name: string | null;
  username: string | null;
  tags: TagItem[];
  description: string | null;
  socials: Array<{ platform: string; url: string; iconName: string }>;
  logoUrl: string | null;
  photoUrl: string | null;
  showFooter: boolean;
  footerContent: string | null;
  showContactForm: {
    socials: boolean;
    freelance: boolean;
  };
}

export default class IntroController {
  private introStore = useIntroStore();
  private toastController = new ToastController();

  async loadIntro(): Promise<IntroData> {
    this.introStore.setLoading(true);
    try {
      const data = await getApiConnector().get<IntroData>("get-intro");
      this.introStore.setData(data);
      return data;
    } catch (error) {
      console.error("Error loading intro:", error);
      return {
        name: null,
        username: null,
        tags: [],
        description: null,
        socials: [],
        logoUrl: null,
        photoUrl: null,
        showFooter: true,
        footerContent: null,
        showContactForm: { socials: false, freelance: false },
      };
    }
  }

  async saveIntro(intro: IntroData, files?: Record<string, File>): Promise<IntroData> {
    try {
      const formData = new FormData();
      formData.append("intro", JSON.stringify({
        name: intro.name,
        username: intro.username,
        tags: intro.tags,
        description: intro.description,
        socials: intro.socials,
        showFooter: intro.showFooter,
        footerContent: intro.footerContent,
        showContactForm: intro.showContactForm,
      }));

      if (files) {
        Object.entries(files).forEach(([key, file]: [string, File]) => {
          formData.append(key, file);
        });
      }

      const data = await getApiConnector().post<IntroData>(
        "admin/update-intro",
        formData,
      );

      this.introStore.setData(data);

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

  get data() {
    return storeToRefs(this.introStore).data;
  }

  get showContactForm() {
    return this.introStore.data.showContactForm;
  }
}