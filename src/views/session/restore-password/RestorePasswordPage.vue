<template>
  <ion-page>
    <ion-header
      :translucent="true"
      collapse="fade"
      mode="ios"
      class="ion-no-border"
    >
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button
            menu="mainMenu"
            :mode="modeDesingElements"
          ></ion-menu-button>
        </ion-buttons>
        <ion-title>{{ pageTitle }}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-header collapse="condense" mode="ios">
        <ion-toolbar>
          <ion-title size="large">{{ pageTitle }}</ion-title>
        </ion-toolbar>
      </ion-header>

      <ion-row class="center">
        <ion-col size="12" size-md="8" size-lg="6" size-xl="4">
          <ion-card>
            <ion-card-content>
              <ion-item lines="inset">
                <ion-icon
                  slot="start"
                  :icon="keyOutline"
                  class="item-icon"
                ></ion-icon>
                <ion-label position="floating">Contraseña</ion-label>
                <ion-input
                  v-model="(v$ as any).form.password1.$model"
                  :type="inputTypePassword1"
                  @keyup.enter="resetPassword()"
                ></ion-input>
                <ion-button
                  v-if="inputTypePassword1 == 'text'"
                  slot="end"
                  fill="clear"
                  style="margin-top: 20px"
                  @click="inputTypePassword1 = 'password'"
                >
                  <ion-icon :icon="eyeOffOutline"></ion-icon>
                </ion-button>
                <ion-button
                  v-if="inputTypePassword1 == 'password'"
                  slot="end"
                  fill="clear"
                  style="margin-top: 20px"
                  @click="inputTypePassword1 = 'text'"
                >
                  <ion-icon :icon="eyeOutline"></ion-icon>
                </ion-button>
              </ion-item>
              <div
                v-for="(error, index) of (v$ as any).form.password1.$errors"
                :key="index"
              >
                <div class="error">{{ error.$message }}</div>
              </div>

              <ion-item lines="inset">
                <ion-icon
                  slot="start"
                  :icon="keyOutline"
                  class="item-icon"
                ></ion-icon>
                <ion-label position="floating">Repite la contraseña</ion-label>
                <ion-input
                  v-model="(v$ as any).form.password2.$model"
                  :type="inputTypePassword2"
                  @keyup.enter="resetPassword()"
                ></ion-input>
                <ion-button
                  v-if="inputTypePassword2 == 'text'"
                  slot="end"
                  fill="clear"
                  style="margin-top: 20px"
                  @click="inputTypePassword2 = 'password'"
                >
                  <ion-icon :icon="eyeOffOutline"></ion-icon>
                </ion-button>
                <ion-button
                  v-if="inputTypePassword2 == 'password'"
                  slot="end"
                  fill="clear"
                  style="margin-top: 20px"
                  @click="inputTypePassword2 = 'text'"
                >
                  <ion-icon :icon="eyeOutline"></ion-icon>
                </ion-button>
              </ion-item>
              <div
                v-for="(error, index) of (v$ as any).form.password2.$errors"
                :key="index"
              >
                <div class="error">{{ error.$message }}</div>
              </div>

              <ion-button
                expand="full"
                fill="clear"
                :disabled="spinners.buttonResetPassword || (v$ as any).form.$invalid"
                @click="resetPassword()"
                ><ion-label v-if="spinners.buttonResetPassword == false"
                  >Enviar</ion-label
                >
                <ion-spinner
                  v-if="spinners.buttonResetPassword"
                  name="crescent"
                  color="primary"
                ></ion-spinner>
              </ion-button>
            </ion-card-content>
          </ion-card>
        </ion-col>
      </ion-row>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonInput,
  loadingController,
  IonButtons,
  IonMenuButton,
  IonRow,
  IonCol,
  IonCard,
  IonCardContent,
  IonLabel,
  IonButton,
  IonItem,
  IonIcon,
  IonSpinner,
  isPlatform,
} from "@ionic/vue";
import { eyeOutline, eyeOffOutline, keyOutline } from "ionicons/icons";
import { defineComponent, ref } from "vue";
import { resetPassword as resetPasswordService } from "../../../services/session";
import { openToast } from "../../../services/system";
import useVuelidate from "@vuelidate/core";
import { required, helpers, sameAs } from "@vuelidate/validators";
import { useSystem } from "../../../composables/useSystem";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

const modeDesingElements = isPlatform("ios") ? "ios" : ("md" as "ios" | "md");

const form = ref({
  email: route.params.email as string,
  code: route.params.code as string,
  password1: "",
  password2: "",
});
const inputTypePassword1 = "password" as "text" | "password";
const inputTypePassword2 = "password" as "text" | "password";
const spinners = ref({
  buttonResetPassword: false,
});
const pageTitle = "Restablecer contraseña";

const messageError = {
  email: "Correo electronico no valido",
  required: "Campo requerido",
  password: "Las contraseñas no coinciden",
};
const rules = {
  form: {
    password1: {
      required: helpers.withMessage(messageError.required, required),
      minLength: helpers.withMessage(
        "La contraseña debe tener al menos una mayúscula, un numero y tener un tamaño de 8",
        helpers.regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)
      ),
    },
    password2: {
      same: helpers.withMessage(
        messageError.password,
        sameAs(form.value.password1)
      ),
    },
  },
};
const v$ = useVuelidate(rules, { form });
// functions
function closeComponent() {
  router.push("/login");
}

async function presentLoading(message: string) {
  const loading = await loadingController.create({
    cssClass: "loading",
    message,
  });
  return loading;
}

async function resetPassword() {
  spinners.value.buttonResetPassword = true;

  const code = form.value.code;
  const email = form.value.email;
  const password = form.value.password1;

  try {
    await resetPasswordService({
      code,
      email,
      password,
    });

    openToast({
      message: "Contraseña restaurada",
    });

    router.push("/login");
    spinners.value.buttonResetPassword = false;
  } catch (e: any) {
    spinners.value.buttonResetPassword = false;
    if (e.message == "Code invalid") {
      openToast({
        message: "Codigo invalido",
        color: "warning",
      });
    } else {
      console.error(e);
      useSystem().openToastError(e);
    }
  }
}
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
