<template>
  <ion-page class="page-container">
    <ion-header class="ion-no-border">
      <ion-toolbar>
        <ion-title>Registro</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <section class="center">
        <ion-card class="element-post-selected">
          <ion-card-content>
            <div class="center">
              <img
                src="@/assets/otros/user.png"
                alt=""
                class="imagen-usuario"
              />
            </div>

            <section>
              <SignUpFormComponent
                ref="signUpFormComponentRef"
                @form-status="formStatus = $event"
                @enter-pressed="
                  register((signUpFormComponentRef as any).getData())
                "
              />
            </section>

            <!-- button send -->
            <section>
              <ion-button
                fill="clear"
                :disabled="formStatus == false || spinners.buttonSignup"
                expand="full"
                @click="register((signUpFormComponentRef as any).getData())"
              >
                <ion-label
                  v-if="spinners.buttonSignup == false || v$.form.$invalid"
                >
                  Registrar</ion-label
                >
                <ion-spinner
                  v-if="spinners.buttonSignup"
                  name="crescent"
                  color="primary"
                ></ion-spinner>
              </ion-button>
            </section>
          </ion-card-content>
        </ion-card>
      </section>

      <section>
        <div class="center">
          <ion-button
            fill="clear"
            :disabled="spinners.buttonLogin"
            expand="full"
            size="small"
            @click="login()"
          >
            <ion-label v-if="spinners.buttonLogin == false"
              >¿Ya tienes cuenta?</ion-label
            >
            <ion-spinner
              v-if="spinners.buttonLogin"
              name="crescent"
              color="primary"
            ></ion-spinner>
          </ion-button>
        </div>
      </section>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonPage,
  IonContent,
  alertController,
  IonInput,
  IonCard,
  IonItem,
  IonLabel,
  IonButton,
  IonIcon,
  isPlatform,
} from "@ionic/vue";
import { ref } from "vue";
import { userRegister } from "../../../services/session";
import {
  eyeOutline,
  eyeOffOutline,
  manOutline,
  personOutline,
  mailOpenOutline,
  keyOutline,
} from "ionicons/icons";
import useVuelidate from "@vuelidate/core";
import {
  required,
  email,
  helpers,
  sameAs,
  minLength,
} from "@vuelidate/validators";
import { openToast } from "../../../services/system";
import { useSystem } from "../../../composables/useSystem";
import { useRouter } from "vue-router";

// components
import SignUpFormComponent from "@/forms/SignUpFormComponent.vue";

const router = useRouter();

const inputTypePassword1 = ref("password" as "text" | "password");
const inputTypePassword2 = ref("password" as "text" | "password");
const form = ref({
  user: "",
  name: "",
  email: "",
  password: "",
  password2: "",
});
const spinners = ref({
  buttonSignup: false,
  buttonLogin: false,
});

// validation
const samePassword = () => form.value.password == form.value.password2;

const messageError = {
  required: "Campo requerido",
  alpha: "Solamente puede contener texto",
};
const rules = {
  form: {
    name: {
      required: helpers.withMessage(messageError.required, required),
      alpha: helpers.withMessage(
        messageError.alpha,
        helpers.regex(/^[a-zA-Z ]*$/)
      ),
    },
    user: {
      required: helpers.withMessage(messageError.required, required),
      space: helpers.withMessage(messageError.alpha, helpers.regex(/^\S*$/)),
    },
    email: {
      required: helpers.withMessage(messageError.required, required),
      email: helpers.withMessage("Correo no valido", email),
    },
    password: {
      required: helpers.withMessage(messageError.required, required),
      minLength: helpers.withMessage(
        "La contraseña debe tener al menos 8 caracteres",
        minLength(8)
      ),
      regexLower: helpers.withMessage(
        "La contraseña debe contener al menos una letra minúscula",
        helpers.regex(/[a-z]/)
      ),
      regexUpper: helpers.withMessage(
        "La contraseña debe contener al menos una letra mayúscula",
        helpers.regex(/[A-Z]/)
      ),
      regexNumber: helpers.withMessage(
        "La contraseña debe contener al menos un número",
        helpers.regex(/[0-9]/)
      ),
      regexSpecial: helpers.withMessage(
        "La contraseña debe contener al menos un carácter especial",
        helpers.regex(/[@$!%*?&]/)
      ),
    },
    password2: {
      required: helpers.withMessage(messageError.required, required),
      same: helpers.withMessage("Las contraseñas no coinciden", samePassword),
    },
  },
};
const v$ = useVuelidate(rules, { form });
const signUpFormComponentRef = ref(null);
const formStatus = ref(false);

// functions
async function register(params: {
  name: string;
  user: string;
  email: string;
  password: string;
}) {
  const { name, user, password } = params;
  let { email } = params;
  spinners.value.buttonSignup = true;

  email = email.trim();
  try {
    await userRegister({
      name,
      user,
      email,
      password,
    });
    spinners.value.buttonSignup = false;
    alertConfirmaciónEmail();
    router.push("/login");
    clearInputs();
  } catch (e: any) {
    spinners.value.buttonSignup = false;
    if (e.message == "The email has already been selected") {
      openToast({
        message: "Correo ya en uso",
        color: "warning",
      });
      return;
    }
    if (e.message == "The user has already been selected") {
      openToast({
        message: "Usuario ya en uso",
        color: "warning",
      });
      return;
    }
    console.error(e);
    useSystem().openToastError(e);
  }
}

function clearInputs() {
  form.value.name = "";
  form.value.user = "";
  form.value.password = "";
  form.value.password2 = "";
  form.value.email = "";
}

async function alertConfirmaciónEmail() {
  const alert = await alertController.create({
    header: "Alerta",
    subHeader: "Confirmación",
    message:
      "Hemos enviado un correo electrónico a <b>" +
      form.value.email +
      "</b> con un enlace para verificar tu identidad.",
    buttons: [
      {
        text: "Continuar",
        handler: () => {
          router.push("/login");
        },
      },
    ],
  });

  await alert.present();
}

async function login() {
  spinners.value.buttonLogin = true;
  await router.push("/login");
  spinners.value.buttonLogin = false;
}
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
.element-post-selected {
  border: 1px solid var(--ion-color-primary);
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
