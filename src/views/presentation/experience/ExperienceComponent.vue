<template>
  <ion-row>
    <ion-col v-for="(experience, index) in experiences" :key="index" size="4">
      <ion-card class="shadow-1">
        <ion-card-header>
          <div style="display: flex; align-items: center">
            <div style="margin-right: 20px">
              <img
                :src="experience.img"
                alt=""
                style="height: 45px; border-radius: 50%"
              />
            </div>

            <div>
              <ion-card-title>
                {{ experience.title }}
              </ion-card-title>
              <ion-card-subtitle>{{ experience.date }}</ion-card-subtitle>
            </div>
          </div>
        </ion-card-header>

        <ion-card-content>
          <ion-row>
            <ion-col size="10">
              <div style="overflow-x: auto; white-space: nowrap">
                <ion-chip
                  v-for="(tech, techIndex) in experience.technologies"
                  :key="techIndex"
                  color="primary"
                >
                  <img
                    :src="tech.img"
                    :alt="tech.name"
                    :style="{ width: tech.size }"
                  />
                  <ion-label>{{ tech.name }}</ion-label>
                </ion-chip>
              </div>
            </ion-col>
          </ion-row>

          <ion-row>
            <ion-col style="display: flex; justify-content: end">
              <ion-button
                fill="clear"
                @click="
                  modals.modalInfoExperience.title = experience.title;
                  modals.modalInfoExperience.content =
                    experience.details!.description;
                  modals.modalInfoExperience.url = experience.details!.website;
                  modals.modalInfoExperience.open = true;
                "
              >
                Mas información
              </ion-button>
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
import { closeOutline, openOutline } from "ionicons/icons";

// media
import PengyiLabsLogo from "@/assets/otros/pengyilabs_logo.jpg";
import NuxtImg from "@/assets/otros/nuxt-svgrepo-com.svg";
import VueLogo from "@/assets/otros/vue-js-1.svg";
import LaravelLogo from "@/assets/otros/laravel-2.svg";
import MysqlLogo from "@/assets/otros/mysql-6.svg";
import IonicLogo from "@/assets/otros/ionicframework-icon.svg";
import UpworkLogo from "@/assets/otros/icons8-upwork-50.png";
import WorkanaLogo from "@/assets/otros/Workana_ISOLOGO_W.png";
import FirebaseLogo from "@/assets/otros/Firebase_Logo_Logomark.svg";

// vars
const experiences = [
  {
    img: PengyiLabsLogo,
    title: "Pengyi Labs",
    date: "Diciembre 2024 - Actualidad",
    technologies: [
      { img: NuxtImg, name: "Nuxt", size: "25px" },
      { img: VueLogo, name: "Vue", size: "25px" },
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
      { img: VueLogo, name: "Vue", size: "25px" },
      { img: IonicLogo, name: "Ionic", size: "25px" },
      { img: LaravelLogo, name: "Laravel", size: "25px" },
      { img: MysqlLogo, name: "MySql", size: "25px" },
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
      { img: VueLogo, name: "Vue", size: "25px" },
      { img: IonicLogo, name: "Ionic", size: "25px" },
      { img: LaravelLogo, name: "Laravel", size: "25px" },
      { img: FirebaseLogo, name: "Firebase", size: "20px" },
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
