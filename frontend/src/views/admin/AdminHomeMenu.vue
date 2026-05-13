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
          </ion-card>
        </ion-list>
      </ion-col>
    </ion-row>
  </ion-grid>
</template>

<script setup lang="ts">
import { IonCard, IonCol, IonGrid, IonIcon, IonItem, IonLabel, IonList, IonListHeader, IonRow, alertController } from "@ionic/vue";
import { useRouter, useRoute } from "vue-router";
import UserController from "@/controllers/userController";
import {
  personOutline,
  codeSlashOutline,
  barChartOutline,
  briefcaseOutline,
  folderOutline,
  ribbonOutline,
  peopleOutline,
  keyOutline,
  chatbubblesOutline,
} from "ionicons/icons";

const router = useRouter();
const route = useRoute();
const userController = new UserController();

interface MenuItem {
  section: string;
  label: string;
  icon: object;
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
    section: "stack",
    label: "Stack",
    icon: codeSlashOutline,
    route: "/admin-panel/stack",
    color: "#4ECB71",
    permissions: ['stacks.create', 'stacks.update', 'stacks.delete'],
  },
  {
    section: "categories",
    label: "Categorías",
    icon: barChartOutline,
    route: "/admin-panel/skills-categories",
    color: "#F5A623",
    permissions: ['skills-categories.create', 'skills-categories.update', 'skills-categories.delete'],
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
    section: "permissions",
    label: "Permisos",
    icon: keyOutline,
    route: "/admin-panel/permissions",
    color: "#EF4444",
    role: 'admin',
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

  router.push(target);
}
</script>

<style scoped>
.full-height {
  padding-top: 10vh;
}
</style>
