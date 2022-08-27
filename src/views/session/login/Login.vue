<template>
  <ion-page>
    <ion-header :translucent="true" class="ion-no-border">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button
            menu="mainMenu"
            :smode="modeDesingElements"
          ></ion-menu-button>
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
          <h1 style="color: white !important">
            Hola, es un gusto tenerte de vuelta
          </h1>
        </ion-col>
      </ion-row>

      <ion-row class="center center-vertical-card-login">
        <ion-col size="12" size-lg="6" size-xl="4" class="card-form">
          <ion-card>
            <ion-card-content>
              <div class="center">
                <img
                  src="../../../assets/otros/key.png"
                  alt=""
                  class="imagen-usuario"
                />
              </div>
              <form>
                <ion-item lines="inset" class="transparent">
                  <ion-icon
                    slot="start"
                    :icon="mailOpenOutline"
                    class="item-icon"
                  >
                  </ion-icon>
                  <ion-label position="floating">
                    Usuario o correo electrónico
                  </ion-label>
                  <ion-input
                    v-model="(v$ as any).form.email.$model"
                    type="email"
                  >
                  </ion-input>
                </ion-item>
                <div
                  v-for="(error, index) of (v$ as any).form['email'].$errors"
                  :key="index"
                >
                  <div class="error">{{ error.$message }}</div>
                </div>

                <ion-item lines="inset" class="transparent">
                  <ion-icon
                    slot="start"
                    :icon="fingerPrintOutline"
                    class="item-icon"
                  >
                  </ion-icon>
                  <ion-label position="floating">Contraseña</ion-label>
                  <ion-input
                    v-model="(v$ as any).form.password.$model"
                    :type="inputTypePassword"
                  >
                  </ion-input>
                  <ion-button
                    v-if="inputTypePassword == 'text'"
                    slot="end"
                    style="margin-top: 20px"
                    fill="clear"
                    @click="inputTypePassword = 'password'"
                  >
                    <ion-icon :icon="eyeOffOutline"></ion-icon>
                  </ion-button>
                  <ion-button
                    v-if="inputTypePassword == 'password'"
                    slot="end"
                    fill="clear"
                    style="margin-top: 20px"
                    @click="inputTypePassword = 'text'"
                  >
                    <ion-icon :icon="eyeOutline"></ion-icon>
                  </ion-button>
                </ion-item>

                <div
                  v-for="(error, index) of (v$ as any).form.password.$errors"
                  :key="index"
                >
                  <div class="error">{{ error.$message }}</div>
                </div>
              </form>

              <ion-button
                fill="clear"
                :disabled="(v$ as any).form.$invalid || spinners.buttonLogin"
                expand="full"
                @click="login()"
              >
                <ion-label v-if="spinners.buttonLogin == false">
                  Iniciar sesión</ion-label
                >
                <ion-spinner
                  v-if="spinners.buttonLogin"
                  name="crescent"
                ></ion-spinner>
              </ion-button>
            </ion-card-content>
          </ion-card>

          <section>
            <div class="center">
              <ion-item lines="none" class="transparent">
                <ion-button
                  class="options"
                  fill="clear"
                  :disabled="spinners.buttonForgotPassword"
                  @click="forgotPassword()"
                >
                  <ion-label v-if="spinners.buttonForgotPassword == false"
                    >¿Olvidaste la contraseña?</ion-label
                  >
                  <ion-spinner
                    v-if="spinners.buttonForgotPassword"
                    name="crescent"
                  ></ion-spinner>
                </ion-button>
              </ion-item>
            </div>

            <div class="center">
              <ion-item lines="none" class="transparent">
                <ion-button
                  class="options"
                  fill="clear"
                  :disabled="spinners.buttonCreateAccount"
                  expand="full"
                  @click="createAccount()"
                >
                  <ion-label v-if="spinners.buttonCreateAccount == false"
                    >Crear cuenta</ion-label
                  >
                  <ion-spinner
                    v-if="spinners.buttonCreateAccount"
                    name="crescent"
                    color="primary"
                  ></ion-spinner>
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
  isPlatform,
} from "@ionic/vue";
import { defineComponent } from "vue";
import {
  eyeOffOutline,
  eyeOutline,
  fingerPrintOutline,
  mailOpenOutline,
} from "ionicons/icons";
import { userLogin, sendMailResetPassword } from "../../../services/session";
import {
  getUser,
  setUserToken,
  resendEmailConfirmation,
} from "../../../services/user";
import useVuelidate from "@vuelidate/core";
import { required, helpers } from "@vuelidate/validators";
import { openToastErrror } from "../../../services/system";
import { USER_LOGIN, USER_NAME } from "../../../services/graphql";

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
    const modeDesingElements = isPlatform("ios") ? "ios" : "md";
    return {
      eyeOffOutline,
      eyeOutline,
      v$: useVuelidate(),
      fingerPrintOutline,
      mailOpenOutline,
      modeDesingElements,
    };
  },

  data() {
    return {
      inputTypePassword: "password" as "text" | "password",
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

      try {
        const response = await userLogin({
          user,
          password,
          graphql: { name: USER_LOGIN, fragment: "UserLogin" },
        });

        const token = "Bearer " + response.auth.access_token;
        setUserToken({ token });

        this.spinners.buttonLogin = false;
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
        if (e.message == "Disabled user") {
          this.presentToast(
            "Cuenta de usuario deshabilitada, para mas informacion contacte a soporte.",
            "danger"
          );
          return;
        }

        openToastErrror(e);
        console.error(e.message);
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
            handler: () => {
              resendEmailConfirmation({ email: this.form.email });
            },
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

      const alertResponse = await this.presentAlertRestorePassword();
      if (alertResponse.role == "cancel") {
        this.spinners.buttonForgotPassword = false;
        return;
      }

      try {
        await sendMailResetPassword({
          email: alertResponse.email,
        });
      } catch (e: any) {
        console.error(e);
        openToastErrror(e);
      }

      this.spinners.buttonForgotPassword = false;
    },

    async createAccount() {
      this.spinners.buttonCreateAccount = true;
      await this.$router.push("/signup");
      this.spinners.buttonCreateAccount = false;
    },

    async presentAlertRestorePassword(): Promise<{
      email: string;
      role: string;
    }> {
      const alert = await alertController.create({
        cssClass: "my-custom-class",
        header: "Restauracion de contraseña",
        message:
          "Te enviaremos un correo electronico con las intrucciones para restablecer tu contraseña.",
        inputs: [
          {
            name: "email",
            id: "email",
            placeholder: "Correo electronico",
            type: "email",
          },
        ],
        buttons: [
          {
            text: "Cancelar",
            role: "cancel",
            cssClass: "secondary",
            handler: () => {
              // console.log("Confirm Cancel");
            },
          },
          {
            text: "Confirmar",
            handler: () => {
              // console.log(e);
            },
          },
        ],
      });

      await alert.present();
      const response = await alert.onDidDismiss();
      // eslint-disable-next-line
      return { email: response.data.values.email, role: response.role! };
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
