<template>
  <ion-row>
    <ion-col v-for="(experience, index) in experiences" :key="index" size="4">
      <ion-card class="shadow-1">
        <ion-card-header>
          <div style="display: flex; justify-content: space-between">
            <img :src="experience.img" alt="" style="height: 45px" />

            <ion-button
              size="small"
              fill="clear"
              @click="
                modals.modalInfoExperience.title = experience.title;
                modals.modalInfoExperience.content =
                  experience.details!.description;
                modals.modalInfoExperience.url = experience.details!.website;
                modals.modalInfoExperience.open = true;
              "
            >
              <ion-icon :icon="openOutline"> </ion-icon>
            </ion-button>
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
                  :style="{ fontSize: tech.size }"
                  :icon="tech.source"
                ></ion-icon>
              </div>
            </ion-col>
          </ion-row>
        </ion-card-content>
      </ion-card>
    </ion-col>
  </ion-row>

  <!-- modals -->
  <!-- modal more experience information -->
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
import { reactive } from "vue";
import { IonModal } from "@ionic/vue";
import {
  closeOutline,
  logoFirebase,
  logoIonic,
  logoLaravel,
  logoVue,
  openOutline,
} from "ionicons/icons";

// media
import PengyiLabsLogo from "@/assets/otros/pengyilabs_logo.jpg";
import NuxtImg from "@/assets/otros/nuxt-svgrepo-com.svg";
import MysqlLogo from "@/assets/otros/mysql-6.svg";
import UpworkLogo from "@/assets/otros/icons8-upwork-50.png";
import WorkanaLogo from "@/assets/otros/Workana_ISOLOGO_W.png";

// vars
const experiences = [
  {
    img: PengyiLabsLogo,
    title: "Pengyi Labs",
    date: "Diciembre 2024 - Actualidad",
    technologies: [
      { source: NuxtImg, name: "Nuxt", size: "22px", type: "img" },
      { source: logoVue, name: "Vue", size: "18px", type: "icon" },
    ],
    details: {
      description:
        "Contratación por horas para la corrección y desarrollo de nuevas funciones en múltiples proyectos.",
      website: "https://pengyilabs.com/",
    },
  },
  {
    img: UpworkLogo,
    title: "Upwork",
    date: "Marzo 2023 - Actualidad",
    technologies: [
      { source: logoVue, name: "Vue", size: "18px", type: "icon" },
      { source: logoIonic, name: "Ionic", size: "18px", type: "icon" },
      { source: logoLaravel, name: "Laravel", size: "18px", type: "icon" },
      { source: MysqlLogo, name: "MySql", size: "16px", type: "img" },
    ],
    details: {
      description:
        "Contratación para la gestión y realización de proyectos como freelance para una variedad de clientes.",
      website: "https://www.upwork.com/freelancers/~0162303a78d7d448db",
    },
  },
  {
    img: WorkanaLogo,
    title: "Workana",
    date: "Enero 2021 - Actualidad",
    technologies: [
      { source: logoVue, name: "Vue", size: "18px", type: "icon" },
      { source: logoIonic, name: "Ionic", size: "18px", type: "icon" },
      { source: logoLaravel, name: "Laravel", size: "18px", type: "icon" },
      { source: logoFirebase, name: "Firebase", size: "18px", type: "icon" },
    ],
    details: {
      description:
        "Contratación para la gestión y realización de proyectos como freelance para una variedad de clientes.",
      website:
        "https://www.workana.com/freelancer/9d94c3955c99290d9311a2aef1da7f4c",
    },
  },
];
const modals = reactive({
  modalInfoExperience: { open: false, title: "", content: "", url: "" },
});

// functions
function openUrl(params: { url: string }) {
  const { url } = params;
  window.open(url, "_blank");
}
</script>
