<template>
  <ion-page>
    <ion-header :translucent="true" class="ion-no-border" mode="ios">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button menu="mainMenu" mode="md"></ion-menu-button>
        </ion-buttons>
        <ion-title>Bienvenido</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-row style="margin-top: 12vh">
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

      <ion-row>
        <ion-col style="display: flex; justify-content: center">
          <ion-row id="iconos-redes">
            <ion-button
              expand="block"
              fill="clear"
              v-on:click="mail"
              @mouseover="fillCorreo = '#d94f4f'"
              @mouseleave="fillCorreo = '#777777'"
            >
              <ion-icon
                :style="{ color: fillCorreo }"
                :icon="mailOutline"
              ></ion-icon>
            </ion-button>
            <ion-button
              fill="clear"
              href="
                  https://mastodon.social/web/accounts/864151'
                "
              target="_blank"
              @mouseover="fillMastodon = '#2791da'"
              @mouseleave="fillMastodon = '#777777'"
            >
              <ion-icon
                :style="{ color: fillMastodon }"
                :icon="logoMastodon"
              ></ion-icon>
            </ion-button>
            <ion-button
              expand="block"
              fill="clear"
              href="https://gitlab.com/gonzam4"
              target="_blank"
              @mouseover="fillGitlab = '#dd4526'"
              @mouseleave="fillGitlab = '#777777'"
            >
              <ion-icon
                :style="{ color: fillGitlab }"
                :icon="logoGitlab"
              ></ion-icon>
            </ion-button>
            <ion-button
              fill="clear"
              href="
                    https://www.linkedin.com/in/dowar/
                "
              target="_blank"
              @mouseover="fillLinkedIn = '#0074b1'"
              @mouseleave="fillLinkedIn = '#777777'"
            >
              <ion-icon
                :style="{ color: fillLinkedIn }"
                :icon="logoLinkedin"
              ></ion-icon>
            </ion-button>
          </ion-row>
        </ion-col>
      </ion-row>

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
  IonButton,
  IonIcon,
  useBackButton,
  alertController,
} from "@ionic/vue";
import { defineComponent } from "vue";
import { isPlatform } from "@ionic/vue";
import {
  mailOutline,
  logoMastodon,
  logoGitlab,
  logoLinkedin,
} from "ionicons/icons";
import { Plugins } from "@capacitor/core";
const { App } = Plugins;

export default defineComponent({
  name: "HomePage",
  components: {
    IonContent,
    IonPage,
    IonButtons,
    IonMenuButton,
    IonRow,
    IonCol,
    IonButton,
    IonIcon,
  },
  setup() {
    return {
      mailOutline,
      logoMastodon,
      logoGitlab,
      logoLinkedin,
    };
  },
  data() {
    return {
      fillTelegram: "#777777",
      fillCorreo: "#777777",
      fillMastodon: "#777777",
      fillGitlab: "#777777",
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
    mail() {
      if (
        isPlatform("desktop") ||
        isPlatform("mobile") ||
        isPlatform("mobileweb")
      ) {
        location.href = "mailto:contacto@dowar.xyz?Subject=Contacto%20laboral";
      }
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
            handler: (blah) => {
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
