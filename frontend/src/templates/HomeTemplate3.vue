<template>
  <ion-page>
    <ion-header class="ion-no-border template3-header" mode="ios">
      <ion-toolbar class="header-toolbar">
        <ion-buttons slot="start">
          <ion-menu-button class="mobile-menu-trigger" :auto-hide="false" color="dark" />
          <a class="header-logo" href="#" @click.prevent="scrollToSection('#hero')">
            <img src="@/assets/portafolio/logo_dowar_2.1.png" alt="dowardev" class="logo-img" />
            <span class="logo-text">dowardev</span>
          </a>
        </ion-buttons>

        <ion-buttons slot="end">
          <ion-button
            v-for="item in navItems"
            :key="item.label"
            fill="clear"
            class="nav-button"
            @click="scrollToSection(item.href)"
          >
            {{ item.label }}
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content ref="contentRef">
      <section id="hero" class="bp-section bp-section-hero">
        <HeroSection3
          :name="mockName"
          :roles="mockRoles"
        />
        <div class="metrics-wrapper">
          <MetricsBar3 />
        </div>
      </section>

      <section id="projects" class="bp-section bp-section-projects">
        <div class="projects-inner">
          <div class="projects-header">
            <h2 class="projects-heading">Estilos de cards (preview temporal)</h2>
            <p class="projects-sub">Selecciona el que más te guste — A, B, C, D, E o F</p>
          </div>

          <div class="preview-variants">
            <div class="preview-col">
              <span class="preview-label">ESTILO A</span>
              <ProjectCard3
                v-bind="previewCard"
                variant="a"
              />
            </div>
            <div class="preview-col">
              <span class="preview-label">ESTILO B</span>
              <ProjectCard3
                v-bind="previewCard"
                variant="b"
              />
            </div>
            <div class="preview-col">
              <span class="preview-label">ESTILO C</span>
              <ProjectCard3
                v-bind="previewCard"
                variant="c"
              />
            </div>
            <div class="preview-col">
              <span class="preview-label">ESTILO D</span>
              <ProjectCard3
                v-bind="previewCard"
                variant="d"
              />
            </div>
            <div class="preview-col">
              <span class="preview-label">ESTILO E</span>
              <ProjectCard3
                v-bind="previewCard"
                variant="e"
              />
            </div>
            <div class="preview-col">
              <span class="preview-label">ESTILO F</span>
              <ProjectCard3
                v-bind="previewCard"
                variant="f"
              />
            </div>
          </div>

          <div class="section-divider"></div>

          <div class="projects-header">
            <h2 class="projects-heading">Proyectos recientes</h2>
            <p class="projects-sub">Selección de trabajos destacados</p>
          </div>

            <div class="projects-grid">
              <ProjectCard3
                v-for="project in mockProjects"
                :key="project.name"
                v-bind="project"
              />
            </div>
          </div>
        </section>

        <section id="skills" class="bp-section bp-section-skills">
          <TechCloudBackground
            title="Skills"
            :height="320"
            :main-icons="mockMainIcons"
            :background-techs="mockBackgroundTechs"
            bg-color="#fafafa"
            title-color="#111"
            label-color="#ccc"
            icon-label-color="#111"
          />
        </section>

        <section id="experience" class="bp-section bp-section-experience">
          <div class="projects-inner">
            <div class="projects-header">
              <h2 class="projects-heading">Experiencia</h2>
              <p class="projects-sub">Trayectoria profesional</p>
            </div>
            <div class="projects-grid">
              <ProjectCard3
                v-for="exp in mockExperience"
                :key="exp.name"
                v-bind="exp"
              />
            </div>
          </div>
        </section>

        <section id="collaboration" class="bp-section bp-section-collaboration">
          <div class="projects-inner">
            <div class="projects-header">
              <h2 class="projects-heading">Trabajemos juntos</h2>
              <p class="projects-sub">Lo que dicen mis clientes</p>
            </div>

            <div class="platforms-row">
              <a
                v-for="p in mockFreelancePlatforms"
                :key="p.id"
                :href="p.url"
                target="_blank"
                class="platform-link"
                rel="noopener noreferrer"
              >
                {{ p.name }}
              </a>
            </div>

            <div class="projects-grid">
              <ProjectCard3
                v-for="comment in mockComments"
                :key="comment.name"
                v-bind="comment"
              />
            </div>
          </div>
        </section>

      <ion-footer class="ion-no-border template3-footer">
        <div class="footer-inner">
          <p class="footer-text">
            &copy; {{ currentYear }} {{ mockName }}.
          </p>
        </div>
      </ion-footer>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { computed, ref } from "vue"
import {
  IonButton,
  IonButtons,
  IonContent,
  IonFooter,
  IonHeader,
  IonMenuButton,
  IonPage,
  IonToolbar,
} from "@ionic/vue"

import HeroSection3 from "@/views/presentation/sections/HeroSection3.vue"
import ProjectCard3 from "@/components/projects/ProjectCard3.vue"
import TechCloudBackground from "@/components/common/TechCloudBackground.vue"
import MetricsBar3 from "@/components/common/MetricsBar3.vue"

const currentYear = computed(() => new Date().getFullYear())

const previewCard = {
  source: "Upwork",
  name: "E-Commerce Platform",
  iconName: "serverOutline",
  description: "Full-stack e-commerce redesign with real-time inventory management and payment integration.",
  url: "#",
  technologies: [
    { iconName: "logoVue", name: "Vue" },
    { iconName: "logoNodejs", name: "Node" },
    { iconName: "logoJavascript", name: "JS" },
    { iconName: "logoAmazon", name: "AWS" },
  ],
}

const mockName = "Ben Mills"
const mockRoles = ["Developer", "UI/UX Designer", "Creative Thinker"]

const mockProjects = [
  {
    source: "Upwork",
    name: "E-Commerce Platform",
    iconName: "serverOutline",
    description: "Full-stack e-commerce redesign with real-time inventory management and payment integration.",
    url: "#",
    technologies: [
      { iconName: "logoVue", name: "Vue" },
      { iconName: "logoNodejs", name: "Node" },
      { iconName: "logoJavascript", name: "JS" },
      { iconName: "logoAmazon", name: "AWS" },
    ],
  },
  {
    source: "Workana",
    name: "CRM Dashboard",
    iconName: "terminalOutline",
    description: "Analytics dashboard for client relationship management with real-time reporting.",
    url: "#",
    technologies: [
      { iconName: "logoReact", name: "React" },
      { iconName: "logoPython", name: "Python" },
      { iconName: "logoDocker", name: "Docker" },
    ],
  },
  {
    source: "Penglabs",
    name: "AI Chat Platform",
    iconName: "compassOutline",
    description: "Conversational AI platform with multi-language support and real-time translation.",
    url: "#",
    technologies: [
      { iconName: "logoPython", name: "Python" },
      { iconName: "logoFirebase", name: "Firebase" },
      { iconName: "logoAngular", name: "Angular" },
    ],
  },
]

const mockMainIcons = [
  { name: "Vue", iconName: "logoVue" },
  { name: "React", iconName: "logoReact" },
  { name: "Node", iconName: "logoNodejs" },
  { name: "Laravel", iconName: "logoLaravel" },
]

const mockBackgroundTechs = [
  { name: "TypeScript" },
  { name: "Python" },
  { name: "Docker" },
  { name: "AWS" },
  { name: "Firebase" },
  { name: "Sass" },
  { name: "Ionic" },
  { name: "Git" },
  { name: "CSS" },
  { name: "HTML" },
]

const mockExperience = [
  {
    source: "Full-time",
    name: "Senior Full-Stack Developer",
    iconName: "codeSlashOutline",
    description: "Arquitectura y desarrollo de aplicaciones web full-stack con Vue 3, Node.js y Docker.",
    url: "#",
    startDate: "2022-01",
    endDate: undefined,
    technologies: [
      { iconName: "logoVue", name: "Vue" },
      { iconName: "logoNodejs", name: "Node" },
      { iconName: "logoDocker", name: "Docker" },
    ],
  },
  {
    source: "Remoto",
    name: "UI/UX Designer",
    iconName: "colorPaletteOutline",
    description: "Diseño e implementación de interfaces de usuario para aplicaciones SaaS.",
    url: "#",
    startDate: "2020-06",
    endDate: "2021-12",
    technologies: [
      { iconName: "logoSass", name: "Sass" },
      { iconName: "logoReact", name: "React" },
    ],
  },
  {
    source: "Híbrido",
    name: "Frontend Developer",
    iconName: "phonePortraitOutline",
    description: "Desarrollo de aplicaciones móviles híbridas con Ionic y Angular.",
    url: "#",
    startDate: "2018-03",
    endDate: "2020-05",
    technologies: [
      { iconName: "logoJavascript", name: "JS" },
      { iconName: "logoAngular", name: "Angular" },
      { iconName: "logoIonic", name: "Ionic" },
    ],
  },
]

const mockFreelancePlatforms = [
  { id: "1", name: "Upwork", image: "", url: "#" },
  { id: "2", name: "Workana", image: "", url: "#" },
]

const mockComments = [
  {
    source: "Upwork",
    name: "Excelente trabajo",
    iconName: "chatbubblesOutline",
    description: "Profesional y dedicado. Entregó todo a tiempo con calidad excepcional.",
    url: "#",
    rating: 5,
    technologies: [],
  },
  {
    source: "Workana",
    name: "Muy recomendable",
    iconName: "chatbubblesOutline",
    description: "Gran comunicación y resultados impresionantes. Volvería a trabajar con él.",
    url: "#",
    rating: 5,
    technologies: [],
  },
  {
    source: "Fiverr",
    name: "Profesional top",
    iconName: "chatbubblesOutline",
    description: "Resolvió problemas complejos con soluciones elegantes. Un placer colaborar.",
    url: "#",
    rating: 4,
    technologies: [],
  },
]

const navItems = [
  { label: "PROYECTOS", href: "#projects" },
  { label: "SKILLS", href: "#skills" },
  { label: "EXPERIENCIA", href: "#experience" },
  { label: "CONTACTO", href: "#collaboration" },
]

const contentRef = ref()

function scrollToSection(href: string) {
  const el = document.querySelector(href)
  if (!el || !contentRef.value) return
  contentRef.value.$el.scrollToPoint(0, el.offsetTop, 500)
}
</script>

<style scoped>
.template3-header {
  --background: transparent;
}

.header-toolbar {
  --background: transparent;
  --border-width: 0;
  --padding-top: 0;
  --padding-bottom: 0;
  --padding-start: 1.25rem;
  --padding-end: 1.25rem;
}

.header-logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  margin-left: 0.5rem;
}

.logo-img {
  width: 36px;
  height: 36px;
  object-fit: contain;
  display: block;
}

.logo-text {
  font-family: var(--font-family-mono, "Courier New", Courier, monospace);
  font-size: 0.85rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: lowercase;
  color: #111;
}

.nav-button {
  font-family: var(--font-family-mono, "Courier New", Courier, monospace);
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  --color: #555;
  --color-hover: #111;
  --padding-start: 0.75rem;
  --padding-end: 0.75rem;
  --background-hover: transparent;
  --ripple-color: transparent;
}

.mobile-menu-trigger {
  display: none;
}

.projects-header {
  margin-bottom: 2rem;
  border-left: 4px solid #111;
  padding-left: 1rem;
}

.projects-inner {
  max-width: 1400px;
  width: 100%;
  margin: 0 auto;
}

.projects-heading {
  font-family: var(--font-family-primary, "Rubik", sans-serif);
  font-size: 1.75rem;
  font-weight: 700;
  color: #111;
  margin: 0 0 0.5rem;
}

.projects-sub {
  font-family: var(--font-family-primary, "Rubik", sans-serif);
  font-size: 0.9rem;
  color: #888;
  margin: 0;
  letter-spacing: 0.02em;
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1px;
  background: #e5e5e5;
  border: 1px solid #e5e5e5;
  border-radius: 0;
  overflow: hidden;
}

.platforms-row {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.platform-link {
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #555;
  text-decoration: none;
  border: 1px solid #d4d4d4;
  padding: 0.4rem 1rem;
  transition: background 0.2s ease, color 0.2s ease;
}

.platform-link:hover {
  background: #111;
  color: #fff;
  border-color: #111;
}

.projects-inner,
.projects-header,
.projects-grid,
.platforms-row {
  position: relative;
  z-index: 1;
}

.bp-section {
  padding: 2.5rem 2rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  position: relative;
}

.bp-section::before {
  content: "";
  position: absolute;
  inset: 0;
  background-image: radial-gradient(circle, #bbb 1px, transparent 1px);
  background-size: 24px 24px;
  opacity: 0.6;
  pointer-events: none;
  z-index: 0;
}

.bp-section-hero {
  height: 100dvh;
}

.bp-section-projects {
  height: 100dvh;
}

.bp-section-skills {
  height: 100dvh;
}

.bp-section-experience {
  height: 100dvh;
}

.bp-section-collaboration {
  height: 100dvh;
}

@media (min-width: 900px) {
  .projects-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.template3-footer {
  --background: #fafafa;
  --border-width: 0;
}

.footer-inner {
  padding: 1.5rem 2.5rem;
  text-align: center;
}

.footer-text {
  font-size: 0.8rem;
  color: #999;
  margin: 0;
  letter-spacing: 0.02em;
}

.metrics-wrapper {
  display: flex;
  justify-content: center;
  padding: 0;
  margin-top: 2rem;
}

@media (max-width: 768px) {
  .metrics-wrapper {
    margin-top: 1.5rem;
  }
}

@media (max-width: 768px) {
  .logo-text {
    font-size: 0.75rem;
  }

  .mobile-menu-trigger {
    display: block;
  }

  .header-toolbar {
    --padding-start: 0.75rem;
    --padding-end: 0.75rem;
  }

  .bp-section {
    padding: 1.5rem 1rem;
  }

  .bp-section-projects {
    height: 100dvh;
  }

  .bp-section-skills {
    height: 100dvh;
  }

  .bp-section-experience {
    height: 100dvh;
  }

  .bp-section-collaboration {
    height: 100dvh;
  }

  .footer-inner {
    padding: 1rem 1.5rem;
  }
}

/* Preview card comparison */
.preview-variants {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1px;
  background: #e5e5e5;
  border: 1px solid #e5e5e5;
  margin-bottom: 2rem;
}

.preview-col {
  position: relative;
}

.preview-label {
  position: absolute;
  top: -1.75rem;
  left: 0;
  font-family: var(--font-family-mono, "Courier New", Courier, monospace);
  font-size: 0.55rem;
  font-weight: 600;
  color: #999;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.section-divider {
  height: 1px;
  background: #bbb;
  margin: 2rem 0;
}

/* TEMPORAL: diagnostic section colors */
.bp-section-hero { background: rgba(255, 0, 0, 0.08); }
.bp-section-projects { background: rgba(0, 0, 255, 0.08); }
.bp-section-skills { background: rgba(0, 255, 0, 0.08); }
.bp-section-experience { background: rgba(255, 255, 0, 0.1); }
.bp-section-collaboration { background: rgba(255, 0, 255, 0.08); }
</style>
