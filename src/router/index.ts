import { createRouter, createWebHistory } from "@ionic/vue-router";
import { RouteRecordRaw } from "vue-router";
// portfolio
import PresentationPage from "../views/presentation/PresentationPage.vue";
import HistoryPage from "../views/history/HistoryPage.vue";
import SkillsPage from "../views/skills/SkillsPage.vue";
import PortfolioPage from "../views/portfolio/PortfolioPage.vue";
import PoliciesPage from "../views/policies/PoliciesPage.vue";
// posts
import CreatePost from "../views/blog/editor/CreatePost.vue";
import UpdatePost from "../views/blog/editor/UpdatePost.vue";
import BlogPage from "../views/blog/posts/PostsPage.vue";
import PostPage from "../views/blog/post/PostPage.vue";
import PostsPage2 from "../views/blog/posts/PostsPage2.vue";
// auth
import LoginPage from "../views/session/login/Login.vue";
import SignUpPage from "../views/session/signup/SignUpPage.vue";
import RestorePasswordPage from "../views/session/restore-password/RestorePasswordPage.vue";
import PruebaPage from "../views/prueba/Prueba.vue";
// user
import UserPanelPage from "../views/user/UserPanelPage.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    redirect: "/presentation",
  },
  {
    path: "/prueba",
    name: "PruebaPage",
    component: PruebaPage,
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
  {
    path: "/blog",
    name: "BlogPage",
    component: BlogPage,
  },
  {
    path: "/blog",
    name: "PostsPage",
    component: BlogPage,
    children: [
      {
        path: ":date",
        component: PostsPage2,
      },
    ],
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
  {
    path: "/policies",
    name: "PoliciesPage",
    component: PoliciesPage,
  },
  {
    path: "/user",
    name: "UserPanelPage",
    component: UserPanelPage,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
