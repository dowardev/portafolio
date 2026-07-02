import { useSeoSettingsStore } from "@/store/seoSettingsStore";
import { getApiConnector } from "@/apiConnector";
import { ToastController } from "./toastController";

export interface SeoSettingsData {
  siteTitle?: string | null;
  siteDescription?: string | null;
  siteImageUrl?: string | null;
  siteImagePath?: string | null;
  siteKeywords?: string | null;
  langCode?: string;
  ogSiteName?: string | null;
  twitterHandle?: string | null;
  robotsIndex?: boolean;
  canonicalBase?: string | null;
  adminApiUrl?: string | null;
}

export default class SeoSettingsController {
  private store = useSeoSettingsStore();
  private toastController = new ToastController();

  async loadSettings(): Promise<SeoSettingsData> {
    if (this.store.loaded) return this.store.data;
    this.store.setLoading(true);
    try {
      const data = await getApiConnector().get<SeoSettingsData>("seo-settings");
      this.store.setData(data);
      this.store.setLoaded(true);
      return data;
    } catch (error) {
      console.error("Error loading SEO settings:", error);
      return {};
    } finally {
      this.store.setLoading(false);
    }
  }

  async saveSettings(params: {
    settings: SeoSettingsData;
    image?: File;
  }): Promise<SeoSettingsData | null> {
    const { settings, image } = params;
    try {
      const formData = new FormData();
      formData.append("siteTitle", settings.siteTitle ?? "");
      formData.append("siteDescription", settings.siteDescription ?? "");
      formData.append("siteKeywords", settings.siteKeywords ?? "");
      formData.append("langCode", settings.langCode ?? "es");
      formData.append("ogSiteName", settings.ogSiteName ?? "");
      formData.append("twitterHandle", settings.twitterHandle ?? "");
      formData.append("robotsIndex", settings.robotsIndex ? "1" : "0");
      formData.append("canonicalBase", settings.canonicalBase ?? "");
      formData.append("adminApiUrl", settings.adminApiUrl ?? "");

      if (image) {
        formData.append("siteImage", image);
      }

      const data = await getApiConnector().post<SeoSettingsData>(
        "admin/seo-settings",
        formData,
      );

      this.store.setData(data);

      const toast = await this.toastController.presentToast({
        message: "Configuración SEO guardada correctamente",
        duration: 2000,
        color: "success",
      });
      await toast.present();
      return data;
    } catch (error) {
      console.error("Error saving SEO settings:", error);
      const toast = await this.toastController.presentToast({
        message: "Error al guardar la configuración SEO",
        duration: 2000,
        color: "danger",
      });
      await toast.present();
      return null;
    }
  }

  get data() {
    return this.store.data;
  }

  get loaded() {
    return this.store.loaded;
  }
}