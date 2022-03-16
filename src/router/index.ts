import { createRouter, createWebHistory } from "@ionic/vue-router";
import { RouteRecordRaw } from "vue-router";
import PresentationPage from "../views/presentation/PresentationPage.vue";
import HistoryPage from "../views/history/HistoryPage.vue";
import SkillsPage from "../views/skills/SkillsPage.vue";
import PortfolioPage from "../views/portfolio/PortfolioPage.vue";
import CreatePost from "../views/blog/editor/CreatePost.vue";
import UpdatePost from "../views/blog/editor/UpdatePost.vue";
import BlogPage from "../views/blog/posts/PostsPage.vue";
import PostPage from "../views/blog/post/PostPage.vue";
import LoginPage from "../views/session/login/Login.vue";
import SignUpPage from "../views/session/signup/SignUpPage.vue";
import RestorePasswordPage from "../views/session/restore-password/RestorePasswordPage.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    redirect: "/presentation",
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
    path: "/blog/editor/create",
    name: "CreatePost",
    component: CreatePost,
  },
  {
    path: "/blog/editor/update/:id",
    name: "UpdatePost",
    component: UpdatePost,
  },
  // {
  //   path: "/blog/editor/update/:id",
  //   name: "EditorPage",
  //   component: EditorPage,
  // },

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
    path: "/signup",
    name: "SignUpPage",
    component: SignUpPage,
  },
  {
    path: "/restore-password",
    name: "RestorePasswordPage",
    component: RestorePasswordPage,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
