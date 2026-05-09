import { createRouter, createWebHistory } from "@ionic/vue-router";
import { RouteRecordRaw } from "vue-router";
import NoFoundPage from "../views/404/404Page.vue";
import Prueba from "@/views/prueba/Prueba.vue";

import HomePresentationPage from "@/views/presentation/HomePresentationPage.vue";
import CategoriesPage from "@/views/presentation/categories/SkillsPage.vue";
import HistoryPage from "@/views/history/HistoryPage.vue";
import PortfolioPage from "@/views/portfolio/PortfolioPage.vue";
import CertificatesPage from "@/views/certificates/CertificatesPage.vue";
import ExperiencePage from "@/views/experience/ExperiencePage.vue";
import CreatePostPage from "@/views/blog/editor/CreatePostPage.vue";
import UpdatePostPage from "@/views/blog/editor/UpdatePostPage.vue";
import PostsPage from "@/views/blog/posts/PostsPage.vue";
import PostPage from "@/views/blog/post/PostPage.vue";
import AuthCallbackPage from "@/views/session/callback/AuthCallbackPage.vue";
import PoliciesPage from "@/views/policies/PoliciesPage.vue";
import UserPanelPage from "@/views/user/UserPanelPage.vue";
import UsersPage from "@/views/admin/users/UsersPage.vue";
import PanelAdminPage from "@/views/admin/PanelAdminPage.vue";
import AdminEditorPage from "@/views/admin/AdminEditorPage.vue";
import ProjectsListPage from "@/views/admin/sections/ProjectsListPage.vue";
import ProjectsEditor from "@/views/admin/editors/ProjectsEditor.vue";
import ExperienceListPage from "@/views/admin/sections/ExperienceListPage.vue";
import ExperienceEditor from "@/views/admin/editors/ExperienceEditor.vue";
import SkillsCategoriesListPage from "@/views/admin/sections/SkillsCategoriesListPage.vue";
import CategoriesEditor from "@/views/admin/editors/SkillsEditor.vue";
import CertificatesListPage from "@/views/admin/sections/CertificatesListPage.vue";
import CertificatesEditor from "@/views/admin/editors/CertificatesEditor.vue";
import FreelanceListPage from "@/views/admin/sections/FreelanceListPage.vue";
import FreelanceEditor from "@/views/admin/editors/FreelanceEditor.vue";
import PermissionsPage from "@/views/admin/PermissionsPage.vue";

import { getSSOClient } from "@/ssoClientAccessor";
import { createAuthGuard } from "@tu-org/sso-client";
import UserController from "@/controllers/userController";
import { ICustomError, Role } from "@/utils/interfaces";

async function loadUser(controller: UserController): Promise<void> {
  try {
    await controller.loadUser();
  } catch (e: unknown) {
    if (typeof e === "object" && e !== null && "errorDetail" in e) {
      const customError = e as ICustomError;
      if (customError.errorDetail != "Unauthenticated." && customError.errorDetail != "Token no proporcionado") throw customError;
    } else {
      throw e;
    }
  }
}

export function hasAdminRole(roles?: Role[]): boolean {
  if (!roles || roles.length === 0) return false;

  return roles.some(
    (role) =>
      role.slug === "admin" || role.name.toLowerCase() === "administrador",
  );
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
    component: HomePresentationPage,
  },
  {
    path: "/home/categories",
    name: "CategoriesPage",
    component: CategoriesPage,
  },
  {
    path: "/home/history",
    name: "HistoryPage",
    component: HistoryPage,
  },
  {
    path: "/home/portfolio",
    name: "PortfolioPage",
    component: PortfolioPage,
  },
  {
    path: "/home/certificates",
    name: "CertificatesPage",
    component: CertificatesPage,
  },
  {
    path: "/home/experience",
    name: "ExperiencePage",
    component: ExperiencePage,
  },
  {
    path: "/blog/editor/create",
    name: "CreatePostPage",
    component: CreatePostPage,
  },
  {
    path: "/blog/editor/update/:id",
    name: "UpdatePostPage",
    component: UpdatePostPage,
  },
  {
    path: "/blog",
    name: "PostsPage",
    component: PostsPage,
  },
  {
    path: "/blog/post/:id",
    name: "PostPage",
    component: PostPage,
  },
  {
    path: "/auth/callback",
    name: "AuthCallbackPage",
    component: AuthCallbackPage,
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
    path: "/admin-panel/users",
    name: "UsersPage",
    component: UsersPage,
  },
  {
    path: "/admin-panel",
    name: "PanelAdminPage",
    component: PanelAdminPage,
  },
  {
    path: "/admin-panel/permissions",
    name: "PermissionsPage",
    component: PermissionsPage,
  },
  {
    path: "/admin-panel/projects",
    name: "ProjectsListPage",
    component: ProjectsListPage,
  },
  {
    path: "/admin-panel/projects/new",
    name: "ProjectNewPage",
    component: ProjectsEditor,
  },
  {
    path: "/admin-panel/projects/edit/:index",
    name: "ProjectEditPage",
    component: ProjectsEditor,
  },
  {
    path: "/admin-panel/experience",
    name: "ExperienceListPage",
    component: ExperienceListPage,
  },
  {
    path: "/admin-panel/experience/new",
    name: "ExperienceNewPage",
    component: ExperienceEditor,
  },
  {
    path: "/admin-panel/experience/edit/:index",
    name: "ExperienceEditPage",
    component: ExperienceEditor,
  },
  {
    path: "/admin-panel/skills-categories",
    name: "SkillsCategoriesListPage",
    component: SkillsCategoriesListPage,
  },
  {
    path: "/admin-panel/skills-categories/new",
    name: "SkillsCategoriesNewPage",
    component: CategoriesEditor,
  },
  {
    path: "/admin-panel/skills-categories/edit/:index",
    name: "SkillsCategoriesEditPage",
    component: CategoriesEditor,
  },
  {
    path: "/admin-panel/certificates",
    name: "CertificatesListPage",
    component: CertificatesListPage,
  },
  {
    path: "/admin-panel/certificates/new",
    name: "CertificateNewPage",
    component: CertificatesEditor,
  },
  {
    path: "/admin-panel/certificates/edit/:index",
    name: "CertificateEditPage",
    component: CertificatesEditor,
  },
  {
    path: "/admin-panel/freelance",
    name: "FreelanceListPage",
    component: FreelanceListPage,
  },
  {
    path: "/admin-panel/freelance/:type(new|platform|comment)/new",
    name: "FreelanceNewPage",
    component: FreelanceEditor,
  },
  {
    path: "/admin-panel/freelance/:type(platform|comment)/edit/:index",
    name: "FreelanceEditPage",
    component: FreelanceEditor,
  },
  {
    path: "/admin-panel/:section",
    name: "AdminEditorPage",
    component: AdminEditorPage,
  },
  {
    path: "/admin-panel/freelance/edit/:index",
    name: "FreelanceEditPageOld",
    component: FreelanceEditor,
  },
  {
    path: "/admin-panel/freelance/new",
    name: "FreelanceNewPageOld",
    component: FreelanceEditor,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

let authGuard: ReturnType<typeof createAuthGuard> | undefined;

const publicRoutes = [
  "RestorePasswordPage",
  "PresentationPage",
  "HomePage",
  "HistoryPage",
  "PortfolioPage",
  "SkillsPage",
  "CategoriesPage",
  "BlogPage",
  "PostsPage",
  "PostPage",
  "PoliciesPage",
  "PruebaPage",
  "CertificatesPage",
  "ExperiencePage",
  "AuthCallbackPage",
];

const adminRoutes = [
  "CreatePostPage",
  "UpdatePostPage",
  "PanelAdminPage",
  "HomeEditorPage",
  "AdminEditorPage",
  "ProjectsListPage",
  "ProjectEditPage",
  "ProjectNewPage",
  "ExperienceListPage",
  "ExperienceEditPage",
  "ExperienceNewPage",
  "SkillsCategoriesListPage",
  "SkillsCategoriesEditPage",
  "SkillsCategoriesNewPage",
  "CertificatesListPage",
  "CertificateEditPage",
  "CertificateNewPage",
  "FreelanceListPage",
  "FreelanceEditPage",
  "FreelanceEditPageOld",
  "FreelanceNewPage",
  "FreelanceNewPageOld",
  "UsersPage",
  "PermissionsPage",
];

const authorizedRoutes = ["UserPanelPage", "AuthCallbackPage"];

router.beforeEach(async (to, from, next) => {
  if (!authGuard) {
    authGuard = createAuthGuard(getSSOClient(), {
      publicRoutes,
      redirectUri: `${window.location.origin}/auth/callback`,
    });
  }
  await authGuard(to, from, next);

  if (!getSSOClient().isAuthenticated) return;

  const userController = new UserController();
  await loadUser(userController);
  const roles = userController.getUser()?.roles;
  const isAdmin = hasAdminRole(roles);
  const routeName = to.name as string;

  if (adminRoutes.includes(routeName) && !isAdmin) {
    return next({ name: "PresentationPage" });
  }

  if (authorizedRoutes.includes(routeName)) {
    return next();
  }
});

export default router;
