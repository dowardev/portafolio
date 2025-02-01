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
          <ButtonIconAnimationComponent
            ref="buttonAnimation1"
            color="primary"
            @click="handleSendMessage(contactForm?.getData()!)"
          >
            <template #icon-start>
              <ion-icon :icon="sendOutline"></ion-icon>
            </template>

            <template #message>Enviando</template>
          </ButtonIconAnimationComponent>
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
import { ref } from "vue";

// interface
import { ContactMessage } from "@/services/interfaces";

// components
import ButtonIconAnimationComponent from "@/components/buttons/ButtonIconAnimationComponent.vue";
import ContactForm from "@/components/forms/contact/ContactForm.vue";

// controllers
import SystemController from "@/controllers/systemController";
const systemController = new SystemController();

// vars
const pageTitle = "Formulario de contacto";
const contactForm = ref<InstanceType<typeof ContactForm>>();
const buttonAnimation1 =
  ref<InstanceType<typeof ButtonIconAnimationComponent>>();

// functions
function closeModal() {
  modalController.dismiss();
}

async function sendMessage(params: ContactMessage) {
  const { name, email, subject, description } = params;

  try {
    await systemController.createContactMessage({
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
  buttonAnimation1.value?.updateConfig({ status: true, fill: "solid" });

  await new Promise((resolve) => setTimeout(resolve, 800));
  await sendMessage({ name, email, subject, description });
  await new Promise((resolve) => setTimeout(resolve, 800));

  buttonAnimation1.value?.updateConfig({ status: false, fill: "default" });

  await new Promise((resolve) => setTimeout(resolve, 800));
  closeModal();
}
</script>
