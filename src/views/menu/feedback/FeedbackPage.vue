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
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-row>
        <ion-col size="12">
          <form>
            <ion-item>
              <ion-label position="floating">Nombre</ion-label>
              <ion-input
                v-model="v$.form['name'].$model"
                :disabled="form.id != ''"
              ></ion-input>
            </ion-item>
            <div v-for="(error, index) of v$.form['name'].$errors" :key="index">
              <div class="error">{{ error.$message }}</div>
            </div>

            <ion-item>
              <ion-label position="floating">Correo electrónico</ion-label>
              <ion-input
                v-model="v$.form['email'].$model"
                type="email"
                autocomplete="email"
                :disabled="form.id != ''"
              ></ion-input>
            </ion-item>
            <div
              v-for="(error, index) of v$.form['email'].$errors"
              :key="index"
            >
              <div class="error">{{ error.$message }}</div>
            </div>

            <ion-item>
              <ion-label position="floating">Descripción</ion-label>
              <ion-textarea
                auto-grow="true"
                v-model="v$.form['description'].$model"
              ></ion-textarea>
            </ion-item>
            <div
              v-for="(error, index) of v$.form['description'].$errors"
              :key="index"
            >
              <div class="error">{{ error.$message }}</div>
            </div>

            <ion-item lines="full">
              <ion-checkbox v-model="form.contactMe" slot="start">
              </ion-checkbox>
              <ion-label class="ion-text-wrap">
                Acepto que se pongan en contacto conmigo por medio del correo
                que proporciono en el formulario para darle un mejor seguimiento
                a mi caso.
              </ion-label>
            </ion-item>

            <ion-button
              fill="clear"
              expand="block"
              :disabled="v$.$invalid"
              @click="sendFeedback"
            >
              Enviar
            </ion-button>
          </form>
        </ion-col>
      </ion-row>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
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
} from "@ionic/vue";
import { defineComponent } from "vue";
import { closeOutline } from "ionicons/icons";
import useVuelidate from "@vuelidate/core";
import { required, helpers, email, minLength } from "@vuelidate/validators";
import systemService from "../../../services/system.vue";
import feedbackService from "../../../services/feedback.vue";
import userService from "../../../services/user.vue";

export default defineComponent({
  name: "HomePage",
  components: {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonInput,
    IonTextarea,
    IonCheckbox,
  },
  setup() {
    return { closeOutline, v$: useVuelidate() };
  },
  data() {
    return {
      form: {
        id: "",
        name: "",
        email: "",
        description: "",
        contactMe: false,
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
      },
    };
  },
  mounted() {
    this.getUser();
  },
  methods: {
    closeModal() {
      modalController.dismiss();
    },
    async getUser() {
      const query = `
            user {
              id
              name
              email
            }
      `;
      try {
        const response = await userService().getUser({ query });
        this.form.id = response.id as string;
        this.form.name = response.name as string;
        this.form.email = response.email as string;
      } catch (e: any) {
        console.error(e);
        return;
      }
    },
    async sendFeedback() {
      const loading = await this.presentLoading();
      loading.present();

      const userId = this.form.id;
      const name = this.form.name;
      const email = this.form.email;
      const description = this.form.description;
      const contactMe = this.form.contactMe;

      const query = `
            message
      `;

      try {
        await feedbackService().createFeedback({
          query,
          userId,
          name,
          email,
          description,
          contactMe,
        });
        loading.dismiss();
        systemService().openToast({
          message: "Gracias por tus comentarios",
          color: "success",
        });
        this.clearInputs;
        this.closeModal();
      } catch (e) {
        loading.dismiss();
        systemService().openToast({
          message: "Ocurrió un error",
          color: "danger",
        });
        console.error(e);
      }
    },
    presentLoading() {
      return systemService().presentLoading({
        message: "Enviando comentarios",
      });
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
