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
              @click="navigate(item.route)"
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
import { IonCard, IonCol, IonGrid, IonIcon, IonItem, IonLabel, IonList, IonListHeader, IonRow } from "@ionic/vue";
import { useRouter, useRoute } from "vue-router";
import {
  personOutline,
  codeSlashOutline,
  barChartOutline,
  briefcaseOutline,
  folderOutline,
  ribbonOutline,
  peopleOutline,
} from "ionicons/icons";

const router = useRouter();
const route = useRoute();

const menuItems = [
  {
    section: "info",
    label: "Info",
    icon: personOutline,
    route: "/admin-panel/info",
    color: "#5B8DEF",
  },
  {
    section: "stack",
    label: "Stack",
    icon: codeSlashOutline,
    route: "/admin-panel/stack",
    color: "#4ECB71",
  },
  {
    section: "categories",
    label: "Categorías",
    icon: barChartOutline,
    route: "/admin-panel/skills-categories",
    color: "#F5A623",
  },
  {
    section: "experience",
    label: "Experiencia",
    icon: briefcaseOutline,
    route: "/admin-panel/experience",
    color: "#2DD4BF",
  },
  {
    section: "projects",
    label: "Proyectos",
    icon: folderOutline,
    route: "/admin-panel/projects",
    color: "#8B5CF6",
  },
  {
    section: "certificates",
    label: "Certificados",
    icon: ribbonOutline,
    route: "/admin-panel/certificates",
    color: "#D4A843",
  },
  {
    section: "freelance",
    label: "Freelance",
    icon: peopleOutline,
    route: "/admin-panel/freelance",
    color: "#EC4899",
  },
];

function navigate(target: string) {
  if (route.path === target) return;
  router.push(target);
}
</script>

<style scoped>
.full-height {
  padding-top: 10vh;
}
</style>
