<template>
  <div>
    <ion-card
      v-for="(project, index) in proyectos"
      :key="index"
      class="blur-effect selectable-card"
    >
      <ion-card-content>
        <ion-row>
          <ion-col size-xs="12" size-md="4" class="center">
            <img
              v-if="project.image && project.image.length"
              class="project-image"
              :src="project.image[0].route"
            />
          </ion-col>

          <ion-col size-xs="12" size-md="8">
            <ion-row class="ion-padding-start">
              <ion-col size="12">
                <ion-card-title>
                  {{ project.name }}
                </ion-card-title>

                <ion-card-subtitle>
                  {{ project.status }}
                </ion-card-subtitle>
              </ion-col>
            </ion-row>

            <ion-row>
              <ion-col>
                <ion-list class="transparent">
                  <ion-row class="ion-padding-start">
                    <ion-col>
                      <ion-icon
                        v-for="icon in project.type"
                        :key="icon"
                        :icon="icon"
                        class="ion-padding-end"
                        color="primary"
                      ></ion-icon>
                    </ion-col>
                  </ion-row>
                </ion-list>
              </ion-col>
            </ion-row>

            <!-- technologies -->
            <ion-row v-if="project.technologies && project.technologies.length">
              <ion-col size="12">
                <ion-list class="transparent">
                  <ion-list-header>
                    <ion-label>Tecnologías</ion-label>
                  </ion-list-header>

                  <ion-row>
                    <ion-col>
                      <div style="display: flex">
                        <div
                          v-for="tech in project.technologies"
                          :key="tech.icon"
                        >
                          <ion-button
                            :href="tech.route"
                            target="_blank"
                            fill="clear"
                            size="small"
                          >
                            <ion-icon
                              v-if="tech.type == 'icon'"
                              :icon="tech.icon"
                              color="primary"
                            ></ion-icon>
                            <img
                              v-if="tech.type == 'svg'"
                              :src="tech.icon"
                              alt=""
                              style="max-width: 18px"
                            />
                          </ion-button>
                        </div>
                      </div>
                    </ion-col>
                  </ion-row>
                </ion-list>
              </ion-col>
            </ion-row>

            <!-- platform -->
            <ion-row v-if="project.platform">
              <ion-col>
                <ion-list class="transparent">
                  <ion-list-header>
                    <ion-label>Plataforma</ion-label>
                  </ion-list-header>

                  <ion-row class="ion-padding-start">
                    <ion-col>
                      <img
                        style="cursor: pointer"
                        :src="project.platform.image.route"
                        :style="{
                          width: project.platform.image.width,
                          height: project.platform.image.height,
                        }"
                        alt="upwork-logo"
                        @click="openLink({ route: project.platform.route! })"
                      />
                    </ion-col>
                  </ion-row>
                </ion-list>
              </ion-col>
            </ion-row>

            <!-- links -->
            <ion-row
              v-if="project.page || project.appPlayStore || project.sourceCode"
            >
              <ion-col size="12">
                <ion-list class="transparent">
                  <ion-list-header>
                    <ion-label>Enlaces de interés</ion-label>
                  </ion-list-header>

                  <ion-row>
                    <ion-col>
                      <ion-button
                        v-if="project.page"
                        href="project.page"
                        target="_blank"
                        fill="clear"
                        >Sitio web</ion-button
                      >

                      <ion-button
                        v-if="project.appPlayStore"
                        :href="project.appPlayStore"
                        target="_blank"
                        fill="clear"
                        >Aplicación móvil(Play Store)</ion-button
                      >
                      <ion-button
                        v-if="project.sourceCode"
                        :href="project.sourceCode"
                        target="_blank"
                        fill="clear"
                        >Código fuente</ion-button
                      >
                    </ion-col>
                  </ion-row>
                </ion-list>
              </ion-col>
            </ion-row>
          </ion-col>
        </ion-row>
      </ion-card-content>

      <ion-accordion-group>
        <ion-accordion value="third">
          <ion-item slot="header">
            <ion-label>Descripción</ion-label>
          </ion-item>
          <div slot="content" class="ion-padding">
            {{ project.description }}
          </div>
        </ion-accordion>
      </ion-accordion-group>
    </ion-card>
  </div>
</template>

<script setup lang="ts">
import {} from "@ionic/vue";

// images
import lifelineLogo from "../../../assets/otros/lifeline_v1.webp";
import mariaDBLogo from "../../../assets/otros/mariadb-icon.svg";
import graphqlLogo from "../../../assets/otros/graphql-clear.svg";
import viteLogo from "../../../assets/otros/vite.svg";
import metaApp from "../../../assets/otros/meta_app.png";
import noLogo from "../../../assets/otros/no-logo.png";
import logoUpwork from "../../../assets/otros/icons8-upwork-50.png";

import {
  logoIonic,
  logoAndroid,
  logoWindows,
  logoTux,
  logoFirefox,
  logoChrome,
  logoVue,
  logoLaravel,
  logoElectron,
  logoCapacitor,
} from "ionicons/icons";
import { ref } from "vue";

const proyectos = [
  {
    name: "Lifeline",
    status: "En desarrollo",
    type: [logoAndroid, logoFirefox, logoChrome, logoWindows, logoTux],
    color: "primary",
    image: [
      {
        route: lifelineLogo,
        width: "134px",
        height: "112px",
      },
    ],
    description: "Proyecto para la administración de tiempo",
    technologies: [
      {
        route: "https://ionicframework.com/",
        icon: logoIonic,
        type: "icon",
      },
      {
        route: "https://vuejs.org",
        icon: logoVue,
        type: "icon",
      },
      {
        route: "https://vitejs.dev",
        icon: viteLogo,
        type: "svg",
      },
      {
        route: "https://laravel.com",
        icon: logoLaravel,
        type: "icon",
      },
      {
        route: "https://mariadb.org",
        icon: mariaDBLogo,
        type: "svg",
      },
      {
        route: "https://graphql.org",
        icon: graphqlLogo,
        type: "svg",
      },
    ],
    page: "https://lifeline.dowar.xyz",
    sourceCode: "https://gitlab.com/gonzam4/lifeline",
  },
  {
    name: "Nueva Visión F.A.",
    status: "Finalizada",
    type: [logoAndroid, logoFirefox, logoChrome],
    color: "primary",
    image: [
      {
        route: metaApp,
        width: "134px",
        height: "112px",
      },
    ],
    description:
      "App exclusiva para socios, permite acceder de forma rápida y sencilla a toda la información relacionada con sus aportes y procesos.",
    technologies: [
      {
        route: "https://ionicframework.com/",
        icon: logoIonic,
        type: "icon",
      },
      {
        route: "https://vuejs.org",
        icon: logoVue,
        type: "icon",
      },
    ],
    page: "https://login-socios.asociacionmilitaresnuevavision.com/home",
    appPlayStore: "https://play.google.com/store/apps/details?id=com.meta.com",
    platform: {
      name: "UpWork",
      image: {
        route: logoUpwork,
        width: "20px",
        height: "20px",
      },
    },
  },
  {
    name: "Ciclo",
    status: "En desarrollo",
    type: [logoAndroid, logoFirefox, logoChrome, logoWindows],
    color: "primary",
    image: [
      {
        route: noLogo,
        width: "134px",
        height: "112px",
      },
    ],
    description: "Aplicación para la gestión de productos y ventas",
    technologies: [
      {
        route: "https://ionicframework.com/",
        icon: logoIonic,
        type: "icon",
      },
      {
        route: "https://vuejs.org",
        icon: logoVue,
        type: "icon",
      },
      {
        route: "https://www.electronjs.org/",
        icon: logoElectron,
        type: "icon",
      },
      {
        route: "https://capacitorjs.com/",
        icon: logoCapacitor,
        type: "icon",
      },
      {
        route: "https://laravel.com",
        icon: logoLaravel,
        type: "icon",
      },
    ],
    platform: {
      name: "UpWork",
      route: "https://www.upwork.com/",
      image: {
        route: logoUpwork,
        width: "20px",
        height: "20px",
      },
    },
  },
];

// functions
function openLink(params: { route: string }) {
  window.open(params.route, "_blank");
}
</script>

<style scoped>
.blur-effect {
  backdrop-filter: blur(10px);
}

.project-image {
  width: 70%;
}

@media (min-width: 1024px) {
  .project-image {
    max-width: 250px;
    max-height: 250px;
    width: auto;
    height: auto;
  }
}
</style>
