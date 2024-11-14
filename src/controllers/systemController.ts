import { System } from "@/services/interfaces";
import { modalController, toastController } from "@ionic/vue";
import { alertCircleOutline, closeOutline } from "ionicons/icons";
import { storeToRefs } from "pinia";
import FeedbackPage from "../components/feedback/FeedbackPage.vue";
import { ReportError, Theme } from "../services/interfaces";
import { useSystemStore } from "../store/systemStore";
import { Storage } from "@ionic/storage";
import { Theme as ThemeType } from "@/services/types";
import {
  getTheme as getThemeService,
  applyTheme as applyThemeService,
  storeThemeSelected as storeThemeSelectedService,
  getImageURL as getImageURLService,
} from "@/services/system";

export default class SystemController {
  // TODO:remove
  systemStore = useSystemStore();

  async reportError(params: ReportError) {
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

  async openToastError(error: object) {
    const toast = await toastController.create({
      header: "Ocurrió un error",
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

  async loadThemeSelected(): Promise<void> {
    const theme = (await getThemeService()) ?? {
      selected: "light",
      options: { blur: false },
    };
    this.systemStore.updateThemeSelected({ theme });
  }

  getTheme(): Theme {
    return this.systemStore.getThemeSelected();
  }

  applyTheme(params: { newTheme: Theme; oldTheme: Theme }): void {
    const { newTheme, oldTheme } = params;
    applyThemeService({ theme: newTheme, currentTheme: oldTheme });
  }

  async storeThemeSelected(params: { theme: Theme }): Promise<void> {
    const theme = params.theme;
    await storeThemeSelectedService({ theme });
  }

  updateThemeSelected(params: { theme: Theme }): void {
    const { theme } = params;
    this.systemStore.updateThemeSelected({ theme });
  }

  toggleUpdateOption() {
    this.systemStore.toggleUpdateOption();
  }

  getUpdateStatus() {
    return this.systemStore.update;
  }

  async getImageURL(params: {
    name: string;
  }): Promise<{ id: string; name: string; url: string }> {
    const { name } = params;
    return await getImageURLService({ name });
  }
}
