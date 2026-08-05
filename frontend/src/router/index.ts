import { createRouter, createWebHistory } from "@ionic/vue-router";
import { RouteRecordRaw } from "vue-router";
import NoFoundPage from "../views/404/404Page.vue";
import PruebaPage from "@/views/prueba/PruebaPage.vue";

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
import SkillsListPage from "@/views/admin/sections/SkillsListPage.vue";
import SkillsEditorPage from "@/views/admin/sections/SkillsEditorPage.vue";
import CertificatesListPage from "@/views/admin/sections/CertificatesListPage.vue";
import CertificatesEditor from "@/views/admin/editors/CertificatesEditor.vue";
import FreelancePlatformsListPage from "@/views/admin/sections/FreelancePlatformsListPage.vue";
import FreelanceCommentsListPage from "@/views/admin/sections/FreelanceCommentsListPage.vue";
import FreelanceEditor from "@/views/admin/editors/FreelanceEditor.vue";
import PermissionsPage from "@/views/admin/PermissionsPage.vue";
import SeoSettingsPage from "@/views/admin/sections/SeoSettingsPage.vue";

import { getSSOClient } from "@/ssoClientAccessor";
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

interface RouteGuard {
  roles?: string[];
  permissions?: string[];
}

const routeGuards: Record<string, RouteGuard> = {
  CreatePostPage: { permissions: ['posts.create'] },
  UpdatePostPage: { permissions: ['posts.update'] },
  PanelAdminPage: { roles: ['admin', 'editor'] },
  ProjectsListPage: { permissions: ['projects.create', 'projects.update', 'projects.delete'] },
  ProjectEditPage: { permissions: ['projects.update'] },
  ProjectNewPage: { permissions: ['projects.create'] },
  ExperienceListPage: { permissions: ['experiences.create', 'experiences.update', 'experiences.delete'] },
  ExperienceEditPage: { permissions: ['experiences.update'] },
  ExperienceNewPage: { permissions: ['experiences.create'] },
  SkillsListPage: { permissions: ['stacks.create', 'stacks.update', 'stacks.delete', 'techs.create', 'techs.update', 'techs.delete'] },
  SkillsNewPage: { permissions: ['stacks.create', 'techs.create'] },
  SkillsEditPage: { permissions: ['stacks.update', 'techs.update'] },
  CertificatesListPage: { permissions: ['certificates.create', 'certificates.update', 'certificates.delete'] },
  CertificateEditPage: { permissions: ['certificates.update'] },
  CertificateNewPage: { permissions: ['certificates.create'] },
  FreelancePlatformsListPage: { permissions: ['freelance.create', 'freelance.update', 'freelance.delete'] },
  FreelancePlatformEditPage: { permissions: ['freelance.update'] },
  FreelancePlatformNewPage: { permissions: ['freelance.create'] },
  FreelanceCommentsListPage: { permissions: ['freelance-comments.create', 'freelance-comments.update', 'freelance-comments.delete'] },
  FreelanceCommentEditPage: { permissions: ['freelance-comments.update'] },
  FreelanceCommentNewPage: { permissions: ['freelance-comments.create'] },
  UsersPage: { roles: ['admin'] },
  PermissionsPage: { roles: ['admin'] },
  AdminEditorPage: { roles: ['admin', 'editor'] },
  SeoSettingsPage: { permissions: ['seo.update'] },
};

function canAccessRoute(params: { guard: RouteGuard; userController: UserController }): boolean {
  const { guard, userController } = params
  const { roles, permissions } = guard

  if (roles?.length) {
    if (userController.hasAnyRole({ slugs: roles })) return true
  }
  if (permissions?.length) {
    if (userController.hasAnyPermission({ slugs: permissions })) return true
  }
  return false
}

const routes: Array<RouteRecordRaw> = [
  {
    path: "/prueba",
    name: "PruebaPage",
    component: PruebaPage,
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
    path: "/blog/:date?",
    name: "PostsPage",
    component: PostsPage,
  },
  {
    path: "/blog/post/:slug",
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
    path: "/admin-panel/seo",
    name: "SeoSettingsPage",
    component: SeoSettingsPage,
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
    path: "/admin-panel/skills",
    name: "SkillsListPage",
    component: SkillsListPage,
  },
  {
    path: "/admin-panel/skills/new",
    name: "SkillsNewPage",
    component: SkillsEditorPage,
  },
  {
    path: "/admin-panel/skills/edit/:id",
    name: "SkillsEditPage",
    component: SkillsEditorPage,
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
    path: "/admin-panel/freelance-platform",
    name: "FreelancePlatformsListPage",
    component: FreelancePlatformsListPage,
  },
  {
    path: "/admin-panel/freelance-platform/new",
    name: "FreelancePlatformNewPage",
    component: FreelanceEditor,
  },
  {
    path: "/admin-panel/freelance-platform/edit/:index",
    name: "FreelancePlatformEditPage",
    component: FreelanceEditor,
  },
  {
    path: "/admin-panel/freelance-comments",
    name: "FreelanceCommentsListPage",
    component: FreelanceCommentsListPage,
  },
  {
    path: "/admin-panel/freelance-comments/new",
    name: "FreelanceCommentNewPage",
    component: FreelanceEditor,
  },
  {
    path: "/admin-panel/freelance-comments/edit/:index",
    name: "FreelanceCommentEditPage",
    component: FreelanceEditor,
  },
  {
    path: "/admin-panel/:section",
    name: "AdminEditorPage",
    component: AdminEditorPage,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

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
  "AdminEditorPage",
  "ProjectsListPage",
  "ProjectEditPage",
  "ProjectNewPage",
  "ExperienceListPage",
  "ExperienceEditPage",
  "ExperienceNewPage",
  "SkillsListPage",
  "SkillsNewPage",
  "SkillsEditPage",
  "CertificatesListPage",
  "CertificateEditPage",
  "CertificateNewPage",
  "FreelancePlatformsListPage",
  "FreelancePlatformEditPage",
  "FreelancePlatformNewPage",
  "FreelanceCommentsListPage",
  "FreelanceCommentEditPage",
  "FreelanceCommentNewPage",
  "UsersPage",
  "PermissionsPage",
  "SeoSettingsPage",
];

const authorizedRoutes = ["UserPanelPage", "AuthCallbackPage"];

router.beforeEach(async (to, from, next) => {
  const client = getSSOClient();
  const routeName = to.name as string;

  if (publicRoutes.includes(routeName || "")) {
    return next();
  }

  if (authorizedRoutes.includes(routeName)) {
    return next();
  }

  if (!client.isAuthenticated) {
    await client.loginWithRedirect({
      redirectUri: `${window.location.origin}/auth/callback`,
    });
    return next("/");
  }

  const userController = new UserController();
  await loadUser(userController);

  if (adminRoutes.includes(routeName)) {
    const guard = routeGuards[routeName];
    if (guard && !canAccessRoute({ guard, userController })) {
      return next({ name: "PresentationPage" });
    }
  }

  return next();
});

export default router;
