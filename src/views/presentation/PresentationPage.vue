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
      <ion-row class="center">
        <ion-col size-lg="12">
          <InformationComponent />
        </ion-col>
      </ion-row>

      <ion-item-divider sticky>
        <ion-segment v-model="mainSegment">
          <ion-segment-button value="skills">Habilidades</ion-segment-button>
          <ion-segment-button value="history">Historia</ion-segment-button>
          <ion-segment-button value="portfolio">Portfolio</ion-segment-button>
        </ion-segment>
      </ion-item-divider>

      <ion-row>
        <ion-col>
          <SkillsPage v-if="mainSegment == 'skills'" />
          <HistoryPage v-if="mainSegment == 'history'" />
          <PortfolioPage v-if="mainSegment == 'portfolio'" />
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
  IonSegment,
  IonSegmentButton,
} from "@ionic/vue";
import { defineComponent } from "vue";
import { App } from "@capacitor/app";
import InformationComponent from "./information/InformationComponent.vue";
import SkillsPage from "../skills/SkillsPage.vue";
import {
  chatbubble,
  copyOutline,
  logoLinkedin,
  logoMastodon,
  mail,
  openOutline,
} from "ionicons/icons";
import HistoryPage from "../history/HistoryPage.vue";
import PortfolioPage from "../portfolio/PortfolioPage.vue";

export default defineComponent({
  name: "PresentationPage",
  components: {
    IonContent,
    IonPage,
    IonButtons,
    IonMenuButton,
    IonRow,
    IonCol,
    InformationComponent,
    SkillsPage,
    IonSegment,
    IonSegmentButton,
    HistoryPage,
    PortfolioPage,
  },

  setup() {
    const modeDesingElements = isPlatform("ios")
      ? "ios"
      : ("md" as "ios" | "md");
    return {
      modeDesingElements,
      mail,
      copyOutline,
      openOutline,
      logoLinkedin,
      chatbubble,
      logoMastodon,
    };
  },

  data() {
    const defaultColorFill = "#777777";
    return {
      defaultColorFill,
      fillTelegramGroup: defaultColorFill,
      fillTelegramChannel: defaultColorFill,
      fillEmailContact: defaultColorFill,
      fillEmailHelp: defaultColorFill,
      fillMastodon: defaultColorFill,
      fillLinkedIn: defaultColorFill,
      fillDev: defaultColorFill,
      mainSegment: "skills",
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

<style scoped src="./information/animacion-nombre.css"></style>
<style scoped>
.img-perfil {
  border-radius: 50%;
  width: 166px;
  height: 166px;
}
.center {
  display: flex;
  justify-content: center;
}
/* smartphones vertical */
@media (min-width: 320px) and (max-width: 480px) {
  .texto-bienvenida {
    margin-top: 21px;
  }
  .img-logo {
    width: 215px;
  }
}
/* smartphones horizontal */
@media only screen and (min-width: 600px) {
  .img-logo {
    width: 186px;
  }
  .texto-bienvenida {
    margin-top: 16px;
  }
}
/*tablet */
@media only screen and (min-width: 768px) {
  .img-logo {
    width: 226px;
  }
  .texto-bienvenida {
    margin-top: 16px;
  }
  .img-perfil {
    border-radius: 50%;
    width: 182px;
    height: 182px;
  }
}
/* escritorio */
@media only screen and (min-width: 992px) {
  .img-proyecto {
    width: 241px;
  }

  #texto-bienvenida {
    display: flex;
    justify-content: center;
  }
  .img-logo {
    width: 215px;
    margin-right: 100%;
  }
  .img-perfil {
    border-radius: 50%;
    width: 182px;
    height: 182px;
  }
}
.slogan {
  text-align: center;
  font-family: OpenSans-Bold !important;
  opacity: 0.6;
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
