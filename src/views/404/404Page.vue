<template>
  <ion-page>
    <ion-header
      :translucent="true"
      collapse="fade"
      mode="ios"
      class="ion-no-border"
    >
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button menu="mainMenu" mode="md"></ion-menu-button>
        </ion-buttons>
        <ion-title>{{ pageTitle }}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-header collapse="condense" mode="ios">
        <ion-toolbar>
          <ion-title size="large">{{ pageTitle }}</ion-title>
        </ion-toolbar>
      </ion-header>

      <div class="align-vertical">
        <section class="center">
          <ion-item lines="none">
            <ion-icon slot="start" :icon="banOutline" color="danger"></ion-icon>
            <ion-label color="danger">Pagina no encontrada</ion-label>
          </ion-item>
        </section>

        <section>
          <ion-button expand="block" fill="clear" @click="openReportError()"
            >Reportar</ion-button
          >
        </section>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonItem,
  IonButton,
  IonLabel,
  IonIcon,
} from "@ionic/vue";
import { banOutline } from "ionicons/icons";
import { useSystem } from "../../composables/useSystem";
import { useRoute } from "vue-router";

const route = useRoute();

const pageTitle = "404";
const reportError = useSystem().reportError;

// functions
function openReportError() {
  const error404 = {
    page: route,
  };
  reportError({ error: error404, type: "error" });
}
</script>

<style scoped>
.align-vertical {
  position: absolute;
  left: 50%;
  top: 50%;
  -webkit-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
}
</style>
