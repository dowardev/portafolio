<template>
  <ion-page class="page-container">
    <ion-header class="ion-no-border">
      <ion-toolbar>
        <ion-title>Iniciar sesión</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <section class="center">
        <ion-card class="element-post-selected">
          <ion-card-content>
            <div class="center">
              <img src="@/assets/otros/key.png" alt="" class="imagen-usuario" />
            </div>

            <!-- component -->
            <LoginFormComponent
              ref="loginFormComponentRef"
              @form-status="formStatus = $event"
              @enter-pressed="login((loginFormComponentRef as any).getData())"
            />

            <ion-button
              fill="clear"
              :disabled="formStatus == false || spinners.buttonLogin"
              expand="full"
              @click="login((loginFormComponentRef as any).getData())"
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
      </section>

      <!-- other options -->
      <section>
        <div class="center">
          <ion-button
            class="options"
            fill="clear"
            :disabled="spinners.buttonForgotPassword"
            expand="full"
            size="small"
            @click="isOpenModalPasswordRecover = true"
          >
            <ion-label v-if="spinners.buttonForgotPassword == false"
              >¿Olvidaste la contraseña?</ion-label
            >
            <ion-spinner
              v-if="spinners.buttonForgotPassword"
              name="crescent"
            ></ion-spinner>
          </ion-button>
        </div>

        <div class="center">
          <ion-button
            class="options"
            fill="clear"
            :disabled="spinners.buttonCreateAccount"
            expand="full"
            size="small"
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
        </div>
      </section>

      <!-- modals -->
      <ion-modal
        :is-open="isOpenModalPasswordRecover"
        @did-dismiss="isOpenModalPasswordRecover = false"
      >
        <ion-header mode="ios" class="ion-bo-border">
          <ion-toolbar>
            <ion-buttons slot="start">
              <ion-button @click="isOpenModalPasswordRecover = false">
                <ion-icon :icon="closeOutline"></ion-icon>
              </ion-button>
            </ion-buttons>

            <ion-title>Recuperar contraseña</ion-title>
          </ion-toolbar>
        </ion-header>

        <ion-content class="ion-padding">
          <RecoverPasswordComponent />
        </ion-content>
      </ion-modal>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  toastController,
  alertController,
  IonCard,
  IonLabel,
  IonButton,
  IonPage,
  IonContent,
  IonModal,
} from "@ionic/vue";
import { ref } from "vue";
import useVuelidate from "@vuelidate/core";
import { required, helpers } from "@vuelidate/validators";
import { useRouter } from "vue-router";
import { closeOutline, server } from "ionicons/icons";

// TODO: create controller1
// import { setUserToken, resendEmailConfirmation } from "../../../services/user";
// import { userLogin } from "../../../services/session";

//controllers
import ServerConfig from "@/controllers/serverConfigController";
import SystemController from "../../../controllers/systemController";
const serverConfig = new ServerConfig();
const systemController = new SystemController();

// components
import LoginFormComponent from "@/forms/LoginFormComponent.vue";
import RecoverPasswordComponent from "@/components/auth/RecoverPasswordComponent.vue";

// vars
const router = useRouter();
const form = ref({
  // email: "admin@admin.com",
  // password: "d2f%PF",
  email: "",
  password: "",
});
const spinners = ref({
  buttonLogin: false,
  buttonForgotPassword: false,
  buttonCreateAccount: false,
});

const messageError = {
  email: "Correo electrónico no valido",
  required: "Campo requerido",
};
const rules = {
  email: {
    required: helpers.withMessage(messageError.required, required),
  },
  password: {
    required: helpers.withMessage(messageError.required, required),
  },
};
const v$ = useVuelidate(rules, form);
const loginFormComponentRef = ref(null);
const formStatus = ref(false);
const isOpenModalPasswordRecover = ref(false);

// functions
async function presentToast(message: string, color: string) {
  const toast = await toastController.create({
    message,
    duration: 3000,
    mode: "ios",
    color,
  });
  toast.present();
}

async function login(params: { email: string; password: string }) {
  const { email, password } = params;
  spinners.value.buttonLogin = true;

  const user = email.trim();

  try {
    const response = await userLogin({
      user,
      password,
    });

    const token = response.token;
    //FIX: create function in composable
    await serverConfig.store({ userToken: token });
    // setUserToken({ token });

    spinners.value.buttonLogin = false;
    clearInputs();
    location.reload();
  } catch (e: any) {
    spinners.value.buttonLogin = false;
    if (e.message == "Unauthorized" || e.message == "Not found") {
      presentToast("Usuario y/o contraseña incorrectos", "danger");
      return;
    }
    if (e.message == "Unverified email") {
      alertConfirmationEmail();
      return;
    }
    if (e.message == "Disabled user") {
      presentToast(
        "Cuenta de usuario deshabilitada, para mas información contacte a soporte.",
        "danger"
      );
      return;
    }

    systemController.openToastError(e);
    console.error(e.message);
  }
}

function clearInputs() {
  form.value.password = "";
  form.value.email = "";
}

async function alertConfirmationEmail() {
  const alert = await alertController.create({
    cssClass: "my-custom-class",
    header: "Alerta",

    subHeader: "Confirmación",
    message:
      "Hemos enviado un correo electrónico a " +
      form.value.email +
      " con un enlace para verificar tu identidad.",
    buttons: [
      {
        text: "Continuar",
        handler: () => {
          resendEmailConfirmation({ email: form.value.email });
        },
      },
    ],
  });

  await alert.present();
}

async function createAccount() {
  spinners.value.buttonCreateAccount = true;
  await router.push("/signup");
  spinners.value.buttonCreateAccount = false;
}

async function presentAlertRestorePassword(): Promise<{
  email: string;
  role: string;
}> {
  const alert = await alertController.create({
    cssClass: "my-custom-class",
    header: "Restauración de contraseña",
    message:
      "Te enviaremos un correo electrónico con las instrucciones para restablecer tu contraseña.",
    inputs: [
      {
        name: "email",
        id: "email",
        placeholder: "Correo electrónico",
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
  if (response.data == undefined) return { email: "", role: "cancel" };
  else return { email: response.data.values.email, role: response.role! };
}
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
.main-content {
  background-image: "https://image.winudf.com/v2/image/Y29tLnNhcmFzLkJlc3RNaW5pbWFsaXN0V2FsbHBhcGVyX3NjcmVlbl81Xzk4dHZtbnNw/screen-5.jpg?h=800&fakeurl=1&type=.jpg" !important;
}
.element-post-selected {
  border: 1px solid var(--ion-color-primary);
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
  .main-section {
    float: right;
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
