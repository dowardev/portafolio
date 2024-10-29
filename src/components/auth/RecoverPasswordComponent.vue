<template>
  <p>
    Sigue los siguientes pasos para completar la recuperación de tu contraseña.
  </p>

  <!-- first step -->
  <ion-row v-show="step == 1">
    <ion-col size="12">
      <ion-row>
        <ion-col size="12">
          1- Ingresa el correo electrónico con el que te registraste.
        </ion-col>
      </ion-row>

      <ion-row>
        <ion-col size="12">
          <ion-input
            :value="email"
            label="Correo electrónico"
            label-placement="floating"
            fill="solid"
            type="email"
            @ion-change="email = $event.target.value as string"
          >
          </ion-input>
        </ion-col>
      </ion-row>

      <ion-row>
        <ion-col size="12">
          <ion-button
            :disabled="loaderStep1"
            expand="block"
            @click="sendEmail()"
          >
            <transition name="fade">
              <ion-spinner
                v-show="loaderStep1"
                style="width: 20px; height: 20px"
              >
              </ion-spinner>
            </transition>

            <transition name="fade">
              <div v-if="loaderTextStep1">Enviar</div></transition
            >
          </ion-button>
        </ion-col>
      </ion-row>
    </ion-col>
  </ion-row>

  <!-- second step -->
  <ion-row v-show="step == 2">
    <ion-col>
      <ion-row>
        <ion-col size="12">
          2- Ingresa el código que te enviamos a tu correo.
        </ion-col>
      </ion-row>

      <ion-row>
        <ion-col size="12">
          <ion-input
            type="number"
            label="Código"
            label-placement="floating"
            fill="solid"
            :value="code"
            @ion-change="code = $event.target.value as string"
          >
          </ion-input>
        </ion-col>
      </ion-row>

      <ion-row>
        <ion-col>3- Ingresa tu nueva contraseña</ion-col>
      </ion-row>

      <ion-row>
        <ion-col size="12">
          <div style="display: flex; justify-content: space-between">
            <div style="width: 100%">
              <ion-input
                label="Nueva contraseña"
                label-placement="floating"
                fill="solid"
                :value="newPassword"
                :type="password1Visible == true ? 'text' : 'password'"
                @ion-change="newPassword = $event.target.value as string"
              >
              </ion-input>
            </div>

            <div class="vertical-center">
              <ion-button
                fill="clear"
                @click="password1Visible = !password1Visible"
              >
                <ion-icon
                  :icon="password1Visible == true ? eye : eyeOutline"
                ></ion-icon>
              </ion-button>
            </div>
          </div>
        </ion-col>
      </ion-row>

      <ion-row>
        <ion-col size="12">
          <ion-button
            :disabled="loaderStep2"
            expand="block"
            @click="sendNewPassword()"
          >
            <transition name="fade">
              <ion-spinner
                v-show="loaderStep2"
                style="width: 20px; height: 20px"
              >
              </ion-spinner>
            </transition>

            <transition name="fade">
              <div v-if="loaderTextStep2">Enviar</div></transition
            >
          </ion-button>
        </ion-col>
      </ion-row>
    </ion-col>
  </ion-row>
</template>

<script setup lang="ts">
import {
  IonRow,
  IonCol,
  IonInput,
  IonButton,
  IonSpinner,
  IonIcon,
} from "@ionic/vue";
import { ref } from "vue";
import { eye, eyeOutline } from "ionicons/icons";

// services
import {
  recoverPassword,
  sendNewPassword as sendNewPasswordService,
} from "@/services/session";
import { presentToast } from "@/services/system";

// vars
const email = ref("admin@admin.com");
const code = ref("");
const newPassword = ref("");
const loaderStep1 = ref(false);
const loaderTextStep1 = ref(true);
const loaderStep2 = ref(false);
const loaderTextStep2 = ref(true);
const password1Visible = ref<boolean>(false);

const step = ref(1);

async function sendEmail() {
  await startAnimationStep1();
  try {
    await recoverPassword({ email: email.value });

    await presentToast({
      message: "Código enviado",
    });

    step.value = 2;
  } catch (error: any) {
    if (error.message == "Email not found")
      await presentToast({
        message: "Correo electrónico no encontrado",
        color: "danger",
      });
    else console.error(error);
  } finally {
    stopAnimationStep1();
  }
}

async function sendNewPassword() {
  await startAnimationStep2();

  try {
    await sendNewPasswordService({
      email: email.value,
      code: code.value,
      password: newPassword.value,
    });

    await presentToast({
      message: "Contraseña actualizada",
    });
  } catch (error: any) {
    if (error.message == "Code invalid")
      await presentToast({
        message: "Código incorrecto",
        color: "danger",
      });
    else console.error(error);
  } finally {
    stopAnimationStep2();
  }
}

async function startAnimationStep1(): Promise<void> {
  const timeout = (ms: number) =>
    new Promise((resolve) => {
      setTimeout(resolve, ms);
    });

  await timeout(200);
  loaderTextStep1.value = false;

  await timeout(600);
  loaderStep1.value = true;

  await timeout(2000);
}

async function stopAnimationStep1(): Promise<void> {
  const timeout = (ms: number) =>
    new Promise((resolve) => {
      setTimeout(resolve, ms);
    });

  loaderStep1.value = false;
  await timeout(600);
  loaderTextStep1.value = true;
}

async function stopAnimationStep2(): Promise<void> {
  const timeout = (ms: number) =>
    new Promise((resolve) => {
      setTimeout(resolve, ms);
    });

  loaderStep2.value = false;
  await timeout(600);
  loaderTextStep2.value = true;
}

async function startAnimationStep2(): Promise<void> {
  const timeout = (ms: number) =>
    new Promise((resolve) => {
      setTimeout(resolve, ms);
    });

  await timeout(200);
  loaderTextStep2.value = false;

  await timeout(600);
  loaderStep2.value = true;

  await timeout(2000);
}
</script>

<style scoped>
.fade-enter-active {
  transition: opacity 0.5s ease-in-out;
}

.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
