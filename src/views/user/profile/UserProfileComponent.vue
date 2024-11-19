<template>
  <!-- profile -->
  <section>
    <ion-list class="transparent">
      <ion-list-header>
        <ion-label>Información básica</ion-label>
      </ion-list-header>

      <ion-row>
        <ion-modal
          trigger="trigger-basicCardInformation"
          :breakpoints="[0.1, 0.5, 1]"
          :initial-breakpoint="0.5"
        >
          <ion-content class="ion-padding">
            <ul
              v-for="item in information[0].basicCardInformation"
              :key="item.title"
            >
              <li>
                <span class="important-text"> {{ item.title }} </span>
                {{ item.content }}
              </li>
            </ul>
          </ion-content>
        </ion-modal>

        <ion-col
          size-xs="12"
          size-md="12"
          size-lg="6"
          size-xl="4"
          class="ion-hide-lg-down"
        >
          <ul
            v-for="item in information[0].basicCardInformation"
            :key="item.title"
          >
            <li>
              <span class="important-text"> {{ item.title }} </span>
              {{ item.content }}
            </li>
          </ul>
        </ion-col>

        <!-- user fields -->
        <ion-col
          size-xs="12"
          size-md="12"
          size-lg="6"
          size-xl="4"
          offset-xl="1"
        >
          <ion-card
            :class="{
              'element-post-selected': profileCardSelected,
              'element-post-no-selected': !profileCardSelected,
            }"
            @mouseenter="profileCardSelected = true"
            @mouseleave="profileCardSelected = false"
          >
            <ion-card-header>
              <div class="card-header">
                <div class="card-title-container">
                  <ion-card-title style="top: 9px">
                    Perfil de usuario
                  </ion-card-title>
                </div>
                <div>
                  <ion-button
                    id="trigger-basicCardInformation"
                    fill="clear"
                    class="ion-hide-lg-up"
                  >
                    <ion-icon :icon="informationCircleOutline"></ion-icon>
                  </ion-button>
                </div>
              </div>
            </ion-card-header>

            <ion-card-content>
              <!-- img -->
              <div class="center">
                <img
                  :src="userImage"
                  style="
                    width: 90px;
                    height: 90px;
                    border-radius: 50%;
                    cursor: pointer;
                  "
                  @click="($refs as any).inputUserImage.click()"
                />
              </div>
              <ion-spinner
                v-if="spinners.uploadImage == true"
                name="crescent"
              ></ion-spinner>
              <input
                ref="inputUserImage"
                accept="image/*"
                type="file"
                style="display: none"
                :disabled="spinners.uploadImage == true"
                @change="uploadUserImage($event)"
              />

              <!-- name -->
              <ion-row>
                <ion-col>
                  <ion-input
                    label="Nombre"
                    label-placement="stacked"
                    type="text"
                    autocomplete="name"
                    fill="outline"
                    :value="form.name"
                    :error-text="v$.form.name.$errors[0]?.$message.toString()"
                    :class="{
                      'ion-invalid':
                        v$.form.name.$invalid && v$.form.name.$dirty,
                      'ion-touched': v$.form.name.$dirty,
                    }"
                    @ion-input="form.name = $event.detail.value || ''"
                    @click="v$.form.name.$touch()"
                  >
                    <ion-icon slot="start" :icon="manOutline"></ion-icon>
                  </ion-input>
                </ion-col>
              </ion-row>

              <!-- user -->
              <ion-row>
                <ion-col>
                  <ion-input
                    label-placement="stacked"
                    autocomplete="username"
                    fill="outline"
                    label="Usuario"
                    type="text"
                    :value="form.user"
                    :error-text="v$.form.user.$errors[0]?.$message.toString()"
                    :class="{
                      'ion-invalid':
                        v$.form.user.$invalid && v$.form.user.$dirty,
                      'ion-touched': v$.form.user.$dirty,
                    }"
                    @ion-input="form.user = $event.detail.value!.toString()"
                    @click="v$.form.user.$touch()"
                  >
                    <ion-icon
                      slot="start"
                      :icon="personOutline"
                      class="item-icon"
                    ></ion-icon>
                  </ion-input>
                </ion-col>
              </ion-row>

              <!-- email -->
              <ion-row>
                <ion-col>
                  <ion-input
                    label-placement="stacked"
                    fill="outline"
                    label="Correo electrónico"
                    type="email"
                    autocomplete="email"
                    pattern="email"
                    inputmode="email"
                    :value="form.email"
                    :error-text="v$.form.email.$errors[0]?.$message.toString()"
                    :class="{
                      'ion-invalid':
                        v$.form.email.$invalid && v$.form.email.$dirty,
                      'ion-touched': v$.form.email.$dirty,
                    }"
                    @ion-input="form.email = $event.detail.value!.toString()"
                    @click="v$.form.email.$touch()"
                  >
                    <ion-icon
                      slot="start"
                      :icon="mailOpenOutline"
                      class="item-icon"
                    ></ion-icon>
                  </ion-input>
                </ion-col>
              </ion-row>

              <!-- button -->
              <ion-row>
                <ion-col>
                  <ion-button
                    fill="clear"
                    :disabled="(v$ as any).form.$invalid"
                    expand="full"
                    @click="saveUserData()"
                  >
                    <ion-spinner v-if="spinners.saveUserData" name="crescent">
                    </ion-spinner>
                    <ion-label v-if="!spinners.saveUserData">
                      Guardar
                    </ion-label>
                  </ion-button>
                </ion-col>
              </ion-row>
            </ion-card-content>
          </ion-card>
        </ion-col>
      </ion-row>
    </ion-list>
  </section>

  <!-- account -->
  <section>
    <ion-list class="transparent">
      <ion-list-header>
        <ion-label>Cuenta</ion-label>
      </ion-list-header>

      <ion-row>
        <ion-modal
          trigger="trigger-cardDeleteAccount"
          :breakpoints="[0.1, 0.5, 1]"
          :initial-breakpoint="0.5"
        >
          <ion-content class="ion-padding">
            <ul
              v-for="item in information[0].cardDeleteAccount"
              :key="item.content"
            >
              <li>{{ item.content }}</li>
            </ul>
          </ion-content>
        </ion-modal>

        <ion-col
          size-xs="12"
          size-md="12"
          size-lg="6"
          size-xl="4"
          class="ion-hide-lg-down"
        >
          <ul
            v-for="item in information[0].cardDeleteAccount"
            :key="item.content"
          >
            <li>{{ item.content }}</li>
          </ul>
        </ion-col>

        <ion-col
          size-xs="12"
          size-md="12"
          size-lg="6"
          size-xl="4"
          offset-xl="1"
        >
          <ion-card
            :class="{
              'element-post-selected': deleteUserCardSelected,
              'element-post-no-selected': !deleteUserCardSelected,
            }"
            @mouseenter="deleteUserCardSelected = true"
            @mouseleave="deleteUserCardSelected = false"
          >
            <ion-card-header>
              <div class="card-header">
                <div class="card-title-container">
                  <ion-card-title style="top: 9px">
                    Borrar cuenta
                  </ion-card-title>
                </div>
                <div>
                  <ion-button
                    id="trigger-cardDeleteAccount"
                    fill="clear"
                    class="ion-hide-lg-up"
                  >
                    <ion-icon :icon="informationCircleOutline"></ion-icon>
                  </ion-button>
                </div>
              </div>
            </ion-card-header>

            <ion-card-content>
              <p>
                Para confirmar tu identidad es necesario que ingreses por ultima
                vez tu contraseña.
              </p>

              <ion-input
                autocomplete="current-password"
                label-placement="stacked"
                label="Contraseña"
                fill="outline"
                :value="formDeleteAccount.password"
                :type="inputTypePassword"
                :error-text="
                  v$.formDeleteAccount.$errors[0]?.$message.toString()
                "
                :class="{
                  'ion-invalid':
                    v$.formDeleteAccount.$invalid &&
                    v$.formDeleteAccount.$dirty,
                  'ion-touched': v$.formDeleteAccount.$dirty,
                }"
                @ion-input="
                  formDeleteAccount.password = $event.detail.value!.toString()
                "
                @click="v$.formDeleteAccount.$touch()"
              >
                <ion-icon
                  slot="start"
                  class="item-icon"
                  :icon="keyOutline"
                ></ion-icon>

                <ion-input-password-toggle
                  slot="end"
                ></ion-input-password-toggle>
              </ion-input>

              <ion-button
                fill="clear"
                :disabled="(v$ as any).formDeleteAccount.$invalid"
                color="danger"
                expand="full"
                @click="deleteUserAccount()"
              >
                <ion-spinner
                  v-if="spinners.deleteUserAccount"
                  name="crescent"
                  color="danger"
                >
                </ion-spinner>
                <ion-label v-if="!spinners.deleteUserAccount">
                  Borrar cuenta
                </ion-label>
              </ion-button>
            </ion-card-content>
          </ion-card>
        </ion-col>
      </ion-row>
    </ion-list>
  </section>
</template>

<script setup lang="ts">
import {
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonSpinner,
  alertController,
  IonModal,
  IonList,
  IonListHeader,
  IonRow,
  IonCol,
  IonIcon,
} from "@ionic/vue";
import { onMounted, ref } from "vue";
import useVuelidate from "@vuelidate/core";
import {
  required,
  helpers,
  email,
  maxLength,
  minLength,
} from "@vuelidate/validators";
import {
  eyeOutline,
  eyeOffOutline,
  informationCircleOutline,
  manOutline,
  personOutline,
  mailOpenOutline,
  keyOutline,
} from "ionicons/icons";
import userAvatar from "../../../assets/otros/user.png";

// controllers
import SystemController from "@/controllers/systemController";
import UserController from "@/controllers/userController";
const systemController = new SystemController();
const userController = new UserController();

const form = ref({
  name: "",
  user: "",
  email: "",
  userImageId: "",
});
const spinners = ref({
  saveUserData: false,
  uploadImage: false,
  deleteUserAccount: false,
});
const oldEmail = ref("");
const userImage = ref(userAvatar);
const inputTypePassword = "password" as "password" | "text";
const formDeleteAccount = ref({
  password: "",
});
const information = [
  {
    basicCardInformation: [
      {
        title: "Nombre:",
        content:
          "Solamente tú puedes ver tu nombre y lo usaremos única y exclusivamente para contactarte.",
      },
      {
        title: "Usuario:",
        content:
          "Es el único dato que los otros usuarios de este blog podrán conocer de ti.",
      },
      {
        title: "Correo electrónico:",
        content:
          "Al igual que tu nombre, este solamente será usado para contactar contigo.",
      },
    ],
    cardDeleteAccount: [
      {
        content:
          "Al borrar tu cuenta todos los datos relacionados con ella serán eliminados y ya no se podrán recuperar.",
      },
      {
        content:
          "Antes de irte, nos podrías regalar un poco de tu tiempo para que nos cuentes por qué decidiste tomar esta decisión.",
      },
    ],
  },
];

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
      maxLength: helpers.withMessage("Máximo 32 caracteres", maxLength(32)),
      minLength: helpers.withMessage(
        "Mínimo 4 caracteres",
        helpers.regex(/^.{4,}$/)
      ),
    },
    email: {
      required: helpers.withMessage(messageError.required, required),
      email: helpers.withMessage("Correo no valido", email),
    },
  },

  formDeleteAccount: {
    password: {
      required: helpers.withMessage(messageError.required, required),
    },
  },
};
const v$ = useVuelidate(rules, { form, formDeleteAccount });
const profileCardSelected = ref(false);
const deleteUserCardSelected = ref(false);

// mounted
onMounted(async () => {
  await loadUser();
  oldEmail.value = form.value.email!;
});

async function loadUser() {
  await userController.loadUser();

  form.value.name = userController.getUser()?.name!;
  form.value.user = userController.getUser()?.user!;
  form.value.email = userController.getUser()?.email!;
  userImage.value = userController.getUser()?.toString()!;
}

async function saveUserData() {
  spinners.value.saveUserData = true;
  const name = form.value.name!;
  const user = form.value.user!;
  const email = form.value.email!;
  const imageId = form.value.userImageId;

  if (email != oldEmail.value) {
    presentAlertEmail();
  }

  try {
    await userController.saveUserData({ name, user, email, imageId });
    loadUser();
    await systemController.presentToast({
      message: "Datos actualizados",
    });
  } catch (e: any) {
    if (e.message == "Email already selected") {
      await systemController.presentToast({
        message: "Correo ya en uso",
        color: "warning",
      });
      return;
    }
    console.error(e);
    systemController.openToastError(e);
  } finally {
    spinners.value.saveUserData = false;
  }
}

async function presentAlertEmail() {
  const alert = await alertController.create({
    cssClass: "my-custom-class",
    header: "Mensaje",
    message: "Hemos enviado un mensaje de verificación a tu nuevo correo.",
    buttons: ["OK"],
  });
  await alert.present();
}

async function getImageBase64(e: any) {
  return new Promise((resolve) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = async (e: any) => {
      const fileData = e.target.result;
      resolve(fileData);
    };
    reader.readAsDataURL(file);
  });
}

async function uploadUserImage(e: any) {
  if (!e.target.files[0]) return;
  spinners.value.uploadImage = true;
  const image = await getImageBase64(e);

  try {
    const response = await userController.uploadImage({
      image,
    });

    spinners.value.uploadImage = false;
    if (response.name) {
      userImage.value = "data:image/png;base64," + response.source;
      form.value.userImageId = response.id!;
    }
    userController.updateUserProps({
      user: {
        imageProfile: response.source,
      },
    });
  } catch (e: any) {
    console.error(e);
    systemController.openToastError(e);
  } finally {
    spinners.value.uploadImage = false;
  }
}

async function presentAlertDeleteAccount() {
  const alert = await alertController.create({
    cssClass: "my-custom-class",
    header: "Confirmación",
    subHeader: "Eliminar cuenta",
    message: "No hay vuelta atrás, ¿Quieres continuar?",
    buttons: [
      {
        text: "No",
        id: "cancel-button",
        handler: () => {
          alert.dismiss(false);
          return false;
        },
      },
      {
        text: "Si",
        id: "confirm-button",
        handler: () => {
          alert.dismiss(true);
          return true;
        },
      },
    ],
  });
  await alert.present();
  return alert;
}

async function deleteUserAccount() {
  spinners.value.deleteUserAccount = true;

  const alertResponse = await (
    await presentAlertDeleteAccount()
  ).onDidDismiss();

  if (alertResponse.data == false) {
    spinners.value.deleteUserAccount = false;
    await systemController.presentToast({
      message: "Gracias por quedarte, prometo no fallarte",
    });
    return;
  }

  if (alertResponse.data) {
    try {
      await userController.deleteAccount({
        password: formDeleteAccount.password,
      });

      await systemController.presentToast({
        message: "Hasta pronto",
      });
      location.reload();
    } catch (e: any) {
      if (e.message == "Wrong password") {
        await systemController.presentToast({
          message: "Contraseña incorrecta",
          color: "danger",
        });
      }
      console.error(e);
      systemController.openToastError(e);
    } finally {
      spinners.value.deleteUserAccount = false;
    }
  }
}

async function logout() {
  try {
    await logout();
    const token = (document.cookie =
      "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;");
    // setUserToken({ token });
    location.reload();
  } catch (e: any) {
    console.error(e);
    systemController.openToastError(e);
  }
}
</script>

<style scoped>
.important-text {
  font-weight: bold;
}
.card-header {
  display: flex;
}
.card-header > .card-title-container {
  flex-basis: 90%;
}
.card-header > .card-title-container > ion-card-title {
  top: 9px;
}

.element-post-selected {
  border: 1px solid var(--ion-color-primary);
}

.element-post-no-selected {
  border: 1px solid var(--ion-background-color);
}
</style>
