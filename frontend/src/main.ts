import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

import { IonicVue } from "@ionic/vue";

import { vTooltip } from "./directives/tooltip";
import { vSectionReveal } from "./directives/sectionReveal";

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

/* Theme variables */
import "./theme/variables.css";

// pinia - propio del portafolio
import { createPinia } from "pinia";
const pinia = createPinia();

// storage
import { Storage } from "@ionic/storage";
const storage = new Storage();
export const storageInstance = await initStorage();

// SSO Client - caja negra, el portafolio no gestiona tokens ni estado SSO
import { SSOClient } from "@tu-org/sso-client";
const ssoClient = new SSOClient({
  ssoUrl: import.meta.env.VITE_SSO_URL,
  ssoFrontendUrl: import.meta.env.VITE_SSO_FRONTEND_URL,
  clientId: import.meta.env.VITE_SSO_CLIENT_ID,
  apiBaseUrl: import.meta.env.VITE_API_URL,
});
await ssoClient.init();
export { ssoClient };

import { setHttpClient } from "@/apiConnector";
import { setSSOClient } from "@/ssoClientAccessor";
setHttpClient(ssoClient.http);
setSSOClient(ssoClient);

// Sincronizar estado SSO con la store local del portafolio
import { useUserStore } from "@/store/userStore";

// service worker
import { Workbox } from "workbox-window";
let wb: Workbox | null = null;
if ("serviceWorker" in navigator) {
  wb = new Workbox("/sw.js");
  wb.register();
}
export { wb };

const app = createApp(App).use(IonicVue).use(pinia).use(router);
app.directive("tooltip", vTooltip);
app.directive("section-reveal", vSectionReveal);

ssoClient.onAuthStateChange((state) => {
  const userStore = useUserStore();
  if (state.isAuthenticated && state.user) {
    userStore.updateUserProps(state.user);
    userStore.updateUserLoggedProp(true);
  } else {
    userStore.logout();
    userStore.updateUserLoggedProp(false);
  }
});

router.isReady().then(() => {
  app.mount("#app");
});

async function initStorage() {
  await storage.create();
  return storage;
}
