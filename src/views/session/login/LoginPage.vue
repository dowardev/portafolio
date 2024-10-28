<template>
  <ion-page class="page-container">
    <ion-header class="ion-no-border">
      <ion-toolbar>
        <ion-title>Iniciar sesion</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <div style="height: 100%" class="center">
        <div>
          <section>
            <ion-card class="element-post-selected">
              <ion-card-content>
                <div class="center">
                  <img
                    src="../../../assets/otros/key.png"
                    alt=""
                    class="imagen-usuario"
                  />
                </div>
                <form>
                  <!-- user -->
                  <ion-item lines="inset" class="transparent">
                    <ion-icon
                      slot="start"
                      :icon="mailOpenOutline"
                      class="item-icon"
                    >
                    </ion-icon>

                    <ion-input
                      type="email"
                      label="Usuario o correo electrónico"
                      label-placement="floating"
                      :value="form.email"
                      @ion-input="form.email as any"
                      @keydown.enter="
                        ($refs as any).inputPassword.$el.setFocus()
                      "
                    >
                    </ion-input>
                  </ion-item>

                  <div
                    v-for="(error, index) of (v$ as any).email.$errors"
                    :key="index"
                  >
                    <div class="error">
                      {{ error.$message }}
                    </div>
                  </div>

                  <!-- password -->
                  <ion-item lines="inset" class="transparent">
                    <ion-icon
                      slot="start"
                      :icon="fingerPrintOutline"
                      class="item-icon"
                    >
                    </ion-icon>

                    <ion-input
                      ref="inputPassword"
                      label="Contraseña"
                      label-placement="floating"
                      :value="form.password"
                      :type="inputTypePassword"
                      @ion-input="form.password = $event.detail.value as any"
                      @keydown.enter="login()"
                      @click="v$.password.$touch()"
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
                    v-for="(error, index) of (v$ as any).password.$errors"
                    :key="index"
                  >
                    <div class="error">
                      {{ error.$message }}
                    </div>
                  </div>
                </form>

                <ion-button
                  fill="clear"
                  :disabled="(v$ as any).$invalid || spinners.buttonLogin"
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
          </section>

          <section>
            <div class="center">
              <ion-button
                class="options"
                fill="clear"
                :disabled="spinners.buttonForgotPassword"
                expand="full"
                size="small"
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
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  toastController,
  alertController,
  IonInput,
  loadingController,
  IonCard,
  IonItem,
  IonIcon,
  IonLabel,
  IonButton,
  isPlatform,
  IonPage,
  IonContent,
} from "@ionic/vue";
import { ref } from "vue";
import {
  eyeOffOutline,
  eyeOutline,
  fingerPrintOutline,
  mailOpenOutline,
} from "ionicons/icons";
import { userLogin, sendMailResetPassword } from "../../../services/session";
import { setUserToken, resendEmailConfirmation } from "../../../services/user";
import useVuelidate from "@vuelidate/core";
import { required, helpers } from "@vuelidate/validators";
import { useSystem } from "../../../composables/useSystem";
import { useRouter } from "vue-router";

const router = useRouter();

const inputTypePassword = ref("password" as "text" | "password");
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

async function login() {
  spinners.value.buttonLogin = true;

  const user = form.value.email.replace(/\s+/g, "");
  const password = form.value.password;

  try {
    const response = await userLogin({
      user,
      password,
    });

    const token = response.token;
    //FIX: create function in composable
    setUserToken({ token });

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

    useSystem().openToastError(e);
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

async function presentLoading(message: string) {
  const loading = await loadingController.create({
    message,
  });
  return loading;
}

async function forgotPassword() {
  spinners.value.buttonForgotPassword = true;

  const alertResponse = await presentAlertRestorePassword();
  console.log(alertResponse);
  if (alertResponse.role == "cancel") {
    spinners.value.buttonForgotPassword = false;
    return;
  }

  try {
    await sendMailResetPassword({
      email: alertResponse.email,
    });
  } catch (e: any) {
    console.error(e);
    useSystem().openToastError(e);
  }

  spinners.value.buttonForgotPassword = false;
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
