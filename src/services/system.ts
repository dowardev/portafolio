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

import apolloClient from "../Apollo";
import gql from "graphql-tag";
import { useMutation, useQuery } from "@vue/apollo-composable";
import { provideApolloClient } from "@vue/apollo-composable";
import { DocumentNode } from "graphql";
provideApolloClient(apolloClient);

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
    return "https://dowar-blog.dowar.xyz/";
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
    header: "Confirmacion",
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
  const {
    mutate: uploadImage,
    onDone,
    onError,
  } = useMutation(
    gql`
        mutation UploadImage($file: String!) {
          uploadImage(input: { file: $file }) {
            ...${params.graphql.fragment}
          }
        }
        ${params.graphql.name}
      `,
    {
      variables: {
        file: params.image,
      },
    }
  );
  uploadImage();

  return new Promise((resolve, reject) => {
    onDone((response) => resolve(response.data.uploadImage.image));
    onError((error) => reject(error));
  });
}

export async function executeGrapQuery(params: {
  query: any;
  options: { refetch: boolean };
}): Promise<any> {
  const { query, options } = params;
  const { refetch, result } = useQuery(query, null, {
    fetchPolicy: "cache-first",
  });
  if (options.refetch) await refetch();

  return result;
}

export function graphqlQueryBuilder(params: {
  name: DocumentNode;
  fragment: string;
  mutationName: string;
}): Object {
  const { name, fragment, mutationName } = params;

  const query = gql`
        query GetUser {
          ${mutationName}{
           ...${fragment}
          }
        }
        ${name}
      `;
  return query;
}
