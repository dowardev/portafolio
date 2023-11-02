<template>
  <ion-toolbar>
    <ion-buttons slot="start">
      <ion-menu-button
        menu="mainMenu"
        :mode="modeDesingElements"
      ></ion-menu-button>
    </ion-buttons>

    <ion-title>Bienvenido</ion-title>

    <ion-buttons slot="end">
      <ion-segment
        :value="props.mainSegment"
        @ion-change="emits('mainsegment', $event.detail.value as string)"
      >
        <ion-segment-button value="skills">Habilidades</ion-segment-button>
        <ion-segment-button value="history">Historia</ion-segment-button>
        <ion-segment-button value="portfolio">Portfolio</ion-segment-button>
      </ion-segment>
    </ion-buttons>
  </ion-toolbar>
</template>

<script setup lang="ts">
import {
  IonButtons,
  IonMenuButton,
  IonSegment,
  IonSegmentButton,
} from "@ionic/vue";
import { isPlatform } from "@ionic/vue";

const props = defineProps({
  mainSegment: {
    type: String,
    required: true,
    validator: (value: any) => {
      return ["skills", "history", "portfolio"].includes(value);
    },
  },
});
const emits = defineEmits(["mainsegment"]);
const modeDesingElements = isPlatform("ios") ? "ios" : ("md" as "ios" | "md");
</script>
