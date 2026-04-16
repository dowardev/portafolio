<template>
  <ion-header class="ion-no-border" mode="ios">
    <ion-toolbar class="container-page">
      <ion-buttons slot="start">
        <ion-menu-button menu="mainMenu"></ion-menu-button>
      </ion-buttons>

      <ion-title>{{ pageTitle }}</ion-title>
    </ion-toolbar>
  </ion-header>

  <ion-content>
    <ion-row
      class="ion-justify-content-center"
      style="display: flex; overflow: auto; max-height: calc(100% - 8dvh)"
    >
      <ion-col size-xs="12" size-sm="8" size-lg="6">
        <ProjectsComponent :filter="typeContent" />
      </ion-col>
    </ion-row>
  </ion-content>
</template>

<script setup lang="ts">
import { ref } from "vue";

import ProjectsComponent from "@/components/projects/ProjectsComponent.vue";

const typeContent = ref<"all" | "personal" | "professional">("professional");
const pageTitle = "Proyectos";
</script>

<style scoped>
.container {
  width: 60%;
}
</style>