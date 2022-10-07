<template>
  <ion-row>
    <ion-col size="12">
      <div class="center">
        <img
          src="@/assets/portafolio/foto_perfil.jpg"
          alt=""
          class="img-perfil"
        />
      </div>
    </ion-col>
    <ion-col id="copywriting" size="12" class="ion-padding">
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
        <img src="https://www.codewars.com/users/dowar/badges/small" alt="" />
      </a>
    </ion-col>
  </ion-row>
</template>

<script lang="ts">
import {
  IonRow,
  IonCol,
  useBackButton,
  alertController,
  isPlatform,
} from "@ionic/vue";
import { defineComponent } from "vue";
import {
  mail,
  logoMastodon,
  logoGitlab,
  logoLinkedin,
  copyOutline,
  openOutline,
  ellipsisVerticalOutline,
} from "ionicons/icons";
import { App } from "@capacitor/app";
import telegramLogo from "../../../assets/otros/icons8-telegram-app.svg";

export default defineComponent({
  name: "InformationComponent",
  components: {
    IonRow,
    IonCol,
  },

  setup() {
    const modeDesingElements = isPlatform("ios")
      ? "ios"
      : ("md" as "ios" | "md");
    return {
      mail,
      logoMastodon,
      logoGitlab,
      logoLinkedin,
      modeDesingElements,
      iconTelegram: telegramLogo,
      copyOutline,
      openOutline,
      ellipsisVerticalOutline,
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

    async copyToClipboard(params: { text: any }) {
      const text = params.text;
      try {
        await navigator.clipboard.writeText(text);
      } catch ($e) {
        alert("Cannot copy");
      }
    },
  },
});
</script>

<style scoped src="./animacion-nombre.css"></style>

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
