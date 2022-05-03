<template>
  <ion-page>
    <ion-header :translucent="true" class="ion-no-border">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button menu="mainMenu" mode="md"></ion-menu-button>
        </ion-buttons>
        <ion-title>Iniciar sesión</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <img
        src="https://image.winudf.com/v2/image/Y29tLnNhcmFzLkJlc3RNaW5pbWFsaXN0V2FsbHBhcGVyX3NjcmVlbl81Xzk4dHZtbnNw/screen-5.jpg?h=800&fakeurl=1&type=.jpg"
        class="img-fondo"
        style="opacity: 90%"
      />
      <ion-row class="ion-padding">
        <ion-col size="12">
          <h1 style="color: white">Hola, es un gusto tenerte de vuelta</h1>
        </ion-col>
      </ion-row>
      <ion-row class="center center-vertical-card-login">
        <ion-col size="12" size-lg="6" size-xl="4" class="card-form">
          <ion-card>
            <div class="center">
              <img
                src="../../../../public/assets/otros/key.png"
                alt=""
                class="imagen-usuario"
              />
            </div>
            <ion-card-content>
              <form>
                <ion-item>
                  <ion-icon
                    :icon="mailOpenOutline"
                    style="font-size: 20px; margin-top: 24px"
                    slot="start"
                  >
                  </ion-icon>
                  <ion-label position="floating">
                    Usuario o correo electrónico
                  </ion-label>
                  <ion-input v-model="v$.form['email'].$model" type="email">
                  </ion-input>
                </ion-item>
                <div
                  v-for="(error, index) of v$.form['email'].$errors"
                  :key="index"
                >
                  <div class="error">{{ error.$message }}</div>
                </div>

                <ion-item>
                  <ion-icon
                    :icon="fingerPrintOutline"
                    style="font-size: 20px; margin-top: 24px"
                    slot="start"
                  >
                  </ion-icon>
                  <ion-label position="floating">Contraseña</ion-label>
                  <ion-input
                    v-model="v$.form['password'].$model"
                    :type="inputTypePassword"
                  >
                  </ion-input>
                  <ion-button
                    slot="end"
                    fill="clear"
                    v-if="inputTypePassword == 'text'"
                    v-on:click="inputTypePassword = 'password'"
                    style="margin-top: 20px"
                  >
                    <ion-icon :icon="eyeOffOutline"></ion-icon>
                  </ion-button>
                  <ion-button
                    slot="end"
                    fill="clear"
                    v-if="inputTypePassword == 'password'"
                    v-on:click="inputTypePassword = 'text'"
                    style="margin-top: 20px"
                  >
                    <ion-icon :icon="eyeOutline"></ion-icon>
                  </ion-button>
                </ion-item>

                <div
                  v-for="(error, index) of v$.form['password'].$errors"
                  :key="index"
                >
                  <div class="error">{{ error.$message }}</div>
                </div>
              </form>

              <div class="center">
                <ion-item lines="none">
                  <ion-spinner
                    name="crescent"
                    v-if="spinners.buttonLogin"
                  ></ion-spinner>
                  <ion-button
                    fill="clear"
                    v-on:click="login()"
                    :disabled="v$.form.$invalid"
                  >
                    Iniciar sesión
                  </ion-button>
                </ion-item>
              </div>
            </ion-card-content>
          </ion-card>

          <section>
            <div class="center">
              <ion-item lines="none">
                <ion-spinner
                  name="crescent"
                  v-if="spinners.buttonForgotPassword"
                ></ion-spinner>
                <ion-button
                  @click="forgotPassword()"
                  class="options"
                  fill="clear"
                >
                  <ion-label>¿Olvidaste la contraseña?</ion-label>
                </ion-button>
              </ion-item>
            </div>

            <div class="center">
              <ion-item lines="none">
                <ion-spinner
                  name="crescent"
                  v-if="spinners.buttonCreateAccount"
                ></ion-spinner>
                <ion-button
                  @click="createAccount()"
                  class="options"
                  fill="clear"
                >
                  <ion-label>Crear cuenta</ion-label>
                </ion-button>
              </ion-item>
            </div>
          </section>
        </ion-col>
      </ion-row>
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
  alertController,
  IonInput,
  loadingController,
  IonCard,
  IonRow,
  IonCol,
  IonButtons,
  IonMenuButton,
  IonItem,
  IonIcon,
  IonLabel,
  IonButton,
} from "@ionic/vue";
import { defineComponent } from "vue";
import {
  eyeOffOutline,
  eyeOutline,
  fingerPrintOutline,
  mailOpenOutline,
} from "ionicons/icons";
import sessionService from "../../../services/session.vue";
import userService from "../../../services/user.vue";
import useVuelidate from "@vuelidate/core";
import { required, helpers } from "@vuelidate/validators";
import systemService from "../../../services/system.vue";

export default defineComponent({
  name: "LoginPage",
  components: {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonInput,
    IonCard,
    IonRow,
    IonCol,
    IonButtons,
    IonMenuButton,
    IonItem,
    IonIcon,
    IonLabel,
    IonButton,
  },
  setup() {
    return {
      eyeOffOutline,
      eyeOutline,
      v$: useVuelidate(),
      fingerPrintOutline,
      mailOpenOutline,
    };
  },
  data() {
    return {
      inputTypePassword: "password",
      form: {
        email: "",
        password: "",
      },
      spinners: {
        buttonLogin: false,
        buttonForgotPassword: false,
        buttonCreateAccount: false,
      },
    };
  },
  validations() {
    const messageRequired = "Campo requerido";
    return {
      form: {
        email: {
          required: helpers.withMessage(messageRequired, required),
        },
        password: {
          required: helpers.withMessage(messageRequired, required),
        },
      },
    };
  },

  beforeRouteEnter(to, from, next) {
    userService()
      .getUserName()
      .then(() => {
        next("/blog");
      })
      .catch(() => {
        next();
      });
  },

  methods: {
    async presentToast(message: string, color: string) {
      const toast = await toastController.create({
        message,
        duration: 3000,
        mode: "ios",
        color,
      });
      toast.present();
    },

    async login() {
      this.spinners.buttonLogin = true;

      const user = this.form.email.replace(/\s+/g, "");
      const password = this.form.password;
      const query = `
            auth {
              access_token
        }
      `;
      try {
        const response = await sessionService().userLogin({
          query,
          user,
          password,
        });
        this.spinners.buttonLogin = false;
        const token = "Bearer " + response.auth.access_token;
        userService().setUserToken({ token });
        this.clearInputs();
        location.reload();
      } catch (e: any) {
        this.spinners.buttonLogin = false;
        if (e.message == "Unauthorized" || e.message == "Not found") {
          this.presentToast("Usuario y/o contraseña incorrectos", "danger");
          return;
        }
        if (e.message == "Unverified email") {
          this.alertConfirmationEmail();
          return;
        }
        systemService().openToastErrror(e);
        console.error(e);
      }
    },

    clearInputs() {
      this.form.password = "";
      this.form.email = "";
    },

    async alertConfirmationEmail() {
      const alert = await alertController.create({
        cssClass: "my-custom-class",
        header: "Alerta",
        subHeader: "Confirmación",
        message:
          "Hemos enviado un correo electrónico a " +
          this.form.email +
          " con un enlace para verificar tu identidad.",
        buttons: [
          {
            text: "Continuar",
            // handler: () => {},
          },
        ],
      });

      await alert.present();
    },

    async presentLoading(message: string) {
      const loading = await loadingController.create({
        message,
      });
      return loading;
    },

    async forgotPassword() {
      this.spinners.buttonForgotPassword = true;
      await this.$router.push("/restore-password");
      this.spinners.buttonForgotPassword = false;
    },

    async createAccount() {
      this.spinners.buttonCreateAccount = true;
      await this.$router.push("/signup");
      this.spinners.buttonCreateAccount = false;
    },
  },
});
</script>

<style scoped>
.imagen-usuario {
  border-radius: 50%;
  width: 90px;
}
.center-vertical-card-login {
  align-items: center;
  height: 83vh;
}
.img-fondo {
  width: 100%;
  height: 50%;
  position: absolute;
}
.card-form {
  margin-bottom: 18vh;
}

@media only screen and (min-width: 768px) {
  .img-fondo {
    width: 100%;
    height: 40%;
    position: absolute;
  }
  .card-form {
    margin-top: 0;
  }
}
@media only screen and (min-width: 992px) {
  .img-fondo {
    width: 100%;
    height: auto;
    position: absolute;
  }
  .card-form {
    margin-top: 12vh;
  }
}
@media only screen and (min-width: 1200px) {
  .img-fondo {
    width: 100%;
    height: 50%;
    position: absolute;
  }
  .card-form {
    margin-top: 4vh;
  }
}
</style>
