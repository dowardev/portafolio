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

    <ion-content>
      <section class="section-options">
        <ion-row>
          <ion-col size="12">
            <div class="main-section">
              <ion-segment
                :value="mainSegment"
                @ion-change="mainSegment = $event.detail.value as string"
              >
                <ion-segment-button value="skills"
                  >Habilidades</ion-segment-button
                >
                <ion-segment-button value="history"
                  >Historia</ion-segment-button
                >
                <ion-segment-button value="portfolio"
                  >Portfolio</ion-segment-button
                >
              </ion-segment>
            </div>
          </ion-col>
        </ion-row>
      </section>

      <ion-row>
        <ion-col>
          <ion-card class="card-main-content">
            <ion-row>
              <ion-col size="12" size-lg="6">
                <InformationComponent />
              </ion-col>

              <ion-col size="12" size-lg="6">
                <div v-if="mainSegment == 'skills'" class="components-section">
                  <SkillsPage />
                </div>

                <div v-if="mainSegment == 'history'" class="components-section">
                  <HistoryPage />
                </div>

                <div
                  v-if="mainSegment == 'portfolio'"
                  class="components-section"
                >
                  <PortfolioPage />
                </div>
              </ion-col>
            </ion-row>
          </ion-card>
        </ion-col>
      </ion-row>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
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
  IonSegment,
  IonSegmentButton,
} from "@ionic/vue";
import { defineComponent, onMounted, ref } from "vue";
import { App } from "@capacitor/app";
import { useSystem } from "@/composables/useSystem";

// components
import InformationComponent from "./information/InformationComponent.vue";
import SkillsPage from "../skills/SkillsPage.vue";
import HistoryPage from "../history/HistoryPage.vue";
import PortfolioPage from "../portfolio/PortfolioPage.vue";

const modeDesingElements = isPlatform("ios") ? "ios" : ("md" as "ios" | "md");

const mainSegment = ref("skills");

onMounted(() => {
  useBackButton(10, () => {
    alertExitApp();
  });
});

// functions
async function alertExitApp() {
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
}
</script>

<style scoped src="./information/animacion-nombre.css"></style>
<style scoped>
.center {
  display: flex;
  justify-content: center;
}

.card-main-content {
  height: calc(100vh - 142px);
}

ion-content {
  --overflow: hidden;
}

.components-section {
  height: calc(100vh - 439px);
  overflow: auto;
}

/*tablet */
@media only screen and (min-width: 768px) {
  .texto-bienvenida {
    margin-top: 16px;
  }
  .components-section {
    height: calc(100vh - 146px);
    overflow: auto;
  }
  .slogan {
    text-align: center;
    font-family: OpenSans-Bold !important;
    opacity: 0.6;
  }
}

@media only screen and (min-width: 768px) {
  .main-section {
    float: right;
  }
}

@media (prefers-color-scheme: dark) {
  .slogan {
    opacity: 0.3;
  }
  p,
  ion-label,
  ion-text {
    font-family: OpenSans-Medium !important;
  }
  p {
    opacity: 0.7;
  }
}
</style>
