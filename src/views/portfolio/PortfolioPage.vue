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
          <ion-menu-button menu="mainMenu" mode="md"></ion-menu-button>
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
        <h2 class="ion-padding">Proyectos</h2>
        <ion-row>
          <ion-col
            size="12"
            size-md="4"
            size-lg="3"
            v-for="(project, index) in proyectos"
            :key="index"
          >
            <ion-card
              @click="openModalProject(project)"
              class="fancy_card card-click"
            >
              <ion-card-header>
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
              </ion-card-header>
              <ion-card-content>
                <ion-row>
                  <ion-col size="12">
                    <ion-chip :color="project.color">
                      <ion-label>{{ project.status }}</ion-label>
                    </ion-chip>
                  </ion-col>
                  <ion-col size="12">
                    <ion-button
                      v-for="icon in project.type"
                      :key="icon"
                      fill="clear"
                      size="small"
                    >
                      <ion-icon :icon="icon"></ion-icon>
                    </ion-button>
                  </ion-col>
                </ion-row>
              </ion-card-content>
            </ion-card>
          </ion-col>
        </ion-row>
      </section>

      <!-- Holdings -->
      <section>
        <h2 class="ion-padding-start">Participaciones</h2>
        <ion-row>
          <ion-col
            size="12"
            size-md="4"
            size-lg="3"
            v-for="(participación, index) in participaciones"
            :key="index"
          >
            <ion-card class="card-click">
              <ion-card-header @click="openPage(participación.page)">
                <ion-card-title>
                  {{ participación.name }}
                </ion-card-title>
              </ion-card-header>
            </ion-card>
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
  modalController,
  IonButtons,
  IonRow,
  IonCol,
  IonMenuButton,
  IonCard,
  IonCardHeader,
  IonCardContent,
  IonChip,
  IonLabel,
  IonButton,
  IonCardTitle,
} from "@ionic/vue";
import { defineComponent } from "vue";
import { Plugins } from "@capacitor/core";
const { Browser } = Plugins;
import {
  logoIonic,
  logoFirebase,
  logoPaypal,
  logoWordpress,
  logoAndroid,
  globeOutline,
} from "ionicons/icons";
import ProjectModal from "./project/ProjectPage.vue";

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
    IonChip,
    IonLabel,
    IonButton,
    IonCardTitle,
  },
  setup() {
    return {
      pageTitle: "Portfolio",
      proyectos: [
        {
          name: "Petstread",
          status: "Finalizado",
          type: [logoAndroid],
          color: "success",
          image: [
            {
              route: require("../../../public/assets/otros/Petstread.svg"),
              width: "134px",
              height: "112px",
            },
          ],
          description:
            "Petstread es una tienda de alimentos y accesorios para diversos tipos de mascotas siendo esta una aplicación para PWA, Android y IOs, el proyecto fue adquirido por medio de la plataforma de workana.",
          technologies: [
            {
              name: "Ionic",
              route: "https://ionicframework.com/",
              icon: logoIonic,
              type: "FrontEnd",
            },
            {
              name: "Firebase",
              route: "https://firebase.google.com/",
              icon: logoFirebase,
              type: "BackEnd",
            },
            {
              name: "Paypal",
              route: "https://www.paypal.com/mx/",
              icon: logoPaypal,
              type: "FrontEnd",
            },
          ],
          page: "https://petstread-ab119.web.app/inicio",
        },
        {
          name: "Thinkers",
          status: "Finalizado",
          type: [globeOutline],
          color: "success",
          image: [
            {
              route: require("../../../public/assets/otros/thinkers.png"),
              width: "134px",
              height: "112px",
            },
          ],
          description:
            "Thinkers fue desarrollado como un landing page para una compañía de desarrolladores de software, el proyecto fue asignado como un proyecto de la plataforma de Workana.",
          technologies: [
            {
              name: "Wordpress",
              route: "https://es-mx.wordpress.org/",
              icon: logoWordpress,
              type: "CMS",
            },
          ],
          page: "https://thinkers.com.ec/",
        },
      ],
      participaciones: [
        {
          name: "Workana",
          type: "Trabajo",
          color: "secondary",
          image: [
            {
              route: require("../../../public/assets/otros/workana.png"),
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
              route: require("../../../public/assets/otros/init.png"),
              width: "134px",
              height: "82px",
            },
          ],
          page: "https://www.initu.me/",
        },
      ],
    };
  },
  methods: {
    async navegador(url: string) {
      await Browser.open({ url });
    },
    async openPage(page: string) {
      window.open(page, "_blank");
    },
    async openModalProject(project: any) {
      const modal = await modalController.create({
        component: ProjectModal,
        cssClass: "my-custom-class",
        componentProps: {
          project,
        },
      });
      return modal.present();
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
