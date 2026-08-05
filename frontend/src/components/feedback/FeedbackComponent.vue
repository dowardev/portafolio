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
          <!-- send -->
          <!-- :disabled="v$.form.$invalid" -->
          <LoadButton
            :fill="buttonSendProps.fill as any"
            :status="buttonSendProps.status"
            @click="
              sendFeedback({
                userId: form.id,
                name: form.name,
                email: form.email,
                description: form.description,
                contactMe: form.contactMe,
              })
            "
          >
            <template #icon-start>
              <ion-icon :icon="sendOutline"></ion-icon>
            </template>
            <template #message>Enviando</template>
          </LoadButton>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <section class="ion-padding">
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
                'ion-invalid': v$.form.name.$invalid && v$.form.name.$dirty,
                'ion-touched': v$.form.name.$dirty,
              }"
              :error-text="v$.form.name.$errors[0]?.$message.toString()"
              @ion-input="form.name = $event.detail.value!.toString()"
              @click="v$.form.name.$touch()"
            ></ion-input>
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
                'ion-invalid': v$.form.email.$invalid && v$.form.email.$dirty,
                'ion-touched': v$.form.email.$dirty,
              }"
              :error-text="v$.form.email.$errors[0]?.$message.toString()"
              @ion-input="form.email = $event.detail.value!.toString()"
              @click="v$.form.email.$touch()"
            ></ion-input>
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
                'ion-invalid':
                  v$.form.description.$invalid && v$.form.description.$dirty,
                'ion-touched': v$.form.description.$dirty,
              }"
              :error-text="v$.form.description.$errors[0]?.$message.toString()"
              @ion-input="form.description = $event.detail.value!.toString()"
              @click="v$.form.description.$touch()"
            ></ion-textarea>
          </ion-col>
        </ion-row>

        <!-- check -->
        <ion-row>
          <ion-col>
            <ion-item
              lines="none"
              class="transparent"
              style="border: 1px solid var(--ion-background-color-step-150)"
            >
              <ion-checkbox
                :value="form.contactMe"
                label-placement="end"
                @ion-change="form.contactMe = $event.detail.checked"
              >
                <p style="white-space: normal !important">
                  Permitir que me contacten para obtener más detalles sobre mi
                  feedback.
                </p>
              </ion-checkbox>
            </ion-item>
          </ion-col>
        </ion-row>
      </section>

      <!-- toast -->
      <ion-toast
        :is-open="toast.open"
        :message="toast.message"
        :duration="toast.duration"
        :color="toast.color"
        @did-dismiss="toast.open = false"
      ></ion-toast>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonButton,
  IonButtons,
  IonCheckbox,
  IonCol,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonPage,
  IonRow,
  IonTextarea,
  IonTitle,
  IonToast,
  IonToolbar,
} from "@ionic/vue";
import { onMounted, reactive } from "vue";
import { closeOutline, sendOutline } from "ionicons/icons";
import useVuelidate from "@vuelidate/core";
import { required, helpers, email, minLength } from "@vuelidate/validators";
// TODO: pending
// import { createFeedback } from "../../services/feedback";
import { LoadButton } from "ionic-extra-components";

// controllers
import { FeedbackParams } from "@/utils/interfaces";
import FeedbackController from "@/controllers/feedbackController";
import { useUserStore } from "@/store/userStore";
const userStore = useUserStore();
const feedbackController = new FeedbackController();
// end controllers

// props
const emit = defineEmits(["dismiss"]);
// end props

// ref
const form = reactive({
  id: "",
  name: "",
  email: "",
  description: "",
  contactMe: false,
});
const toast = reactive({
  color: "",
  open: false,
  message: "",
  duration: 5000,
});
// end ref

// vars
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
        helpers.regex(/^[a-zA-ZñÑ\s]+$/),
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
  },
};
const v$ = useVuelidate(rules, { form });
const buttonSendProps = reactive({ status: false, fill: "clear" });
// end vars

// mounted
onMounted(() => {
  const u = userStore.user;
  if (u) {
    form.id = u.id ?? "";
    form.name = u.name ?? "";
    form.email = u.email ?? "";
  }
});
// end mounted

// funtions
function closeModal() {
  emit("dismiss");
}

async function sendFeedback(params: FeedbackParams) {
  const { userId, name, email, description, contactMe } = params;

  buttonSendProps.status = true;
  buttonSendProps.fill = "solid";

  try {
    await feedbackController.createFeedback({
      userId,
      name,
      email,
      description,
      contactMe,
    });
    toast.open = true;
    toast.message = "Gracias por tus comentarios";
    closeModal();
  } catch (error) {
    console.error(error);
    toast.open = true;
    toast.color = "danger";
    toast.message = "Error al enviar el comentario";
  } finally {
    buttonSendProps.status = false;
    buttonSendProps.fill = "clear";
  }
}
</script>
