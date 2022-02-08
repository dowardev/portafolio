import { createRouter, createWebHistory } from "@ionic/vue-router";
import { RouteRecordRaw } from "vue-router";
import HomePage from "../views/HomePage.vue";
import PresentationPage from "../views/presentation/PresentationPage.vue";
import HistoryPage from "../views/history/HistoryPage.vue";
import SkillsPage from "../views/skills/SkillsPage.vue";
import PortfolioPage from "../views/portfolio/PortfolioPage.vue";

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
  {
    path: "/history",
    name: "HistoryPage",
    component: HistoryPage,
  },
  {
    path: "/skills",
    name: "SkillsPage",
    component: SkillsPage,
  },
  {
    path: "/portfolio",
    name: "PortfolioPage",
    component: PortfolioPage,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
