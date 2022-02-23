<template>
  <ion-page>
    <ion-header :translucent="true" class="ion-no-border">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button menu="mainMenu"></ion-menu-button>
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
                  ></ion-icon>
                  <ion-label position="floating"> Correo electrónico</ion-label>
                  <ion-input
                    v-model="v$.form['email'].$model"
                    type="email"
                  ></ion-input>
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
                  ></ion-icon>
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

              <ion-row>
                <ion-col size="12">
                  <ion-button
                    fill="clear"
                    expand="block"
                    v-on:click="login()"
                    :disabled="v$.form.$invalid"
                  >
                    Iniciar sesión
                  </ion-button>
                </ion-col>
              </ion-row>
            </ion-card-content>
          </ion-card>
          <ion-row>
            <ion-col size="12" class="center">
              <small style="cursor: pointer">
                <ion-text
                  v-on:click="$router.push('/restore-password')"
                  class="options"
                >
                  ¿Olvidaste la contraseña?
                </ion-text>
              </small>
            </ion-col>
          </ion-row>
          <ion-row>
            <ion-col size="12" class="center">
              <small style="cursor: pointer">
                <ion-text
                  color="primary"
                  v-on:click="$router.push('/signup')"
                  class="options"
                >
                  Crear cuenta
                </ion-text>
              </small>
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
  IonText,
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
import { required, email, minLength, helpers } from "@vuelidate/validators";
import eventBus from "../../../EventBus";

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
    IonText,
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
    };
  },
  validations() {
    const messageRequired = "Campo requerido";
    return {
      form: {
        email: {
          required: helpers.withMessage(messageRequired, required),
          email: helpers.withMessage("Correo no valido", email),
        },
        password: {
          required: helpers.withMessage(messageRequired, required),
          min: minLength(6),
        },
      },
    };
  },
  beforeRouteEnter(to, from, next) {
    userService()
      .getUserToken()
      .then((response: string | null) => {
        if (response == null) {
          next();
        } else {
          next("/blog");
        }
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
      const loading = await this.presentLoading("Iniciando sesión");
      loading.present();
      sessionService()
        .userLogin(this.form.email.replace(/\s+/g, ""), this.form.password)
        .then(async (response) => {
          loading.dismiss();
          await userService().setUserToken(response.data.access_token);
          await this.saveUserData();
          eventBus().emitter.emit("refresh-content", { event: "login" });
          this.clearInputs();
          this.presentToast("Bienvenido", "success");
          this.$router.go(-1);
        })
        .catch((e) => {
          loading.dismiss();
          if (e.response.data.message == "Unauthorized") {
            this.presentToast("Credenciales incorrectas", "danger");
          }
          if (e.response.data.message == "Unverified email") {
            this.alertConfirmationEmail();
          }
        });
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

      // await loading.present();
      return loading;
    },
    async saveUserData() {
      const user = await userService().getUserLogged();
      userService().setUserData(user?.data);
    },
  },
});
</script>

<style scoped>
.error {
  color: var(--ion-color-danger);
}
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
.options {
  color: var(--accent-color);
}
</style>
