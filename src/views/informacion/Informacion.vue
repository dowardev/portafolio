<template>
  <ion-page>
    <ion-content>
      <ion-segment v-model="segment">
        <ion-button fill="clear" v-on:click="$router.push('/')">
          <ion-icon :icon="arrowBack"></ion-icon>
        </ion-button>
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

      <ion-col size="12" v-if="segment == 'historia'">
        <historia />
      </ion-col>
      <ion-col size="12" v-if="segment == 'habilidades'">
        <habilidades />
      </ion-col>
      <ion-col size="12" v-if="segment == 'proyectos'">
        <proyectos />
      </ion-col>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { IonPage, IonContent, IonSegment, IonSegmentButton } from "@ionic/vue";
import { defineComponent } from "vue";
import Habilidades from "../habilidades/Habilidades.vue";
import Proyectos from "../proyectos/Proyectos.vue";
import { arrowBack } from "ionicons/icons";
import Historia from "../historia/Historia.vue";

export default defineComponent({
  components: {
    IonPage,
    IonContent,
    IonSegment,
    IonSegmentButton,
    Habilidades,
    Proyectos,
    Historia,
  },
  data() {
    return {
      segment: "historia",
    };
  },
  setup() {
    return {
      arrowBack,
    };
  },
});
</script>
