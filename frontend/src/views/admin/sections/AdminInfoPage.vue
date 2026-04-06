<template>
  <ion-header class="ion-no-border" mode="ios">
    <ion-toolbar>
      <ion-buttons slot="start">
        <ion-back-button default-href="/admin-panel"></ion-back-button>
      </ion-buttons>

      <ion-title>Info</ion-title>

      <ion-buttons slot="end">
        <ion-button
          v-if="isDev"
          v-tooltip="{
            content: 'Llenar datos de prueba',
            delay: [500, 0],
            touch: 'hold',
          }"
          color="warning"
          @click="infoEditorRef?.fillTestData()"
        >
          <ion-icon :icon="bugOutline"></ion-icon>
        </ion-button>

        <ion-button
          v-tooltip="'Guardar cambios'"
          :disabled="homeEditorStore.saving"
          @click="homeEditorStore.save()"
        >
          <ion-spinner
            v-if="homeEditorStore.saving"
            slot="start"
            name="crescent"
          ></ion-spinner>
          <ion-icon :icon="saveOutline"></ion-icon>
        </ion-button>
      </ion-buttons>
    </ion-toolbar>
  </ion-header>

  <ion-content class="ion-padding">
    <ion-grid>
      <ion-row class="ion-justify-content-center">
        <ion-col size="4">
          <InfoEditor ref="infoEditorRef" />
        </ion-col>
      </ion-row>
    </ion-grid>
  </ion-content>
</template>

<script setup lang="ts">
import { vTooltip } from "@/directives/tooltip";
// register directive locally for this SFC
defineOptions({
  directives: { tooltip: vTooltip },
});
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonBackButton,
  IonContent,
  IonButton,
  IonSpinner,
} from "@ionic/vue";
import { ref, onMounted } from "vue";
import InfoEditor from "../editors/InfoEditor.vue";
import { useHomeEditorStore } from "@/store/homeEditorStore";
import { bugOutline, saveOutline } from "ionicons/icons";

const homeEditorStore = useHomeEditorStore();
const infoEditorRef = ref<InstanceType<typeof InfoEditor>>();
const isDev = import.meta.env.DEV;

onMounted(() => {
  homeEditorStore.loadData();
});
</script>
