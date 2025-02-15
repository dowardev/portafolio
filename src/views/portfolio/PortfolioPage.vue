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
          <ion-select-option value="all"> Todos </ion-select-option>

          <ion-select-option value="personal">
            Proyectos de personales
          </ion-select-option>

          <ion-select-option value="professional">
            Proyectos profesionales
          </ion-select-option>
        </ion-select>
      </ion-buttons>
    </ion-toolbar>

    <ion-toolbar v-if="screenSize.preset == 'xs'">
      <div class="center" style="width: 100%">
        <ion-select
          v-model="typeContent"
          :mode="designMode"
          style="width: auto"
          interface="popover"
        >
          <ion-select-option value="all"> Todos </ion-select-option>

          <ion-select-option value="personal">
            Proyectos personales
          </ion-select-option>

          <ion-select-option value="professional">
            Proyectos profesionales
          </ion-select-option>
        </ion-select>
      </div>
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
import { IonSelect, IonSelectOption } from "@ionic/vue";
import { ref } from "vue";

// props component
// end props component

// interface
import { DesignMode } from "@/utils/types";
// end interface

// components
import ProjectsComponent from "@/components/projects/ProjectsComponent.vue";
// end components

// componentes
import SystemController from "@/controllers/systemController";
const systemController = new SystemController();
// end componentes

// vars
const designMode = ref<DesignMode>(systemController.getdesignMode());
const typeContent = ref<"all" | "personal" | "professional">("professional");
const pageTitle = "Proyectos";
const screenSize = ref(systemController.getScreenSize());
// end vars
</script>

<style scoped>
.container {
  width: 60%;
}
</style>
