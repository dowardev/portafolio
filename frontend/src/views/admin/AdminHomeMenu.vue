<template>
  <ion-grid class="full-height">
    <ion-row class="ion-justify-content-center">
      <ion-col size="12" size-md="10" size-lg="4">
        <ion-list>
          <ion-list-header>
            <ion-label>Opciones</ion-label>
          </ion-list-header>

          <ion-card class="shadow1">
            <ion-item
              v-for="item in menuItems"
              :key="item.section"
              button
              class="transparent"
              lines="full"
              @click="navigate(item.route, item)"
            >
              <ion-icon
                slot="start"
                :icon="item.icon"
                :style="{ color: item.color }"
              />

              <ion-label>{{ item.label }}</ion-label>
            </ion-item>

            <ion-item
              v-if="isDev"
              button
              class="transparent"
              lines="none"
              @click="openSeedModal"
            >
              <ion-icon
                slot="start"
                :icon="bugOutline"
                color="warning"
              />
              <ion-label color="warning">Datos de prueba</ion-label>
            </ion-item>
          </ion-card>
        </ion-list>
      </ion-col>
    </ion-row>
  </ion-grid>

  <ion-modal :is-open="showSeedModal" @did-dismiss="showSeedModal = false">
    <ion-header class="ion-no-border" mode="ios">
      <ion-toolbar style="--background: var(--ion-background-color)">
        <ion-buttons slot="start">
          <ion-button @click="showSeedModal = false">
            <ion-icon :icon="closeOutline"></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-title>Datos de prueba</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <ion-grid>
        <ion-row class="ion-justify-content-center">
          <ion-col size="12" size-md="8" size-lg="6">
            <p class="ion-text-center ion-padding-bottom">
              Selecciona las secciones para insertar datos de prueba
            </p>

            <ion-list>
              <ion-item>
                <ion-checkbox
                  slot="start"
                  :checked="selectedSections.size === seedSections.length"
                  @ion-change="toggleAll"
                />
                <ion-label>Seleccionar todo</ion-label>
              </ion-item>

              <ion-item
                v-for="s in seedSections"
                :key="s.id"
              >
                <ion-checkbox
                  slot="start"
                  :checked="selectedSections.has(s.id)"
                  @ion-change="toggleSection(s.id)"
                />
                <ion-icon
                  slot="start"
                  :icon="s.icon"
                  :style="{ color: s.color }"
                />
                <ion-label>{{ s.label }}</ion-label>
              </ion-item>
            </ion-list>

            <div class="ion-padding-top ion-text-center">
              <ion-button
                color="warning"
                :disabled="busy || selectedSections.size === 0"
                class="ion-margin-end"
                @click="handleSeed"
              >
                <ion-spinner
                  v-if="busy && seedBusy"
                  slot="start"
                  name="crescent"
                />
                <ion-icon v-else slot="start" :icon="bugOutline" />
                Sembrar
              </ion-button>

              <ion-button
                color="danger"
                fill="outline"
                :disabled="busy || selectedSections.size === 0"
                @click="handleClear"
              >
                <ion-spinner
                  v-if="busy && !seedBusy"
                  slot="start"
                  name="crescent"
                />
                <ion-icon v-else slot="start" :icon="trashOutline" />
                Vaciar
              </ion-button>
            </div>
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-content>
  </ion-modal>
</template>

<script setup lang="ts">
import {
  IonButton,
  IonButtons,
  IonCard,
  IonCheckbox,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonModal,
  IonRow,
  IonSpinner,
  IonTitle,
  IonToolbar,
  alertController,
} from "@ionic/vue";
import { ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import UserController from "@/controllers/userController";
import SeedController from "@/controllers/seedController";
import type { SeedSection } from "@/controllers/seedController";
import {
  personOutline,
  codeSlashOutline,
  briefcaseOutline,
  folderOutline,
  ribbonOutline,
  peopleOutline,
  keyOutline,
  chatbubblesOutline,
  bugOutline,
  closeOutline,
  searchOutline,
  trashOutline,
} from "ionicons/icons";

const router = useRouter();
const route = useRoute();
const userController = new UserController();
const seedController = new SeedController();
const isDev = import.meta.env.DEV;

const showSeedModal = ref(false);
const busy = ref(false);
const seedBusy = ref(false);
const selectedSections = ref<Set<SeedSection>>(new Set());

interface SeedSectionItem {
  id: SeedSection;
  label: string;
  icon: string;
  color: string;
}

const seedSections: SeedSectionItem[] = [
  { id: "info", label: "Info", icon: personOutline, color: "#5B8DEF" },
  { id: "skills", label: "Skills", icon: codeSlashOutline, color: "#4ECB71" },
  { id: "experience", label: "Experiencia", icon: briefcaseOutline, color: "#2DD4BF" },
  { id: "projects", label: "Proyectos", icon: folderOutline, color: "#8B5CF6" },
  { id: "certificates", label: "Certificados", icon: ribbonOutline, color: "#D4A843" },
  { id: "freelance-platform", label: "Plataformas Freelance", icon: briefcaseOutline, color: "#EC4899" },
  { id: "freelance-comments", label: "Comentarios Freelance", icon: chatbubblesOutline, color: "#8B5CF6" },
];

function openSeedModal() {
  selectedSections.value = new Set();
  showSeedModal.value = true;
}

function toggleSection(id: SeedSection) {
  const next = new Set(selectedSections.value)
  if (next.has(id)) {
    next.delete(id)
  } else {
    next.add(id)
  }
  selectedSections.value = next
}

function toggleAll() {
  if (selectedSections.value.size === seedSections.length) {
    selectedSections.value = new Set()
  } else {
    selectedSections.value = new Set(seedSections.map((s) => s.id))
  }
}

async function handleSeed() {
  if (selectedSections.value.size === 0 || busy.value) return

  busy.value = true
  seedBusy.value = true
  try {
    await seedController.seedSections({
      sections: Array.from(selectedSections.value),
    })
    showSeedModal.value = false
  } finally {
    busy.value = false
    seedBusy.value = false
  }
}

async function handleClear() {
  if (selectedSections.value.size === 0 || busy.value) return

  busy.value = true
  seedBusy.value = false
  try {
    await seedController.clearSections({
      sections: Array.from(selectedSections.value),
    })
    showSeedModal.value = false
  } finally {
    busy.value = false
  }
}

interface MenuItem {
  section: string;
  label: string;
  icon: string;
  route: string;
  color: string;
  role?: string;
  permissions?: string[];
}

const menuItems: MenuItem[] = [
  {
    section: "info",
    label: "Info",
    icon: personOutline,
    route: "/admin-panel/info",
    color: "#5B8DEF",
    permissions: ['intro.update'],
  },
  {
    section: "skills",
    label: "Skills",
    icon: codeSlashOutline,
    route: "/admin-panel/skills",
    color: "#4ECB71",
    permissions: ['stacks.create', 'stacks.update', 'stacks.delete', 'techs.create', 'techs.update', 'techs.delete'],
  },
  {
    section: "experience",
    label: "Experiencia",
    icon: briefcaseOutline,
    route: "/admin-panel/experience",
    color: "#2DD4BF",
    permissions: ['experiences.create', 'experiences.update', 'experiences.delete'],
  },
  {
    section: "projects",
    label: "Proyectos",
    icon: folderOutline,
    route: "/admin-panel/projects",
    color: "#8B5CF6",
    permissions: ['projects.create', 'projects.update', 'projects.delete'],
  },
  {
    section: "certificates",
    label: "Certificados",
    icon: ribbonOutline,
    route: "/admin-panel/certificates",
    color: "#D4A843",
    permissions: ['certificates.create', 'certificates.update', 'certificates.delete'],
  },
  {
    section: "freelance-platform",
    label: "Plataformas Freelance",
    icon: briefcaseOutline,
    route: "/admin-panel/freelance-platform",
    color: "#EC4899",
    permissions: ['freelance.create', 'freelance.update', 'freelance.delete'],
  },
{
            section: "freelance-comment",
            label: "Comentarios Freelance",
            icon: chatbubblesOutline,
            route: "/admin-panel/freelance-comments",
            color: "#8B5CF6",
            permissions: ['freelance-comments.create', 'freelance-comments.update', 'freelance-comments.delete'],
          },
{
  section: "sso-user-management",
  label: "Usuarios",
  icon: peopleOutline,
  route: import.meta.env.VITE_SSO_FRONTEND_URL + '/admin/users?sso_client_id=' + import.meta.env.VITE_SSO_CLIENT_ID,
  color: "#6366F1",
  role: 'admin',
},
          {
            section: "permissions",
            label: "Permisos",
            icon: keyOutline,
            route: "/admin-panel/permissions",
            color: "#EF4444",
            role: 'admin',
          },
          {
            section: "seo",
            label: "SEO",
            icon: searchOutline,
            route: "/admin-panel/seo",
            color: "#10B981",
            permissions: ['seo.update'],
          },
];

async function navigate(target: string, item: MenuItem) {
  if (route.path === target) return;

  if (item.role && !userController.hasRole({ slug: item.role })) {
    const alert = await alertController.create({
      header: 'Sin permisos',
      message: `Se requiere rol de ${item.role} para acceder a esta sección.`,
      buttons: ['OK'],
    });
    await alert.present();
    return;
  }

  if (item.permissions?.length && !userController.hasAnyPermission({ slugs: item.permissions })) {
    const alert = await alertController.create({
      header: 'Sin permisos',
      message: 'No tienes permisos para acceder a esta sección. Contacta al administrador.',
      buttons: ['OK'],
    });
    await alert.present();
    return;
  }

  // Handle external URLs (starting with http)
  if (target.startsWith('http')) {
    window.open(target, '_blank', 'noopener,noreferrer');
    return;
  }

  router.push(target);
}
</script>

<style scoped>
</style>
