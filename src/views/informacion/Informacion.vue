<template>
  <ion-page>
    <ion-toolbar>
      <ion-buttons slot="start" v-on:click="$router.push('/')">
        <ion-button>
          <ion-icon :icon="chevronBackOutline"></ion-icon>
        </ion-button>
      </ion-buttons>
      <ion-segment
        v-model="segment"
        scrollable="true"
        class="hide-scroll-y hide-scroll"
      >
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

    <ion-content>
      <Historia v-if="segment == 'historia'"></Historia>
      <Habilidades v-if="segment == 'habilidades'"></Habilidades>
      <Proyectos v-if="segment == 'proyectos'"></Proyectos>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import {
  IonPage,
  IonToolbar,
  IonSegment,
  IonSegmentButton,
  IonButtons,
  IonContent,
} from "@ionic/vue";
import { defineComponent } from "vue";
import { chevronBackOutline } from "ionicons/icons";
import Historia from "../historia/Historia.vue";
import Habilidades from "../habilidades/Habilidades.vue";
import Proyectos from "../proyectos/Proyectos.vue";

export default defineComponent({
  components: {
    IonPage,
    IonToolbar,
    IonSegment,
    IonSegmentButton,
    IonButtons,
    IonContent,
    Historia,
    Habilidades,
    Proyectos,
  },
  data() {
    return {
      segment: "historia",
    };
  },
  setup() {
    return {
      chevronBackOutline,
    };
  },
});
</script>

<style scope>
ion-segment {
  --background: #23232f;
}
ion-segment-button {
  --color-checked: #e64e81;
}
ion-toolbar {
  --background: #23232f;
}
.hide-scroll-y {
  overflow-y: scroll; /* Add the ability to scroll */
}

/* Hide scrollbar for Chrome, Safari and Opera */
.hide-scroll::-webkit-scrollbar {
  display: none;
}

/* Hide scrollbar for IE, Edge and Firefox */
.hide-scroll {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}
</style>
