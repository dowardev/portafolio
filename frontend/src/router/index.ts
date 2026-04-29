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
import LoginPage from "@/views/session/login/LoginPage.vue";
import SignUpPage from "@/views/session/signup/SignUpPage.vue";
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

import UserController from "@/controllers/userController";
import { ICustomError } from "@/services/interfaces";
import { Role } from "@/utils/interfaces";

async function loadUser(controller: UserController): Promise<void> {
  try {
    await controller.loadUser();
  } catch (e: unknown) {
    if (typeof e === "object" && e !== null && "errorDetail" in e) {
      const customError = e as ICustomError;
      if (customError.errorDetail != "Unauthenticated.") throw customError;
    } else {
      throw e;
    }
  }
}

function hasAdminRole(roles?: Role[]): boolean {
  if (!roles || roles.length === 0) return false;
  
  return roles.some(role => 
    role.slug === 'admin' || 
    role.name.toLowerCase() === 'administrador'
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

router.beforeEach(async (to, from, next) => {
  const userController = new UserController();
  await loadUser(userController);
  const user = userController.getUser()?.user;
  const roles = userController.getUser()?.roles;
  const isAdmin = hasAdminRole(roles);

  const routeName = to.name as string;
  const authorizedRoutes = ["UserPanelPage"];
  const unauthorizedRoutes = ["LoginPage", "SignUpPage"];
  const adminRoutes = ["CreatePostPage", "UpdatePostPage", "PanelAdminPage", "HomeEditorPage", "AdminEditorPage", "ProjectsListPage", "ProjectEditPage", "ProjectNewPage", "ExperienceListPage", "ExperienceEditPage", "ExperienceNewPage", "SkillsCategoriesListPage", "SkillsCategoriesEditPage", "SkillsCategoriesNewPage", "SkillsListPage", "SkillsEditPage", "SkillsNewPage", "CertificatesListPage", "CertificateEditPage", "CertificateNewPage", "FreelanceListPage", "FreelanceEditPage", "FreelanceEditPageOld", "FreelanceNewPage", "FreelanceNewPageOld", "UsersPage"];
  const noGuardRequired = [
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
