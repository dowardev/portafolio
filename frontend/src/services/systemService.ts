import { getApiConnector } from "@/apiConnector";
import { storageInstance } from "@/main";
import Cookies from "js-cookie";

import {
  toastController,
  loadingController,
  alertController,
} from "@ionic/vue";
import {
  AlertConfirmation,
  Image,
  Loading,
  Toast,
  UploadImage,
  Theme,
} from "../utils/interfaces";
import { ConcreteTheme } from "../utils/types";
import { CONCRETE_THEMES } from "../utils/themeDefaults";

export default class SystemService {
  async getTheme(): Promise<Theme | null> {
    const theme = await this.getDataFromLocalStorage({ key: "theme" });
    if (theme === null || theme === undefined) return null;
    return typeof theme === "string" ? JSON.parse(theme) : theme;
  }

  applyTheme(params: {
    theme: Theme;
    resolvedSelected: ConcreteTheme;
    currentTheme: Theme;
    resolvedCurrentSelected: ConcreteTheme;
  }): void {
    const { theme, resolvedSelected } = params;

    const body = document.getElementsByTagName("body")[0];
    // Remove every known variant class: the previous class may be unknown at
    // call time (e.g. re-applying when OS scheme changes), so a whitelist
    // sweep is safer than relying on the caller-provided old class.
    body.classList.remove(...CONCRETE_THEMES);
    body.classList.add(resolvedSelected);

    if (!theme.options || !theme.options.blur) {
      body.removeAttribute("data-blur");
    } else {
      body.setAttribute("data-blur", "true");
    }
  }

  async storeThemeSelected(params: { theme: Theme }): Promise<void> {
    const { theme } = params;
    // Store the object directly: @ionic/storage serializes once via localforage.
    // Pre-stringifying caused double serialization, which IndexedDB returns
    // raw on read (getItem does not deserialize), so the persisted theme was
    // never restored after reload.
    await this.storeDataOnLocalStorage({ key: "theme", value: theme });
  }

  async openToast(params: Toast): Promise<void> {
    const duration = params.duration == undefined ? 2000 : params.duration;
    const position = params.position == undefined ? "bottom" : params.position;
    let color = params.color;

    if (params.color == undefined)
      color =
        window.matchMedia("(prefers-color-scheme: dark)").matches == true
          ? "dark"
          : "light";

    const toast = await toastController.create({
      message: params.message,
      duration,
      color: color,
      position,
    });
    return toast.present();
  }

  async presentLoading(params: Loading): Promise<HTMLIonLoadingElement> {
    const { message } = params;
    const loading = await loadingController.create({
      cssClass: "my-custom-class",
      message,
    });
    return loading;
  }

  async presentAlertConfirmation(params: AlertConfirmation): Promise<boolean> {
    const alert = await alertController.create({
      cssClass: "my-custom-class",
      header: "Confirmación",
      message: params.message,
      buttons: [
        {
          text: "Cancelar",
          role: "cancel",
          cssClass: "secondary",
          id: "cancel-button",
        },
        {
          text: "Confirmar",
          id: "confirm-button",
          role: "confirm",
        },
      ],
    });
    await alert.present();

    const { role } = await alert.onDidDismiss();
    return role == "confirm" ? true : false;
  }

  createFirstCookie() {
    document.cookie = "firstAccess=" + false;
  }

  getFirstCookie(): boolean {
    const name = "firstAccess=";
    const cDecoded = decodeURIComponent(document.cookie);
    const cArr = cDecoded.split("; ");
    let access = true;
    cArr.forEach((val) => {
      if (val.indexOf(name) === 0) access = false;
    });
    return access;
  }

  async uploadImage(params: UploadImage): Promise<Image> {
    const { image, type } = params;
    const formData = new FormData();
    formData.append("file", image);
    formData.append("type", type);

    const response = await getApiConnector().post<{
      image: { id: string; path: string; name: string };
    }>("upload-image", formData);

    return response.image;
  }

  // TODO: REMOVE
  async presentToast(params: Toast) {
    const { message, color = "dark" } = params;
    const toast = await toastController.create({
      message,
      duration: 1500,
      position: "bottom",
      color,
    });

    await toast.present();
  }

  async getImageURL(params: { name: string }): Promise<{ url: string }> {
    const { name } = params;

    const { url } = await getApiConnector().get<{ url: string }>(
      "get-image",
      { params: { name } }
    );

    return {
      url,
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async storeDataOnLocalStorage(params: { key: string; value: any }) {
    const { key, value } = params;
    await storageInstance.set(key, value);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async getDataFromLocalStorage(params: { key: string }): Promise<any> {
    const { key } = params;
    return await storageInstance.get(key);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  storeCookie(params: { key: string; value: any }) {
    const { key, value } = params;

    Cookies.set(key, value, {
      secure: true,
      sameSite: "Strict",
    });
  }

  getCookie(params: { key: string }): string | undefined {
    const { key } = params;
    return Cookies.get(key);
  }

  removeCookie(params: { key: string }) {
    const { key } = params;
    Cookies.remove(key);
  }
}
