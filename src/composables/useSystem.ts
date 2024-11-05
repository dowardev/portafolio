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

const store = new Storage();
store.create();

export const useSystem = () => {
  // TODO:remove
  const systemStore = useSystemStore();

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

  async function loadThemeSelected(): Promise<void> {
    const theme = (await getThemeService()) ?? {
      selected: "light",
      options: { blur: false },
    };
    systemStore.updateThemeSelected({ theme });
  }

  function getTheme(): Theme {
    return systemStore.getThemeSelected();
  }

  function applyTheme(params: { newTheme: Theme; oldTheme: Theme }): void {
    const { newTheme, oldTheme } = params;
    applyThemeService({ theme: newTheme, currentTheme: oldTheme });
  }

  async function storeThemeSelected(params: { theme: Theme }): Promise<void> {
    const theme = params.theme;
    await storeThemeSelectedService({ theme });
  }

  function updateThemeSelected(params: { theme: Theme }): void {
    const { theme } = params;
    systemStore.updateThemeSelected({ theme });
  }

  function toggleUpdateOption() {
    systemStore.toggleUpdateOption();
  }

  function getUpdateStatus() {
    return systemStore.update;
  }

  async function getImageURL(params: {
    name: string;
  }): Promise<{ id: string; name: string; url: string }> {
    const { name } = params;
    return await getImageURLService({ name });
  }

  return {
    reportError,
    openToastError,
    storeThemeSelected,
    applyTheme,
    loadThemeSelected,
    getTheme,
    updateThemeSelected,
    toggleUpdateOption,
    getUpdateStatus,
    getImageURL,
  };
};
