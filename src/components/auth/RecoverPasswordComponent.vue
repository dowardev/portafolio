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

      <!-- email -->
      <ion-row>
        <ion-col size="12">
          <ion-input
            label="Correo electrónico"
            label-placement="stacked"
            fill="outline"
            type="email"
            :value="email"
            :class="{
              'input-error': v1$.email.$invalid && v1$.email.$dirty,
            }"
            @ion-input="email = $event.target.value as string"
            @click="v1$.email.$touch()"
          >
          </ion-input>

          <!-- errors -->
          <span
            class="error"
            v-if="v1$.email.$dirty && v1$.email.required.$invalid"
            >{{ v1$.email.required.$message }}</span
          >
          <span
            class="error"
            v-if="v1$.email.$dirty && v1$.email.email.$invalid"
            >{{ v1$.email.email.$message }}</span
          >
        </ion-col>
      </ion-row>

      <!-- button send email -->
      <ion-row>
        <ion-col size="12">
          <ion-button
            :disabled="loaderStep1 || v1$.email.$invalid"
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
  <ion-row v-if="step == 2">
    <ion-col>
      <ion-row>
        <ion-col size="12">
          2- Ingresa el código que te enviamos a tu correo.
        </ion-col>
      </ion-row>

      <!-- code -->
      <ion-row>
        <ion-col size="12">
          <ion-input
            type="number"
            label="Código"
            label-placement="stacked"
            fill="outline"
            :value="code"
            :class="{
              'input-error': v2$.code.$invalid && v2$.code.$dirty,
            }"
            @ion-input="code = parseInt($event.target.value as string)"
            @click="v2$.code.$touch()"
          >
          </ion-input>

          <!-- errors -->
          <span
            class="error"
            v-if="v2$.code.$dirty && v2$.code.required.$invalid"
            >{{ v2$.code.required.$message }}</span
          >
          <span
            class="error"
            v-if="v2$.code.$dirty && v2$.code.numeric.$invalid"
            >{{ v2$.code.numeric.$message }}</span
          >
        </ion-col>
      </ion-row>

      <ion-row>
        <ion-col>3- Ingresa tu nueva contraseña</ion-col>
      </ion-row>

      <ion-row>
        <!-- password -->
        <ion-col size="12">
          <div style="display: flex; justify-content: space-between">
            <div style="width: 100%">
              <ion-input
                label="Nueva contraseña"
                label-placement="stacked"
                fill="outline"
                :value="newPassword"
                :clear-on-edit="false"
                :type="password1Visible == true ? 'text' : 'password'"
                :class="{
                  'input-error': v2$.password.$invalid && v2$.password.$dirty,
                }"
                @ion-input="newPassword = $event.target.value as string"
                @click="v2$.password.$touch()"
              >
                <ion-button
                  slot="end"
                  fill="clear"
                  @click="password1Visible = !password1Visible"
                >
                  <ion-icon
                    :icon="password1Visible == true ? eye : eyeOutline"
                  ></ion-icon>
                </ion-button>
              </ion-input>
            </div>
          </div>

          <!-- errors -->
          <span
            class="error"
            v-if="v2$.password.$dirty && v2$.password.required.$invalid"
            >{{ v2$.password.required.$message }}</span
          >
          <span
            class="error"
            v-if="v2$.password.$dirty && v2$.password.minLength.$invalid"
            >{{ v2$.password.minLength.$message }}</span
          >
          <br />
          <span
            class="error"
            v-if="v2$.password.$dirty && v2$.password.regexLower.$invalid"
            >{{ v2$.password.regexLower.$message }}</span
          >
          <br />
          <span
            class="error"
            v-if="v2$.password.$dirty && v2$.password.regexUpper.$invalid"
            >{{ v2$.password.regexUpper.$message }}</span
          >
          <br />
          <span
            class="error"
            v-if="v2$.password.$dirty && v2$.password.regexNumber.$invalid"
            >{{ v2$.password.regexNumber.$message }}</span
          >
          <br />
          <span
            class="error"
            v-if="v2$.password.$dirty && v2$.password.regexSpecial.$invalid"
            >{{ v2$.password.regexSpecial.$message }}</span
          >
        </ion-col>
      </ion-row>

      <!-- button send new password -->
      <ion-row>
        <ion-col size="12">
          <ion-button
            :disabled="
              loaderStep2 || v2$.code.$invalid || v2$.password.$invalid
            "
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
import {
  email as emailHelper,
  helpers,
  required,
  minLength,
  numeric,
} from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";

// services
import {
  recoverPassword,
  sendNewPassword as sendNewPasswordService,
} from "@/services/session";
import { presentToast } from "@/services/system";

// vars
const email = ref("admin@admin.com");
const code = ref<number | undefined>(undefined);
const newPassword = ref("");
const loaderStep1 = ref(false);
const loaderTextStep1 = ref(true);
const loaderStep2 = ref(false);
const loaderTextStep2 = ref(true);
const password1Visible = ref<boolean>(false);
const step = ref(1);
const messageError = {
  required: "Campo requerido",
  email: "Correo no valido",
};
const rules1 = {
  email: {
    required: helpers.withMessage(messageError.required, required),
    email: helpers.withMessage(messageError.email, emailHelper),
  },
};
const v1$ = useVuelidate(rules1, { email });
const rules2 = {
  code: {
    required: helpers.withMessage(messageError.required, required),
    numeric: helpers.withMessage("El código debe ser numérico", numeric),
  },
  password: {
    required: helpers.withMessage(messageError.required, required),
    minLength: helpers.withMessage(
      "La contraseña debe tener al menos 8 caracteres",
      minLength(8)
    ),
    regexLower: helpers.withMessage(
      "La contraseña debe contener al menos una letra minúscula",
      helpers.regex(/[a-z]/)
    ),
    regexUpper: helpers.withMessage(
      "La contraseña debe contener al menos una letra mayúscula",
      helpers.regex(/[A-Z]/)
    ),
    regexNumber: helpers.withMessage(
      "La contraseña debe contener al menos un número",
      helpers.regex(/[0-9]/)
    ),
    regexSpecial: helpers.withMessage(
      "La contraseña debe contener al menos un carácter especial",
      helpers.regex(/[@$!%*?&]/)
    ),
  },
};
const v2$ = useVuelidate(rules2, { code, password: newPassword });

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
