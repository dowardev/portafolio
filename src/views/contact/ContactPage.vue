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
          <ion-buttons slot="start">
            <ion-button @click="closeModal({})">
              <ion-icon :icon="closeOutline"> </ion-icon>
            </ion-button>
          </ion-buttons>
        </ion-buttons>
        <ion-title>{{ pageTitle }}</ion-title>

        <ion-buttons slot="end">
          <ion-button
            :disabled="spinners.sendMessage || v$.contactData.$invalid"
            @click="
              sendMessage({
                data: {
                  name: contactData.name,
                  subject: contactData.subject,
                  email: contactData.email,
                  description: contactData.description,
                },
              })
            "
          >
            <ion-icon v-if="spinners.sendMessage == false" :icon="sendOutline">
            </ion-icon>
            <ion-spinner v-if="spinners.sendMessage" name="crescent">
            </ion-spinner>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-header collapse="condense" mode="ios">
        <ion-toolbar>
          <ion-title size="large">{{ pageTitle }}</ion-title>
        </ion-toolbar>
      </ion-header>

      <ion-row>
        <ion-col size="12">
          <ion-item>
            <ion-label position="floating"> Nombre </ion-label>
            <ion-input
              v-model="contactData.name"
              type="text"
              :autofocus="true"
              autocomplete="name"
            >
            </ion-input>
          </ion-item>
          <div
            v-for="(error, index) of v$.contactData.name.$errors"
            :key="index"
          >
            <div class="error">{{ error.$message }}</div>
          </div>
        </ion-col>

        <ion-col size="12">
          <ion-item>
            <ion-label position="floating"> Asunto</ion-label>
            <ion-input
              v-model="contactData.subject"
              type="text"
              :spellcheck="true"
            >
            </ion-input>
          </ion-item>
          <div
            v-for="(error, index) of v$.contactData.subject.$errors"
            :key="index"
          >
            <div class="error">{{ error.$message }}</div>
          </div>
        </ion-col>

        <ion-col size="12">
          <ion-item>
            <ion-label position="floating"> Correo electrónico</ion-label>
            <ion-input
              v-model="contactData.email"
              type="email"
              autocomplete="email"
            >
            </ion-input>
          </ion-item>
          <div
            v-for="(error, index) of v$.contactData.email.$errors"
            :key="index"
          >
            <div class="error">{{ error.$message }}</div>
          </div>
        </ion-col>

        <ion-col size="12">
          <ion-item>
            <ion-label position="floating"> Descripción</ion-label>
            <ion-textarea v-model="contactData.description"> </ion-textarea>
          </ion-item>
          <div
            v-for="(error, index) of v$.contactData.description.$errors"
            :key="index"
          >
            <div class="error">{{ error.$message }}</div>
          </div>
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
  modalController,
  IonInput,
  IonTextarea,
} from "@ionic/vue";
import { closeOutline, sendOutline } from "ionicons/icons";
import { ref } from "vue";
import { openToast } from "../../services/system";
import { ContactMessage } from "../../services/interfaces";
import { createContactMessage as createContactMessageService } from "../../services/contact";
import { helpers, required } from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";

const pageTitle = "Formulario de contacto";

const spinners = ref({
  sendMessage: false,
});
const contactData = ref({
  name: "",
  subject: "",
  email: "",
  description: "",
});

const messageError = {
  required: "Campo requerido",
};
const rules = {
  contactData: {
    name: {
      required: helpers.withMessage(messageError.required, required),
    },
    email: {
      required: helpers.withMessage(messageError.required, required),
    },
    subject: {
      required: helpers.withMessage(messageError.required, required),
    },
    description: {
      required: helpers.withMessage(messageError.required, required),
    },
  },
};
const v$ = useVuelidate(rules, { contactData });

// functions
function closeModal(params: { data?: any }) {
  const data = params.data;
  modalController.dismiss({ data });
}

async function sendMessage(params: { data: ContactMessage }) {
  spinners.value.sendMessage = true;

  const form = {
    name: params.data.name,
    subject: params.data.subject,
    email: params.data.email,
    description: params.data.description,
  };

  await createContactMessageService({ data: form });

  openToast({ message: "Mensaje recibido" });
  spinners.value.sendMessage = false;
  closeModal({});
}
</script>
