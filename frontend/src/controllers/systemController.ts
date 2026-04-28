import { FeedbackParams, Toast } from "@/services/interfaces";
import { toastController } from "@ionic/vue";
import { Theme } from "../services/interfaces";
import { useSystemStore } from "../store/systemStore";
import { wb } from "@/main";

// controllers
import ErrorController from "./errorController";

// services
import SystemService from "@/services/systemService";
import { DesignMode } from "@/utils/types";

export default class SystemController {
  systemService = new SystemService();
  private errorController = new ErrorController();

  // TODO:remove
  systemStore = useSystemStore();

  async loadThemeSelected(): Promise<void> {
    try {
      const theme = (await this.systemService.getTheme()) ?? {
        selected: "light",
        options: { blur: false },
      };
      this.systemStore.updateThemeSelected({ theme });
    } catch (error) {
      return this.errorController.handleError({ error });
    }
  }

  getTheme(): Theme | void {
    try {
      return this.systemStore.getThemeSelected();
    } catch (error) {
      return this.errorController.handleError({ error });
    }
  }

  applyTheme(params: { newTheme: Theme; oldTheme: Theme }): void {
    try {
      const { newTheme, oldTheme } = params;
      this.systemService.applyTheme({
        theme: newTheme,
        currentTheme: oldTheme,
      });
    } catch (error) {
      return this.errorController.handleError({ error });
    }
  }

  async storeThemeSelected(params: { theme: Theme }): Promise<void> {
    try {
      const theme = params.theme;
      await this.systemService.storeThemeSelected({ theme });
    } catch (error) {
      return this.errorController.handleError({ error });
    }
  }

  updateThemeSelected(params: { theme: Theme }): void {
    try {
      const { theme } = params;
      this.systemStore.updateThemeSelected({ theme });
    } catch (error) {
      return this.errorController.handleError({ error });
    }
  }

  toggleUpdateOption() {
    try {
      this.systemStore.toggleUpdateOption();
    } catch (error) {
      return this.errorController.handleError({ error });
    }
  }

  getUpdateStatus() {
    try {
      return this.systemStore.update;
    } catch (error) {
      return this.errorController.handleError({ error });
    }
  }

  async getImageURL(params: { name: string }): Promise<{ url: string } | void> {
    try {
      const { name } = params;
      return await this.systemService.getImageURL({ name });
    } catch (error) {
      return this.errorController.handleError({ error });
    }
  }

  async presentAlertConfirmation(params: {
    message: string;
  }): Promise<boolean | void> {
    try {
      const { message } = params;
      return await this.systemService.presentAlertConfirmation({ message });
    } catch (error) {
      return this.errorController.handleError({ error });
    }
  }

  async presentLoading(params: {
    message: string;
  }): Promise<HTMLIonLoadingElement | void> {
    try {
      const { message } = params;
      return await this.systemService.presentLoading({ message });
    } catch (error) {
      return this.errorController.handleError({ error });
    }
  }

  async presentToast(params: Toast) {
    try {
      const { message, color = "dark" } = params;
      (
        await toastController.create({
          message,
          duration: 1500,
          position: "bottom",
          color,
        })
      ).present();
    } catch (error) {
      return this.errorController.handleError({ error });
    }
  }

  getFirstCookie() {
    try {
      return this.systemService.getFirstCookie();
    } catch (error) {
      return this.errorController.handleError({ error });
    }
  }

  createFirstCookie() {
    try {
      this.systemService.createFirstCookie();
    } catch (error) {
      return this.errorController.handleError({ error });
    }
  }

  updateApp() {
    try {
      if (wb) {
        wb.addEventListener("controlling", () => {
          window.location.reload();
        });
        wb.messageSkipWaiting();
      } else {
        throw new Error("Workbox no está inicializado.");
      }
    } catch (error) {
      return this.errorController.handleError({ error });
    }
  }

  enableLoader(params: { color: string }) {
    try {
      const { color } = params;
      this.systemStore.updateLoader({ status: true, color });
    } catch (error) {
      return this.errorController.handleError({ error });
    }
  }

  disableLoader() {
    try {
      this.systemStore.updateLoader({ status: false });
    } catch (error) {
      return this.errorController.handleError({ error });
    }
  }

  getLoader() {
    try {
      return this.systemStore.loader;
    } catch (error) {
      return this.errorController.handleError({ error });
    }
  }

  setDesignMode(params: { mode: DesignMode }) {
    try {
      const { mode } = params;
      this.systemStore.setDesignMode({ mode });
    } catch (error) {
      return this.errorController.handleError({ error });
    }
  }

  getdesignMode(): DesignMode {
    try {
      return this.systemStore.getDesignMode() || "md";
    } catch (error) {
      return "md";
    }
  }

  getScreenSize(): { width: number; height: number; preset: string } | void {
    try {
      return this.systemStore.screenSize;
    } catch (error) {
      return this.errorController.handleError({ error });
    }
  }

  updateScreenSize(params: { width: number; height: number; preset: string }) {
    try {
      const { width, height, preset } = params;
      this.systemStore.updateScreenSize({ width, height, preset });
    } catch (error) {
      return this.errorController.handleError({ error });
    }
  }
}
