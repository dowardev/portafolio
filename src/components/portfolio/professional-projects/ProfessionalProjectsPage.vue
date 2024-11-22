<template>
  <div>
    <ion-card
      v-for="(project, index) in proyectos"
      :key="index"
      class="blur-effect primary-select-animated"
    >
      <ion-card-content>
        <ion-row>
          <ion-col size-xs="12" size-md="4" class="center">
            <img
              v-if="project.image"
              class="project-image"
              :src="project.image.route"
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
          </ion-col>
        </ion-row>
      </ion-card-content>

      <!-- more info -->
      <ion-accordion-group>
        <ion-accordion value="third">
          <ion-item slot="header">
            <ion-label>Mas información</ion-label>
          </ion-item>

          <div slot="content" class="ion-padding">
            <!-- links -->
            <ion-row
              v-if="
                project.page ||
                project.appPlayStore ||
                project.sourceCode ||
                project.platform
              "
            >
              <ion-col size="12">
                <ion-list class="transparent">
                  <ion-list-header>
                    <ion-label>Enlaces de interés</ion-label>
                  </ion-list-header>

                  <ion-row>
                    <ion-col>
                      <!-- web site -->
                      <ion-item
                        lines="full"
                        v-if="project.page"
                        :href="project.page"
                        target="_blank"
                      >
                        <ion-icon slot="start" :icon="globeOutline"></ion-icon>

                        <ion-label> Sitio web </ion-label>

                        <ion-icon slot="end" :icon="openOutline"></ion-icon>
                      </ion-item>

                      <!-- play store -->
                      <ion-item
                        lines="full"
                        v-if="project.appPlayStore"
                        :href="project.appPlayStore"
                        target="_blank"
                      >
                        <ion-icon
                          slot="start"
                          :icon="logoGooglePlaystore"
                        ></ion-icon>

                        <ion-label> Aplicación móvil </ion-label>

                        <ion-icon slot="end" :icon="openOutline"></ion-icon>
                      </ion-item>

                      <!-- source code -->
                      <ion-item
                        lines="full"
                        v-if="project.sourceCode"
                        :href="project.sourceCode"
                        target="_blank"
                        ><ion-icon
                          slot="start"
                          :icon="codeDownloadOutline"
                        ></ion-icon>

                        <ion-label>Código fuente</ion-label>

                        <ion-icon slot="end" :icon="openOutline"></ion-icon>
                      </ion-item>

                      <!-- platform -->
                      <ion-item
                        lines="full"
                        v-if="project.platform"
                        :href="project.platform.route"
                        target="_blank"
                      >
                        <ion-icon
                          slot="start"
                          :icon="briefcaseOutline"
                        ></ion-icon>

                        <ion-label>
                          Plataforma ({{ project.platform.name }})
                        </ion-label>

                        <ion-icon slot="end" :icon="openOutline"></ion-icon>
                      </ion-item>
                    </ion-col>
                  </ion-row>
                </ion-list>
              </ion-col>
            </ion-row>

            <!-- description -->
            <ion-row>
              <ion-col>
                <ion-list>
                  <ion-list-header>
                    <ion-label>Descripción</ion-label>
                  </ion-list-header>

                  <ion-row class="ion-padding-start">
                    <ion-col>
                      <ion-note style="color: var(--ion-text-color)">{{
                        project.description
                      }}</ion-note>
                    </ion-col>
                  </ion-row>
                </ion-list>
              </ion-col>
            </ion-row>
          </div>
        </ion-accordion>
      </ion-accordion-group>
    </ion-card>
  </div>
</template>

<script setup lang="ts">
import { IonItem } from "@ionic/vue";

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
  openOutline,
  globeOutline,
  logoGooglePlaystore,
  briefcaseOutline,
  codeDownloadOutline,
} from "ionicons/icons";
import { ref } from "vue";

const proyectos = [
  {
    name: "Lifeline",
    status: "En desarrollo",
    type: [logoAndroid, logoFirefox, logoChrome, logoWindows, logoTux],
    color: "primary",
    image: {
      route: lifelineLogo,
      width: "134px",
      height: "112px",
    },

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
    image: {
      route: metaApp,
      width: "134px",
      height: "112px",
    },
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
      route: "https://www.upwork.com/freelancers/~0162303a78d7d448db",
    },
  },
  {
    name: "Ciclo",
    status: "En desarrollo",
    type: [logoAndroid, logoFirefox, logoChrome, logoWindows],
    color: "primary",
    image: {
      route: noLogo,
      width: "134px",
      height: "112px",
    },
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
      image: {
        route: logoUpwork,
        width: "20px",
        height: "20px",
      },
      route: "https://www.upwork.com/freelancers/~0162303a78d7d448db",
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
