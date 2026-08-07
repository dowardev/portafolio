import { Toast, Theme } from "@/utils/interfaces";
import { toastController } from "@ionic/vue";
import { useSystemStore } from "../store/systemStore";
import { DEFAULT_THEME } from "@/utils/themeDefaults";
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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const storedTheme = stored as any;
        const resolved = storedTheme.selected !== "auto"
          ? storedTheme.selected
          : (storedTheme.options?.lightTheme ?? "light");

        const template: HomeTemplate = storedTheme.template ?? DEFAULT_THEME.template;
        const variant: ConcreteTheme = storedTheme.variant ?? (resolved === "cyberpunk-light" ? "light" : resolved === "auto" ? (storedTheme.options?.lightTheme ?? "light") : resolved);

        const theme: Theme = {
          selected: storedTheme.selected,
          template,
          variant,
          savedVariant: storedTheme.savedVariant,
          options: storedTheme.options ?? { blur: false, lightTheme: "light" as ConcreteTheme, darkTheme: "catppuccin-macchiato" as ConcreteTheme },
        };
        this.systemStore.updateThemeSelected({ theme });
      } else {
        this.systemStore.updateThemeSelected({ theme: { ...DEFAULT_THEME } });
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
      return { ...DEFAULT_THEME };
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
      return DEFAULT_THEME.template;
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

  getThemeModalOpen(): boolean {
    try {
      return this.systemStore.getThemeModalOpen();
    } catch (error) {
      this.errorController.handleError({ error });
      return false;
    }
  }

  openThemeModal(): void {
    try {
      this.systemStore.openThemeModal();
    } catch (error) {
      return this.errorController.handleError({ error });
    }
  }

  closeThemeModal(): void {
    try {
      this.systemStore.closeThemeModal();
    } catch (error) {
      return this.errorController.handleError({ error });
    }
  }

  /**
   * Builds the next theme when the user changes the template.
   * - Leaving template2 records the current variant in `savedVariant` (if not "light") and forces "light".
   * - Entering template2 restores the saved variant when it exists and is not "light".
   * - Switching between non-template2 templates keeps any previously saved variant.
   */
  buildThemeForTemplate(params: { currentTheme: Theme; template: HomeTemplate }): Theme {
    const { currentTheme, template } = params;

    let variant: ConcreteTheme = currentTheme.variant;
    let savedVariant: ConcreteTheme | undefined = currentTheme.savedVariant;

    if (template !== "template2") {
      if (currentTheme.template === "template2") {
        savedVariant = currentTheme.variant !== "light" ? currentTheme.variant : undefined;
      }
      variant = "light";
    } else {
      variant =
        currentTheme.savedVariant && currentTheme.savedVariant !== "light"
          ? currentTheme.savedVariant
          : currentTheme.variant;
      savedVariant = undefined;
    }

    return {
      ...currentTheme,
      selected: variant,
      template,
      variant,
      savedVariant,
    };
  }

  /**
   * Builds the next theme when the user changes the variant.
   * Records the chosen variant as `savedVariant` so it survives modal close/reopen.
   */
  buildThemeForVariant(params: { currentTheme: Theme; variant: ConcreteTheme }): Theme {
    const { currentTheme, variant } = params;

    return {
      ...currentTheme,
      selected: variant,
      variant,
      savedVariant: variant,
    };
  }

  /**
   * Builds the next theme when the user selects the "auto" mode.
   * Keeps the current variant so switching back to a concrete variant restores it.
   */
  buildThemeForAuto(params: { currentTheme: Theme }): Theme {
    const { currentTheme } = params;

    return {
      ...currentTheme,
      selected: "auto",
    };
  }

  /**
   * Builds the next theme when the user changes the light theme used in "auto" mode.
   */
  buildThemeForAutoLightTheme(params: { currentTheme: Theme; lightTheme: ConcreteTheme }): Theme {
    const { currentTheme, lightTheme } = params;

    return {
      ...currentTheme,
      options: {
        ...currentTheme.options,
        lightTheme,
      },
    };
  }

  /**
   * Builds the next theme when the user changes the dark theme used in "auto" mode.
   */
  buildThemeForAutoDarkTheme(params: { currentTheme: Theme; darkTheme: ConcreteTheme }): Theme {
    const { currentTheme, darkTheme } = params;

    return {
      ...currentTheme,
      options: {
        ...currentTheme.options,
        darkTheme,
      },
    };
  }

  /**
   * Re-applies the theme when the OS color scheme changes (prefers-color-scheme).
   * Only meaningful when the selected mode is "auto": concrete modes ignore it.
   */
  onSystemColorSchemeChange(): void {
    try {
      const theme = this.getTheme();
      if (theme.selected === "auto") {
        this.applyTheme({ newTheme: theme, oldTheme: theme });
      }
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
    return this.systemStore.getDesignMode() || "md";
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
