import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

import { IonicVue } from "@ionic/vue";

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

// server config
import ServerConfig from "@/composables/serverConfig";
const serverConfigService = await ServerConfig.createInstance();
await serverConfigService.store({
  serverUrl: "http://127.0.0.1:8000/api/",
});
const serverConfig = await serverConfigService.getConfig();

// api connector
import APIService from "@/services/APIService";
const api = new APIService({
  serverUrl: serverConfig.serverUrl,
  userToken: serverConfig.UserToken,
});
export const apiConnector = api;

// service worker
import { Workbox } from "workbox-window";
let wb: Workbox | null = null;
if ("serviceWorker" in navigator) {
  wb = new Workbox("/sw.js");
  wb.register();
}
export { wb };

const app = createApp(App).use(IonicVue).use(pinia).use(router);

router.isReady().then(() => {
  app.mount("#app");
});

async function initStorage() {
  await storage.create();
  return storage;
}
