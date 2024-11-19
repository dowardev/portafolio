<template>
  <ion-page>
    <ion-header class="ion-no-border">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button @click="closeModal">
            <ion-icon :icon="closeOutline"></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-title>Comentarios</ion-title>

        <ion-buttons slot="end">
          <ion-button
            @click="displayError = true"
            v-if="props.data.type == 'error'"
          >
            <ion-icon :icon="bugOutline"></ion-icon>
          </ion-button>

          <!-- send -->
          <ion-button
            :disabled="v$.$invalid || spinners.buttonSendFeedback"
            @click="sendFeedback()"
          >
            <ion-icon :icon="sendOutline"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <section v-if="displayError == false">
        <ion-row>
          <ion-col>
            <ion-card>
              <ion-card-content>
                <ion-row>
                  <ion-col size="12">
                    <!-- name -->
                    <ion-input
                      label="Nombre"
                      label-placement="stacked"
                      fill="outline"
                      :value="form.name"
                      :disabled="form.id != ''"
                      :class="{
                        'input-error':
                          v$.form.name.$dirty && v$.form.name.$invalid,
                      }"
                      @ion-input="form.name = $event.target.value as any"
                      @click="v$.form.name.$touch()"
                    ></ion-input>

                    <!-- errors -->
                    <span
                      class="error"
                      v-if="
                        v$.form.name.$dirty && v$.form.name.required.$invalid
                      "
                      >{{ v$.form.name.required.$message }}</span
                    >
                    <span
                      class="error"
                      v-if="v$.form.name.$dirty && v$.form.name.alpha.$invalid"
                      >{{ v$.form.name.alpha.$message }}</span
                    >
                  </ion-col>
                </ion-row>

                <!-- email -->
                <ion-row>
                  <ion-col>
                    <ion-input
                      label="Correo electrónico"
                      label-placement="stacked"
                      fill="outline"
                      autocomplete="email"
                      type="email"
                      :value="form.email"
                      :disabled="form.id != ''"
                      :class="{
                        'input-error':
                          v$.form.email.$dirty && v$.form.email.$invalid,
                      }"
                      @ion-input="form.email = $event.detail.value as any"
                      @click="v$.form.email.$touch()"
                    ></ion-input>

                    <!-- errors -->
                    <span
                      class="error"
                      v-if="
                        v$.form.email.$dirty && v$.form.email.required.$invalid
                      "
                      >{{ v$.form.email.required.$message }}</span
                    >
                    <span
                      class="error"
                      v-if="
                        v$.form.email.$dirty && v$.form.email.email.$invalid
                      "
                      >{{ v$.form.email.email.$message }}</span
                    >
                  </ion-col>
                </ion-row>

                <!-- description -->
                <ion-row>
                  <ion-col>
                    <ion-textarea
                      label="Descripción"
                      label-placement="stacked"
                      fill="outline"
                      :value="form.description"
                      :auto-grow="true"
                      :class="{
                        'input-error':
                          v$.form.description.$dirty &&
                          v$.form.description.$invalid,
                      }"
                      @ion-input="form.description = $event.target.value as any"
                      @click="v$.form.description.$touch()"
                    ></ion-textarea>

                    <!-- errors -->
                    <span
                      class="error"
                      v-if="
                        v$.form.description.$dirty &&
                        v$.form.description.required.$invalid
                      "
                      >{{ v$.form.description.required.$message }}</span
                    >
                    <span
                      class="error"
                      v-if="
                        v$.form.description.$dirty &&
                        v$.form.description.minLength.$invalid
                      "
                      >{{ v$.form.description.minLength.$message }}</span
                    >
                  </ion-col>
                </ion-row>

                <!-- check -->
                <ion-row>
                  <ion-col>
                    <ion-item lines="none" label class="transparent">
                      <ion-checkbox
                        :value="form.contactMe"
                        justify="space-between"
                        label-placement="end"
                        @ion-change="form.contactMe = $event.detail.checked"
                      >
                        Acepto que se pongan en contacto conmigo.
                      </ion-checkbox>
                    </ion-item>
                  </ion-col>
                </ion-row>
              </ion-card-content>
            </ion-card>
          </ion-col>
        </ion-row>
      </section>

      <section v-if="displayError">
        <ion-item-divider
          class="blur-effect blur-effect-color"
          :sticky="true"
          button
          @click="displayError = false"
        >
          <ion-icon slot="start" :icon="chevronBackOutline"></ion-icon>
          <ion-label>Regresar al formulario</ion-label>
        </ion-item-divider>

        <pre style="color: var(--primary-text-color)">
          <code>
           {{props.data.error}} 
          </code>
        </pre>
      </section>
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
  modalController,
  IonInput,
  IonTextarea,
  IonCheckbox,
  IonItem,
} from "@ionic/vue";
import { onMounted, ref } from "vue";
import {
  closeOutline,
  chevronBackOutline,
  bugOutline,
  sendOutline,
} from "ionicons/icons";
import useVuelidate from "@vuelidate/core";
import { required, helpers, email, minLength } from "@vuelidate/validators";
// TODO: pending
// import { createFeedback } from "../../services/feedback";
import { ReportError } from "../../services/interfaces";

// controllers
import UserController from "@/controllers/userController";
import SystemController from "@/controllers/systemController";
const userController = new UserController();
const systemController = new SystemController();

const props = defineProps<{
  data: ReportError;
}>();

const form = ref({
  id: "",
  name: "",
  email: "",
  description: "",
  contactMe: false,
  type: "",
});
const displayError = ref(false);
const spinners = ref({
  buttonSendFeedback: false,
});

const messageError = {
  email: "Correo electrónico no valido",
  required: "Campo requerido",
  password: "Las contraseñas no coinciden",
};
const rules = {
  form: {
    name: {
      required: helpers.withMessage(messageError.required, required),
      alpha: helpers.withMessage(
        "Solo texto",
        helpers.regex(/^[a-zA-ZñÑ\s]+$/)
      ),
    },
    email: {
      required: helpers.withMessage(messageError.required, required),
      email: helpers.withMessage("Correo no valido", email),
    },
    description: {
      required: helpers.withMessage(messageError.required, required),
      minLength: helpers.withMessage("Platícanos un poco mas", minLength(20)),
    },
    type: {
      required: helpers.withMessage(messageError.required, required),
    },
  },
};
const v$ = useVuelidate(rules, { form });

// mounted
onMounted(() => {
  if (props.data.type) {
    form.value.type = props.data.type;
  }
  getUser();
});

// funtions
function closeModal() {
  modalController.dismiss();
}

async function getUser() {
  try {
    await userController.loadUser();

    form.value.id = userController.getUser()?.id!;
    form.value.name = userController.getUser()?.name!;
    form.value.email = userController.getUser()?.email!;
  } catch (e: any) {
    console.error(e);
    return;
  }
}

async function sendFeedback() {
  spinners.value.buttonSendFeedback = true;

  const userId = form.value.id;
  const type = form.value.type;
  const name = form.value.name;
  const email = form.value.email;
  let description = form.value.description;
  const contactMe = form.value.contactMe;

  if (props.data.error)
    description += "\nError " + JSON.stringify(props.data.error);

  try {
    await systemController.createFeedback({
      userId,
      name,
      email,
      description,
      contactMe,
      type,
    });
    spinners.value.buttonSendFeedback = false;
    systemController.presentToast({
      message: "Gracias por tus comentarios",
      color: "success",
    });
    clearInputs;
    systemController.presentToast({ message: "Gracias por tus comentarios" });
    closeModal();
  } catch (e) {
    spinners.value.buttonSendFeedback = false;
    systemController.presentToast({
      message: "Ocurrió un error",
      color: "danger",
    });
    console.error(e);
  }
}

function clearInputs() {
  form.value.id = "";
  form.value.name = "";
  form.value.email = "";
  form.value.description = "";
}
</script>
