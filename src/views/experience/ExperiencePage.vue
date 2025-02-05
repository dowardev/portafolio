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
      </ion-col>
    </ion-row>

    <!-- modals -->
    <!-- modal more experience information -->
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

          <ion-title>{{ experiences[indexExperienceSeleted].title }}</ion-title>

          <ion-buttons slot="end">
            <ion-button
              @click="
                popovers.popoverModalProjectOptions.event = $event;
                popovers.popoverModalProjectOptions.open = true;
              "
            >
              <ion-icon :icon="ellipsisVerticalOutline"> </ion-icon>
            </ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>

      <ion-content class="ion-padding">
        <p>
          {{ experiences[indexExperienceSeleted].details.description }}
        </p>
      </ion-content>
    </ion-modal>
    <!-- end modals -->

    <!-- popovers -->
    <!-- end popovers -->
  </ion-content>
</template>

<script setup lang="ts">
import { IonSelect, IonSelectOption, IonModal } from "@ionic/vue";
import { computed, reactive, ref } from "vue";
import {
  closeOutline,
  ellipsisVerticalOutline,
  logoFirebase,
  logoIonic,
  logoLaravel,
  logoVue,
} from "ionicons/icons";

// props component
// end props component

// interface
import { DesignMode } from "@/utils/types";
// end interface

// media
import PengyiLabsLogo from "@/assets/otros/pengyilabs_logo.jpg";
import NuxtImg from "@/assets/otros/nuxt-svgrepo-com.svg";
import MysqlLogo from "@/assets/otros/mysql-6.svg";
import UpworkLogo from "@/assets/otros/icons8-upwork-50.png";
import WorkanaLogo from "@/assets/otros/Workana_ISOLOGO_W.png";

// componentes
import SystemController from "@/controllers/systemController";
const systemController = new SystemController();
// end componentes

// life
const sortedExperiences = computed(() => {
  const parseDate = (dateStr: string): number => {
    const [month, year] = dateStr.split(" ");
    const months: { [key: string]: number } = {
      Enero: 0,
      Febrero: 1,
      Marzo: 2,
      Abril: 3,
      Mayo: 4,
      Junio: 5,
      Julio: 6,
      Agosto: 7,
      Septiembre: 8,
      Octubre: 9,
      Noviembre: 10,
      Diciembre: 11,
    };
    return new Date(parseInt(year), months[month]).getTime();
  };

  return [...experiences].sort((a, b) => {
    return (
      parseDate(b.date.split(" - ")[0]) - parseDate(a.date.split(" - ")[0])
    );
  });
});
// end life

// vars
const designMode = ref<DesignMode>(systemController.getdesignMode());
const typeContent = ref<"all" | "personal" | "professional">("professional");
const pageTitle = "Experiencia";
const screenSize = ref(systemController.getScreenSize());
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
  modalInfoExperience: { open: false },
});
const indexExperienceSeleted = ref(-1);
const popovers = reactive({
  popoverModalProjectOptions: { open: false, event: null },
});
// end vars

// functions
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

<style scoped>
.container {
  width: 60%;
}
</style>
