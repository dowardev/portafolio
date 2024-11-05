import { Storage } from "@ionic/storage";
const storage = new Storage();
storage.create();

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
} from "./interfaces";

import axios from "axios";
import { getUserToken } from "./user";
import { url } from "@vuelidate/validators";

export async function getTheme(): Promise<Theme> {
  const theme = await storage.get("theme");
  return JSON.parse(theme);
}

export function applyTheme(params: {
  theme: Theme;
  currentTheme: Theme;
}): void {
  const theme = params.theme;
  const currentTheme = params.currentTheme;

  document
    .getElementsByTagName("body")[0]
    .classList.remove(currentTheme.selected);
  document.getElementsByTagName("body")[0].classList.add(theme.selected);

  const themeClass = document.querySelector<HTMLElement>(`.${theme.selected}`);
  if (!theme.options || !theme.options.blur) {
    themeClass!.style.setProperty("--blur", "0px");
    themeClass!.style.setProperty("--wallpaper-main-content", "none");
    themeClass!.style.setProperty("--blur-color-opacity", "0");
    themeClass!.style.setProperty("--wallpaper-opacity", "1");
    themeClass!.style.setProperty("--wallpaper-opacity", "1");
  } else {
    const blurValue = getComputedStyle(
      document.documentElement
    ).getPropertyValue("--blur");
    const backgroundImage = getComputedStyle(
      document.documentElement
    ).getPropertyValue("--wallpaper-main-content");
    const blurColorOpacity = getComputedStyle(
      document.documentElement
    ).getPropertyValue("--blur-color-opacity");
    const wallpaperOpacity = getComputedStyle(
      document.documentElement
    ).getPropertyValue("--wallpaper-opacity");
    themeClass!.style.setProperty("--blur", blurValue);
    themeClass!.style.setProperty("--wallpaper-main-content", backgroundImage);
    themeClass!.style.setProperty("--blur-color-opacity", blurColorOpacity);
    themeClass!.style.setProperty("--wallpaper-opacity", wallpaperOpacity);
  }
}

export async function storeThemeSelected(params: {
  theme: Theme;
}): Promise<void> {
  const theme = params.theme;
  await storage.set("theme", JSON.stringify(theme));
}

export async function openToast(params: Toast): Promise<void> {
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

export function getBaseURL(): string {
  const mode = process.env.NODE_ENV;
  if (mode == "development") {
    return "http://127.0.0.1:8000/";
  } else {
    return "http://127.0.0.1:8000/";
    // return "https://prueba-blogb.dowar.xyz/";
  }
}

export async function presentLoading(params: Loading) {
  const loading = await loadingController.create({
    cssClass: "my-custom-class",
    message: params.message,
  });
  return loading;
}

export async function presentAlertConfirmation(
  params: AlertConfirmation
): Promise<boolean> {
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

export function createFirstCookie() {
  document.cookie = "firstAccess=" + false;
}

export function getFirstCookie(): boolean {
  const name = "firstAccess=";
  const cDecoded = decodeURIComponent(document.cookie);
  const cArr = cDecoded.split("; ");
  let access = true;
  cArr.forEach((val) => {
    if (val.indexOf(name) === 0) access = false;
  });
  return access;
}

export async function uploadImage(params: UploadImage): Promise<Image> {
  const { image, type } = params;
  const formData = new FormData();
  formData.append("file", image);
  formData.append("type", type);

  const response = await axios.request({
    url: `http://127.0.0.1:8000/api/upload-image`,
    method: "POST",
    headers: {
      Authorization: getUserToken(),
    },
    data: formData,
  });

  return response.data.image;
}

export async function presentToast(params: {
  message: string;
  color?: "dark" | "danger";
}) {
  const { message, color = "dark" } = params;
  const toast = await toastController.create({
    message,
    duration: 1500,
    position: "bottom",
    color,
  });

  await toast.present();
}

export async function getImageURL(params: {
  name: string;
}): Promise<{ id: string; name: string; url: string }> {
  const { name } = params;

  const response = await axios.request({
    url: `http://127.0.0.1:8000/api/get-image`,
    method: "GET",
    headers: {
      contentType: "application/json",
      Authorization: getUserToken(),
    },
    params: { name },
  });

  return {
    id: response.data.id,
    name: response.data.name,
    url: response.data.url,
  };
}
