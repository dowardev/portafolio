<template>
  <ion-header class="ion-no-border" mode="ios">
    <ion-toolbar class="container-page">
      <ion-buttons slot="start" :mode="designMode">
        <ion-menu-button menu="mainMenu" :mode="designMode"></ion-menu-button>
      </ion-buttons>

      <ion-title>{{ pageTitle }}</ion-title>

      <ion-buttons slot="end" :mode="designMode">
        <!-- selector -->
        <ion-select
          v-if="screenSize.preset != 'xs'"
          v-model="typeContent"
          interface="popover"
        >
          <ion-select-option value="all"> Todos </ion-select-option>

          <ion-select-option value="personal">
            Proyectos de personales
          </ion-select-option>

          <ion-select-option value="professional">
            Proyectos profesionales
          </ion-select-option>
        </ion-select>
      </ion-buttons>
    </ion-toolbar>

    <ion-toolbar v-if="screenSize.preset == 'xs'">
      <div class="center" style="width: 100%">
        <ion-select
          v-model="typeContent"
          :mode="designMode"
          style="width: auto"
          interface="popover"
        >
          <ion-select-option value="all"> Todos </ion-select-option>

          <ion-select-option value="personal">
            Proyectos personales
          </ion-select-option>

          <ion-select-option value="professional">
            Proyectos profesionales
          </ion-select-option>
        </ion-select>
      </div>
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
            v-for="(project, indexProject) in filteredProjects"
            :key="indexProject"
            size-xs="12"
            size-md="6"
            size-lg="6"
          >
            <ion-card
              class="shadow-1"
              style="cursor: pointer"
              @click="
                indexProjectSeleted = indexProject;
                modals.modalInfoExperience.open = true;
              "
            >
              <ion-card-header>
                <div style="display: flex; justify-content: space-between">
                  <img :src="project.img" alt="" style="height: 45px" />
                </div>

                <ion-card-title>
                  {{ project.title }}
                </ion-card-title>
                <ion-card-subtitle>
                  <ion-text
                    :color="
                      project.status == 'finished'
                        ? 'success'
                        : project.status == 'indeterminate'
                          ? 'warning'
                          : project.status == 'progress'
                            ? 'primary'
                            : ''
                    "
                  >
                    {{
                      project.status == "progress"
                        ? "En progeso"
                        : project.status == "indeterminate"
                          ? "Indeterminado"
                          : project.status == "finished"
                            ? "Terminado"
                            : ""
                    }}
                  </ion-text>
                </ion-card-subtitle>
              </ion-card-header>

              <ion-card-content>
                <ion-row>
                  <ion-col size="10" style="display: flex">
                    <div
                      v-for="(tech, techIndex) in project.technologies"
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

          <ion-title>{{ projects[indexProjectSeleted].title }}</ion-title>

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
        <ion-row>
          <ion-col>
            <ion-card
              :class="{
                'success-border':
                  projects[indexProjectSeleted].status == 'finished',
                'primary-border':
                  projects[indexProjectSeleted].status == 'progress',
                'warning-border':
                  projects[indexProjectSeleted].status == 'indeterminate',
              }"
              class="shadow-1"
            >
              <ion-item lines="none" class="transparent">
                <ion-icon
                  slot="start"
                  :color="
                    projects[indexProjectSeleted].status == 'finished'
                      ? 'success'
                      : projects[indexProjectSeleted].status == 'indeterminate'
                        ? 'warning'
                        : projects[indexProjectSeleted].status == 'progress'
                          ? 'primary'
                          : ''
                  "
                  :icon="hourglassOutline"
                >
                </ion-icon>
                <ion-label
                  :color="
                    projects[indexProjectSeleted].status == 'finished'
                      ? 'success'
                      : projects[indexProjectSeleted].status == 'indeterminate'
                        ? 'warning'
                        : projects[indexProjectSeleted].status == 'progress'
                          ? 'primary'
                          : ''
                  "
                >
                  {{
                    projects[indexProjectSeleted].status == "progress"
                      ? "En progeso"
                      : projects[indexProjectSeleted].status == "indeterminate"
                        ? "Indeterminado"
                        : projects[indexProjectSeleted].status == "finished"
                          ? "Terminado"
                          : ""
                  }}
                </ion-label>
              </ion-item>
              <ion-card-content>
                <!-- status -->

                <!-- description -->
                <ion-row>
                  <ion-col>
                    <p>
                      <ion-text>
                        {{ projects[indexProjectSeleted].details.description }}
                      </ion-text>
                    </p>
                  </ion-col>
                </ion-row>
              </ion-card-content>
            </ion-card>
          </ion-col>
        </ion-row>

        <!-- technologies -->
        <ion-row>
          <ion-col>
            <ion-list>
              <ion-list-header>
                <ion-label>Tecnologías</ion-label>
              </ion-list-header>

              <ion-chip
                v-for="(tech, indexTech) in projects[indexProjectSeleted]
                  .technologies"
                :key="indexTech"
                outline
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

                <ion-label>{{ tech.name }}</ion-label>
              </ion-chip>
              <hr class="style1" />
            </ion-list>
          </ion-col>
        </ion-row>

        <!-- platforms -->
        <ion-row>
          <ion-col>
            <ion-list>
              <ion-list-header>
                <ion-label>Plataformas</ion-label>
              </ion-list-header>

              <ion-chip
                v-for="(platform, indexPlatform) in projects[
                  indexProjectSeleted
                ].details.platforms"
                :key="indexPlatform"
                outline
              >
                <ion-icon
                  :style="{
                    color: getIconColorByName({ name: platform.name }),
                  }"
                  :icon="platform.icon"
                ></ion-icon>
                <ion-label>{{ platform.name }}</ion-label>
              </ion-chip>
              <hr class="style1" />
            </ion-list>
          </ion-col>
        </ion-row>
      </ion-content>
    </ion-modal>
    <!-- end modals -->

    <!-- popovers -->
    <ion-popover
      :is-open="popovers.popoverModalProjectOptions.open"
      :event="popovers.popoverModalProjectOptions.event"
      @did-dismiss="popovers.popoverModalProjectOptions.open = false"
    >
      <ion-content>
        <!-- website -->
        <ion-item
          :href="projects[indexProjectSeleted].details.website"
          target="_blank"
          >Sitio web</ion-item
        >

        <!-- repository -->
        <ion-item
          v-if="projects[indexProjectSeleted].repository"
          :href="projects[indexProjectSeleted].repository"
          target="_blank"
          >Repositorio</ion-item
        >
      </ion-content>
    </ion-popover>
    <!-- end popovers -->
  </ion-content>
</template>

<script setup lang="ts">
import { IonSelect, IonSelectOption, IonModal, IonPopover } from "@ionic/vue";
import { computed, reactive, ref } from "vue";
import {
  closeOutline,
  ellipsisVerticalOutline,
  globeOutline,
  hourglassOutline,
  logoAndroid,
  logoCapacitor,
  logoElectron,
  logoFirebase,
  logoIonic,
  logoLaravel,
  logoNpm,
  logoPwa,
  logoTux,
  logoVue,
  logoWindows,
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
import DowarLogo from "@/assets/portafolio/logo_dowar_2.1.png";
import MoneyFlapLogo from "@/assets/otros/moneyflap-logo-white.svg";
import LifelineLogo from "@/assets/otros/lifeline_v1.webp";
import NoLogoImage from "@/assets/otros/no-logo.png";
import UpworkLogo from "@/assets/otros/icons8-upwork-50.png";

// componentes
import SystemController from "@/controllers/systemController";
const systemController = new SystemController();
// end componentes

// life
const filteredProjects = computed(() => {
  if (typeContent.value === "all") return projects;
  else
    return projects.filter((project) => project.category === typeContent.value);
});
// end life

// vars
const designMode = ref<DesignMode>(systemController.getdesignMode());
const typeContent = ref<"all" | "personal" | "professional">("professional");
const pageTitle = "Proyectos";
const screenSize = ref(systemController.getScreenSize());
const projects = [
  {
    img: MoneyFlapLogo,
    title: "Moneyflap",
    status: "indeterminate",
    technologies: [
      { source: NuxtImg, name: "Nuxt", size: "22px", type: "img" },
      { source: logoVue, name: "Vue", size: "18px", type: "icon" },
    ],
    client: {
      img: PengyiLabsLogo,
      name: "PengyiLabs",
    },
    details: {
      description:
        "MoneyFlap es una plataforma financiera global que ofrece cuentas de ahorro, transferencias sin comisiones, tarjetas virtuales y cashback de hasta el 35%, facilitando la gestión financiera.",
      website: "https://www.moneyflap.com/",
      platforms: [{ name: "Web", icon: globeOutline }],
    },
    category: "professional",
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
    client: {
      img: DowarLogo,
      name: "DowarDev",
    },
    details: {
      description:
        "Plataforma que ofrece una variedad de herramientas para la organizacion personal",
      platforms: [
        { name: "Linux", icon: logoTux },
        { name: "Web", icon: globeOutline },
        { name: "PWA", icon: logoPwa },
        { name: "Android", icon: logoAndroid },
        { name: "Windows", icon: logoWindows },
      ],
    },
    repository: "https://gitlab.com/dowardev/lifeline",
    category: "personal",
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
    client: {
      img: DowarLogo,
      name: "DowarDev",
    },
    details: {
      description:
        "Plataforma que permite compartir contenido en formato escrito con as herramientas necesarias para su gestion permite compartir contenido en formato escrito con as herramientas necesarias para su gestion.",
      platforms: [
        { name: "Web", icon: globeOutline },
        { name: "PWA", icon: logoPwa },
        { name: "Android", icon: logoAndroid },
      ],
    },
    repository: "https://gitlab.com/dowardev/portafolio",
    category: "personal",
  },
  {
    img: NoLogoImage,
    title: "Ciclo",
    status: "finished",
    technologies: [
      { source: logoIonic, name: "Ionic", size: "18px", type: "icon" },
      { source: logoVue, name: "Vue", size: "18px", type: "icon" },
      { source: logoElectron, name: "Electronjs", size: "18px", type: "icon" },
      {
        source: logoCapacitor,
        name: "Capacitorjs",
        size: "18px",
        type: "icon",
      },
      { source: logoLaravel, name: "Laravel", size: "18px", type: "icon" },
    ],
    client: {
      img: UpworkLogo,
      name: "Upwork",
    },
    details: {
      description: "Aplicación para la gestión de productos y ventas.",
      platforms: [
        { name: "Web", icon: globeOutline },
        { name: "PWA", icon: logoPwa },
        { name: "Android", icon: logoAndroid },
      ],
    },
    category: "professional",
  },
  {
    img: NoLogoImage,
    title: "Nueva Visión F.A.",
    status: "finished",
    technologies: [
      { source: logoIonic, name: "Ionic", size: "18px", type: "icon" },
      { source: logoVue, name: "Vue", size: "18px", type: "icon" },
      { source: logoElectron, name: "Electronjs", size: "18px", type: "icon" },
      {
        source: logoCapacitor,
        name: "Capacitorjs",
        size: "18px",
        type: "icon",
      },
      { source: logoLaravel, name: "Laravel", size: "18px", type: "icon" },
    ],
    client: {
      img: UpworkLogo,
      name: "Upwork",
    },
    details: {
      description:
        "App exclusiva para socios, permite acceder de forma rápida y sencilla a toda la información relacionada con sus aportes y procesos.",
      platforms: [
        { name: "Web", icon: globeOutline },
        { name: "PWA", icon: logoPwa },
        { name: "Android", icon: logoAndroid },
      ],
    },
    category: "professional",
  },
  {
    img: NoLogoImage,
    title: "Ionic extra components",
    status: "progress",
    technologies: [
      { source: logoVue, name: "Vue", size: "18px", type: "icon" },
      { source: logoIonic, name: "Ionic", size: "18px", type: "icon" },
      { source: logoNpm, name: "Npm", size: "20px", type: "icon" },
    ],
    client: {
      img: DowarLogo,
      name: "DowarDev",
    },
    details: {
      description:
        "Conjunto de componentes mejorados para proectos de Ionic Framework.",
      website: "https://ionic-components.dowar.xyz/",
      platforms: [
        { name: "Web", icon: globeOutline },
        { name: "PWA", icon: logoPwa },
        { name: "Android", icon: logoAndroid },
      ],
    },
    repository: "https://gitlab.com/dowardev/ionic-extra-components",
    category: "personal",
  },
];
const modals = reactive({
  modalInfoExperience: { open: false },
});
const indexProjectSeleted = ref(-1);
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
