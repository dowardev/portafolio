import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { createHead } from "@unhead/vue";
const head = createHead();

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
import { createPinia, setActivePinia } from "pinia";
const pinia = createPinia();
setActivePinia(pinia);

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

// Sincronizar estado SSO con la store local del portafolio
import { useUserStore } from "@/store/userStore";

// Registrar listener ANTES de init() para capturar la emisión inicial del estado de autenticación
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

await ssoClient.init();
export { ssoClient };

import { setHttpClient } from "@/apiConnector";
import { setSSOClient } from "@/ssoClientAccessor";
import UserController from "@/controllers/userController";
setHttpClient(ssoClient.http);
setSSOClient(ssoClient);

// Bootstrap: cargar identidad una sola vez tras init.
// Los menús y el router leen reactivamente del store, no hacen HTTP.
const userController = new UserController();
userController.loadUser().catch(() => {});

// Sincronización de sesión con el SSO:
// - Al volver a la pestaña (focus/visibility) se revalida la sesión contra el
//   backend. Si el access token expiró o fue revocado, el refresh falla y el
//   sso-client emite onAuthStateChange(false) → se limpia el store.
// - El evento 'storage' cubre el logout en otra pestaña del mismo origen: al
//   borrar el token de localStorage, esta pestaña detecta el cambio y limpia
//   el store local.
function syncSessionOnReturn() {
  userController.syncSession().catch(() => {});
}
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') syncSessionOnReturn();
});
window.addEventListener('focus', syncSessionOnReturn);

const SSO_TOKEN_KEY = '@dowardev/sso-client:token';
window.addEventListener('storage', (event) => {
  if (event.key === SSO_TOKEN_KEY && event.newValue === null) {
    const store = useUserStore();
    store.logout();
    store.updateUserLoggedProp(false);
  }
});

const app = createApp(App).use(IonicVue).use(pinia).use(router).use(head);
app.directive("tooltip", vTooltip);
app.directive("section-reveal", vSectionReveal);

router.isReady().then(() => {
  app.mount("#app");
});

async function initStorage() {
  await storage.create();
  return storage;
}
