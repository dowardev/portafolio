import { createRouter, createWebHistory } from "@ionic/vue-router";
import { RouteRecordRaw } from "vue-router";
import HomePage from "../views/HomePage.vue";
import NoFoundPage from "../views/404/404Page.vue";
import { useUser } from "../composables/useUser";
import HomePresentationPage from "../views/presentation/HomePresentationPage.vue";
import SkillsPage from "@/views/skills/SkillsPage.vue";
import HistoryPage from "@/views/history/HistoryPage.vue";
import PortfolioPage from "@/views/portfolio/PortfolioPage.vue";

async function loadUser(): Promise<void> {
  try {
    await useUser().loadUser();
  } catch (error: any) {
    throw new Error(error.message);
  }
}

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    redirect: "/home/presentation",
  },
  { path: "/:catchAll(.*)", component: NoFoundPage, name: "NoFoundPage" },
  {
    path: "/prueba",
    name: "PruebaPage",
    component: HomePage,
  },
  {
    path: "/home",
    name: "HomePage",
    component: HomePage,
    children: [
      {
        path: "presentation",
        name: "PresentationPage",
        component: HomePage,
      },
      {
        path: "skills",
        name: "SkillsPage",
        component: SkillsPage,
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
    ],
  },
  {
    path: "/blog/editor/create",
    name: "CreatePost",
    component: HomePage,
  },
  {
    path: "/blog/editor/update/:id",
    name: "UpdatePost",
    component: HomePage,
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
  },
  {
    path: "/signup",
    name: "SignUpPage",
    component: HomePage,
  },
  {
    path: "/restore-password/:email/:code",
    name: "RestorePasswordPage",
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
    name: "AdminPanelPage",
    component: HomePage,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// router.beforeEach(async (to, from, next) => {
//   await loadUser();
//   const user = useUser().user.value.user;
//   const isAdmin = useUser().user.value.isAdmin;
//
//   const routeName = to.name as string;
//   const authorizedRoutes = ["UserPanelPage"];
//   const unauthorizedRoutes = ["LoginPage", "SignUpPage"];
//   const adminRoutes = ["CreatePost", "UpdatePost", "AdminPanelPage"];
//   const noGuardRequired = [
//     "RestorePasswordPage",
//     "PresentationPage",
//     "HomePage",
//     "HistoryPage",
//     "PortfolioPage",
//     "BlogPage",
//     "PostsPage",
//     "PostPage",
//     "PoliciesPage",
//   ];
//
//   if (user != undefined) {
//     if (authorizedRoutes.includes(routeName)) {
//       return next();
//     }
//     if (adminRoutes.includes(routeName) && isAdmin) {
//       return next();
//     }
//     if (noGuardRequired.includes(routeName)) {
//       return next();
//     }
//     return next({ name: "HomePage" });
//   }
//
//   if (user == undefined) {
//     if (unauthorizedRoutes.includes(routeName)) return next();
//     if (noGuardRequired.includes(routeName)) {
//       return next();
//     } else next({ name: "LoginPage" });
//   }
// });

export default router;
