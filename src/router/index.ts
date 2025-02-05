import { createRouter, createWebHistory } from "@ionic/vue-router";
import { RouteRecordRaw } from "vue-router";
import NoFoundPage from "../views/404/404Page.vue";
import Prueba from "@/views/prueba/Prueba.vue";

import HomePage from "@/views/HomePage.vue";

// controllers
import UserController from "@/controllers/userController";

async function loadUser(controller: UserController): Promise<void> {
  try {
    await controller.loadUser();
  } catch (error: unknown) {
    if (error.message != "Request failed with status code 500")
      throw new Error(error.message);
  }
}

const routes: Array<RouteRecordRaw> = [
  {
    path: "/prueba",
    name: "PruebaPage",
    component: Prueba,
  },

  {
    path: "/",
    redirect: "/home/presentation",
  },
  { path: "/:catchAll(.*)", component: NoFoundPage, name: "NoFoundPage" },
  {
    path: "/home/presentation",
    name: "PresentationPage",
    component: HomePage,
  },
  {
    path: "/home/skills",
    name: "SkillsPage",
    component: HomePage,
  },
  {
    path: "/home/history",
    name: "HistoryPage",
    component: HomePage,
  },
  {
    path: "/home/portfolio",
    name: "PortfolioPage",
    component: HomePage,
  },
  {
    path: "/blog/editor/create",
    name: "CreatePostPage",
    component: HomePage,
  },
  {
    path: "/blog/editor/update/:id",
    name: "UpdatePostPage",
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
  },
  {
    path: "/signup",
    name: "SignUpPage",
    component: HomePage,
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
  },
  {
    path: "/admin-panel",
    name: "PanelAdminPage",
    component: HomePage,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const userController = new UserController();
  await loadUser(userController);
  const user = userController.getUser()?.user;
  const isAdmin = userController.getUser()?.isAdmin;

  const routeName = to.name as string;
  const authorizedRoutes = ["UserPanelPage"];
  const unauthorizedRoutes = ["LoginPage", "SignUpPage"];
  const adminRoutes = ["CreatePostPage", "UpdatePostPage", "PanelAdminPage"];
  const noGuardRequired = [
    "RestorePasswordPage",
    "PresentationPage",
    "HomePage",
    "HistoryPage",
    "PortfolioPage",
    "SkillsPage",
    "BlogPage",
    "PostsPage",
    "PostPage",
    "PoliciesPage",
    "PruebaPage",
  ];

  if (user != undefined) {
    if (authorizedRoutes.includes(routeName)) {
      return next();
    }
    if (adminRoutes.includes(routeName) && isAdmin) {
      return next();
    }
    if (noGuardRequired.includes(routeName)) {
      return next();
    }
    return next({ name: "PresentationPage" });
  }

  if (user == undefined) {
    if (unauthorizedRoutes.includes(routeName)) return next();
    if (noGuardRequired.includes(routeName)) {
      return next();
    } else next({ name: "LoginPage" });
  }
});

export default router;
