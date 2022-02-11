import { createRouter, createWebHistory } from "@ionic/vue-router";
import { RouteRecordRaw } from "vue-router";
import HomePage from "../views/HomePage.vue";
import PresentationPage from "../views/presentation/PresentationPage.vue";
import HistoryPage from "../views/history/HistoryPage.vue";
import SkillsPage from "../views/skills/SkillsPage.vue";
import PortfolioPage from "../views/portfolio/PortfolioPage.vue";
import EditorPage from "../views/blog/editor/EditorPage.vue";
import BlogPage from "../views/blog/posts/PostsPage.vue";
import PostPage from "../views/blog/post/PostPage.vue";
import LoginPage from "../views/session/login/Login.vue";
import RegisterPage from "../views/session/register/Register.vue";

// TODO: proteger rutas
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
  {
    path: "/blog/editor",
    name: "EditorPage",
    component: EditorPage,
  },
  {
    path: "/blog",
    name: "BlogPage",
    component: BlogPage,
  },
  {
    path: "/blog/post/:id",
    name: "PostPage",
    component: PostPage,
  },
  {
    path: "/login",
    name: "LoginPage",
    component: LoginPage,
  },
  {
    path: "/register",
    name: "RegisterPage",
    component: RegisterPage,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
