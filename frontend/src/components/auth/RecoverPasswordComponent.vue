<template>
  <ion-page>
    <ion-header class="ion-no-border">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button color="primary" @click="modalController.dismiss()">
            <ion-icon :icon="closeOutline"></ion-icon>
          </ion-button>
        </ion-buttons>

        <ion-title>Recuperar contraseña</ion-title>

        <ion-buttons slot="end">
          <!-- step 1 -->
          <ion-button
            v-if="step == 1"
            color="primary"
            :disabled="mainLoad || v1$.email.$invalid"
            @click="handleStep1({ email })"
          >
            <ion-icon :icon="chevronForwardOutline"></ion-icon>
          </ion-button>

          <!-- step 2 -->
          <ion-button
            v-if="step == 2"
            color="primary"
            :disabled="mainLoad || v2$.code.$invalid || v2$.password.$invalid"
            @click="handleStep2({ email, code: code!, password: newPassword! })"
          >
            <ion-icon :icon="saveOutline"></ion-icon>
          </ion-button>
        </ion-buttons>

        <!-- progress bar -->
        <ion-progress-bar
          v-if="mainLoad == true"
          class="primary-progress-bar"
          type="indeterminate"
        ></ion-progress-bar>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding-start ion-padding-end">
      <transition name="fade-transition" mode="out-in">
        <section v-show="step === 1" v-if="step === 1">
          <ion-row>
            <ion-col size="12">
              <ion-card class="shadow-1">
                <div class="center ion-padding-top">
                  <img style="width: 90px" :src="mailImage" alt="" />
                </div>

                <ion-card-header>
                  <ion-card-title style="text-align: center">
                    Correo de recuperación
                  </ion-card-title>

                  <ion-card-subtitle style="text-align: center">
                    Por favor, ingresa el correo electrónico asociado a tu
                    cuenta.
                  </ion-card-subtitle>
                </ion-card-header>

                <ion-card-content>
                  <ion-row>
                    <ion-col size="12">
                      <!-- email -->
                      <ion-input
                        label="Correo electrónico"
                        fill="outline"
                        :label-placement="
                          isPlatform('ios') ? 'stacked' : 'floating'
                        "
                        type="email"
                        :value="email"
                        :error-text="v1$.email.$errors[0]?.$message.toString()"
                        :class="{
                          'ion-invalid': v1$.email.$invalid && v1$.email.$dirty,
                          'ion-touched': v1$.email.$dirty,
                        }"
                        :disabled="mainLoad"
                        @ion-input="
                          email = $event.target.value?.toString() || ''
                        "
                        @click="v1$.email.$touch()"
                      >
                      </ion-input>
                    </ion-col>
                  </ion-row>
                </ion-card-content>
              </ion-card>
            </ion-col>
          </ion-row>

          <ion-row>
            <ion-col size="12">
              <CardAlert color="success">
                <template #icon>
                  <ion-icon :icon="informationOutline"></ion-icon>
                </template>

                <template #title>Nota</template>

                <template #content>
                  Recibirás un código en tu correo electrónico para restablecer
                  tu contraseña.
                </template>
              </CardAlert>
            </ion-col>
          </ion-row>
        </section>

        <section v-show="step === 2" v-else-if="step === 2">
          <ion-row>
            <ion-col>
              <ion-card
                class="shadow-1"
                :class="{
                  'danger-border': codeError,
                }"
              >
                <div class="center ion-padding-top">
                  <img style="width: 90px" :src="keyImage" alt="" />
                </div>

                <ion-card-header>
                  <ion-card-title style="text-align: center">
                    Actualización de contraseña
                  </ion-card-title>

                  <ion-card-subtitle style="text-align: center">
                    Por favor, introduce el código que has recibido y tu nueva
                    contraseña.
                  </ion-card-subtitle>
                </ion-card-header>

                <ion-card-content>
                  <ion-row>
                    <ion-col>
                      <!-- code -->
                      <ion-row>
                        <ion-col>
                          <ion-input
                            type="number"
                            label="Código"
                            fill="outline"
                            :label-placement="
                              isPlatform('ios') ? 'stacked' : 'floating'
                            "
                            :value="code"
                            :error-text="
                              v2$.code.$errors[0]?.$message.toString()
                            "
                            :class="{
                              'ion-invalid':
                                v2$.code.$invalid && v2$.code.$dirty,
                              'ion-touched': v2$.code.$dirty,
                            }"
                            :disabled="mainLoad"
                            @ion-input="
                              code = parseInt($event.target.value as string)
                            "
                            @click="v2$.code.$touch()"
                          >
                          </ion-input>
                        </ion-col>
                      </ion-row>

                      <!-- new password -->
                      <ion-row>
                        <ion-col>
                          <ion-input
                            label="Nueva contraseña"
                            fill="outline"
                            :label-placement="
                              isPlatform('ios') ? 'stacked' : 'floating'
                            "
                            :value="newPassword"
                            :clear-on-edit="false"
                            :error-text="
                              v2$.password.$errors[0]?.$message.toString()
                            "
                            :class="{
                              'ion-invalid':
                                v2$.password.$invalid && v2$.password.$dirty,
                              'ion-touched': v2$.password.$dirty,
                            }"
                            :disabled="mainLoad"
                            @ion-input="
                              newPassword =
                                $event.target.value?.toString() || ''
                            "
                            @click="v2$.password.$touch()"
                          >
                            <ion-input-password-toggle
                              v-if="newPassword"
                              slot="end"
                            >
                            </ion-input-password-toggle>
                          </ion-input>
                        </ion-col>
                      </ion-row>
                    </ion-col>
                  </ion-row>
                </ion-card-content>
              </ion-card>
            </ion-col>
          </ion-row>

          <ion-row
            v-if="codeError"
            class="ion-justify-content-center"
            style="width: 100%"
          >
            <ion-col>
              <ion-button
                fill="clear"
                expand="block"
                @click="
                  resendEmail({ email });
                  codeError = false;
                "
              >
                Volver a enviar código
              </ion-button>
            </ion-col>
          </ion-row>
        </section>
      </transition>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonCol,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonInputPasswordToggle,
  IonPage,
  IonProgressBar,
  IonRow,
  IonTitle,
  IonToolbar,
  isPlatform,
  modalController,
} from "@ionic/vue";
import { ref } from "vue";
import {
  chevronForwardOutline,
  closeOutline,
  informationOutline,
  saveOutline,
} from "ionicons/icons";
import {
  email as emailHelper,
  helpers,
  required,
  minLength,
  numeric,
} from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";
import { CardAlert } from "ionic-extra-components";

// controllers
import SystemController from "@/controllers/systemController";
import UserController from "@/controllers/userController";
const systemController = new SystemController();
const userController = new UserController();

// images
import mailImage from "@/assets/otros/mail.png";
import keyImage from "@/assets/otros/key.png";

// vars
const email = ref("admin@admin.com");
const code = ref<number | undefined>(undefined);
const newPassword = ref("");
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
      minLength(8),
    ),
    regexLower: helpers.withMessage(
      "La contraseña debe contener al menos una letra minúscula",
      helpers.regex(/[a-z]/),
    ),
    regexUpper: helpers.withMessage(
      "La contraseña debe contener al menos una letra mayúscula",
      helpers.regex(/[A-Z]/),
    ),
    regexNumber: helpers.withMessage(
      "La contraseña debe contener al menos un número",
      helpers.regex(/[0-9]/),
    ),
    regexSpecial: helpers.withMessage(
      "La contraseña debe contener al menos un carácter especial",
      helpers.regex(/[@$!%*?&]/),
    ),
  },
};
const v2$ = useVuelidate(rules2, { code, password: newPassword });
const mainLoad = ref(false);
const codeError = ref(false);
// end vars

// functions
async function handleStep1(params: { email: string }) {
  const { email } = params;
  mainLoad.value = true;

  try {
    await sendEmail({ email });
    await systemController.presentToast({
      message: "Código enviado",
    });
    step.value = 2;
  } catch (error) {
    console.error(error);
  } finally {
    mainLoad.value = false;
  }
}

async function handleStep2(params: {
  email: string;
  code: number;
  password: string;
}) {
  const { email, code, password } = params;
  mainLoad.value = true;

  try {
    await sendNewPassword({ email, code, password });
    await modalController.dismiss();
    await systemController.presentToast({
      message: "Contraseña actualizada",
    });
  } catch (error) {
    console.error(error);
  } finally {
    mainLoad.value = false;
  }
}

async function resendEmail(params: { email: string }) {
  const { email } = params;
  mainLoad.value = true;

  try {
    await sendEmail({ email });
  } catch (error) {
    console.error(error);
  } finally {
    mainLoad.value = false;
  }
}

// functions
async function sendEmail(params: { email: string }) {
  const { email } = params;

  try {
    await userController.recoverPassword({ email });
  } catch (error: unknown) {
    // const message = error instanceof Error ? error.message : "Ocurrió un error";
    await systemController.presentToast({
      message: "Ocurrió un error",
      color: "danger",
    });
    throw error;
  }
}

async function sendNewPassword(params: {
  email: string;
  code: number;
  password: string;
}) {
  const { email, code, password } = params;

  try {
    await userController.sendNewPassword({
      email,
      code,
      password,
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error && error.message === "Code invalid"
        ? "Código incorrecto"
        : "Ocurrió un error";

    await systemController.presentToast({
      message,
      color: "danger",
    });

    throw error;
  }
}
</script>
