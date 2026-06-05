<template>
  <ion-page>
    <ion-header class="ion-no-border template3-header" mode="ios">
      <ion-toolbar class="header-toolbar">
        <ion-buttons slot="start">
          <ion-menu-button class="mobile-menu-trigger" :auto-hide="false" color="dark" menu="mainMenu" aria-label="Abrir menú" />
          <a class="header-logo" href="#" @click.prevent="scrollToSection('#hero')">
            <img src="@/assets/portafolio/logo_dowar_2.1.png" alt="dowardev" class="logo-img" width="36" height="36" />
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
          <ion-button
            id="mobile-nav-trigger"
            class="mobile-nav-trigger"
            fill="clear"
            color="dark"
          >
            <ion-icon slot="icon-only" :icon="menuOutline" />
          </ion-button>
          <ion-popover
            trigger="mobile-nav-trigger"
            trigger-action="click"
            :show-backdrop="false"
            :dismiss-on-select="true"
            side="bottom"
            alignment="start"
          >
            <ion-content class="mobile-nav-popover">
              <ion-item
                v-for="item in navItems"
                :key="item.label"
                button
                lines="none"
                class="mobile-nav-item"
                @click="scrollToSection(item.href)"
              >
                <ion-label>{{ item.label }}</ion-label>
              </ion-item>
            </ion-content>
          </ion-popover>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content ref="contentRef">
      <section id="hero" class="bp-section bp-section-hero">
        <HeroSection3
          :name="name"
          :roles="roles"
          :nav-links="heroNavLinks"
        />
      </section>

      <section id="projects" class="bp-section bp-section-projects">
        <div class="projects-inner">
          <div class="projects-header">
            <h2 class="projects-heading">Proyectos recientes</h2>
            <p class="projects-sub">Selección de trabajos destacados</p>
          </div>

          <div class="projects-grid">
            <ProjectCard3
              v-for="card in projectCards"
              :key="'proj-' + card.index"
              v-bind="card"
            />
          </div>
        </div>
      </section>

<section id="skills" class="bp-section bp-section-skills">
  <div class="section-inner">
    <div class="section-header">
      <h2 class="section-heading">Skills</h2>
      <p class="section-sub">Tecnologías y herramientas</p>
    </div>

    <SkillsSection3
      :categories="mockSkillCategories"
    />
  </div>
</section>

        <section id="experience" class="bp-section bp-section-experience">
          <div class="section-inner">
            <div class="section-header">
              <h2 class="section-heading">Experiencia</h2>
              <p class="section-sub">Trayectoria profesional</p>
          </div>
          <div class="section-grid">
            <ProjectCard3
              v-for="exp in experienceCards"
              :key="'exp-' + exp.index"
              v-bind="exp"
            />
          </div>
        </div>
      </section>

        <section id="collaboration" class="bp-section bp-section-collaboration">
          <div class="section-inner">
            <div class="section-header">
              <h2 class="section-heading">Trabajemos juntos</h2>
              <p class="section-sub">Lo que dicen mis clientes</p>
            </div>

            <div class="platforms-row">
              <a
                v-for="p in freelancePlatforms"
                :key="p.id"
                :href="p.url"
                target="_blank"
                class="platform-link"
                rel="noopener noreferrer"
              >
                {{ p.name }}
              </a>
            </div>

          <div class="section-grid">
            <ProjectCard3
              v-for="comment in commentCards"
              :key="'cmt-' + comment.index"
              v-bind="comment"
            />
          </div>
          </div>
        </section>

      </ion-content>

      <ion-footer class="ion-no-border template3-footer">
        <div class="footer-inner">
          <p class="footer-text">
            &copy; {{ currentYear }} {{ name }}.
          </p>
        </div>
      </ion-footer>
    </ion-page>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from "vue"
import {
  IonButton,
  IonButtons,
  IonContent,
  IonFooter,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonMenuButton,
  IonPage,
  IonPopover,
  IonToolbar,
} from "@ionic/vue"
import { menuOutline } from "ionicons/icons"

import IntroController from "@/controllers/introController"
import ProjectsController from "@/controllers/projectsController"
import ExperienceController from "@/controllers/experienceController"
import FreelancePlatformController from "@/controllers/freelancePlatformController"
import FreelanceCommentController from "@/controllers/freelanceCommentController"
import { getIconByName } from "@/composables/iconsIndex"

import HeroSection3 from "@/views/presentation/sections/HeroSection3.vue"
import ProjectCard3 from "@/components/projects/ProjectCard3.vue"
import SkillsSection3 from "@/components/common/SkillsSection3.vue"

const introController = new IntroController()
const projectsController = new ProjectsController()
const experienceController = new ExperienceController()
const freelancePlatformController = new FreelancePlatformController()
const freelanceCommentController = new FreelanceCommentController()

const currentYear = computed(() => new Date().getFullYear())

const isMobile = ref(window.innerWidth <= 768)
function onResize() {
  isMobile.value = window.innerWidth <= 768
}

const introData = computed(() => introController.data.value || { name: null, tags: [], description: null, socials: [], logoUrl: null, photoUrl: null, showContactForm: { socials: false, freelance: false } })
const name = computed(() => introData.value.name || "...")
const roles = computed(() => (introData.value.tags || []).map(t => t.name))

const heroNavLinks = computed(() => {
  const tags = introData.value.tags || []
  return tags.map(t => ({ label: t.name.toUpperCase(), href: t.url || null }))
})

const projectCards = computed(() =>
  (projectsController.projects.value || []).slice(0, isMobile.value ? 3 : 6).map((p, i) => ({
    source: p.source?.name,
    name: p.title,
    description: p.details?.description || "",
    url: p.source?.url || "#",
    index: i + 1,
    technologies: (p.technologies || []).map(t => ({
      name: getIconByName(t.iconName)?.label || t.iconName
    }))
  }))
)

const experienceCards = computed(() =>
  (experienceController.experiences.value || []).slice(0, isMobile.value ? 3 : 6).map((e, i) => ({
    name: e.title,
    description: e.details?.description || "",
    url: e.details?.website || "#",
    startDate: e.startDate,
    endDate: e.endDate || undefined,
    index: i + 1,
    technologies: (e.technologies || []).map(t => ({
      name: getIconByName(t.iconName)?.label || t.iconName
    }))
  }))
)

const freelancePlatforms = computed(() =>
  freelancePlatformController.freelancePlatforms.value || []
)

const commentCards = computed(() =>
  (freelanceCommentController.freelanceComments.value || []).slice(0, isMobile.value ? 3 : 6).map((c, i) => ({
    name: c.title,
    description: c.text || "",
    rating: c.rating || 0,
    index: i + 1,
    technologies: [],
  }))
)

const mockSkillCategories = [
  {
    iconName: "logoVue",
    name: "Frontend",
    skills: ["Vue", "React", "TypeScript", "Sass", "Ionic", "CSS", "HTML"],
  },
  {
    iconName: "logoLaravel",
    name: "Backend",
    skills: ["Node", "Python", "Laravel", "Firebase"],
  },
  {
    iconName: "logoDocker",
    name: "DevOps & Tools",
    skills: ["Docker", "AWS", "Git"],
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
  const el = document.querySelector(href) as HTMLElement
  if (!el || !contentRef.value) return
  contentRef.value.$el.scrollToPoint(0, el.offsetTop, 500)
}

onMounted(async () => {
  window.addEventListener("resize", onResize)
  await Promise.all([
    introController.loadIntro(),
    projectsController.loadPublicProjects(),
    experienceController.loadPublicExperiences(),
    freelancePlatformController.loadFreelancePlatforms(),
    freelanceCommentController.loadFreelanceComments(),
  ])
})

onUnmounted(() => {
  window.removeEventListener("resize", onResize)
})
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

.nav-button:focus-visible {
  outline: 2px solid #111;
  outline-offset: 2px;
}

.mobile-menu-trigger {
  display: none;
}

.mobile-nav-trigger {
  display: none;
}

.mobile-nav-popover {
  --background: #f8f9fb;
}

.mobile-nav-item {
  --background: transparent;
  --color: #333;
  --min-height: 2.75rem;
  font-family: var(--font-family-mono, "Courier New", Courier, monospace);
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  --padding-start: 1.25rem;
}

.mobile-nav-item:hover {
  --background: #111;
  --color: #fff;
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

.section-inner {
  max-width: 1400px;
  width: 100%;
  margin: 0 auto;
}

.section-header {
  margin-bottom: 2rem;
  border-left: 4px solid #111;
  padding-left: 1rem;
}

.section-heading {
  font-family: var(--font-family-primary, "Rubik", sans-serif);
  font-size: 1.75rem;
  font-weight: 700;
  color: #111;
  margin: 0 0 0.5rem;
}

.section-sub {
  font-family: var(--font-family-primary, "Rubik", sans-serif);
  font-size: 0.9rem;
  color: #888;
  margin: 0;
  letter-spacing: 0.02em;
}

.section-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.platforms-row {
  display: flex;
  flex-wrap: wrap;
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

.platform-link:focus-visible {
  outline: 2px solid #111;
  outline-offset: 2px;
}

.projects-inner,
.projects-header,
.projects-grid,
.section-inner,
.section-header,
.section-grid,
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
  background-image:
    linear-gradient(rgba(0, 0, 0, 0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 0, 0, 0.04) 1px, transparent 1px);
  background-size: 40px 40px;
  pointer-events: none;
  z-index: 0;
}

.bp-section-hero {
  height: 100dvh;
  background: #f8f9fb;
}

.bp-section-projects {
  min-height: 100dvh;
  height: auto;
  background: #f0f2f5;
  scroll-margin-top: 56px;
}

.bp-section-skills {
  min-height: 100dvh;
  height: auto;
  background: #f8f9fb;
  scroll-margin-top: 56px;
}

.bp-section-experience {
  min-height: 100dvh;
  height: auto;
  background: #f3f4f7;
  scroll-margin-top: 56px;
}

.bp-section-collaboration {
  min-height: 100dvh;
  height: auto;
  background: #f0f2f5;
  scroll-margin-top: 56px;
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

@media (max-width: 768px) {
  .logo-text {
    font-size: 0.75rem;
  }

  .mobile-menu-trigger {
    display: block;
  }

  .mobile-nav-trigger {
    display: inline-flex;
  }

  .nav-button {
    display: none;
  }

  .header-toolbar {
    --padding-start: 0.75rem;
    --padding-end: 0.75rem;
  }

  .bp-section {
    padding: 1.5rem 1rem;
  }

  .projects-grid {
    grid-template-columns: 1fr;
  }

  .section-grid {
    grid-template-columns: 1fr;
  }

  .platforms-row {
    gap: 0.75rem;
  }

  .footer-inner {
    padding: 1rem 1.5rem;
  }
}

</style>
