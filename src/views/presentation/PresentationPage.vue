<template>
  <ion-page>
    <ion-header :translucent="true" class="ion-no-border" mode="ios">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button
            menu="mainMenu"
            :mode="modeDesingElements"
          ></ion-menu-button>
        </ion-buttons>
        <ion-title>Bienvenido</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-row>
        <ion-col size-xs="12" size-md="6">
          <InformationComponent />
        </ion-col>

        <ion-col size-xs="12" size-md="6">
          <CardsInformationComponent />
        </ion-col>
      </ion-row>

      <ion-row>
        <ion-col>
          <p class=center>Habilidades</p>
          <SkillsPage />
        </ion-col>
      </ion-row>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import {
  IonContent,
  IonPage,
  IonButtons,
  IonMenuButton,
  IonRow,
  IonCol,
  useBackButton,
  alertController,
  isPlatform,
} from "@ionic/vue";
import { defineComponent } from "vue";
import { App } from "@capacitor/app";
import CardsInformationComponent from "./cards_information/CardInformationComponent.vue";
import InformationComponent from "./information/InformationComponent.vue";
import SkillsPage from "../skills/SkillsPage.vue";

export default defineComponent({
  name: "PresentationPage",
  components: {
    IonContent,
    IonPage,
    IonButtons,
    IonMenuButton,
    IonRow,
    IonCol,
    CardsInformationComponent,
    InformationComponent,
    SkillsPage,
  },

  setup() {
    const modeDesingElements = isPlatform("ios")
      ? "ios"
      : ("md" as "ios" | "md");
    return {
      modeDesingElements,
    };
  },

  mounted() {
    useBackButton(10, () => {
      this.alertExitApp();
    });
  },

  methods: {
    async alertExitApp() {
      const alert = await alertController.create({
        header: "Alerta",
        message: "Esta a punto de salir de la aplicación",
        buttons: [
          {
            text: "Cancel",
            role: "cancel",
            cssClass: "secondary",
            id: "cancel-button",
            handler: () => {
              // console.log('Confirm Cancel:', blah)
            },
          },
          {
            text: "Continuar",
            id: "confirm-button",
            handler: () => {
              App.exitApp();
            },
          },
        ],
      });
      await alert.present();

      const { role } = await alert.onDidDismiss();
      console.log("onDidDismiss resolved with role", role);
    },
  },
});
</script>
