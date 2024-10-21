<template>
  <ion-page>
    <ion-header class="ion-no-border">
      <ion-toolbar class="container-page">
        <ion-buttons slot="start">
          <ion-menu-button menu="mainMenu" mode="md"></ion-menu-button>
        </ion-buttons>
        <ion-title>{{ pageTitle }}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="container-page">
      <ion-header collapse="condense" mode="ios">
        <ion-toolbar>
          <ion-title size="large">{{ pageTitle }}</ion-title>
        </ion-toolbar>
      </ion-header>

      <ion-item-divider sticky>
        <ion-segment v-model="mainSegment" scrollable>
          <ion-segment-button value="posts">
            <ion-label>Posts</ion-label>
          </ion-segment-button>

          <ion-segment-button value="users">
            <ion-label>Usuarios</ion-label>
          </ion-segment-button>
        </ion-segment>
      </ion-item-divider>

      <section v-if="mainSegment == 'users'">
        <UsersComponent />
      </section>
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
  IonSegment,
  IonSegmentButton,
} from "@ionic/vue";
import { ref } from "vue";
import UsersComponent from "./users/UsersPage.vue";

const pageTitle = "Panel Administrador";
const mainSegment = ref("users");
</script>
