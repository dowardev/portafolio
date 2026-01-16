<template>
  <ion-header class="ion-no-border" mode="ios">
    <ion-toolbar>
      <ion-buttons slot="start" :mode="designPlatform">
        <ion-menu-button menu="mainMenu"></ion-menu-button>
      </ion-buttons>

      <ion-title>Iniciar sesión</ion-title>
    </ion-toolbar>
  </ion-header>

  <ion-content>
    <div class="background-image">
      <div
        class="ion-justify-content-center ion-align-items-center"
        style="
          width: 100%;
          height: 83dvh;
          display: flex;
          flex-direction: column;
        "
      >
        <section>
          <ion-row>
            <ion-col size="12">
              <ion-card class="shadow-1">
                <ion-card-content>
                  <div class="center ion-padding-bottom d">
                    <img
                      src="@/assets/otros/key.png"
                      alt=""
                      class="imagen-usuario"
                    />
                  </div>

                  <!-- component -->
                  <LoginFormComponent
                    ref="loginFormComponentRef"
                    @form-status="formStatus = $event"
                    @enter-pressed="login(loginFormComponentRef?.getData())"
                  />

                  <ion-button
                    fill="clear"
                    :disabled="formStatus == false || spinners.buttonLogin"
                    expand="full"
                    @click="login(loginFormComponentRef?.getData())"
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
            </ion-col>
          </ion-row>
        </section>

        <!-- other options -->
        <section>
          <ion-row>
            <ion-col size="12">
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
            </ion-col>
          </ion-row>

          <ion-row>
            <ion-col size="12">
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
            </ion-col>
          </ion-row>
        </section>
      </div>
    </div>

    <!-- modals -->
    <ion-modal
      :is-open="isOpenModalPasswordRecover"
      @did-dismiss="isOpenModalPasswordRecover = false"
    >
      <RecoverPasswordComponent />
    </ion-modal>
  </ion-content>
</template>

<script setup lang="ts">
import {
  alertController,
  IonCard,
  IonLabel,
  IonButton,
  IonContent,
  IonModal,
  isPlatform,
} from "@ionic/vue";
import { reactive, ref } from "vue";
import useVuelidate from "@vuelidate/core";
import { required, helpers } from "@vuelidate/validators";
import { useRouter } from "vue-router";

// interface
import { ICustomError } from "@/utils/interfaces";

//controllers
import ServerConfig from "@/controllers/serverConfigController";
import SystemController from "../../../controllers/systemController";
import UserController from "@/controllers/userController";
import ErrorController from "@/controllers/errorController";
import { ToastController } from "@/controllers/toastController";
const serverConfig = new ServerConfig();
const systemController = new SystemController();
const userController = new UserController();
const errorController = new ErrorController();
const toastController = new ToastController();

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
const loginFormComponentRef = ref<typeof LoginFormComponent | null>(null);
const formStatus = ref(false);
const isOpenModalPasswordRecover = ref(false);
const designPlatform = isPlatform("ios") ? "ios" : "md";
const toast = reactive<{
  open: boolean;
  color: string;
  message: string;
  buttons: Array<{
    text: string;
    role?: string;
    handler?: () => Promise<boolean | void>;
  }>;
  duration?: number;
}>({
  open: false,
  color: "",
  message: "",
  buttons: [],
  duration: 3000,
});

// functions
async function login(params: { email: string; password: string }) {
  const { email, password } = params;
  spinners.value.buttonLogin = true;

  const user = email.trim();

  try {
    const response = await userController.login({
      user,
      password,
    });

    if (response) {
      const token = response.token;
      userController.storeUserToken({ token });
      spinners.value.buttonLogin = false;
      clearInputs();
      await router.push("/");
    }
  } catch (e: unknown) {
    if (typeof e === "object" && e !== null && "errorDetail" in e) {
      const customError = e as ICustomError;
      if (customError.errorDetail == "Email address has not been verified") {
        openToastEmailConfirm();
      }
      if (
        customError.errorDetail == "Unauthorized" ||
        customError.errorDetail == "Not found"
      ) {
        toast.message = "Usuario y/o contraseña incorrectos.";
        toast.open = true;
      }
      if (customError.errorDetail == "Disabled user") {
        toast.message =
          "Cuenta de usuario deshabilitada, para mas información contacte a soporte.";
        toast.open = true;
      }
    } else {
      console.error("Unexpected error:", e);
      errorController.openToastError({ error: e as Error });
    }
  } finally {
    spinners.value.buttonLogin = false;
  }
}

function clearInputs() {
  form.value.password = "";
  form.value.email = "";
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

async function openToastEmailConfirm() {
  const toast = await toastController.presentToast({
    message: "Verifica tu correo electrónico para continuar.",
    buttons: [
      {
        text: "Reenviar correo",
        role: "button",
        handler: async () => {
          toast.dismiss();
          await resendEmailVerification({
            email: loginFormComponentRef.value?.getData().email,
          });
        },
      },
    ],
  });
  toast.present();
  setTimeout(() => {
    toast.dismiss();
  }, 3000);
}

async function resendEmailVerification(params: { email: string }) {
  const { email } = params;

  try {
    await userController.resendEmailVerification({ email });
    const toast = await toastController.presentToast({
      message: "Correo electrónico reenviado.",
    });
    toast.present();
    setTimeout(() => {
      toast.dismiss();
    }, 3000);
  } catch (e: unknown) {
    if (typeof e === "object" && e !== null && "errorDetail" in e) {
      const customError = e as ICustomError;
      console.log(customError.errorDetail);
    } else {
      console.error("Unexpected error:", e);
      errorController.openToastError({ error: e as Error });
    }
  }
}
</script>

<style scoped>
.imagen-usuario {
  width: 90px;
}

.background-image {
  background-image: url("https://image.winudf.com/v2/image/Y29tLnNhcmFzLkJlc3RNaW5pbWFsaXN0V2FsbHBhcGVyX3NjcmVlbl81Xzk4dHZtbnNw/screen-5.jpg?h=800&fakeurl=1&type=.jpg");
  background-size: cover;
  background-position: center;
  height: 40%;
}
</style>
