import {
  ContactMessage,
  FeedbackParams,
  System,
  Toast,
} from "@/services/interfaces";
import { modalController, toastController } from "@ionic/vue";
import { alertCircleOutline, closeOutline } from "ionicons/icons";
import { storeToRefs } from "pinia";
import FeedbackPage from "../components/feedback/FeedbackPage.vue";
import { ReportError, Theme } from "../services/interfaces";
import { useSystemStore } from "../store/systemStore";
import { Storage } from "@ionic/storage";
import { Theme as ThemeType } from "@/services/types";
import { wb } from "@/main";

// services
import SystemService from "@/services/systemService";
import ContactService from "@/services/contactService";
import FeedbackService from "@/services/feedbackService";
import { DesignMode } from "@/utils/types";

export default class SystemController {
  systemService = new SystemService();
  contactService = new ContactService();
  feedbackService = new FeedbackService();

  // TODO:remove
  systemStore = useSystemStore();

  // async reportError(params: ReportError) {
  //   const type = params.type;
  //   const error = params.error;

  //   const modal = await modalController.create({
  //     component: FeedbackPage,
  //     componentProps: {
  //       dataProp: { type, error },
  //     },
  //   });
  //   await modal.present();
  // }

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
    const theme = (await this.systemService.getTheme()) ?? {
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
    this.systemService.applyTheme({
      theme: newTheme,
      currentTheme: oldTheme,
    });
  }

  async storeThemeSelected(params: { theme: Theme }): Promise<void> {
    const theme = params.theme;
    await this.systemService.storeThemeSelected({ theme });
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

  async getImageURL(params: { name: string }): Promise<{ url: string }> {
    const { name } = params;
    return await this.systemService.getImageURL({ name });
  }

  async presentAlertConfirmation(params: {
    message: string;
  }): Promise<boolean> {
    const { message } = params;

    return await this.systemService.presentAlertConfirmation({ message });
  }

  async presentLoading(params: {
    message: string;
  }): Promise<HTMLIonLoadingElement> {
    const { message } = params;
    return await this.systemService.presentLoading({ message });
  }

  async presentToast(params: Toast) {
    const { message, duration, color } = params;
    return await this.systemService.presentToast({ message, duration, color });
  }

  async createContactMessage(params: ContactMessage) {
    const { name, subject, email, description } = params;
    await this.contactService.createContactMessage({
      name,
      subject,
      email,
      description,
    });
  }

  getFirstCookie() {
    return this.systemService.getFirstCookie();
  }

  createFirstCookie() {
    this.systemService.createFirstCookie();
  }

  updateApp() {
    if (wb) {
      wb.addEventListener("controlling", () => {
        window.location.reload();
      });
      wb.messageSkipWaiting();
    } else {
      console.error("Workbox no está inicializado.");
    }
  }

  async createFeedback(params: FeedbackParams): Promise<void> {
    const { userId, name, email, description, contactMe, type } = params;

    await this.feedbackService.createFeedback({
      userId,
      name,
      email,
      description,
      contactMe,
      type,
    });
  }

  enableLoader(params: { color: string }) {
    const { color } = params;
    this.systemStore.updateLoader({ status: true, color });
  }

  disableLoader() {
    this.systemStore.updateLoader({ status: false });
  }

  getLoader() {
    return this.systemStore.loader;
  }

  setDesignMode(params: { mode: DesignMode }) {
    const { mode } = params;
    this.systemStore.setDesignMode({ mode });
  }

  getdesignMode(): DesignMode {
    return this.systemStore.getDesignMode();
  }

  getScreenSize() {
    return this.systemStore.screenSize;
  }
}
