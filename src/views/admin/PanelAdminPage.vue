<template>
  <ion-header class="ion-no-border" mode="ios">
    <ion-toolbar class="container-page">
      <ion-buttons slot="start">
        <ion-menu-button menu="mainMenu" mode="md"></ion-menu-button>
      </ion-buttons>

      <ion-title>{{ pageTitle }}</ion-title>

      <ion-buttons slot="end">
        <ion-segment
          :value="mainSegment"
          :mode="designElements"
          scrollable
          @ion-change="mainSegment = $event.detail.value?.toString() || ''"
        >
          <ion-segment-button value="posts">
            <ion-label>Posts</ion-label>
          </ion-segment-button>

          <ion-segment-button value="users">
            <ion-label>Usuarios</ion-label>
          </ion-segment-button>
        </ion-segment>
      </ion-buttons>
    </ion-toolbar>
  </ion-header>

  <ion-content class="container-page">
    <section v-if="mainSegment == 'users'">
      <UsersComponent
        @on-content-loaded="
          toggleLoader({ show: $event == true ? false : true })
        "
      />
    </section>
  </ion-content>
</template>

<script setup lang="ts">
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonSegment,
  IonSegmentButton,
  isPlatform,
} from "@ionic/vue";
import { onMounted, ref } from "vue";
import UsersComponent from "./users/UsersPage.vue";

// controllers
import SystemController from "@/controllers/systemController";
const systemController = new SystemController();

const pageTitle = "Panel Administrador";
const mainSegment = ref("users");
const designElements = isPlatform("ios") ? "ios" : "md";

onMounted(() => {
  toggleLoader({ show: true });
});

// functions
function toggleLoader(params: { show: boolean }) {
  const { show } = params;
  if (show) {
    systemController.enableLoader({ color: "primary" });
  } else {
    systemController.disableLoader();
  }
}

function pr(e) {
  console.log(e);
}
</script>
