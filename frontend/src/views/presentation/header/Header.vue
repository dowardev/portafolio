<template>
  <div>
    <ion-toolbar>
      <ion-buttons slot="start">
        <ion-menu-button menu="mainMenu"></ion-menu-button>
      </ion-buttons>

      <ion-title
        v-if="showTitle || isPlatform('desktop')"
        class="fade-in-title"
        >{{ props.pageTitle }}</ion-title
      >

      <ion-buttons
        slot="end"
        :class="{ adaptiveSegment: showTitle && !isPlatform('desktop') }"
      >
        <ion-segment
          :value="props.mainSegment"
          :scrollable="true"
          @ion-change="emits('mainsegment', $event.detail.value as string)"
        >
          <ion-segment-button value="categories">Habilidades</ion-segment-button>
          <ion-segment-button value="history">Historia</ion-segment-button>
          <ion-segment-button value="portfolio">Portfolio</ion-segment-button>
        </ion-segment>
      </ion-buttons>
    </ion-toolbar>
  </div>
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
      return ["categories", "history", "portfolio"].includes(value);
    },
  },
  showTitle: { type: Boolean, required: true, default: false },
  pageTitle: { type: String, required: true, default: "Inicio" },
});
const emits = defineEmits(["mainsegment"]);
</script>

<style scoped>
.adaptiveSegment {
  width: 50%;
}
</style>
