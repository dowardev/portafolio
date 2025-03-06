<template>
  <ion-page>
    <ion-header class="ion-no-border" mode="ios">
      <ion-toolbar>
        <ion-title>Reportar error</ion-title>

        <ion-buttons slot="end">
          <LoadButton
            :fill="buttonSendProps.fill as any"
            :status="buttonSendProps.status"
            @click="
              sendErrorReport({
                message: props.error.message,
                stack: props.error.stack!,
                comments: userComments,
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

    <ion-content :fullscreen="true" style="height: 70dvh">
      <ion-row>
        <ion-col>
          <CardAlert color="success" :border="true" class="no-shadow">
            <template #icon>
              <ion-icon :icon="informationOutline"></ion-icon>
            </template>
            <template #title>Uso de datos</template>
            <template #content>
              Ningún dato relacionado al usuario sera enviado en este reporte.
            </template>
          </CardAlert>
        </ion-col>
      </ion-row>

      <ion-row>
        <ion-col>
          <ion-list>
            <ion-list-header>
              <ion-label>Reporte</ion-label>
            </ion-list-header>
          </ion-list>

          <ion-card class="shadow-1">
            <ion-card-content>
              <!-- stack-->
              <ion-row>
                <ion-col>
                  <!-- message -->
                  <ion-item lines="full">
                    <ion-label>Mensaje</ion-label>
                    <ion-label slot="end">{{ props.error.message }}</ion-label>
                  </ion-item>

                  <ion-accordion-group class="ion-padding-top">
                    <ion-accordion
                      value="first"
                      style="
                        border: 1px solid var(--ion-background-color-step-150);
                        border-radius: 4px;
                      "
                    >
                      <ion-item slot="header">
                        <ion-label>Stack</ion-label>
                      </ion-item>

                      <div slot="content" class="ion-padding">
                        {{ props.error.stack }}
                      </div>
                    </ion-accordion>
                  </ion-accordion-group>

                  <!-- commentary -->
                  <ion-textarea
                    class="ion-padding-top"
                    label="Comentarios"
                    label-placement="stacked"
                    fill="outline"
                    placeholder="Opcionales"
                    :value="userComments"
                    @ion-change="userComments = $event.detail.value!"
                  ></ion-textarea>
                </ion-col>
              </ion-row>
            </ion-card-content>
          </ion-card>
        </ion-col>
      </ion-row>

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
  IonLabel,
  IonItem,
  IonTextarea,
  IonRow,
  IonCol,
  IonContent,
  IonAccordion,
  modalController,
} from "@ionic/vue";
import { CardAlert, LoadButton } from "ionic-extra-components";
import { reactive, ref } from "vue";
import { informationOutline, sendOutline } from "ionicons/icons";

// controllers
import ErrorController from "@/controllers/errorController";
const errorController = new ErrorController();

// props
const props = withDefaults(
  defineProps<{
    error: Error;
  }>(),
  {
    error: () => new Error(),
  },
);
// end props

// vars
const buttonSendProps = reactive({ status: false, fill: "clear" });
const userComments = ref("");
const toast = reactive({
  color: "",
  open: false,
  message: "",
  duration: 5000,
});
// endv ars

// functions
async function sendErrorReport(params: {
  message: string;
  stack: string;
  comments: string;
}) {
  const { message, stack, comments } = params;

  buttonSendProps.status = true;
  buttonSendProps.fill = "solid";

  try {
    await errorController.sendErrorReport({
      message,
      stack,
      comments,
    });
    toast.open = true;
    toast.message = "Reporte enviado";
    await modalController.dismiss();
  } catch (error) {
    console.error(error);
    toast.open = true;
    toast.color = "danger";
    toast.message = "Error al enviar el reporte";
  } finally {
    buttonSendProps.status = false;
    buttonSendProps.fill = "clear";
  }
}
</script>
