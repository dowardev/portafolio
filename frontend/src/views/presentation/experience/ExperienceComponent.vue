<template>
  <ion-row style="overflow: auto; max-height: calc(100% - 8dvh)">
    <ion-col
      v-for="(experience, index) in experiences"
      :key="index"
      size-xs="12"
      size-md="6"
      size-lg="6"
    >
      <ion-card
        class="shadow-1"
        style="cursor: pointer"
        @click="
          modals.modalInfoExperience.title = experience.title;
          modals.modalInfoExperience.content = experience.details!.description;
          modals.modalInfoExperience.url = experience.details!.website;
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
                style="display: flex; align-items: center; margin-right: 10px"
              >
                <img
                  v-if="tech.type === 'img'"
                  :src="tech.source"
                  :alt="tech.name"
                  :style="{ width: tech.size }"
                />

                <ion-icon
                  v-if="tech.type == 'icon'"
                  :style="{
                    fontSize: tech.size,
                    color: getIconColorByName({ name: tech.name }),
                  }"
                  :icon="getIconSource(tech.source)"
                ></ion-icon>
              </div>
            </ion-col>
          </ion-row>
        </ion-card-content>
      </ion-card>
    </ion-col>
  </ion-row>

  <ion-modal
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

        <ion-title>{{ modals.modalInfoExperience.title }}</ion-title>

        <ion-buttons slot="end">
          <ion-button @click="openUrl({ url: modals.modalInfoExperience.url })">
            <ion-icon :icon="openOutline"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <p>
        {{ modals.modalInfoExperience.content }}
      </p>
    </ion-content>
  </ion-modal>
</template>

<script lang="ts" setup>
import { reactive, ref, onMounted } from "vue";
import { IonModal } from "@ionic/vue";
import {
  closeOutline,
  openOutline,
} from "ionicons/icons";
import * as ionicons from "ionicons/icons";
import homeApi, { type ExperienceItem } from "@/services/homeApi";

const experiences = ref<ExperienceItem[]>([]);
const modals = reactive({
  modalInfoExperience: { open: false, title: "", content: "", url: "" },
});

onMounted(async () => {
  try {
    const data = await homeApi.getPublic();
    experiences.value = data.experience || [];
  } catch (error) {
    console.error("Error loading experience data:", error);
  }
});

function openUrl(params: { url: string }) {
  const { url } = params;
  window.open(url, "_blank");
}

function getIconSource(source: string) {
  if (!source) return ionicons.linkOutline;
  const icon = ionicons[source as keyof typeof ionicons];
  return icon || ionicons.linkOutline;
}

function getIconColorByName(params: { name: string }) {
  const { name } = params;
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
