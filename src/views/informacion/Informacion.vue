<template>
  <ion-page>
    <ion-toolbar>
      <ion-buttons slot="start" v-on:click="$router.push('/')">
        <ion-button>
          <ion-icon :icon="arrowBack"></ion-icon>
        </ion-button>
      </ion-buttons>
      <ion-segment v-model="segment" scrollable="true">
        <ion-segment-button value="historia">
          <ion-label>Historia</ion-label>
        </ion-segment-button>
        <ion-segment-button value="habilidades">
          <ion-label>Habilidades</ion-label>
        </ion-segment-button>
        <ion-segment-button value="proyectos">
          <ion-label>Proyectos</ion-label>
        </ion-segment-button>
      </ion-segment>
    </ion-toolbar>

    <historia v-if="segment == 'historia'" />
    <habilidades v-if="segment == 'habilidades'" />
    <proyectos v-if="segment == 'proyectos'" />
  </ion-page>
</template>

<script lang="ts">
import { IonPage, IonSegment, IonSegmentButton, IonButtons } from "@ionic/vue";
import { defineComponent } from "vue";
import { arrowBack } from "ionicons/icons";
import Historia from "../historia/Historia.vue";
import Habilidades from "../habilidades/Habilidades.vue";
import Proyectos from "../proyectos/Proyectos.vue";

export default defineComponent({
  components: {
    IonPage,
    Historia,
    Habilidades,
    Proyectos,
    IonSegment,
    IonSegmentButton,
    IonButtons,
  },
  data() {
    return {
      segment: "habilidades",
    };
  },
  setup() {
    return {
      arrowBack,
    };
  },
});
</script>
