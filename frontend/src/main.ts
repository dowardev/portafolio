import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

import { IonicVue } from "@ionic/vue";

import { vTooltip } from "./directives/tooltip";

/* Core CSS required for Ionic components to work properly */
import "@ionic/vue/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/vue/css/normalize.css";
import "@ionic/vue/css/structure.css";
import "@ionic/vue/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/vue/css/padding.css";
import "@ionic/vue/css/float-elements.css";
import "@ionic/vue/css/text-alignment.css";
import "@ionic/vue/css/text-transformation.css";
import "@ionic/vue/css/flex-utils.css";
import "@ionic/vue/css/display.css";

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* @import '@ionic/vue/css/palettes/dark.always.css'; */
/* @import '@ionic/vue/css/palettes/dark.class.css'; */
// import "@ionic/vue/css/palettes/dark.system.css";

/* Theme variables */
import "./theme/variables.css";

// pinia
import { createPinia } from "pinia";
const pinia = createPinia();

// storage
import { Storage } from "@ionic/storage";
const storage = new Storage();
export const storageInstance = await initStorage();

// DPoP service
import DpopService from "@/services/dpopService";
const dpopService = new DpopService();
await dpopService.initialize();

// server config - API principal
import ServerConfig from "@/controllers/serverConfigController";
const userToken = Cookies.get("user-token");
export const serverConfigController = new ServerConfig({
  baseUrl: import.meta.env.VITE_API_URL,
  accessToken: userToken ?? "",
});

// server config - SSO
import SSOServerConfig from "@/controllers/SSOServerConfigController";
export const ssoServerConfig = new SSOServerConfig({
  baseUrl: import.meta.env.VITE_SSO_URL,
  accessToken: userToken ?? "",
});

// api connector
import APIController from "@/controllers/APIController";
const api = new APIController(serverConfigController, dpopService);
export const apiConnector = api;

import SSOAPIController from "@/controllers/SSOAPIController";
const ssoApi = new SSOAPIController(ssoServerConfig, dpopService);
export const ssoApiConnector = ssoApi;

// user auth
// import Cookies from "js-cookie";
// import AuthController from "@/controllers/authController";
// const token = Cookies.get("user-token");
// const refreshToken = Cookies.get("user-refresh-token");
// export const auth = new AuthController(
//   token,
//   refreshToken,
//   import.meta.env.VITE_API_URL,
//   api,
// );

// service worker
import { Workbox } from "workbox-window";
import Cookies from "js-cookie";
let wb: Workbox | null = null;
if ("serviceWorker" in navigator) {
  wb = new Workbox("/sw.js");
  wb.register();
}
export { wb };

export { dpopService };

const app = createApp(App).use(IonicVue).use(pinia).use(router);
app.directive("tooltip", vTooltip);

router.isReady().then(() => {
  app.mount("#app");
});

async function initStorage() {
  await storage.create();
  return storage;
}
