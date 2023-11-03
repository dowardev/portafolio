<template>
  <div>
    <ion-toolbar mode="md">
      <ion-buttons slot="start">
        <ion-menu-button menu="mainMenu" mode="md"></ion-menu-button>
      </ion-buttons>

      <ion-title v-if="showTitle || isPlatform('desktop')" class="fade-in">{{
        props.pageTitle
      }}</ion-title>
      <ion-buttons
        slot="end"
        :class="{ adaptiveSegment: showTitle && !isPlatform('desktop') }"
      >
        <ion-segment
          :value="props.mainSegment"
          :scrollable="true"
          @ion-change="emits('mainsegment', $event.detail.value as string)"
        >
          <ion-segment-button value="skills">Habilidades</ion-segment-button>
          <ion-segment-button value="history">Historia</ion-segment-button>
          <ion-segment-button value="portfolio">Portfolio</ion-segment-button>
        </ion-segment>
      </ion-buttons>
    </ion-toolbar>
  </div>
</template>

<script setup lang="ts">
import {
  IonPage,
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
  showTitle: { type: Boolean, required: true, default: false },
  pageTitle: { type: String, required: true, default: "Inicio" },
});
const emits = defineEmits(["mainsegment"]);
</script>

<style scoped>
.fade-in {
  animation: fade-in-animation 1s ease-in;
}

@keyframes fade-in-animation {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

.adaptiveSegment {
  width: 50%;
}
</style>
