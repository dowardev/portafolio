<template>
  <ion-page>
    <ion-header class="ion-no-border" :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button @click="closeComponent()">
            <ion-icon :icon="chevronBackOutline"></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-title>Restablecer contraseña</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-row class="ion-padding center">
        <ion-col size="12" size-md="6">
          <p>No te preocupes juntos lo solucionaremos.</p>
          <ol>
            <li>Ingresa tu correo electrónico</li>
            <li>Ingresa el código que recibiste en tu correo electrónico</li>
            <li>Ingresa tu nueva contraseña</li>
            <li>Recupera el acceso a tu cuenta</li>
          </ol>
        </ion-col>
      </ion-row>

      <section v-if="options.emailForm">
        <ion-row class="center">
          <ion-col size="12" size-md="8" size-lg="6" size-xl="4">
            <ion-card>
              <ion-card-content>
                <ion-item>
                  <ion-label position="floating">Correo electrónico</ion-label>
                  <ion-input
                    type="email"
                    v-model="form.email"
                    autocomplete="email"
                    @keyup.enter="sendMailResetPassword()"
                  ></ion-input>
                </ion-item>
                <ion-button
                  expand="block"
                  fill="clear"
                  @click="sendMailResetPassword()"
                >
                  Confirmar
                </ion-button>
              </ion-card-content>
            </ion-card>
          </ion-col>
        </ion-row>
      </section>

      <section v-if="options.codeForm">
        <ion-row class="center">
          <ion-col size="12" size-md="8" size-lg="6" size-xl="4">
            <ion-card>
              <ion-card-content>
                <ion-item>
                  <ion-label position="floating">Código</ion-label>
                  <ion-input
                    type="numeric"
                    v-model="form.code"
                    @keyup.enter="sendCodeResetPassword()"
                  ></ion-input>
                </ion-item>
                <ion-button
                  expand="full"
                  fill="clear"
                  @click="sendCodeResetPassword()"
                  >Enviar</ion-button
                >
              </ion-card-content>
            </ion-card>
          </ion-col>
        </ion-row>
      </section>

      <section v-if="options.passwordForm">
        <ion-row class="center">
          <ion-col size="12" size-md="8" size-lg="6" size-xl="4">
            <ion-card>
              <ion-card-content>
                <ion-item>
                  <ion-label position="floating">Contraseña</ion-label>
                  <ion-input
                    :type="inputTypePassword1"
                    v-model="form.password1"
                    @keyup.enter="resetPassword()"
                  ></ion-input>
                  <ion-button
                    slot="end"
                    fill="clear"
                    v-if="inputTypePassword1 == 'text'"
                    v-on:click="inputTypePassword1 = 'password'"
                    style="margin-top: 20px"
                  >
                    <ion-icon :icon="eyeOffOutline"></ion-icon>
                  </ion-button>
                  <ion-button
                    slot="end"
                    fill="clear"
                    v-if="inputTypePassword1 == 'password'"
                    v-on:click="inputTypePassword1 = 'text'"
                    style="margin-top: 20px"
                  >
                    <ion-icon :icon="eyeOutline"></ion-icon>
                  </ion-button>
                </ion-item>
                <ion-item>
                  <ion-label position="floating"
                    >Repite la contraseña</ion-label
                  >
                  <ion-input
                    :type="inputTypePassword2"
                    v-model="form.password2"
                    @keyup.enter="resetPassword()"
                  ></ion-input>
                  <ion-button
                    slot="end"
                    fill="clear"
                    v-if="inputTypePassword2 == 'text'"
                    v-on:click="inputTypePassword2 = 'password'"
                    style="margin-top: 20px"
                  >
                    <ion-icon :icon="eyeOffOutline"></ion-icon>
                  </ion-button>
                  <ion-button
                    slot="end"
                    fill="clear"
                    v-if="inputTypePassword2 == 'password'"
                    v-on:click="inputTypePassword2 = 'text'"
                    style="margin-top: 20px"
                  >
                    <ion-icon :icon="eyeOutline"></ion-icon>
                  </ion-button>
                </ion-item>
                <ion-button expand="full" fill="clear" @click="resetPassword()">
                  Enviar
                </ion-button>
              </ion-card-content>
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
  toastController,
  IonInput,
  loadingController,
} from "@ionic/vue";
import { chevronBackOutline, eyeOutline, eyeOffOutline } from "ionicons/icons";
import { defineComponent } from "vue";
import sessionService from "../../../services/session.vue";

export default defineComponent({
  name: "HomePage",
  components: {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonInput,
  },
  setup() {
    return { chevronBackOutline, eyeOutline, eyeOffOutline };
  },
  data() {
    return {
      form: {
        email: "",
        code: "",
        password1: "",
        password2: "",
      },
      options: {
        emailForm: true,
        codeForm: false,
        passwordForm: false,
      },
      inputTypePassword1: "password",
      inputTypePassword2: "password",
    };
  },
  methods: {
    closeComponent() {
      this.$router.push("/login");
    },
    async sendMailResetPassword() {
      const loading = await this.presentLoading("Enviando correo");
      loading.present();

      sessionService()
        .sendMailResetPassword(this.form.email)
        .then(() => {
          loading.dismiss();
          this.options.emailForm = false;
          this.options.codeForm = true;
        })
        .catch((e) => {
          loading.dismiss();
          this.presentToast("Hubo un problema al enviar el corro.", "danger");
        });
    },
    async presentToast(message: string, color: string) {
      const toast = await toastController.create({
        message,
        duration: 3000,
        color,
      });
      toast.present();
    },
    async presentLoading(message: string) {
      const loading = await loadingController.create({
        cssClass: "loading",
        message,
      });
      return loading;
    },
    async sendCodeResetPassword() {
      const loading = await this.presentLoading("Verificando código");
      loading.present();

      sessionService()
        .sendCodeResetPassword(this.form.email, this.form.code)
        .then(() => {
          loading.dismiss();
          this.options.codeForm = false;
          this.options.passwordForm = true;
        })
        .catch((e) => {
          loading.dismiss();
          if (e.response.data.message == "Code invalid") {
            this.presentToast("Código incorrecto", "danger");
          }
        });
    },
    async resetPassword() {
      if (this.form.password1 != this.form.password2) {
        this.presentToast("Las contraseñas no coinciden", "danger");
        return;
      }
      const loading = await this.presentLoading("Actualizando contraseña");
      loading.present();

      sessionService()
        .resetPassword(this.form.email, this.form.password1)
        .then(() => {
          loading.dismiss();
          this.options.passwordForm = false;
          this.options.emailForm = true;
          this.presentToast("Contraseña restaurada", "success");
          this.$router.push("/login");
        })
        .catch(() => {
          loading.dismiss();
          this.presentToast(
            "Hubo un problema al actualizar la contraseña",
            "danger"
          );
        });
    },
  },
});
</script>

<style scoped>
#container {
  text-align: center;

  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
}

#container strong {
  font-size: 20px;
  line-height: 26px;
}

#container p {
  font-size: 16px;
  line-height: 22px;

  color: #8c8c8c;

  margin: 0;
}

#container a {
  text-decoration: none;
}
</style>
