import { createRouter, createWebHistory } from "@ionic/vue-router";
import { RouteRecordRaw } from "vue-router";
import Home from "../views/inicio/Home.vue";
import Informacion from "../views/informacion/Informacion.vue";
import Prueba from "../views/Prueba/Prueba.vue";
import Historia from "../views/historia/Historia.vue";
import Habilidades from "../views/habilidades/Habilidades.vue";
import Proyectos from "../views/proyectos/Proyectos.vue";
import Proyecto from "../views/proyectos/proyecto/Proyecto.vue";
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
    children: [
      { path: "historia", component: Historia },
      { path: "habilidades", component: Habilidades },
      {
        path: "proyectos",
        component: Proyectos,
        props: true,
        children: [{ name: "Proyecto", path: ":nombre", component: Proyecto }],
      },
    ],
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
