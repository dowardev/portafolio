<template>
  <ion-page>
    <ion-header
      :translucent="true"
      collapse="fade"
      mode="ios"
      class="ion-no-border"
    >
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button
            menu="mainMenu"
            :mode="modeDesingElements"
          ></ion-menu-button>
        </ion-buttons>
        <ion-title>{{ pageTitle }}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-header collapse="condense" mode="ios">
        <ion-toolbar>
          <ion-title size="large">{{ pageTitle }}</ion-title>
        </ion-toolbar>
      </ion-header>

      <!-- Projects -->
      <section>
        <ion-row>
          <ion-col size="12">
            <ion-list>
              <ion-list-header>
                <ion-label>Proyectos</ion-label>
                <ion-button href="https://gitlab.com/gonzam4" target="_blank"
                  >Ver todo</ion-button
                >
              </ion-list-header>

              <ion-accordion-group>
                <ion-row>
                  <ion-col size="12" size-md="6" size-lg="4">
                    <ion-card
                      v-for="(project, index) in proyectos"
                      :key="index"
                      class="card-click"
                    >
                      <ion-accordion>
                        <ion-card-header slot="header">
                          <div class="center">
                            <img
                              :src="project.image[0].route"
                              alt=""
                              :style="{
                                maxWidth: project.image[0].width,
                                height: project.image[0].height,
                              }"
                            />
                          </div>

                          <ion-card-title class="center"
                            >{{ project.name }}
                          </ion-card-title>

                          <div class="center ion-padding-bottom">
                            <ion-label>{{ project.status }}</ion-label>
                          </div>

                          <div class="center">
                            <ion-icon
                              v-for="icon in project.type"
                              :key="icon"
                              fill="clear"
                              size="small"
                              :icon="icon"
                              class="ion-padding-end"
                              color="primary"
                            ></ion-icon>
                          </div>
                        </ion-card-header>

                        <ion-card-content slot="content">
                          <ion-list>
                            <ion-list-header>Tecnologías</ion-list-header>
                            <ion-row>
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
                          </ion-list>

                          <ion-list>
                            <ion-list-header
                              >Enlaces de interes</ion-list-header
                            >
                            <ion-item lines="none">
                              <ion-button
                                fill="clear"
                                :href="project.page"
                                target="_blank"
                              >
                                <ion-icon :icon="globeOutline"></ion-icon>
                              </ion-button>
                              <ion-button
                                v-for="source in project.sourceCode"
                                :key="source.page"
                                :href="source.page"
                                fill="clear"
                                target="_blank"
                              >
                                <ion-icon
                                  :icon="
                                    source.name == 'FrontEnd'
                                      ? browsersOutline
                                      : serverOutline
                                  "
                                ></ion-icon>
                              </ion-button>
                            </ion-item>
                          </ion-list>
                        </ion-card-content>
                      </ion-accordion>
                    </ion-card>
                  </ion-col>
                </ion-row>
              </ion-accordion-group>
            </ion-list>
          </ion-col>
        </ion-row>
      </section>

      <!-- Holdings -->
      <section>
        <ion-row>
          <ion-col size="12">
            <ion-list>
              <ion-list-header>
                <ion-label>Participaciones</ion-label>
              </ion-list-header>

              <ion-row>
                <ion-col
                  v-for="participacion in participaciones"
                  :key="participacion.name"
                  size="12"
                  size-md="4"
                  size-lg="3"
                >
                  <ion-card
                    class="card-click"
                    @click="openPage(participacion.page)"
                  >
                    <ion-card-header>
                      <ion-card-title>
                        {{ participacion.name }}
                      </ion-card-title>
                    </ion-card-header>
                  </ion-card>
                </ion-col>
              </ion-row>
            </ion-list>
          </ion-col>
        </ion-row>
      </section>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonRow,
  IonCol,
  IonMenuButton,
  IonCard,
  IonCardHeader,
  IonCardContent,
  IonLabel,
  IonButton,
  IonCardTitle,
  isPlatform,
} from "@ionic/vue";
import { defineComponent } from "vue";
import { Plugins } from "@capacitor/core";
const { Browser } = Plugins;
import {
  logoIonic,
  logoAndroid,
  browsersOutline,
  logoWindows,
  logoTux,
  serverOutline,
  logoFirefox,
  logoChrome,
  globeOutline,
  logoVue,
  logoLaravel,
} from "ionicons/icons";
import lifelineLogo from "../../assets/otros/lifeline_v1.webp";
import mariaDBLogo from "../../assets/otros/mariadb-icon.svg";
import graphqlLogo from "../../assets/otros/graphql-clear.svg";
import viteLogo from "../../assets/otros/vite.svg";

export default defineComponent({
  name: "PortfolioPage",
  components: {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonRow,
    IonCol,
    IonMenuButton,
    IonCard,
    IonCardHeader,
    IonCardContent,
    IonLabel,
    IonButton,
    IonCardTitle,
  },

  setup() {
    const modeDesingElements = isPlatform("ios")
      ? "ios"
      : ("md" as "ios" | "md");
    return {
      pageTitle: "Portfolio",
      proyectos: [
        {
          name: "Lifeline",
          status: "En desarrollo",
          type: [
            logoAndroid,
            browsersOutline,
            logoFirefox,
            logoChrome,
            logoWindows,
            logoTux,
          ],
          color: "primary",
          image: [
            {
              route: lifelineLogo,
              width: "134px",
              height: "112px",
            },
          ],
          description: "",
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
          sourceCode: [
            {
              name: "FrontEnd",
              page: "https://gitlab.com/gonzam4/lifeline",
            },
            {
              name: "BackEnd",
              page: "https://gitlab.com/gonzam4/lifeline-backend",
            },
          ],
        },
      ],
      participaciones: [
        {
          name: "Workana",
          type: "Trabajo",
          color: "secondary",
          image: [
            {
              // route: workanaLogo,
              width: "189px",
              height: "82px",
            },
          ],
          page: "https://www.workana.com/freelancer/9d94c3955c99290d9311a2aef1da7f4c?ref=user_dropdown",
        },
        {
          name: "Init",
          type: "Colaboración",
          color: "secondary",
          image: [
            {
              // route: initLogo,
              width: "134px",
              height: "82px",
            },
          ],
          page: "https://www.initu.me/",
        },
      ],
      modeDesingElements,
      serverOutline,
      browsersOutline,
      logoFirefox,
      logoChrome,
      globeOutline,
    };
  },

  methods: {
    async navegador(url: string) {
      await Browser.open({ url });
    },

    async openPage(page: string) {
      window.open(page, "_blank");
    },
  },
});
</script>

<style scope>
/* tarjetas */
.fancy_card {
  border-radius: 5px;
  overflow: hidden;
  /* otherwise header image won't respect rounded corners */
  /*background: #2e3440;*/
  transition: all 0.5s ease;
  /* back to normal */
}
.fancy_card:hover {
  transform: translate3D(0, -1px, 0) scale(1.03);
  /* move up slightly and zoom in */
  box-shadow: 8px 28px 50px rgba(129, 161, 193, 0.07),
    1px 6px 12px rgba(129, 161, 193, 0.04);
  transition: all 0.4s ease;
  /* zoom in */
}
.card-click {
  cursor: pointer;
}
</style>
