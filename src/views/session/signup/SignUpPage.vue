<template>
  <section class="center">
    <ion-card class="element-post-selected">
      <ion-card-content>
        <div class="center">
          <img
            src="../../../assets/otros/user.png"
            alt=""
            class="imagen-usuario"
          />
        </div>

        <section>
          <form>
            <!-- name -->
            <ion-item lines="inset" class="transparent">
              <ion-icon
                slot="start"
                :icon="manOutline"
                class="item-icon"
              ></ion-icon>

              <ion-input
                autocomplete="name"
                label-placement="floating"
                label="Nombre"
                :value="form.name"
                @ion-input="form.name = $event.detail.value as any"
                @click="v$.name.$touch()"
              ></ion-input>
            </ion-item>

            <div
              v-for="(error, index) of (v$ as any).name.$errors"
              :key="index"
            >
              <div class="error">{{ error.$message }}</div>
            </div>

            <!-- user -->
            <ion-item lines="inset" class="transparent">
              <ion-icon
                slot="start"
                :icon="personOutline"
                class="item-icon"
              ></ion-icon>

              <ion-input
                label-placement="floating"
                label="Usuario"
                :value="form.user"
                @ion-input="form.user = $event.detail.value as any"
                @click="v$.user.$touch()"
              ></ion-input>
            </ion-item>

            <div
              v-for="(error, index) of (v$ as any).user.$errors"
              :key="index"
            >
              <div class="error">{{ error.$message }}</div>
            </div>

            <!-- email -->
            <ion-item lines="inset" class="transparent">
              <ion-icon
                slot="start"
                :icon="mailOpenOutline"
                class="item-icon"
              ></ion-icon>

              <ion-input
                autocomplete="email"
                label-placement="floating"
                label="Correo electrónico"
                :value="form.email"
                @ion-input="form.email = $event.detail.value as any"
                @click="v$.email.$touch()"
              ></ion-input>
            </ion-item>

            <div
              v-for="(error, index) of (v$ as any).email.$errors"
              :key="index"
            >
              <div class="error">{{ error.$message }}</div>
            </div>

            <!-- password -->
            <ion-item lines="inset" class="transparent">
              <ion-icon
                slot="start"
                :icon="keyOutline"
                class="item-icon"
              ></ion-icon>

              <ion-input
                label-placement="floating"
                label="Contraseña"
                :value="form.password"
                :type="inputTypePassword1"
                @ion-input="form.password = $event.detail.value as any"
                @click="v$.password.$touch()"
              ></ion-input>

              <ion-button
                v-if="inputTypePassword1 == 'text'"
                slot="end"
                fill="clear"
                style="margin-top: 20px"
                @click="inputTypePassword1 = 'password'"
              >
                <ion-icon :icon="eyeOffOutline"></ion-icon>
              </ion-button>

              <ion-button
                v-if="inputTypePassword1 == 'password'"
                slot="end"
                fill="clear"
                style="margin-top: 20px"
                @click="inputTypePassword1 = 'text'"
              >
                <ion-icon :icon="eyeOutline"></ion-icon>
              </ion-button>
            </ion-item>

            <div
              v-for="(error, index) of (v$ as any).password.$errors"
              :key="index"
            >
              <div class="error">{{ error.$message }}</div>
            </div>

            <!-- password2 -->
            <ion-item lines="inset" class="transparent">
              <ion-icon
                slot="start"
                :icon="keyOutline"
                class="item-icon"
              ></ion-icon>

              <ion-input
                label-placement="floating"
                label="Repite contraseña"
                :value="form.password2"
                :type="inputTypePassword2"
                @ion-input="form.password2 = $event.detail.value as any"
                @click="v$.password2.$touch()"
              ></ion-input>

              <ion-button
                v-if="inputTypePassword2 == 'text'"
                slot="end"
                fill="clear"
                style="margin-top: 20px"
                @click="inputTypePassword2 = 'password'"
              >
                <ion-icon :icon="eyeOffOutline"></ion-icon>
              </ion-button>

              <ion-button
                v-if="inputTypePassword2 == 'password'"
                slot="end"
                fill="clear"
                style="margin-top: 20px"
                @click="inputTypePassword2 = 'text'"
              >
                <ion-icon :icon="eyeOutline"></ion-icon>
              </ion-button>
            </ion-item>

            <div
              v-for="(error, index) of (v$ as any).password2.$errors"
              :key="index"
            >
              <div class="error">{{ error.$message }}</div>
            </div>
          </form>
        </section>

        <section>
          <ion-button
            fill="clear"
            :disabled="(v$ as any).$invalid || spinners.buttonSignup"
            expand="full"
            @click="register()"
          >
            <ion-label v-if="spinners.buttonSignup == false">
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
</template>

<script setup lang="ts">
import {
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
import { required, email, helpers, sameAs } from "@vuelidate/validators";
import { openToast } from "../../../services/system";
import { useSystem } from "../../../composables/useSystem";
import { useRouter } from "vue-router";

const router = useRouter();

const inputTypePassword1 = ref("password" as "text" | "password");
const inputTypePassword2 = ref("password" as "text" | "password");
const form = ref({
  user: "ssj",
  name: "ww",
  email: "d@d.com",
  password: "smartwordlM4",
  password2: "smartwordlM4",
});
const spinners = ref({
  buttonSignup: false,
  buttonLogin: false,
});

const messageError = {
  required: "Campo requerido",
  alpha: "Solamente puede contener texto",
};
const rules = {
  name: {
    required: helpers.withMessage(messageError.required, required),
    alpha: helpers.withMessage(
      messageError.alpha,
      helpers.regex(/^[a-zA-Z ]*$/),
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
      "La contraseña debe tener al menos una mayúscula, un numero y tener un tamaño de 8",
      helpers.regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/),
    ),
  },
  password2: {
    required: helpers.withMessage(messageError.required, required),
    same: helpers.withMessage(
      "Las contraseñas no coinciden",
      sameAs(form.value.password),
    ),
  },
};
const v$ = useVuelidate(rules, form);

// functions
async function register() {
  spinners.value.buttonSignup = true;

  const name = form.value.name;
  const user = form.value.user;
  const email = form.value.email.replace(/\s+/g, "");
  const password = form.value.password;
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
