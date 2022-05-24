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
        <ion-col size-xs="12" size-lg="6" style="margin-top: 5vh">
          <ion-row>
            <ion-col size="12">
              <div class="center">
                <img
                  src="../../../public/assets/portafolio/foto_perfil.jpg"
                  alt=""
                  class="img-perfil"
                />
              </div>
            </ion-col>
            <ion-col size="12" class="ion-padding" id="copywriting">
              <div style="text-align: center">
                <div class="wrapper">
                  <div class="letters">
                    <span class="letter">G</span>
                    <span class="letter">o</span>
                    <span class="letter">n</span>
                    <span class="letter">z</span>
                    <span class="letter">a</span>
                    <span class="letter">l</span>
                    <span class="letter">o</span>
                    <span class="letter"></span>
                    <span class="letter">P</span>
                    <span class="letter">o</span>
                    <span class="letter">n</span>
                    <span class="letter">c</span>
                    <span class="letter">e</span>
                    <span class="letter"></span>
                  </div>
                </div>
              </div>
            </ion-col>
          </ion-row>

          <ion-row id="texto-bienvenida" class="center">
            <ion-col size="12" size-md="6" class="ion-padding">
              <p class="slogan">
                Haciendo de mi pasión una forma de hacer realidad tus objetivos.
              </p>
            </ion-col>
          </ion-row>

          <ion-row>
            <ion-col size="12" style="display: flex; justify-content: center">
              <a href="https://www.codewars.com/users/dowar/" target="_blank">
                <img
                  src="https://www.codewars.com/users/dowar/badges/small"
                  alt=""
                />
              </a>
            </ion-col>
          </ion-row>
        </ion-col>

        <ion-col size-xs="12" size-lg="6">
          <ion-row>
            <ion-col size-xs="12" size-lg="8">
              <ion-list>
                <ion-list-header>
                  <ion-label>Contacto profesional</ion-label>
                </ion-list-header>

                <ion-card>
                  <ion-card-content>
                    <ion-item
                      @click="openMailContact()"
                      @mouseover="fillEmailContact = '#d94f4f'"
                      @mouseleave="fillEmailContact = '#777777'"
                      lines="none"
                      button
                    >
                      <ion-icon
                        :style="{ color: fillEmailContact }"
                        :icon="mail"
                        slot="start"
                      ></ion-icon>
                      <ion-label> Correo electrónico </ion-label>
                    </ion-item>

                    <ion-item
                      href="https://www.linkedin.com/in/dowar/"
                      target="_blank"
                      @mouseover="fillLinkedIn = '#0074b1'"
                      @mouseleave="fillLinkedIn = '#777777'"
                      lines="none"
                      button
                    >
                      <ion-icon
                        :style="{ color: fillLinkedIn }"
                        :icon="logoLinkedin"
                        slot="start"
                      ></ion-icon>
                      <ion-label> LinkedIn </ion-label>
                    </ion-item>
                  </ion-card-content>
                </ion-card>
              </ion-list>

              <ion-list>
                <ion-list-header>
                  <ion-label>Social</ion-label>
                </ion-list-header>

                <ion-card>
                  <ion-card-content>
                    <ion-item
                      @click="openMailHelp()"
                      @mouseover="fillEmailHelp = '#d94f4f'"
                      @mouseleave="fillEmailHelp = '#777777'"
                      lines="none"
                      button
                    >
                      <ion-icon
                        :style="{ color: fillEmailHelp }"
                        :icon="mail"
                        slot="start"
                      ></ion-icon>
                      <ion-label> Correo electrónico </ion-label>
                    </ion-item>

                    <ion-item
                      href="https://mastodon.social/web/@dowar"
                      target="_blank"
                      @mouseover="fillMastodon = '#2791da'"
                      @mouseleave="fillMastodon = '#777777'"
                      lines="none"
                      button
                    >
                      <ion-icon
                        :style="{ color: fillMastodon }"
                        :icon="logoMastodon"
                        slot="start"
                      ></ion-icon>
                      <ion-label> Mastodon </ion-label>
                    </ion-item>

                    <ion-item
                      href="https://t.me/+qSXz6T6rF7djOTkz"
                      target="_blank"
                      @mouseover="fillTelegramGroup = '#2497d6'"
                      @mouseleave="fillTelegramGroup = '#777777'"
                      lines="none"
                      button
                    >
                      <ion-icon
                        :style="{ color: fillTelegramGroup }"
                        :src="iconTelegram"
                        slot="start"
                      ></ion-icon>
                      <ion-label> Grupo de Telegram</ion-label>
                    </ion-item>

                    <ion-item
                      href="https://t.me/news_dowar_blog"
                      target="_blank"
                      @mouseover="fillTelegramChannel = '#2497d6'"
                      @mouseleave="fillTelegramChannel = '#777777'"
                      lines="none"
                      button
                    >
                      <ion-icon
                        :style="{ color: fillTelegramChannel }"
                        :src="iconTelegram"
                        slot="start"
                      ></ion-icon>
                      <ion-label> Canal de Telegram</ion-label>
                    </ion-item>

                    <!-- <ion-row> -->
                    <!--   <ion-col -->
                    <!--     style=" -->
                    <!--       align-items: center; -->
                    <!--       display: flex; -->
                    <!--       flex-direction: column; -->
                    <!--       justify-content: enter; -->
                    <!--       padding: 1em; -->
                    <!--       text-align: center; -->
                    <!--     " -->
                    <!--   > -->
                    <!--     <a -->
                    <!--       class="btn btn-5" -->
                    <!--       v-on:click="$router.push('/informacion')" -->
                    <!--       style=" -->
                    <!--         display: block; -->
                    <!--         height: 58px; -->
                    <!--         max-width: 58px; -->
                    <!--         border-radius: 50%; -->
                    <!--       " -->
                    <!--     > -->
                    <!--       <ion-icon -->
                    <!--         :icon="arrowForward" -->
                    <!--         style=" -->
                    <!--           width: 41px; -->
                    <!--           height: 40px; -->
                    <!--           position: absolute; -->
                    <!--           top: 50%; -->
                    <!--           transform: translate(-20px, -50%); -->
                    <!--         " -->
                    <!--       ></ion-icon -->
                    <!--     ></a> -->
                    <!--   </ion-col> -->
                    <!-- </ion-row> -->
                  </ion-card-content>
                </ion-card>
              </ion-list>
            </ion-col>
          </ion-row>
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
  IonIcon,
  useBackButton,
  alertController,
  isPlatform,
} from "@ionic/vue";
import { defineComponent } from "vue";
import { mail, logoMastodon, logoGitlab, logoLinkedin } from "ionicons/icons";
import { App } from "@capacitor/app";

export default defineComponent({
  name: "PresentationPage",
  components: {
    IonContent,
    IonPage,
    IonButtons,
    IonMenuButton,
    IonRow,
    IonCol,
    IonIcon,
  },

  setup() {
    const modeDesingElements = isPlatform("ios") ? "ios" : "md";
    return {
      mail,
      logoMastodon,
      logoGitlab,
      logoLinkedin,
      modeDesingElements,
      iconTelegram: require("../../../public/assets/otros/icons8-telegram-app.svg"),
    };
  },

  data() {
    return {
      fillTelegramGroup: "#777777",
      fillTelegramChannel: "#777777",
      fillEmailContact: "#777777",
      fillEmailHelp: "#777777",
      fillMastodon: "#777777",
      fillLinkedIn: "#777777",
      fillDev: "#777777",
    };
  },
  mounted() {
    useBackButton(10, () => {
      this.alertExitApp();
    });
  },
  methods: {
    openMailContact() {
      location.href = "mailto:contacto@dowar.xyz?Subject=Contacto%20laboral";
    },

    openMailHelp() {
      location.href = "mailto:ayuda@dowar.xyz?Subject=Ayuda";
    },

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

<style scoped src="./animacion-nombre.css"></style>
<style scoped src="./boton-flecha.css"></style>

<style scoped>
svg {
  width: 28px;
  height: 28px;
}
#svg-telegram path:hover {
  fill: #31a7d9;
}
#svg-dev path:hover {
  fill: #000000;
}
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
