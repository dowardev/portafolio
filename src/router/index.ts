import { createRouter, createWebHistory } from "@ionic/vue-router";
import { RouteRecordRaw } from "vue-router";
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
import LoginPage from "../views/session/login/LoginPage.vue";
import SignUpPage from "../views/session/signup/SignUpPage.vue";
import RestorePasswordPage from "../views/session/restore-password/RestorePasswordPage.vue";
import PruebaPage from "../views/prueba/Prueba.vue";
// user
import UserPanelPage from "../views/user/UserPanelPage.vue";
// admin
import AdminPanelPage from "../views/admin/PanelAdminPage.vue";
import NoFoundPage from "../views/404/404Page.vue";

import { useUser } from "../composables/useUser";
import { ROUTER_USER_VALIDATION } from "../services/graphql";

async function loadUser() {
  try {
    await useUser().loadUser({
      graphql: {
        name: ROUTER_USER_VALIDATION,
        fragment: "RouterUserValidation",
        refetch: true,
      },
    });
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

async function userSignOutGuard() {
  try {
    await loadUser();
    const user = useUser().user.value.user;
    if (user) return "/";
  } catch (error) {
    return true;
  }
}

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    redirect: "/blog",
  },
  { path: "/:catchAll(.*)", component: NoFoundPage, name: "NoFoundPage" },
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
    path: "/portfolio",
    name: "PortfolioPage",
    component: PortfolioPage,
  },
  {
    path: "/blog/editor/create",
    name: "CreatePost",
    component: CreatePost,
    beforeEnter: async (to, from) => {
      return await adminGuard();
    },
  },
  {
    path: "/blog/editor/update/:id",
    name: "UpdatePost",
    component: UpdatePost,
    beforeEnter: async (to, from) => {
      return await adminGuard();
    },
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
        component: BlogPage,
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
    beforeEnter: async (to, from) => {
      return await userSignOutGuard();
    },
  },
  {
    path: "/signup",
    name: "SignUpPage",
    component: SignUpPage,
    beforeEnter: async (to, from) => {
      return await userSignOutGuard();
    },
  },
  {
    path: "/restore-password/:email/:code",
    name: "RestorePasswordPage",
    component: RestorePasswordPage,
    beforeEnter: async (to, from) => {
      return await userSignOutGuard();
    },
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
    beforeEnter: async (to, from) => {
      return await userLoggedGuard();
    },
  },
  {
    path: "/admin-panel",
    name: "AdminPanelPage",
    component: AdminPanelPage,
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
