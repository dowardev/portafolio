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
        <ion-segment-button
          value="historia"
          @click="$router.push('/informacion/historia')"
        >
          <ion-label>Historia</ion-label>
        </ion-segment-button>
        <ion-segment-button
          value="habilidades"
          @click="$router.push('/informacion/habilidades')"
        >
          <ion-label>Habilidades</ion-label>
        </ion-segment-button>
        <ion-segment-button
          value="proyectos"
          @click="$router.push('/informacion/proyectos')"
        >
          <ion-label>Proyectos</ion-label>
        </ion-segment-button>
      </ion-segment>
    </ion-toolbar>

    <router-view></router-view>
  </ion-page>
</template>

<script lang="ts">
import { IonPage, IonSegment, IonSegmentButton, IonButtons } from "@ionic/vue";
import { defineComponent } from "vue";
import { chevronBackOutline } from "ionicons/icons";

export default defineComponent({
  components: {
    IonPage,
    IonSegment,
    IonSegmentButton,
    IonButtons,
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
