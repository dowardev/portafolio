<template>
  <ion-page class="page-container">
    <ion-header class="ion-no-border" mode="ios">
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
                  v-if="spinners.buttonSignup == false || formStatus == false"
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
  IonCard,
  IonLabel,
  IonButton,
} from "@ionic/vue";
import { ref } from "vue";
import { useRouter } from "vue-router";

// controllers
import SystemController from "@/controllers/systemController";
import UserController from "@/controllers/userController";
const systemController = new SystemController();
const userController = new UserController();

// components
import SignUpFormComponent from "@/forms/SignUpFormComponent.vue";

const router = useRouter();

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
    await userController.createUserAccount({
      name,
      user,
      email,
      password,
    });
    spinners.value.buttonSignup = false;
    await alertConfirmaciónEmail({ email });
    await router.push("/login");
    clearInputs();
  } catch (e: any) {
    spinners.value.buttonSignup = false;
    if (e.message == "The email has already been selected") {
      await systemController.presentToast({
        message: "Correo ya en uso",
        color: "warning",
      });
      return;
    }
    if (e.message == "The user has already been selected") {
      await systemController.presentToast({
        message: "Usuario ya en uso",
        color: "warning",
      });
      return;
    }
    console.error(e);
    systemController.openToastError(e);
  }
}

function clearInputs() {
  form.value.name = "";
  form.value.user = "";
  form.value.password = "";
  form.value.password2 = "";
  form.value.email = "";
}

async function alertConfirmaciónEmail(params: { email: string }) {
  const { email } = params;

  const alert = await alertController.create({
    header: "Alerta",
    subHeader: "Confirmación",
    message: `Hemos enviado un correo electrónico a
      ${email}
       con un enlace para verificar tu identidad.`,
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
