import { createRouter, createWebHistory } from "@ionic/vue-router";
import { RouteRecordRaw } from "vue-router";
import NoFoundPage from "../views/404/404Page.vue";
import { useUser } from "../composables/useUser";
import HomePresentationPage from "../views/presentation/HomePresentationPage.vue";
import SkillsPage from "@/views/skills/SkillsPage.vue";
import HistoryPage from "@/views/history/HistoryPage.vue";
import PortfolioPage from "@/views/portfolio/PortfolioPage.vue";
import CreatePost from "@/views/blog/editor/CreatePost.vue";
import UpdatePost from "@/views/blog/editor/UpdatePost.vue";
import PostsPage from "@/views/blog/posts/PostsPage.vue";
import PostPage from "@/views/blog/post/PostPage.vue";
import LoginPage from "@/views/session/login/LoginPage.vue";
import SignUpPage from "@/views/session/signup/SignUpPage.vue";
import PoliciesPage from "@/views/policies/PoliciesPage.vue";
import UserPanelPage from "@/views/user/UserPanelPage.vue";
import AdminPanelPage from "@/views/admin/users/UsersPage.vue";
import InformationComponent from "@/views/presentation/information/InformationComponent.vue";

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
    path: "/home/presentation",
    name: "PresentationPage",
    component: HomePresentationPage,
  },
  {
    path: "/home/skills",
    name: "SkillsPage",
    component: HomePresentationPage,
  },
  {
    path: "/home/history",
    name: "HistoryPage",
    component: HomePresentationPage,
  },
  {
    path: "/home/portfolio",
    name: "PortfolioPage",
    component: HomePresentationPage,
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
    name: "PostsPage",
    component: PostsPage,
    children: [
      {
        path: ":date",
        component: PostsPage,
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
    path: "/policies",
    name: "PoliciesPage",
    component: PoliciesPage,
  },
  {
    path: "/user",
    name: "UserPanelPage",
    component: UserPanelPage,
  },
  {
    path: "/admin-panel",
    name: "AdminPanelPage",
    component: AdminPanelPage,
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
