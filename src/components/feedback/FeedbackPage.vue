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

        <ion-buttons v-if="dataProp?.type == 'error'" slot="end">
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
           {{dataProp?.error}} 
          </code>
        </pre>
      </section>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-non-null-assertion */
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
import { defineComponent } from "vue";
import { closeOutline, chevronBackOutline, bugOutline } from "ionicons/icons";
import useVuelidate from "@vuelidate/core";
import { required, helpers, email, minLength } from "@vuelidate/validators";
import { openToast } from "../../services/system";
import { createFeedback } from "../../services/feedback";
import { ReportError } from "../../services/interfaces";
import { USER_BASIC_DETAILS } from "../../services/graphql";
import { useUser } from "../../composables/useUser";

export default defineComponent({
  name: "FeedbackPage",
  components: {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonInput,
    IonTextarea,
    IonCheckbox,
    IonItem,
  },

  props: {
    dataProp: {
      type: Object as () => ReportError,
      default() {
        return {} as ReportError;
      },
    },
  },

  setup() {
    return {
      closeOutline,
      v$: useVuelidate(),
      chevronBackOutline,
      bugOutline,
      useUser: useUser(),
    };
  },

  data() {
    return {
      form: {
        id: String(),
        name: String(),
        email: String(),
        description: String(),
        contactMe: false,
        type: String(),
      },
      displayError: false,
      spinners: {
        buttonSendFeedback: false,
      },
    };
  },

  validations() {
    const messageRequired = "Campo requerido";
    return {
      form: {
        name: {
          required: helpers.withMessage(messageRequired, required),
        },
        email: {
          required: helpers.withMessage(messageRequired, required),
          email: helpers.withMessage("Correo no valido", email),
        },
        description: {
          required: helpers.withMessage(messageRequired, required),
          minLength: helpers.withMessage(
            "Platicanos un poco mas",
            minLength(20)
          ),
        },
        type: {
          required: helpers.withMessage(messageRequired, required),
        },
      },
    };
  },

  mounted() {
    // eslint-disable-next-line
    this.form.type = this.dataProp!.type;
    this.getUser();
  },

  methods: {
    closeModal() {
      modalController.dismiss();
    },

    async getUser() {
      try {
        await this.useUser.loadUser({
          graphql: { name: USER_BASIC_DETAILS, fragment: "UserBasicDetails" },
        });

        this.form.id = this.useUser.user.value.id!;
        this.form.name = this.useUser.user.value.name!;
        this.form.email = this.useUser.user.value.email!;
      } catch (e: any) {
        console.error(e);
        return;
      }
    },

    async sendFeedback() {
      this.spinners.buttonSendFeedback = true;

      const userId = this.form.id;
      const type = this.form.type;
      const name = this.form.name;
      const email = this.form.email;
      let description = this.form.description;
      const contactMe = this.form.contactMe;

      if (this.dataProp!.error)
        description += "\nError " + JSON.stringify(this.dataProp!.error);

      try {
        await createFeedback({
          userId,
          name,
          email,
          description,
          contactMe,
          type,
        });
        this.spinners.buttonSendFeedback = false;
        openToast({
          message: "Gracias por tus comentarios",
          color: "success",
        });
        this.clearInputs;
        openToast({ message: "Gracias por tus comentarios" });
        this.closeModal();
      } catch (e) {
        this.spinners.buttonSendFeedback = false;
        openToast({
          message: "Ocurrió un error",
          color: "danger",
        });
        console.error(e);
      }
    },

    clearInputs() {
      this.form.id = "";
      this.form.name = "";
      this.form.email = "";
      this.form.description = "";
    },
  },
});
</script>
