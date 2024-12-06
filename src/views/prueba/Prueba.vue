<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title> Prueba </ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-row>
        <ion-col size="4">
          <ion-card class="danger-select-animated-active">
            <ion-card-content>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Officiis,
              numquam. Praesentium cum rem modi porro, a voluptatibus quas nulla
              iure nam corrupti omnis aspernatur. Similique, error. Inventore
              est hic expedita!
            </ion-card-content>
          </ion-card>
        </ion-col>
      </ion-row>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonPage,
} from "@ionic/vue";
import { defineComponent } from "vue";

export default defineComponent({
  components: { IonContent, IonHeader, IonTitle, IonToolbar },
});
</script>
