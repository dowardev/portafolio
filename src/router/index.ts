import { createRouter, createWebHistory } from "@ionic/vue-router";
import { RouteRecordRaw } from "vue-router";
import Home from "../views/Home.vue";
import Informacion from "../views/informacion/Informacion.vue";
import Prueba from "../views/Prueba/Prueba.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    redirect: "/home",
  },
  {
    path: "/home",
    name: "Home",
    component: Home,
  },
  {
    path: "/informacion",
    name: "Informacion",
    component: Informacion,
  },
  {
    path: "/prueba",
    name: "Prueba",
    component: Prueba,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
