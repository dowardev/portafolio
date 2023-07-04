<template>
  <!-- Projects -->
  <div
    style="
      background-color: var(--ion-background-light-color);
      position: sticky;
      top: -6px;
      z-index: 3;
    "
  >
    <ion-select v-model="typeContent" interface="popover">
      <ion-select-option value="shares">Participaciones</ion-select-option>
      <ion-select-option value="projectsB"
        >Proyectos del blog</ion-select-option
      >
      <ion-select-option value="projectsP"
        >Proyectos profesionales</ion-select-option
      >
    </ion-select>
  </div>

  <div v-if="typeContent == 'projectsP'">
    <ProfessionalProjectsPage></ProfessionalProjectsPage>
  </div>

  <div v-if="typeContent == 'shares'">
    <participationsPage></participationsPage>
  </div>

  <div v-if="typeContent == 'projectsB'">
    <BloglProjectsPage></BloglProjectsPage>
  </div>
</template>

<script setup lang="ts">
import { IonSelect, IonSelectOption } from "@ionic/vue";
import { ref } from "vue";

// components
import ProfessionalProjectsPage from "../../components/portfolio/professional-projects/ProfessionalProjectsPage.vue";
import BloglProjectsPage from "../../components/portfolio/blog-projects/BlogProjectsPage.vue";

const typeContent = ref("projectsP");
</script>
