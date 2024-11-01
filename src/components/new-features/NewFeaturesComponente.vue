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
    <!-- theme selector -->
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
              v-for="(version, versionIndex) in versions"
              :key="versionIndex"
              :value="version.code"
              >{{ version.code }}</ion-select-option
            >
          </ion-select>
        </ion-item>

        <!-- improvements -->
        <ion-list
          v-if="
            filterImprovements({
              versionCode: versionSelected,
            })
          "
        >
          <ion-list-header>
            <ion-label>Nuevas funciones</ion-label>
          </ion-list-header>

          <ion-card>
            <ion-card-content>
              <ion-item
                v-for="(improvement, indexImprovement) in filterImprovements({
                  versionCode: versionSelected,
                })"
                :key="indexImprovement"
                lines="full"
                class="transparent"
              >
                <ion-label>{{ improvement }}</ion-label>
              </ion-item>
            </ion-card-content>
          </ion-card>
        </ion-list>

        <!-- fixes -->
        <ion-list
          v-if="
            filterCorrections({
              versionCode: versionSelected,
            })
          "
        >
          <ion-list-header>
            <ion-label>Correcciones</ion-label>
          </ion-list-header>

          <ion-card>
            <ion-card-content>
              <ion-item
                v-for="(correction, indexCorrection) in filterCorrections({
                  versionCode: versionSelected,
                })"
                :key="indexCorrection"
                lines="full"
                class="transparent"
              >
                <ion-label>{{ correction }}</ion-label>
              </ion-item>
            </ion-card-content>
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
import { reactive, ref } from "vue";
import { wb } from "@/main";
import versionsData from "@/utils/versions.json";

// composables
import { useSystem } from "../../composables/useSystem";
const systemComposable = useSystem();

const pageTitle = ref("Novedades");
const versions = Object.entries(versionsData).map(([code, data]) => ({
  code,
  ...data,
}));
const versionSelected = ref(versions[0].code);

// functions
function closeModal(): void {
  modalController.dismiss();
}

function filterImprovements(params: { versionCode: string }): string[] {
  const { versionCode } = params;
  const result = versions.filter((version) => version.code == versionCode);
  return result[0].improvements;
}

function filterCorrections(params: { versionCode: string }): string[] {
  const { versionCode } = params;
  const result = versions.filter((version) => version.code == versionCode);
  return result[0].corrections;
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
