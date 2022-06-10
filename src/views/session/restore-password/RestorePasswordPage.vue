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
          <ion-menu-button
            menu="mainMenu"
            :mode="modeDesingElements"
          ></ion-menu-button>
        </ion-buttons>
        <ion-title>{{ pageTitle }}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-header collapse="condense" mode="ios">
        <ion-toolbar>
          <ion-title size="large">{{ pageTitle }}</ion-title>
        </ion-toolbar>
      </ion-header>

      <ion-row class="center">
        <ion-col size="12" size-md="8" size-lg="6" size-xl="4">
          <ion-card>
            <ion-card-content>
              <ion-item lines="inset">
                <ion-icon
                  :icon="keyOutline"
                  class="item-icon"
                  slot="start"
                ></ion-icon>
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

              <ion-item lines="inset">
                <ion-icon
                  :icon="keyOutline"
                  class="item-icon"
                  slot="start"
                ></ion-icon>
                <ion-label position="floating">Repite la contraseña</ion-label>
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

              <ion-button
                expand="full"
                fill="clear"
                :disabled="spinners.buttonResetPassword || v$.form.$invalid"
                @click="resetPassword()"
                ><ion-label v-if="spinners.buttonResetPassword == false"
                  >Enviar</ion-label
                >
                <ion-spinner
                  name="crescent"
                  v-if="spinners.buttonResetPassword"
                  color="primary"
                ></ion-spinner>
              </ion-button>
            </ion-card-content>
          </ion-card>
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
  isPlatform,
} from "@ionic/vue";
import {
  eyeOutline,
  eyeOffOutline,
  mailOpenOutline,
  keyOutline,
  shieldOutline,
} from "ionicons/icons";
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
    const modeDesingElements = isPlatform("ios") ? "ios" : "md";
    return {
      eyeOutline,
      eyeOffOutline,
      v$: useVuelidate(),
      mailOpenOutline,
      keyOutline,
      shieldOutline,
      modeDesingElements,
      pageTitle: "Restablecer contraseña",
    };
  },

  data() {
    return {
      form: {
        email: this.$route.params.email as string,
        code: this.$route.params.code as string,
        password1: "",
        password2: "",
      },
      inputTypePassword1: "password",
      inputTypePassword2: "password",
      spinners: {
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

    async presentLoading(message: string) {
      const loading = await loadingController.create({
        cssClass: "loading",
        message,
      });
      return loading;
    },

    async resetPassword() {
      this.spinners.buttonResetPassword = true;

      const code = this.form.code;
      const email = this.form.email;
      const password = this.form.password1;

      try {
        const response = await sessionService().resetPassword({
          code,
          email,
          password,
        });

        systemService().openToast({
          message: "Contraseña restaurada",
        });

        this.$router.push("/login");
        this.spinners.buttonResetPassword = false;
      } catch (e: any) {
        this.spinners.buttonResetPassword = false;
        if (e.message == "Code invalid") {
          systemService().openToast({
            message: "Codigo invalido",
            color: "warning",
          });
        } else {
          console.error(e);
          systemService().openToastErrror(e);
        }
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
