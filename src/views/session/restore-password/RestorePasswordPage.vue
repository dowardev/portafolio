<template>
  <ion-page>
    <ion-header class="ion-no-border" :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button menu="mainMenu" mode="md"></ion-menu-button>
        </ion-buttons>
        <ion-title>Restablecer contraseña</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-row class="ion-padding center">
        <ion-col size="12" size-md="6">
          <p>No te preocupes juntos lo solucionaremos.</p>
          <ol>
            <li>Ingresa tu correo electrónico</li>
            <li>Ingresa el código que recibiste en tu correo electrónico</li>
            <li>Ingresa tu nueva contraseña</li>
            <li>Recupera el acceso a tu cuenta</li>
          </ol>
        </ion-col>
      </ion-row>

      <section v-if="options.emailForm">
        <ion-row class="center">
          <ion-col size="12" size-md="8" size-lg="6" size-xl="4">
            <ion-card>
              <ion-card-content>
                <ion-item>
                  <ion-label position="floating">Correo electrónico</ion-label>
                  <ion-input
                    type="email"
                    v-model="form.email"
                    autocomplete="email"
                    @keyup.enter="sendMailResetPassword()"
                  ></ion-input>
                </ion-item>
                <div class="center">
                  <ion-item lines="none">
                    <ion-spinner
                      name="crescent"
                      v-if="spinners.buttonSendEmail"
                    ></ion-spinner>
                    <ion-button
                      expand="block"
                      fill="clear"
                      @click="sendMailResetPassword()"
                    >
                      Confirmar
                    </ion-button>
                  </ion-item>
                </div>
              </ion-card-content>
            </ion-card>
          </ion-col>
        </ion-row>
      </section>

      <section v-if="options.codeForm">
        <ion-row class="center">
          <ion-col size="12" size-md="8" size-lg="6" size-xl="4">
            <ion-card>
              <ion-card-content>
                <ion-item>
                  <ion-label position="floating">Código</ion-label>
                  <ion-input
                    type="numeric"
                    v-model="form.code"
                    @keyup.enter="sendCodeResetPassword()"
                  ></ion-input>
                </ion-item>
                <div class="center">
                  <ion-item lines="none">
                    <ion-spinner
                      name="crescent"
                      v-if="spinners.buttonSendCode"
                    ></ion-spinner>
                    <ion-button
                      expand="full"
                      fill="clear"
                      @click="sendCodeResetPassword()"
                      >Enviar</ion-button
                    >
                  </ion-item>
                </div>
              </ion-card-content>
            </ion-card>
          </ion-col>
        </ion-row>
      </section>

      <section v-if="options.passwordForm">
        <ion-row class="center">
          <ion-col size="12" size-md="8" size-lg="6" size-xl="4">
            <ion-card>
              <ion-card-content>
                <ion-item>
                  <ion-label position="floating">Contraseña</ion-label>
                  <ion-input
                    :type="inputTypePassword1"
                    v-model="(v$.form as any).password1.$model"
                    @keyup.enter="resetPassword()"
                  ></ion-input>
                  <ion-button
                    slot="end"
                    fill="clear"
                    v-if="inputTypePassword1 == 'text'"
                    v-on:click="inputTypePassword1 = 'password'"
                    style="margin-top: 20px"
                  >
                    <ion-icon :icon="eyeOffOutline"></ion-icon>
                  </ion-button>
                  <ion-button
                    slot="end"
                    fill="clear"
                    v-if="inputTypePassword1 == 'password'"
                    v-on:click="inputTypePassword1 = 'text'"
                    style="margin-top: 20px"
                  >
                    <ion-icon :icon="eyeOutline"></ion-icon>
                  </ion-button>
                </ion-item>
                <div
                  v-for="(error, index) of (v$.form as any).password1.$errors"
                  :key="index"
                >
                  <div class="error">{{ error.$message }}</div>
                </div>

                <ion-item>
                  <ion-label position="floating"
                    >Repite la contraseña</ion-label
                  >
                  <ion-input
                    :type="inputTypePassword2"
                    v-model="(v$.form as any).password2.$model"
                    @keyup.enter="resetPassword()"
                  ></ion-input>
                  <ion-button
                    slot="end"
                    fill="clear"
                    v-if="inputTypePassword2 == 'text'"
                    v-on:click="inputTypePassword2 = 'password'"
                    style="margin-top: 20px"
                  >
                    <ion-icon :icon="eyeOffOutline"></ion-icon>
                  </ion-button>
                  <ion-button
                    slot="end"
                    fill="clear"
                    v-if="inputTypePassword2 == 'password'"
                    v-on:click="inputTypePassword2 = 'text'"
                    style="margin-top: 20px"
                  >
                    <ion-icon :icon="eyeOutline"></ion-icon>
                  </ion-button>
                </ion-item>
                <div
                  v-for="(error, index) of (v$.form as any).password2.$errors"
                  :key="index"
                >
                  <div class="error">{{ error.$message }}</div>
                </div>

                <div class="center">
                  <ion-item lines="none">
                    <ion-spinner
                      name="crescent"
                      v-if="spinners.buttonResetPassword"
                    ></ion-spinner>
                    <ion-button
                      expand="full"
                      fill="clear"
                      @click="resetPassword()"
                      :disabled="(v$.form as any).$invalid"
                    >
                      Enviar
                    </ion-button>
                  </ion-item>
                </div>
              </ion-card-content>
            </ion-card>
          </ion-col>
        </ion-row>
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
  IonInput,
  loadingController,
  IonButtons,
  IonMenuButton,
  IonRow,
  IonCol,
  IonCard,
  IonCardContent,
  IonLabel,
  IonButton,
  IonItem,
  IonIcon,
  IonSpinner,
} from "@ionic/vue";
import { eyeOutline, eyeOffOutline } from "ionicons/icons";
import { defineComponent } from "vue";
import sessionService from "../../../services/session.vue";
import userService from "../../../services/user.vue";
import systemService from "../../../services/system.vue";
import useVuelidate from "@vuelidate/core";
import { required, helpers, sameAs } from "@vuelidate/validators";

export default defineComponent({
  name: "HomePage",
  components: {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonInput,
    IonButtons,
    IonMenuButton,
    IonRow,
    IonCol,
    IonCard,
    IonCardContent,
    IonLabel,
    IonButton,
    IonItem,
    IonIcon,
    IonSpinner,
  },
  setup() {
    return { eyeOutline, eyeOffOutline, v$: useVuelidate() };
  },
  data() {
    return {
      form: {
        email: "",
        code: "",
        password1: "",
        password2: "",
      },
      options: {
        emailForm: true,
        codeForm: false,
        passwordForm: false,
      },
      inputTypePassword1: "password",
      inputTypePassword2: "password",
      spinners: {
        buttonSendEmail: false,
        buttonSendCode: false,
        buttonResetPassword: false,
      },
    };
  },
  beforeRouteEnter(to, from, next) {
    userService()
      .getUserName()
      .then(() => {
        next("/blog");
      })
      .catch(() => {
        next();
      });
  },

  validations() {
    const messageRequired = "Campo requerido";
    return {
      form: {
        password1: {
          required: helpers.withMessage(messageRequired, required),
          minLength: helpers.withMessage(
            "La contraseña debe tener al menos una mayúscula, un numero y tener un tamaño de 8",
            helpers.regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)
          ),
        },
        password2: {
          same: helpers.withMessage(
            "Las contraseñas no coinciden",
            sameAs(this.form.password1)
          ),
        },
      },
    };
  },

  methods: {
    closeComponent() {
      this.$router.push("/login");
    },

    async sendMailResetPassword() {
      this.spinners.buttonSendEmail = true;

      try {
        await sessionService().sendMailResetPassword({
          email: this.form.email,
        });
        this.spinners.buttonSendEmail = false;
        this.options.emailForm = false;
        this.options.codeForm = true;
      } catch (e: any) {
        this.spinners.buttonSendEmail = false;
        console.error(e);
        systemService().openToastErrror(e);
      }
    },

    async presentLoading(message: string) {
      const loading = await loadingController.create({
        cssClass: "loading",
        message,
      });
      return loading;
    },

    async sendCodeResetPassword() {
      this.spinners.buttonSendCode = true;

      const email = this.form.email;
      const code = this.form.code;
      try {
        await sessionService().sendCodeResetPassword({
          email,
          code,
        });
        this.spinners.buttonSendCode = false;
        this.options.codeForm = false;
        this.options.passwordForm = true;
      } catch (e: any) {
        this.spinners.buttonSendCode = false;
        if (e.message == "Code invalid") {
          systemService().openToast({
            message: "Code incorrecto",
            color: "danger",
          });
          return;
        }
        console.error(e.message);
        systemService().openToastErrror(e);
      }
    },

    async resetPassword() {
      this.spinners.buttonResetPassword = true;

      const email = this.form.email;
      const password = this.form.password1;
      try {
        await sessionService().resetPassword({ email, password });
        this.spinners.buttonResetPassword = false;
        this.options.passwordForm = false;
        this.options.emailForm = true;
        systemService().openToast({
          message: "Contraseña restaurada",
          color: "success",
        });
        this.$router.push("/login");
      } catch (e: any) {
        this.spinners.buttonResetPassword = false;
        console.error(e);
        systemService().openToastErrror(e);
      }
    },
  },
});
</script>

<style scoped>
#container {
  text-align: center;

  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
}

#container strong {
  font-size: 20px;
  line-height: 26px;
}

#container p {
  font-size: 16px;
  line-height: 22px;

  color: #8c8c8c;

  margin: 0;
}

#container a {
  text-decoration: none;
}
</style>
