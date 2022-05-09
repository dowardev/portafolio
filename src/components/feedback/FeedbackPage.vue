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

        <ion-buttons slot="end" v-if="dataProp?.type == 'error'">
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
                  v-model="v$.form['name'].$model"
                  :disabled="form.id != ''"
                ></ion-input>
              </ion-item>
              <div
                v-for="(error, index) of v$.form['name'].$errors"
                :key="index"
              >
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
                  que proporciono en el formulario para darle un mejor
                  seguimiento a mi caso.
                </ion-label>
              </ion-item>

              <div class="center">
                <ion-item lines="none">
                  <ion-spinner
                    name="crescent"
                    v-if="spinners.buttonSendFeedback"
                  ></ion-spinner>
                  <ion-button
                    fill="clear"
                    expand="block"
                    :disabled="v$.$invalid"
                    @click="sendFeedback"
                  >
                    Enviar
                  </ion-button>
                </ion-item>
              </div>
            </form>
          </ion-col>
        </ion-row>
      </section>

      <section v-if="displayError">
        <ion-item button @click="displayError = false">
          <ion-icon :icon="chevronBackOutline" slot="start"></ion-icon>
          <ion-label>Regresar al formulario</ion-label>
        </ion-item>

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
import systemService from "../../services/system.vue";
import feedbackService from "../../services/feedback.vue";
import userService from "../../services/user.vue";
import { ModalFeedback } from "../../services/interfaces.vue";

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
    dataProp: { type: Object as () => ModalFeedback },
  },
  setup() {
    return { closeOutline, v$: useVuelidate(), chevronBackOutline, bugOutline };
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
      const query = `
            user {
              id
              name
              email
            }
      `;
      try {
        const response = await userService().getUser({ query });
        // eslint-disable-next-line
        this.form.id = response.id!;
        // eslint-disable-next-line
        this.form.name = response.name!;
        // eslint-disable-next-line
        this.form.email = response.email!;
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

      // eslint-disable-next-line
      if (this.dataProp!.error)
        // eslint-disable-next-line
        description += "\nError " + JSON.stringify(this.dataProp!.error);

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
          type,
        });
        this.spinners.buttonSendFeedback = false;
        systemService().openToast({
          message: "Gracias por tus comentarios",
          color: "success",
        });
        this.clearInputs;
        this.closeModal();
      } catch (e) {
        this.spinners.buttonSendFeedback = false;
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
