<template>
  <div>
    <ion-toolbar>
      <ion-buttons slot="start">
        <ion-menu-button menu="mainMenu" mode="md"></ion-menu-button>
      </ion-buttons>

      <ion-title v-if="showTitle || isPlatform('desktop')">{{
        props.pageTitle
      }}</ion-title>

      <ion-buttons
        slot="end"
        :class="{ adaptiveSegment: showTitle && !isPlatform('desktop') }"
      >
        <ion-segment value="props.mainSegment" mode="md" :scrollable="true">
          <ion-segment-button value="privacy">
            <ion-label>Privacidad</ion-label>
          </ion-segment-button>

          <ion-segment-button value="tc" :disabled="true">
            <ion-label>Términos y condiciones</ion-label>
          </ion-segment-button>
        </ion-segment>
      </ion-buttons>
    </ion-toolbar>
  </div>
</template>

<script setup lang="ts">
import {
  IonTitle,
  IonToolbar,
  IonSegment,
  IonSegmentButton,
  isPlatform,
} from "@ionic/vue";

const props = defineProps({
  mainSegment: { type: String, default: "privacy", required: true },
  showTitle: { type: Boolean, required: true, default: false },
  pageTitle: { type: String, required: true, default: "Inicio" },
});
</script>

<style scoped>
.important-text {
  font-weight: bold;
}

.div-main-content {
  max-height: 82vh;
  overflow: auto;
}

.adaptiveSegment {
  width: 50%;
}

@media only screen and (min-width: 768px) {
  .main-section {
    float: right;
  }
}
</style>
