<template>
  <ion-row>
    <ion-col>
      <ion-card v-for="(project, index) in proyectos" :key="index">
        <ion-card-content>
          <ion-row>
            <ion-col size-xs="12" size-md="4">
              <img :src="project.image[0].route" style="width: 20rem" />
            </ion-col>

            <ion-col size-xs="12" size-md="8">
              <ion-row>
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
                  <div>
                    <ion-icon
                      v-for="icon in project.type"
                      :key="icon"
                      :icon="icon"
                      class="ion-padding-end"
                      color="primary"
                    ></ion-icon>
                  </div>
                </ion-col>
              </ion-row>

              <ion-row>
                <ion-col size="12">
                  <ion-text>Tecnologías</ion-text>
                </ion-col>

                <ion-col
                  v-for="tech in project.technologies"
                  :key="tech.icon"
                  size-xs="2"
                  size-md="3"
                  size-lg="3"
                  size-xl="2"
                >
                  <ion-button
                    :href="tech.route"
                    target="_blank"
                    fill="clear"
                    size="small"
                  >
                    <ion-icon
                      v-if="tech.type == 'icon'"
                      slot="start"
                      :icon="tech.icon"
                      color="primary"
                    ></ion-icon>
                    <img
                      v-if="tech.type == 'svg'"
                      :src="tech.icon"
                      alt=""
                      style="max-width: 1.4rem"
                    />
                  </ion-button>
                </ion-col>
              </ion-row>

              <ion-row>
                <ion-col size="12">
                  <ion-text>Enlaces de interes</ion-text>
                </ion-col>

                <ion-col>
                  <ion-button
                    :href="project.page"
                    target="_blank"
                    fill="outline"
                    >Sitio web</ion-button
                  >
                  <ion-button
                    v-if="project.appPlayStore"
                    :href="project.appPlayStore"
                    target="_blank"
                    fill="outline"
                    >Aplicacion movil(Play Store)</ion-button
                  >
                  <ion-button
                    v-if="project.sourceCode"
                    :href="project.sourceCode"
                    target="_blank"
                    fill="outline"
                    >Codigo fuente</ion-button
                  >
                </ion-col>
              </ion-row>
            </ion-col>
          </ion-row>
        </ion-card-content>

        <ion-accordion-group>
          <ion-accordion value="third">
            <ion-item slot="header">
              <ion-label>Descripcion</ion-label>
            </ion-item>
            <div slot="content" class="ion-padding">
              {{ project.description }}
            </div>
          </ion-accordion>
        </ion-accordion-group>
      </ion-card>
    </ion-col>
  </ion-row>
</template>

<script setup lang="ts">
import {} from "@ionic/vue";

import lifelineLogo from "../../../assets/otros/lifeline_v1.webp";
import mariaDBLogo from "../../../assets/otros/mariadb-icon.svg";
import graphqlLogo from "../../../assets/otros/graphql-clear.svg";
import viteLogo from "../../../assets/otros/vite.svg";
import metaApp from "../../../assets/otros/meta_app.png";

import {
  logoIonic,
  logoAndroid,
  logoWindows,
  logoTux,
  logoFirefox,
  logoChrome,
  logoVue,
  logoLaravel,
} from "ionicons/icons";

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
    description: "Proyecto para la administracion de tiempo",
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
  },
];
</script>

<style scope>
.list-tech,
.list-link,
.ion-item-list-link {
  background: transparent;
  --background: transparent;
}
</style>
