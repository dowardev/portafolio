<template>
  <ion-header mode="ios" class="ion-no-border">
    <ion-toolbar>
      <ion-buttons slot="start">
        <ion-button @click="closeModal()">
          <ion-icon :icon="closeOutline"></ion-icon>
        </ion-button>
      </ion-buttons>

      <ion-title>{{ pageTitle }}</ion-title>

      <ion-buttons slot="end">
        <ion-button
          :disabled="systemComposable.getUpdateStatus() == false"
          @click="updateApp()"
        >
          <ion-icon :icon="downloadOutline"></ion-icon>
        </ion-button>
      </ion-buttons>
    </ion-toolbar>
  </ion-header>

  <ion-content>
    <ion-row>
      <ion-col size="12">
        <ion-item lines="none">
          <ion-select
            label="Versiones"
            ok-text="Confirmar"
            cancel-text="Cancelar"
            interface="popover"
            :value="versionSelected"
            @ion-change="versionSelected = $event.detail.value"
          >
            <ion-select-option
              v-for="(version, index) in mainVersions"
              :key="index"
              :value="version"
              >{{ version }}</ion-select-option
            >
          </ion-select>
        </ion-item>
      </ion-col>
    </ion-row>

    <ion-row style="height: calc(100% - 58px); overflow: auto">
      <ion-col>
        <ion-list v-for="(subversion, index) in subVersions" :key="index">
          <ion-list-header>
            <ion-label>{{ subversion.code }}</ion-label>
          </ion-list-header>

          <ion-card
            v-for="(improvement, i) in subversion.improvements"
            :key="i"
          >
            <ion-card-header>Mejoras</ion-card-header>

            <ion-item>
              <ion-label>{{ improvement }}</ion-label>
            </ion-item>
          </ion-card>

          <ion-card v-for="(correction, i) in subversion.corrections" :key="i">
            <ion-card-header>Mejoras</ion-card-header>

            <ion-item>
              <ion-label>{{ correction }}</ion-label>
            </ion-item>
          </ion-card>
        </ion-list>
      </ion-col>
    </ion-row>
  </ion-content>
</template>

<script setup lang="ts">
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonButton,
  IonItem,
  IonLabel,
  modalController,
  IonSelect,
  IonSelectOption,
} from "@ionic/vue";
import { closeOutline, downloadOutline } from "ionicons/icons";
import { ref, watch, onMounted } from "vue";
import { wb } from "@/main";
import versionsDataJson from "@/utils/versions.json";

interface VersionsData {
  [version: string]: {
    [subVersion: string]: {
      improvements?: string[];
      corrections?: string[];
    };
  };
}

// composables
import { useSystem } from "../../composables/useSystem";

const systemComposable = useSystem();

const versionsData = versionsDataJson as VersionsData;

const pageTitle = ref("Novedades");
const mainVersions = Object.keys(versionsData);
const versionSelected: Ref<string> = ref(mainVersions[0]);
const subVersions = ref([]);

onMounted(() => {
  onVersionChange();
});

watch(versionSelected, (nuevaVersion: string) => {
  const selectedVersionData: {
    [subVersion: string]: { improvements?: string[]; corrections?: string[] };
  } = versionsData[nuevaVersion];
  subVersions.value = Object.entries(selectedVersionData).map(
    ([code, data]: [
      string,
      { improvements?: string[]; corrections?: string[] },
    ]) => ({
      code,
      improvements: data.improvements || [],
      corrections: data.corrections || [],
    })
  );
});

function closeModal(): void {
  modalController.dismiss();
}

function onVersionChange() {
  const selectedVersionData = versionsData[versionSelected.value];
  subVersions.value = Object.entries(selectedVersionData).map(
    ([code, data]) => ({
      code,
      improvements: data.improvements || [],
      corrections: data.corrections || [],
    })
  );
}

function updateApp() {
  if (wb) {
    wb.addEventListener("controlling", () => {
      window.location.reload();
    });
    wb.messageSkipWaiting();
  } else {
    console.error("Workbox no está inicializado.");
  }
}
</script>
