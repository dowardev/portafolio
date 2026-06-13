import { FeedbackParams, Toast, Theme } from "@/utils/interfaces";
import { toastController } from "@ionic/vue";
import { useSystemStore } from "../store/systemStore";
import { wb } from "@/main";

// controllers
import ErrorController from "./errorController";

// services
import SystemService from "@/services/systemService";
import { ConcreteTheme, DesignMode, HomeTemplate } from "@/utils/types";

export default class SystemController {
  systemService = new SystemService();
  private errorController = new ErrorController();

  // TODO:remove
  systemStore = useSystemStore();

  async loadThemeSelected(): Promise<void> {
    try {
      const stored = await this.systemService.getTheme();
      if (stored && stored.selected) {
        const storedTheme = stored as any;
        const resolved = storedTheme.selected !== "auto"
          ? storedTheme.selected
          : (storedTheme.options?.lightTheme ?? "light");

        const template: HomeTemplate = storedTheme.template ?? (resolved === "cyberpunk-light" ? "template3" : "template2");
        const variant: ConcreteTheme = storedTheme.variant ?? (resolved === "cyberpunk-light" ? "light" : resolved === "auto" ? (storedTheme.options?.lightTheme ?? "light") : resolved);

        const theme: Theme = {
          selected: storedTheme.selected,
          template,
          variant,
          options: storedTheme.options ?? { blur: false, lightTheme: "light" as ConcreteTheme, darkTheme: "catppuccin-macchiato" as ConcreteTheme },
        };
        this.systemStore.updateThemeSelected({ theme });
      } else {
        const defaultTheme: Theme = {
          selected: "light",
          template: "template2",
          variant: "light",
          options: { blur: false, lightTheme: "light", darkTheme: "catppuccin-macchiato" },
        };
        this.systemStore.updateThemeSelected({ theme: defaultTheme });
      }
    } catch (error) {
      return this.errorController.handleError({ error });
    }
  }

  getTheme(): Theme {
    try {
      return this.systemStore.getThemeSelected();
    } catch (error) {
      this.errorController.handleError({ error });
      return {
        selected: "light",
        template: "template2",
        variant: "light",
        options: { blur: false, lightTheme: "light", darkTheme: "catppuccin-macchiato" },
      };
    }
  }

  resolveAutoTheme(params: { theme: Theme }): ConcreteTheme {
    const { theme } = params;
    if (theme.selected !== "auto") return theme.selected as ConcreteTheme;

    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (prefersDark) {
      return theme.options?.darkTheme ?? "catppuccin-macchiato";
    }
    return theme.options?.lightTheme ?? "light";
  }

  applyTheme(params: { newTheme: Theme; oldTheme: Theme }): void {
    try {
      const { newTheme, oldTheme } = params;
      const resolvedTheme = this.resolveAutoTheme({ theme: newTheme });
      const resolvedOldTheme = this.resolveAutoTheme({ theme: oldTheme });

      const cssTheme = newTheme.template === "template2" ? resolvedTheme : "light";
      const oldCssTheme = oldTheme.template === "template2" ? resolvedOldTheme : "light";

      this.systemService.applyTheme({
        theme: newTheme,
        resolvedSelected: cssTheme,
        currentTheme: oldTheme,
        resolvedCurrentSelected: oldCssTheme,
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

  getTemplate(): HomeTemplate {
    try {
      return this.systemStore.getTemplate();
    } catch (error) {
      this.errorController.handleError({ error });
      return "template2";
    }
  }

  setTemplate(params: { template: HomeTemplate }): void {
    try {
      const { template } = params;
      this.systemStore.setTemplate({ template });
    } catch (error) {
      return this.errorController.handleError({ error });
    }
  }

  getVariant(): ConcreteTheme {
    try {
      return this.systemStore.getVariant();
    } catch (error) {
      this.errorController.handleError({ error });
      return "light";
    }
  }

  setVariant(params: { variant: ConcreteTheme }): void {
    try {
      const { variant } = params;
      this.systemStore.setVariant({ variant });
    } catch (error) {
      return this.errorController.handleError({ error });
    }
  }

  async changeTheme(params: { newTheme: Theme; oldTheme: Theme }): Promise<void> {
    try {
      const { newTheme, oldTheme } = params;
      this.systemStore.updateThemeSelected({ theme: newTheme });
      this.applyTheme({ newTheme, oldTheme });
      await this.storeThemeSelected({ theme: newTheme });
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

  async getImageURL(params: { name: string }): Promise<{ url: string }> {
    try {
      const { name } = params;
      return await this.systemService.getImageURL({ name });
    } catch (error) {
      return this.errorController.handleError({ error });
    }
  }

  async presentAlertConfirmation(params: {
    message: string;
  }): Promise<boolean> {
    try {
      const { message } = params;
      return await this.systemService.presentAlertConfirmation({ message });
    } catch (error) {
      return this.errorController.handleError({ error });
    }
  }

  async presentLoading(params: {
    message: string;
  }): Promise<HTMLIonLoadingElement> {
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

  getScreenSize(): { width: number; height: number; preset: string } {
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
