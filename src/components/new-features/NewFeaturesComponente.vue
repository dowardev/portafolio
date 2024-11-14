<template>
  <ion-page>
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
          <ion-item class="transparent">
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
          <ion-list
            v-for="(subversion, index) in subVersions"
            :key="index"
            class="transparent"
          >
            <ion-list-header>
              <ion-label>{{ subversion.code }}</ion-label>
            </ion-list-header>

            <!-- improvements -->
            <ion-card v-if="subversion.improvements.length > 0">
              <ion-card-header>Mejoras</ion-card-header>

              <ion-card-content>
                <ion-item
                  lines="full"
                  class="transparent"
                  v-for="(improvement, i) in subversion.improvements"
                  :key="i"
                >
                  <ion-label>{{ improvement }}</ion-label>
                </ion-item>
              </ion-card-content>
            </ion-card>

            <!-- corrections -->
            <ion-card v-if="subversion.corrections.length > 0">
              <ion-card-header>Correcciones</ion-card-header>

              <ion-card-content>
                <ion-item
                  lines="none"
                  class="transparent"
                  v-for="(correction, i) in subversion.corrections"
                  :key="i"
                >
                  <ion-label>{{ correction }}</ion-label>
                </ion-item>
              </ion-card-content>
            </ion-card>
          </ion-list>
        </ion-col>
      </ion-row>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonPage,
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
import { ref, watch, onMounted, Ref } from "vue";
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
interface SubVersion {
  code: string;
  improvements: string[];
  corrections: string[];
}

const versionsData = versionsDataJson as VersionsData;

const pageTitle = ref("Novedades");
const mainVersions = Object.keys(versionsData).sort(
  (a, b) => parseFloat(b) - parseFloat(a)
);
const versionSelected: Ref<string> = ref(mainVersions[0]);

const subVersions = ref<SubVersion[]>([]);

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
