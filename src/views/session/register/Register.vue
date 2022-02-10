<template>
  <ion-page>
    <ion-header class="ion-no-border" mode="ios" :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button v-on:click="$router.go(-1)">
            <ion-icon :icon="chevronBackOutline"></ion-icon>
          </ion-button>
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
          <h1 style="color: white">Bienvenido</h1>
        </ion-col>
      </ion-row>
      <ion-row class="center center-vertical-card-login">
        <ion-col size="12" size-lg="6" size-xl="4" class="card-form">
          <ion-card>
            <ion-card-header>
              <div class="center">
                <img
                  src="../../../../public/assets/otros/user.svg"
                  alt=""
                  class="imagen-usuario"
                />
              </div>
            </ion-card-header>

            <ion-card-content>
              <form>
                <ion-item>
                  <ion-label position="floating">Nombre</ion-label>
                  <ion-input
                    v-model="v$.form['name'].$model"
                    autocomplete="name"
                  ></ion-input>
                </ion-item>
                <div
                  v-for="(error, index) of v$.form['name'].$errors"
                  :key="index"
                >
                  <div class="error">{{ error.$message }}</div>
                </div>

                <ion-item>
                  <ion-label position="floating">Usuario</ion-label>
                  <ion-input v-model="v$.form['user'].$model"></ion-input>
                </ion-item>
                <div
                  v-for="(error, index) of v$.form['user'].$errors"
                  :key="index"
                >
                  <div class="error">{{ error.$message }}</div>
                </div>

                <ion-item>
                  <ion-label position="floating">Correo electrónico</ion-label>
                  <ion-input
                    v-model="v$.form['email'].$model"
                    autocomplete="email"
                  ></ion-input>
                </ion-item>
                <div
                  v-for="(error, index) of v$.form['email'].$errors"
                  :key="index"
                >
                  <div class="error">{{ error.$message }}</div>
                </div>

                <ion-item>
                  <ion-label position="floating">Contraseña</ion-label>
                  <ion-input
                    v-model="v$.form['password'].$model"
                    :type="inputTypePassword1"
                    autocomplete="password"
                  ></ion-input>
                  <ion-button
                    slot="end"
                    fill="clear"
                    v-if="inputTypePassword1 == 'text'"
                    v-on:click="changeInputTypePassword1('password')"
                    style="margin-top: 20px"
                  >
                    <ion-icon :icon="eyeOffOutline"></ion-icon>
                  </ion-button>
                  <ion-button
                    slot="end"
                    fill="clear"
                    v-if="inputTypePassword1 == 'password'"
                    v-on:click="changeInputTypePassword1('text')"
                    style="margin-top: 20px"
                  >
                    <ion-icon :icon="eyeOutline"></ion-icon>
                  </ion-button>
                </ion-item>
                <div
                  v-for="(error, index) of v$.form['password'].$errors"
                  :key="index"
                >
                  <div class="error">{{ error.$message }}</div>
                </div>

                <ion-item>
                  <ion-label position="floating">Repite contraseña</ion-label>
                  <ion-input
                    v-model="v$.form['password2'].$model"
                    :type="inputTypePassword2"
                  ></ion-input>
                  <ion-button
                    slot="end"
                    fill="clear"
                    v-if="inputTypePassword2 == 'text'"
                    v-on:click="changeInputTypePassword2('password')"
                    style="margin-top: 20px"
                  >
                    <ion-icon :icon="eyeOffOutline"></ion-icon>
                  </ion-button>
                  <ion-button
                    slot="end"
                    fill="clear"
                    v-if="inputTypePassword2 == 'password'"
                    v-on:click="changeInputTypePassword2('text')"
                    style="margin-top: 20px"
                  >
                    <ion-icon :icon="eyeOutline"></ion-icon>
                  </ion-button>
                </ion-item>
                <div
                  v-for="(error, index) of v$.form['password2'].$errors"
                  :key="index"
                >
                  <div class="error">{{ error.$message }}</div>
                </div>
              </form>

              <ion-row>
                <ion-col size="12">
                  <ion-button
                    expand="block"
                    fill="clear"
                    v-on:click="register()"
                    :disabled="v$.form.$invalid"
                  >
                    Registrar
                  </ion-button>
                </ion-col>
              </ion-row>
            </ion-card-content>
          </ion-card>
          <ion-row>
            <ion-col size="12" class="center">
              <small style="cursor: pointer">
                <ion-text color="primary" v-on:click="$router.push('/login')">
                  ¿Ya tienes cuenta?</ion-text
                >
              </small>
            </ion-col>
          </ion-row>
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
  toastController,
  IonInput,
  loadingController,
} from "@ionic/vue";
import { defineComponent } from "vue";
import session from "../../../services/session.vue";
import { eyeOutline, eyeOffOutline, chevronBackOutline } from "ionicons/icons";
import useVuelidate from "@vuelidate/core";
import { required, email, helpers, alpha, sameAs } from "@vuelidate/validators";

export default defineComponent({
  name: "RegisterPage",
  components: {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonInput,
  },
  setup() {
    const { userRegister } = session();
    return {
      userRegister,
      eyeOutline,
      eyeOffOutline,
      chevronBackOutline,
      v$: useVuelidate(),
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
    };
  },
  validations() {
    const messageRequired = "Campo requerido";
    const messageAlpha = "Solamente puede contener texto";
    return {
      form: {
        name: {
          required: helpers.withMessage(messageRequired, required),
          alpha: helpers.withMessage(messageAlpha, alpha),
        },
        user: {
          required: helpers.withMessage(messageRequired, required),
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
  methods: {
    async register() {
      const loading = await this.presentLoading("Creando cuenta");
      loading.present();
      const email = this.form.email.replace(/\s+/g, "");
      this.userRegister(
        this.form.name,
        this.form.user,
        email,
        this.form.password
      )
        .then(() => {
          loading.dismiss();
          // this.alertConfirmaciónEmail();
          this.$router.push("/register");
          this.clearInputs();
          this.presentToast("Registrado correctamente", "success");
        })
        .catch((e) => {
          loading.dismiss();
          if (
            e.response.data.errors.email == "The email has already been taken."
          ) {
            this.presentToast("Correo ya en uso", "danger");
          }
        });
    },
    async presentToast(message: string, color: string) {
      const toast = await toastController.create({
        message,
        duration: 3000,
        mode: "ios",
        color,
      });
      toast.present();
    },
    clearInputs() {
      this.form.name = "";
      this.form.user = "";
      this.form.password = "";
      this.form.password2 = "";
      this.form.email = "";
    },
    changeInputTypePassword1(type: string) {
      this.inputTypePassword1 = type;
    },
    changeInputTypePassword2(type: string) {
      this.inputTypePassword2 = type;
    },
    async alertConfirmaciónEmail() {
      const alert = await alertController.create({
        cssClass: "my-custom-class",
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
              this.$router.push("/session");
            },
          },
        ],
      });

      await alert.present();
    },
    async presentLoading(message: string) {
      const loading = await loadingController.create({
        cssClass: "loadingClass ",
        message,
      });

      // await loading.present();
      return loading;
    },
  },
});
</script>

<style scoped>
.error {
  color: red;
}
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
</style>
