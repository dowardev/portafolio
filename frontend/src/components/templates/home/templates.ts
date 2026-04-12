import { type TemplateConfig } from "@/utils/types/homeTemplate";

import InformationComponent from "@/views/presentation/information/InformationComponent.vue";
import SkillsPage from "@/views/presentation/skills/SkillsPage.vue";
import ExperienceComponent from "@/views/presentation/experience/ExperienceComponent.vue";
import ProjectsComponent from "@/views/presentation/projects/ProjectsComponent.vue";
import CertificatesComponent from "@/views/presentation/certificates/CertificatesComponent.vue";
import FinalSection from "@/views/presentation/sections/FinalSection.vue";

export const templates: Record<string, TemplateConfig> = {
  default: {
    id: "default",
    name: "Clásico",
    description: "Diseño vertical con scroll snap",
    sections: [
      {
        id: "contact",
        title: "Contacto",
        component: InformationComponent,
        height: "100%",
        layout: { columns: 1 },
      },
      {
        id: "skills",
        title: "Skills",
        component: SkillsPage,
        height: "81dvh",
        layout: { columns: 1 },
      },
      {
        id: "experience",
        title: "Experiencia",
        component: ExperienceComponent,
        routeName: "ExperiencePage",
        routeLabel: "Ver todo",
        height: "82dvh",
        layout: { columns: 1 },
      },
      {
        id: "projects",
        title: "Proyectos",
        component: ProjectsComponent,
        routeName: "PortfolioPage",
        routeLabel: "Ver todo",
        height: "82dvh",
        layout: { columns: 1 },
      },
      {
        id: "certificates",
        title: "Certificados",
        component: CertificatesComponent,
        routeName: "CertificatesPage",
        routeLabel: "Ver todo",
        height: "82dvh",
        layout: { columns: 1 },
      },
      {
        id: "final",
        title: "Final",
        component: FinalSection,
        height: "100%",
        layout: { columns: 1 },
      },
    ],
    header: {
      showSegment: true,
      showMenu: true,
    },
  },
  compact: {
    id: "compact",
    name: "Compacto",
    description: "Todas las secciones en una sola vista",
    sections: [
      {
        id: "all",
        title: "Resumen",
        component: InformationComponent,
        height: "100%",
        layout: { columns: 1 },
      },
    ],
    header: {
      showSegment: false,
      showMenu: true,
    },
  },
  skillsFirst: {
    id: "skillsFirst",
    name: "Skills Primero",
    description: "Comienza con las habilidades técnicas",
    sections: [
      {
        id: "skills",
        title: "Skills",
        component: SkillsPage,
        height: "100%",
        layout: { columns: 1 },
      },
      {
        id: "contact",
        title: "Contacto",
        component: InformationComponent,
        height: "100%",
        layout: { columns: 1 },
      },
      {
        id: "projects",
        title: "Proyectos",
        component: ProjectsComponent,
        routeName: "PortfolioPage",
        routeLabel: "Ver todo",
        height: "100%",
        layout: { columns: 1 },
      },
      {
        id: "experience",
        title: "Experiencia",
        component: ExperienceComponent,
        routeName: "ExperiencePage",
        routeLabel: "Ver todo",
        height: "100%",
        layout: { columns: 1 },
      },
      {
        id: "final",
        title: "Final",
        component: FinalSection,
        height: "100%",
        layout: { columns: 1 },
      },
    ],
    header: {
      showSegment: true,
      showMenu: true,
    },
  },
};

export function getTemplate(id: string): TemplateConfig {
  return templates[id] || templates.default;
}