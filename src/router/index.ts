import { createRouter, createWebHistory } from "@ionic/vue-router";
import { RouteRecordRaw } from "vue-router";
import HomePage from "../views/HomePage.vue";
import PresentationPage from "../views/Presentation/PresentationPage.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    redirect: "/presentation",
  },
  {
    path: "/home",
    name: "Home",
    component: HomePage,
  },
  {
    path: "/presentation",
    name: "PresentationPage",
    component: PresentationPage,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
