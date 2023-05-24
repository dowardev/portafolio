<template>
  <ion-row>
    <ion-col>
      <ion-card v-for="(project, index) in proyectos" :key="index">
        <ion-card-content>
          <ion-row>
            <ion-col>
              <ion-row>
                <ion-col size="12">
                  <ion-card-title>
                    {{ project.name }}
                  </ion-card-title>
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
                    >Post</ion-button
                  >
                  <ion-button
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

import viteLogo from "../../../assets/otros/vite.svg";

import {
  logoIonic,
  logoAndroid,
  logoFirefox,
  logoChrome,
  logoVue,
  logoCapacitor,
} from "ionicons/icons";

const proyectos = [
  {
    name: "Plants.id",
    type: [logoAndroid, logoFirefox, logoChrome],
    color: "primary",
    description:
      "Aplicacion que emplea la API de Plants.id para identificar las plantas de una imagen",
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
        icon: logoCapacitor,
        type: "icon",
      },
    ],
    page: "https://dowar.xyz/blog/post/40",
    sourceCode: "https://gitlab.com/gonzam4/ionic-plants.id",
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
