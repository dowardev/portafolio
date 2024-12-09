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
          <CardCode
            color="success"
            cardTitle="HTML"
            :border="true"
            cardContent="<pre><code><p>ssss</p></code></pre>"
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
import CardCode from "@/components/cards/CardCode.vue";
import { ellipsisVerticalOutline } from "ionicons/icons";
</script>
