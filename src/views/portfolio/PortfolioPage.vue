<template>
  <ion-header class="ion-no-border" mode="ios">
    <ion-toolbar class="container-page">
      <ion-buttons slot="start" :mode="designMode">
        <ion-menu-button menu="mainMenu" :mode="designMode"></ion-menu-button>
      </ion-buttons>

      <ion-title>{{ pageTitle }}</ion-title>

      <ion-buttons slot="end" :mode="designMode">
        <!-- selector -->
        <ion-select
          v-if="screenSize.preset != 'xs'"
          v-model="typeContent"
          interface="popover"
        >
          <ion-select-option value="projectsB">
            Proyectos del blog
          </ion-select-option>

          <ion-select-option value="projectsP">
            Proyectos profesionales
          </ion-select-option>
        </ion-select>
      </ion-buttons>
    </ion-toolbar>

    <ion-toolbar>
      <div class="center" style="width: 100%">
        <ion-select
          v-if="screenSize.preset == 'xs'"
          v-model="typeContent"
          :mode="designMode"
          style="width: auto"
          interface="popover"
        >
          <ion-select-option value="projectsB">
            Proyectos del blog
          </ion-select-option>

          <ion-select-option value="projectsP">
            Proyectos profesionales
          </ion-select-option>
        </ion-select>
      </div>
    </ion-toolbar>
  </ion-header>

  <ion-content>
    <ion-row class="ion-justify-content-center" style="display: flex">
      <ion-col size-xs="12" size-md="6" size-lg="6">
        <ProfessionalProjectsPage v-if="typeContent == 'projectsP'" />
        <BloglProjectsPage v-if="typeContent == 'projectsB'" />
      </ion-col>
    </ion-row>
  </ion-content>
</template>

<script setup lang="ts">
import { IonSelect, IonSelectOption, isPlatform } from "@ionic/vue";
import { ref } from "vue";

// components
import ProfessionalProjectsPage from "../../components/portfolio/professional-projects/ProfessionalProjectsPage.vue";
import BloglProjectsPage from "../../components/portfolio/blog-projects/BlogProjectsPage.vue";

// props component
const emits = defineEmits(["scrollPosition"]);
// end props component

// interface
import { DesignMode } from "@/utils/types";
// end interface

// componentes
import SystemController from "@/controllers/systemController";
const systemController = new SystemController();
// end componentes

// vars
const designMode = ref<DesignMode>(systemController.getdesignMode());
const typeContent = ref("projectsP");
const pageTitle = "Proyectos";
const screenSize = ref(systemController.getScreenSize());
// end vars
</script>

<style scoped>
.container {
  width: 60%;
}
</style>
