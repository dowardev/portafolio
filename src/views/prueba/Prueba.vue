<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title> Prueba </ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-row>
        <ion-col size="12">
          <SuccessCard
            color="success"
            cardTitle="Tarjeta de prueba success"
            :border="true"
            cardContent=" Lorem ipsum dolor sit amet consectetur adipisicing elit. Expedita omnis modi
  vel fugiat ut, et debitis soluta, excepturi optio nam vero eum nostrum enim
  atque praesentium, quis consectetur iure ipsam!"
            :icon="ellipsisVerticalOutline"
          />
        </ion-col>
      </ion-row>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonPage,
} from "@ionic/vue";

import SuccessCard from "@/components/cards/CardAlert.vue";
import { ellipsisVerticalOutline } from "ionicons/icons";
</script>
