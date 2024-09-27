import { createRouter, createWebHistory } from "@ionic/vue-router";
import { RouteRecordRaw } from "vue-router";
import HomePage from "../views/HomePage.vue";
// portfolio
import PresentationPage from "../views/presentation/PresentationPage.vue";
import HistoryPage from "../views/history/HistoryPage.vue";
import PortfolioPage from "../views/portfolio/PortfolioPage.vue";
import PoliciesPage from "../views/policies/PoliciesPage.vue";
// posts
import CreatePost from "../views/blog/editor/CreatePost.vue";
import UpdatePost from "../views/blog/editor/UpdatePost.vue";
import BlogPage from "../views/blog/posts/PostsPage.vue";
import PostPage from "../views/blog/post/PostPage.vue";
// auth
import RestorePasswordPage from "../views/session/restore-password/RestorePasswordPage.vue";
import SessionPage from "../views/session/SessionPage.vue";
// user
import UserPanelPage from "../views/user/UserPanelPage.vue";
// admin
import AdminPanelPage from "../views/admin/PanelAdminPage.vue";

import NoFoundPage from "../views/404/404Page.vue";
import PruebaPage from "../views/prueba/Prueba.vue";

import { useUser } from "../composables/useUser";
import { ROUTER_USER_VALIDATION } from "../services/graphql";

async function loadUser(): Promise<void> {
  try {
    await useUser().loadUser();
  } catch (error: any) {
    throw new Error(error.message);
  }
}

async function adminGuard() {
  await loadUser();
  const isAdmin = useUser().user.value.isAdmin;
  if (isAdmin == true) return true;
  return "/";
}

async function userLoggedGuard() {
  await loadUser();
  const user = useUser().user.value.user;
  if (user) return true;
  return "/login";
}

async function userSignOutGuard(): Promise<true | "/" | undefined> {
  try {
    await loadUser();
    const user = useUser().user.value;
    if (user) {
      return "/";
    }
  } catch (error) {
    return true;
  }
}

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    redirect: "/presentation",
  },
  { path: "/:catchAll(.*)", component: NoFoundPage, name: "NoFoundPage" },
  {
    path: "/prueba",
    name: "PruebaPage",
    component: HomePage,
  },
  {
    path: "/presentation",
    name: "PresentationPage",
    component: HomePage,
  },
  {
    path: "/history",
    name: "HistoryPage",
    component: HomePage,
  },
  {
    path: "/portfolio",
    name: "PortfolioPage",
    component: HomePage,
  },
  {
    path: "/blog/editor/create",
    name: "CreatePost",
    component: HomePage,
    beforeEnter: async (to, from) => {
      return await adminGuard();
    },
  },
  {
    path: "/blog/editor/update/:id",
    name: "UpdatePost",
    component: HomePage,
    beforeEnter: async (to, from) => {
      return await adminGuard();
    },
  },
  {
    path: "/blog",
    name: "BlogPage",
    component: HomePage,
  },
  {
    path: "/blog",
    name: "PostsPage",
    component: HomePage,
    children: [
      {
        path: ":date",
        component: HomePage,
      },
    ],
  },
  {
    path: "/blog/post/:id",
    name: "PostPage",
    component: HomePage,
  },
  {
    path: "/login",
    name: "LoginPage",
    component: HomePage,
    beforeEnter: async (to, from) => {
      return await userSignOutGuard();
    },
  },
  {
    path: "/signup",
    name: "SignUpPage",
    component: HomePage,
    beforeEnter: async (to, from) => {
      return await userSignOutGuard();
    },
  },
  {
    path: "/restore-password/:email/:code",
    name: "RestorePasswordPage",
    component: HomePage,
    beforeEnter: async (to, from) => {
      return await userSignOutGuard();
    },
  },
  {
    path: "/policies",
    name: "PoliciesPage",
    component: HomePage,
  },
  {
    path: "/user",
    name: "UserPanelPage",
    component: HomePage,
    beforeEnter: async (to, from) => {
      return await userLoggedGuard();
    },
  },
  {
    path: "/admin-panel",
    name: "AdminPanelPage",
    component: HomePage,
    beforeEnter: async (to, from) => {
      return await adminGuard();
    },
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
