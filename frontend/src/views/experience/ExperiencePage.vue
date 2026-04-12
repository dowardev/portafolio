<template>
  <ion-header class="ion-no-border" mode="ios">
    <ion-toolbar class="container-page">
      <ion-buttons slot="start" :mode="designMode">
        <ion-menu-button menu="mainMenu" :mode="designMode"></ion-menu-button>
      </ion-buttons>

      <ion-title>{{ pageTitle }}</ion-title>
    </ion-toolbar>
  </ion-header>

  <ion-content>
    <ion-row
      class="ion-justify-content-center"
      style="display: flex; overflow: auto; max-height: calc(100% - 8dvh)"
    >
      <ion-col size-xs="12" size-sm="8" size-lg="6">
        <ion-row>
          <ion-col
            v-for="(experience, indexExperience) in sortedExperiences"
            :key="indexExperience"
            size-xs="12"
            size-md="6"
            size-lg="6"
          >
            <ion-card
              class="shadow-1"
              style="cursor: pointer"
              @click="
                indexExperienceSeleted = indexExperience;
                modals.modalInfoExperience.open = true;
              "
            >
              <ion-card-header>
                <div style="display: flex; justify-content: space-between">
                  <img :src="experience.img" alt="" style="height: 45px" />
                </div>

                <ion-card-title>
                  {{ experience.title }}
                </ion-card-title>
                <ion-card-subtitle>{{ experience.date }}</ion-card-subtitle>
              </ion-card-header>

              <ion-card-content>
                <ion-row>
                  <ion-col size="10" style="display: flex">
                    <div
                      v-for="(tech, techIndex) in experience.technologies"
                      :key="techIndex"
                      style="
                        display: flex;
                        align-items: center;
                        margin-right: 10px;
                      "
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
                          color: getIconColorByName(tech.name),
                        }"
                        :icon="getIconByName(tech.source)"
                      ></ion-icon>
                    </div>
                  </ion-col>
                </ion-row>
              </ion-card-content>
            </ion-card>
          </ion-col>
        </ion-row>
      </ion-col>
    </ion-row>

    <!-- modals -->
    <ion-modal
      :style="{
        '--height':
          screenSize.preset === 'lg' || screenSize.preset === 'xxl'
            ? '90dvh'
            : '',
      }"
      :is-open="modals.modalInfoExperience.open"
      @did-dismiss="modals.modalInfoExperience.open = false"
    >
      <ion-header mode="ios">
        <ion-toolbar>
          <ion-buttons slot="start">
            <ion-button @click="modals.modalInfoExperience.open = false">
              <ion-icon :icon="closeOutline"></ion-icon>
            </ion-button>
          </ion-buttons>

          <ion-title>{{ experiences[indexExperienceSeleted]?.title }}</ion-title>

          <ion-buttons v-if="experiences[indexExperienceSeleted]?.details?.website" slot="end">
            <ion-button @click="openUrl(experiences[indexExperienceSeleted].details.website)">
              <ion-icon :icon="openOutline"></ion-icon>
            </ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>

      <ion-content class="ion-padding">
        <p>
          {{ experiences[indexExperienceSeleted]?.details?.description }}
        </p>
      </ion-content>
    </ion-modal>
  </ion-content>
</template>

<script setup lang="ts">
import { IonModal } from "@ionic/vue";
import { computed, reactive, ref, onMounted } from "vue";
import {
  closeOutline,
  openOutline,
} from "ionicons/icons";
import * as ionicons from "ionicons/icons";

import { DesignMode } from "@/utils/types";
import SystemController from "@/controllers/systemController";
import homeApi, { type ExperienceItem } from "@/services/homeApi";

const systemController = new SystemController();

const designMode = ref<DesignMode>(systemController.getdesignMode());
const pageTitle = "Experiencia";
const screenSize = ref(systemController.getScreenSize());
const experiences = ref<ExperienceItem[]>([]);

const sortedExperiences = computed(() => {
  return [...experiences.value];
});

const modals = reactive({
  modalInfoExperience: { open: false },
});
const indexExperienceSeleted = ref(-1);

onMounted(async () => {
  try {
    const data = await homeApi.getPublic();
    experiences.value = data.experience || [];
  } catch (error) {
    console.error("Error loading experience data:", error);
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

function getIconColorByName(name: string) {
  const colors: { [key: string]: string } = {
    Ionic: "#3356c7",
    Vue: "#41b883",
    Laravel: "#ff2819",
    Firebase: "#ffca28",
    Capacitorjs: "#119eff",
    Electronjs: "#47848f",
    Web: "#3356c7",
    Linux: "#000000",
    PWA: "#5905c8",
    Android: "#44ac5a",
    Windows: "#0078d4",
  };
  return colors[name] || "";
}
</script>

<style scoped>
</style>
