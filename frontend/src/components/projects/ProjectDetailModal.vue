<template>
  <ion-modal :is-open="isOpen" @did-dismiss="emit('close')">
    <ion-header mode="ios">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button @click="emit('close')">
            <ion-icon :icon="closeOutline"></ion-icon>
          </ion-button>
        </ion-buttons>

        <ion-title>{{ project?.title }}</ion-title>

        <ion-buttons v-if="project?.details?.website" slot="end">
          <ion-button @click="openUrl(project.details.website)">
            <ion-icon :icon="openOutline"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <!-- Status -->
      <ion-card
        v-if="project"
        :class="{
          'success-border': project.status === 'finished',
          'primary-border': project.status === 'progress',
          'warning-border': project.status === 'indeterminate',
        }"
        class="shadow-1"
      >
        <ion-item lines="none" class="transparent">
          <ion-icon
            slot="start"
            :color="statusColor"
            :icon="hourglassOutline"
          ></ion-icon>
          <ion-label :color="statusColor">
            {{ statusText }}
          </ion-label>
        </ion-item>
        <ion-card-content>
          <p>{{ project.details?.description }}</p>
        </ion-card-content>
      </ion-card>

      <!-- Technologies -->
      <ion-row v-if="project?.technologies?.length">
        <ion-col>
          <ion-list>
            <ion-list-header>
              <ion-label>Tecnologías</ion-label>
            </ion-list-header>

            <ion-chip
              v-for="(tech, index) in project.technologies"
              :key="index"
              outline
            >
              <img
                v-if="tech.type === 'img'"
                :src="tech.source"
                :alt="tech.name"
                :style="{ width: tech.size }"
              />
              <ion-icon
                v-if="tech.type === 'icon'"
                :style="{
                  fontSize: tech.size,
                  color: getIconColor(tech.source),
                }"
                :icon="getIconByName(tech.source)"
              ></ion-icon>
              <ion-label>{{ tech.name }}</ion-label>
            </ion-chip>
          </ion-list>
        </ion-col>
      </ion-row>

      <!-- Source / Client -->
      <ion-row v-if="project?.source?.name">
        <ion-col>
          <ion-list>
            <ion-list-header>
              <ion-label>Cliente / Fuente</ion-label>
            </ion-list-header>
            <ion-item
              v-if="project.source.url"
              button
              @click="openUrl(project.source.url)"
            >
              <img
                v-if="project.source.img"
                :src="project.source.img"
                alt=""
                style="height: 30px; margin-right: 12px"
              />
              <ion-label>{{ project.source.name }}</ion-label>
              <ion-icon slot="end" :icon="openOutline"></ion-icon>
            </ion-item>
            <ion-item v-else lines="none">
              <img
                v-if="project.source.img"
                :src="project.source.img"
                alt=""
                style="height: 30px; margin-right: 12px"
              />
              <ion-label>{{ project.source.name }}</ion-label>
            </ion-item>
          </ion-list>
        </ion-col>
      </ion-row>
    </ion-content>
  </ion-modal>
</template>

<script setup lang="ts">
import {
  IonModal,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonButton,
  IonIcon,
  IonTitle,
  IonContent,
  IonCard,
  IonCardContent,
  IonItem,
  IonLabel,
  IonRow,
  IonCol,
  IonList,
  IonListHeader,
  IonChip,
} from "@ionic/vue";
import { computed } from "vue";
import { closeOutline, openOutline, hourglassOutline } from "ionicons/icons";
import * as ionicons from "ionicons/icons";
import type { ProjectItem } from "@/services/homeApi";
import { useIconColors } from "@/composables/useIconColors";

const { getIconColor } = useIconColors();

const props = defineProps<{
  isOpen: boolean;
  project: ProjectItem | null;
}>();

const emit = defineEmits<{
  (e: "close"): void;
}>();

const statusColor = computed(() => {
  if (!props.project) return "";
  switch (props.project.status) {
    case "finished":
      return "success";
    case "indeterminate":
      return "warning";
    case "progress":
      return "primary";
    default:
      return "";
  }
});

const statusText = computed(() => {
  if (!props.project) return "";
  switch (props.project.status) {
    case "finished":
      return "Terminado";
    case "indeterminate":
      return "Indeterminado";
    case "progress":
      return "En progreso";
    default:
      return "";
  }
});

function openUrl(url: string) {
  window.open(url, "_blank");
}

function getIconByName(source: string) {
  if (!source) return ionicons.helpCircleOutline;
  const icon = ionicons[source as keyof typeof ionicons];
  return icon || ionicons.helpCircleOutline;
}
</script>
