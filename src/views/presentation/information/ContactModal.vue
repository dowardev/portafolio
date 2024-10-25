<template>
  <ion-page>
    <ion-header :translucent="true" class="ion-no-border">
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
            :disabled="spinners.sendMessage || formStatus == false"
            @click="
              sendMessage({
                data: (contactFormRef as any).getData(),
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
      <ContactForm ref="contactFormRef" @form-status="formStatus = $event" />
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
} from "@ionic/vue";
import { closeOutline, sendOutline } from "ionicons/icons";
import { ref } from "vue";
import { openToast } from "@/services/system";
import { ContactMessage } from "@admin/services/interfaces";
import { createContactMessage as createContactMessageService } from "@/services/contact";
import { helpers, required } from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";

// controllers
import ContactForm from "../../contact/ContactPage.vue";

// vars
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
const contactFormRef = ref(null);
const formStatus = ref(false);

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

  try {
    await createContactMessageService({ data: form });
    openToast({ message: "Mensaje recibido" });
    closeModal({});
  } catch (error) {
    openToast({ message: "Error al enviar mensaje" });
    spinners.value.sendMessage = false;
    return;
  } finally {
    spinners.value.sendMessage = false;
  }
}
</script>
