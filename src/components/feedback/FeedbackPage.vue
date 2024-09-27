<template>
  <ion-page>
    <ion-header :translucent="true" mode="ios" class="ion-no-border">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button @click="closeModal">
            <ion-icon :icon="closeOutline"></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-title>Comentarios</ion-title>

        <ion-buttons v-if="props.data.type == 'error'" slot="end">
          <ion-button @click="displayError = true">
            <ion-icon :icon="bugOutline"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <section v-if="displayError == false">
        <ion-row>
          <ion-col size="12">
            <form>
              <ion-item>
                <ion-label position="floating">Nombre</ion-label>
                <ion-input
                  v-model="(v$ as any).form.name.$model"
                  :disabled="form.id != ''"
                ></ion-input>
              </ion-item>
              <div
                v-for="(error, index) of (v$ as any).form.name.$errors"
                :key="index"
              >
                <div class="error">{{ error.$message }}</div>
              </div>

              <ion-item>
                <ion-label position="floating">Correo electrónico</ion-label>
                <ion-input
                  v-model="(v$ as any).form.email.$model"
                  type="email"
                  autocomplete="email"
                  :disabled="form.id != ''"
                ></ion-input>
              </ion-item>
              <div
                v-for="(error, index) of (v$ as any).form.email.$errors"
                :key="index"
              >
                <div class="error">{{ error.$message }}</div>
              </div>

              <ion-item>
                <ion-label position="floating">Descripción</ion-label>
                <ion-textarea
                  v-model="(v$ as any).form.description.$model"
                  :auto-grow="true"
                ></ion-textarea>
              </ion-item>
              <div
                v-for="(error, index) of (v$ as any).form.description.$errors"
                :key="index"
              >
                <div class="error">{{ error.$message }}</div>
              </div>

              <ion-item lines="full">
                <ion-checkbox slot="start" v-model="form.contactMe">
                </ion-checkbox>
                <ion-label class="ion-text-wrap">
                  Acepto que se pongan en contacto conmigo por medio del correo
                  que proporciono en el formulario para darle un mejor
                  seguimiento a mi caso.
                </ion-label>
              </ion-item>

              <ion-button
                fill="clear"
                expand="full"
                :disabled="v$.$invalid || spinners.buttonSendFeedback"
                @click="sendFeedback()"
              >
                <ion-label v-if="spinners.buttonSendFeedback == false">
                  Enviar</ion-label
                >
                <ion-spinner
                  v-if="spinners.buttonSendFeedback"
                  name="crescent"
                ></ion-spinner>
              </ion-button>
            </form>
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
import { closeOutline, chevronBackOutline, bugOutline } from "ionicons/icons";
import useVuelidate from "@vuelidate/core";
import { required, helpers, email, minLength } from "@vuelidate/validators";
import { openToast } from "../../services/system";
import { createFeedback } from "../../services/feedback";
import { ReportError } from "../../services/interfaces";
import { useUser } from "../../composables/useUser";

const props = defineProps({
  data: {
    type: Object as () => ReportError,
    default() {
      return {} as ReportError;
    },
  },
});

const form = ref({
  id: String(),
  name: String(),
  email: String(),
  description: String(),
  contactMe: false,
  type: String(),
});
const displayError = ref(false);
const spinners = ref({
  buttonSendFeedback: false,
});

const messageError = {
  email: "Correo electronico no valido",
  required: "Campo requerido",
  password: "Las contraseñas no coinciden",
};
const rules = {
  form: {
    name: {
      required: helpers.withMessage(messageError.required, required),
    },
    email: {
      required: helpers.withMessage(messageError.required, required),
      email: helpers.withMessage("Correo no valido", email),
    },
    description: {
      required: helpers.withMessage(messageError.required, required),
      minLength: helpers.withMessage("Platicanos un poco mas", minLength(20)),
    },
    type: {
      required: helpers.withMessage(messageError.required, required),
    },
  },
};
const v$ = useVuelidate(rules, { form });

// mounted
onMounted(() => {
  form.value.type = props.data.type;
  getUser();
});

// funtions
function closeModal() {
  modalController.dismiss();
}

async function getUser() {
  try {
    await useUser().loadUser({
      graphql: { name: USER_BASIC_DETAILS, fragment: "UserBasicDetails" },
    });

    form.value.id = useUser().user.value.id!;
    form.value.name = useUser().user.value.name!;
    form.value.email = useUser().user.value.email!;
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
    await createFeedback({
      userId,
      name,
      email,
      description,
      contactMe,
      type,
    });
    spinners.value.buttonSendFeedback = false;
    openToast({
      message: "Gracias por tus comentarios",
      color: "success",
    });
    clearInputs;
    openToast({ message: "Gracias por tus comentarios" });
    closeModal();
  } catch (e) {
    spinners.value.buttonSendFeedback = false;
    openToast({
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
