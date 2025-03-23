<template>
  <ion-page>
    <ion-header :translucent="true" class="ion-no-border">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-buttons slot="start">
            <ion-button @click="closeModal()">
              <ion-icon :icon="closeOutline"> </ion-icon>
            </ion-button>
          </ion-buttons>
        </ion-buttons>

        <ion-title>{{ pageTitle }}</ion-title>

        <ion-buttons slot="end">
          <LoadButton
            :fill="buttonSend.fill as any"
            :status="buttonSend.status"
            color="primary"
            @click="handleSendMessage(contactForm?.getData()!)"
          >
            <template #icon-start>
              <ion-icon :icon="sendOutline"></ion-icon>
            </template>

            <template #message>Enviando</template>
          </LoadButton>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <ContactForm ref="contactForm" />
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
import { reactive, ref } from "vue";
import { LoadButton } from "ionic-extra-components";

// interface
import { ContactMessage } from "@/services/interfaces";

// components
import ContactForm from "@/forms/ContactForm.vue";

// controllers
import SystemController from "@/controllers/systemController";
import ContactController from "@/controllers/contactController";
const systemController = new SystemController();
const contactController = new ContactController();

// vars
const pageTitle = "Formulario de contacto";
const contactForm = ref<InstanceType<typeof ContactForm>>();
const buttonSend = reactive({ status: false, fill: "clear" });

// functions
function closeModal() {
  modalController.dismiss();
}

async function sendMessage(params: ContactMessage) {
  const { name, email, subject, description } = params;

  try {
    await contactController.createContactMessage({
      name,
      email,
      subject,
      description,
    });
    await systemController.presentToast({ message: "Mensaje recibido" });
  } catch (e: unknown) {
    await systemController.presentToast({ message: "Error al enviar mensaje" });
    console.error(e);
    return;
  } finally {
    //
  }
}

async function handleSendMessage(params: ContactMessage) {
  const { name, email, subject, description } = params;
  buttonSend.status = true;
  buttonSend.fill = "solid";

  await sendMessage({ name, email, subject, description });
  await new Promise((resolve) => setTimeout(resolve, 200));

  buttonSend.status = false;
  buttonSend.fill = "clear";

  await new Promise((resolve) => setTimeout(resolve, 200));
  closeModal();
}
</script>
