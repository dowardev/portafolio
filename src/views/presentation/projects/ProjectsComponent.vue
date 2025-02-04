<template>
  <ion-row style="overflow: auto; max-height: calc(100% - 8dvh)">
    <ion-col
      v-for="(project, index) in projects"
      :key="index"
      size-xs="12"
      size-md="6"
      size-lg="6"
    >
      <ion-card class="shadow-1">
        <ion-card-header>
          <div style="display: flex; justify-content: space-between">
            <img :src="project.img" alt="" style="height: 45px" />

            <ion-button
              size="small"
              fill="clear"
              @click="
                modals.modalInfoExperience.title = project.title;
                modals.modalInfoExperience.content =
                  project.details!.description;
                modals.modalInfoExperience.url = project.details!.website;
                modals.modalInfoExperience.open = true;
              "
            >
              <ion-icon :icon="openOutline"> </ion-icon>
            </ion-button>
          </div>

          <ion-card-title>
            {{ project.title }}
          </ion-card-title>
          <ion-card-subtitle>
            {{
              project.status == "progress"
                ? "En progeso"
                : project.status == "indeterminate"
                  ? "Indeterminado"
                  : "Terminado"
            }}
          </ion-card-subtitle>
        </ion-card-header>

        <ion-card-content>
          <ion-row>
            <ion-col size="10" style="display: flex">
              <div
                v-for="(tech, techIndex) in project.technologies"
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
  openOutline,
  logoVue,
  logoIonic,
  logoLaravel,
  logoFirebase,
} from "ionicons/icons";

// media
import PengyiLabsLogo from "@/assets/otros/pengyilabs_logo.jpg";
import NuxtImg from "@/assets/otros/nuxt-svgrepo-com.svg";
import MysqlLogo from "@/assets/otros/mysql-6.svg";
import DowarLogo from "@/assets/portafolio/logo_dowar_2.1.png";
import MoneyFlapLogo from "@/assets/otros/moneyflap-logo-white.svg";
import LifelineLogo from "@/assets/otros/lifeline_v1.webp";
import NoLogoImage from "@/assets/otros/no-logo.png";

// vars
const projects = [
  {
    img: MoneyFlapLogo,
    title: "Moneyflap",
    status: "indeterminate",
    technologies: [
      { source: NuxtImg, name: "Nuxt", size: "22px", type: "img" },
      { source: logoVue, name: "Vue", size: "18px", type: "icon" },
    ],
    source: {
      img: PengyiLabsLogo,
      name: "PengyiLabs",
      url: "https://www.pengyilabs.com/",
    },
    details: {
      description:
        "MoneyFlap es una plataforma financiera global que ofrece cuentas de ahorro, transferencias sin comisiones, tarjetas virtuales y cashback de hasta el 35%, facilitando la gestión financiera.",
      website: "https://www.moneyflap.com/",
    },
  },
  {
    img: LifelineLogo,
    title: "LifeLine",
    status: "progress",
    technologies: [
      { source: logoIonic, name: "Ionic", size: "18px", type: "icon" },
      { source: logoVue, name: "Vue", size: "18px", type: "icon" },
      { source: logoLaravel, name: "Laravel", size: "18px", type: "icon" },
      { source: MysqlLogo, name: "MySql", size: "16px", type: "img" },
    ],
    source: {
      img: DowarLogo,
      name: "DowarDev",
      url: "https://www.dowar.xyz/",
    },
    details: {
      description:
        "Plataforma que ofrece una variedad de herramientas para la organizacion personal",
      website: "https://www.upwork.com/freelancers/~0162303a78d7d448db",
    },
  },
  {
    img: NoLogoImage,
    title: "Blog",
    status: "progress",
    technologies: [
      { source: logoVue, name: "Vue", size: "18px", type: "icon" },
      { source: logoIonic, name: "Ionic", size: "18px", type: "icon" },
      { source: logoLaravel, name: "Laravel", size: "18px", type: "icon" },
      { source: logoFirebase, name: "Firebase", size: "20px", type: "icon" },
    ],
    source: {
      img: DowarLogo,
      name: "DowarDev",
      url: "https://www.dowar.xyz/",
    },
    details: {
      description:
        "Plataforma que permite compartir contenido en formato escrito con as herramientas necesarias para su gestion permite compartir contenido en formato escrito con as herramientas necesarias para su gestion.",
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
