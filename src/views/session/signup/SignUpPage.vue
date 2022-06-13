<template>
  <ion-page>
    <ion-header :translucent="true" class="ion-no-border">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button
            menu="mainMenu"
            :mode="modeDesingElements"
          ></ion-menu-button>
        </ion-buttons>
        <ion-title>Crear cuenta</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <img
        src="https://image.winudf.com/v2/image/Y29tLnNhcmFzLkJlc3RNaW5pbWFsaXN0V2FsbHBhcGVyX3NjcmVlbl81Xzk4dHZtbnNw/screen-5.jpg?h=800&fakeurl=1&type=.jpg"
        class="img-fondo"
        style="opacity: 90%"
      />
      <ion-row class="ion-padding">
        <ion-col size="12">
          <h1 style="color: white !important">Bienvenido</h1>
        </ion-col>
      </ion-row>
      <ion-row class="center center-vertical-card-login">
        <ion-col size="12" size-lg="6" size-xl="4" class="card-form">
          <section>
            <ion-card>
              <ion-card-header>
                <div class="center">
                  <img
                    src="../../../../public/assets/otros/user.png"
                    alt=""
                    class="imagen-usuario"
                  />
                </div>
              </ion-card-header>

              <ion-card-content>
                <section>
                  <form>
                    <ion-item lines="inset">
                      <ion-icon
                        :icon="manOutline"
                        slot="start"
                        class="item-icon"
                      ></ion-icon>
                      <ion-label position="floating">Nombre</ion-label>
                      <ion-input
                        v-model="(v$.form as any).name.$model"
                        autocomplete="name"
                      ></ion-input>
                    </ion-item>
                    <div
                      v-for="(error, index) of (v$.form as any).name.$errors"
                      :key="index"
                    >
                      <div class="error">{{ error.$message }}</div>
                    </div>

                    <ion-item lines="inset">
                      <ion-icon
                        :icon="personOutline"
                        slot="start"
                        class="item-icon"
                      ></ion-icon>
                      <ion-label position="floating">Usuario</ion-label>
                      <ion-input
                        v-model="(v$.form as any).user.$model"
                      ></ion-input>
                    </ion-item>
                    <div
                      v-for="(error, index) of (v$.form as any).user.$errors"
                      :key="index"
                    >
                      <div class="error">{{ error.$message }}</div>
                    </div>

                    <ion-item lines="inset">
                      <ion-icon
                        :icon="mailOpenOutline"
                        slot="start"
                        class="item-icon"
                      ></ion-icon>
                      <ion-label position="floating"
                        >Correo electrónico</ion-label
                      >
                      <ion-input
                        v-model="(v$.form as any).email.$model"
                        autocomplete="email"
                      ></ion-input>
                    </ion-item>
                    <div
                      v-for="(error, index) of (v$.form as any).email.$errors"
                      :key="index"
                    >
                      <div class="error">{{ error.$message }}</div>
                    </div>

                    <ion-item lines="inset">
                      <ion-icon
                        :icon="keyOutline"
                        slot="start"
                        class="item-icon"
                      ></ion-icon>
                      <ion-label position="floating">Contraseña</ion-label>
                      <ion-input
                        v-model="(v$.form as any).password.$model"
                        :type="inputTypePassword1"
                        autocomplete="password"
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
                      v-for="(error, index) of (v$.form as any).password.$errors"
                      :key="index"
                    >
                      <div class="error">{{ error.$message }}</div>
                    </div>

                    <ion-item lines="inset">
                      <ion-icon
                        :icon="keyOutline"
                        slot="start"
                        class="item-icon"
                      ></ion-icon>
                      <ion-label position="floating"
                        >Repite contraseña</ion-label
                      >
                      <ion-input
                        v-model="(v$.form as any).password2.$model"
                        :type="inputTypePassword2"
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
                  </form>
                </section>

                <section>
                  <div class="center">
                    <ion-item lines="none">
                      <ion-button
                        fill="clear"
                        v-on:click="register()"
                        :disabled="(v$.form as any).$invalid||spinners.buttonSignup"
                      >
                        <ion-label v-if="spinners.buttonSignup == false">
                          Registrar</ion-label
                        >
                        <ion-spinner
                          name="crescent"
                          v-if="spinners.buttonSignup"
                          color="primary"
                        ></ion-spinner>
                      </ion-button>
                    </ion-item>
                  </div>
                </section>
              </ion-card-content>
            </ion-card>
          </section>

          <section>
            <div class="center">
              <ion-item lines="none">
                <ion-button
                  @click="login()"
                  fill="clear"
                  :disabled="spinners.buttonLogin"
                >
                  <ion-label v-if="spinners.buttonLogin == false"
                    >¿Ya tienes cuenta?</ion-label
                  >
                  <ion-spinner
                    name="crescent"
                    v-if="spinners.buttonLogin"
                    color="primary"
                  ></ion-spinner>
                </ion-button>
              </ion-item>
            </div>
          </section>
        </ion-col>
      </ion-row>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import {
  alertController,
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
  IonCardHeader,
  IonItem,
  IonLabel,
  IonButton,
  IonIcon,
  isPlatform,
} from "@ionic/vue";
import { defineComponent } from "vue";
import sessionService from "../../../services/session.vue";
import {
  eyeOutline,
  eyeOffOutline,
  manOutline,
  personOutline,
  mailOpenOutline,
  keyOutline,
} from "ionicons/icons";
import useVuelidate from "@vuelidate/core";
import { required, email, helpers, alpha, sameAs } from "@vuelidate/validators";
import userService from "../../../services/user.vue";
import systemService from "../../../services/system.vue";

export default defineComponent({
  name: "RegisterPage",
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
    IonCardHeader,
    IonItem,
    IonLabel,
    IonButton,
    IonIcon,
  },

  setup() {
    const modeDesingElements = isPlatform("ios") ? "ios" : "md";
    return {
      eyeOutline,
      eyeOffOutline,
      v$: useVuelidate(),
      manOutline,
      personOutline,
      mailOpenOutline,
      keyOutline,
      modeDesingElements,
    };
  },

  data() {
    return {
      inputTypePassword1: "password",
      inputTypePassword2: "password",
      form: {
        user: "",
        name: "",
        email: "",
        password: "",
        password2: "",
      },
      spinners: {
        buttonSignup: false,
        buttonLogin: false,
      },
    };
  },

  validations() {
    const messageRequired = "Campo requerido";
    const messageAlpha = "Solamente puede contener texto";
    return {
      form: {
        name: {
          required: helpers.withMessage(messageRequired, required),
          alpha: helpers.withMessage(
            messageAlpha,
            helpers.regex(/^[a-zA-Z ]*$/)
          ),
        },
        user: {
          required: helpers.withMessage(messageRequired, required),
          space: helpers.withMessage(messageAlpha, helpers.regex(/^\S*$/)),
        },
        email: {
          required: helpers.withMessage(messageRequired, required),
          email: helpers.withMessage("Correo no valido", email),
        },
        password: {
          required: helpers.withMessage(messageRequired, required),
          minLength: helpers.withMessage(
            "La contraseña debe tener al menos una mayúscula, un numero y tener un tamaño de 8",
            helpers.regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)
          ),
        },
        password2: {
          same: helpers.withMessage(
            "Las contraseñas no coinciden",
            sameAs(this.form.password)
          ),
        },
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

  methods: {
    async register() {
      this.spinners.buttonSignup = true;

      const name = this.form.name;
      const user = this.form.user;
      const email = this.form.email.replace(/\s+/g, "");
      const password = this.form.password;
      try {
        await sessionService().userRegister({
          name,
          user,
          email,
          password,
        });
        this.spinners.buttonSignup = false;
        this.alertConfirmaciónEmail();
        this.$router.push("/login");
        this.clearInputs();
      } catch (e: any) {
        this.spinners.buttonSignup = false;
        if (e.message == "The email has already been selected") {
          systemService().openToast({
            message: "Correo ya en uso",
            color: "warning",
          });
          return;
        }
        if (e.message == "The user has already been selected") {
          systemService().openToast({
            message: "Usuario ya en uso",
            color: "warning",
          });
          return;
        }
        console.error(e);
        systemService().openToastErrror(e);
      }
    },

    clearInputs() {
      this.form.name = "";
      this.form.user = "";
      this.form.password = "";
      this.form.password2 = "";
      this.form.email = "";
    },

    async alertConfirmaciónEmail() {
      const alert = await alertController.create({
        header: "Alerta",
        subHeader: "Confirmación",
        message:
          "Hemos enviado un correo electrónico a <b>" +
          this.form.email +
          "</b> con un enlace para verificar tu identidad.",
        buttons: [
          {
            text: "Continuar",
            handler: () => {
              this.$router.push("/login");
            },
          },
        ],
      });

      await alert.present();
    },

    async login() {
      this.spinners.buttonLogin = true;
      await this.$router.push("/login");
      this.spinners.buttonLogin = false;
    },
  },
});
</script>

<style scoped>
.center {
  display: flex;
  justify-content: center;
}
.imagen-usuario {
  border-radius: 50%;
  width: 90px;
}
.center-vertical-card-login {
  align-items: center;
  height: 83vh;
}
.img-fondo {
  width: 100%;
  height: 50%;

  position: absolute;
}
.card-form {
  margin-bottom: 18vh;
}

@media only screen and (min-width: 768px) {
  .img-fondo {
    width: 100%;
    height: 40%;

    position: absolute;
  }
  .card-form {
    margin-top: 0;
  }
}
@media only screen and (min-width: 992px) {
  .img-fondo {
    width: 100%;
    height: auto;
    position: absolute;
  }
  .card-form {
    margin-top: 2vh;
  }
}
@media only screen and (min-width: 1200px) {
  .img-fondo {
    width: 100%;
    height: 50%;

    position: absolute;
  }
  .card-form {
    margin-top: 0;
  }
}
.options {
  color: var(--accent-color);
}
</style>
