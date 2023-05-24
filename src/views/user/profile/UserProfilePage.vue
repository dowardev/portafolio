<template>
  <section>
    <ion-list>
      <ion-list-header>
        <ion-label>Informacion basica</ion-label>
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
          <ion-card>
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
              <form>
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
                <ion-item class="transparent">
                  <ion-icon
                    slot="start"
                    :icon="manOutline"
                    class="item-icon"
                  ></ion-icon>
                  <ion-label position="floating">Nombre</ion-label>
                  <ion-input
                    v-model="(v$ as any).form.name.$model"
                    type="text"
                    autocomplete="name"
                  ></ion-input>
                </ion-item>
                <div
                  v-for="(error, index) of (v$ as any).form.name.$errors"
                  :key="index"
                >
                  <div class="error">{{ error.$message }}</div>
                </div>

                <ion-item class="transparent">
                  <ion-icon
                    slot="start"
                    :icon="personOutline"
                    class="item-icon"
                  ></ion-icon>
                  <ion-label position="floating">Usuario</ion-label>
                  <ion-input
                    v-model="(v$ as any).form.user.$model"
                    type="text"
                    autocomplete="username"
                  ></ion-input>
                </ion-item>
                <div
                  v-for="(error, index) of (v$ as any).form.user.$errors"
                  :key="index"
                >
                  <div class="error">{{ error.$message }}</div>
                </div>

                <ion-item class="transparent">
                  <ion-icon
                    slot="start"
                    :icon="mailOpenOutline"
                    class="item-icon"
                  ></ion-icon>
                  <ion-label position="floating">Correo electronico</ion-label>
                  <ion-input
                    v-model="(v$ as any).form.email.$model"
                    type="email"
                    autocomplete="email"
                    pattern="email"
                    inputmode="email"
                  ></ion-input>
                </ion-item>
                <div
                  v-for="(error, index) of (v$ as any).form.email.$errors"
                  :key="index"
                >
                  <div class="error">{{ error.$message }}</div>
                </div>

                <ion-button
                  fill="clear"
                  :disabled="(v$ as any).form.$invalid"
                  expand="full"
                  @click="saveUserData()"
                >
                  <ion-spinner v-if="spinners.saveUserData" name="crescent">
                  </ion-spinner>
                  <ion-label v-if="!spinners.saveUserData"> Guardar </ion-label>
                </ion-button>
              </form>
            </ion-card-content>
          </ion-card>
        </ion-col>
      </ion-row>
    </ion-list>
  </section>

  <section>
    <ion-list>
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
          <ion-card>
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

              <form>
                <ion-item class="transparent">
                  <ion-icon
                    slot="start"
                    :icon="keyOutline"
                    class="item-icon"
                  ></ion-icon>
                  <ion-label position="floating">Contraseña</ion-label>
                  <ion-input
                    v-model="(v$ as any).formDeleteAccount.password.$model"
                    :type="inputTypePassword"
                    autocomplete="current-password"
                  ></ion-input>
                  <ion-button
                    v-if="inputTypePassword == 'text'"
                    slot="end"
                    style="margin-top: 20px"
                    fill="clear"
                    @click="inputTypePassword = 'password'"
                  >
                    <ion-icon :icon="eyeOffOutline"></ion-icon>
                  </ion-button>
                  <ion-button
                    v-if="inputTypePassword == 'password'"
                    slot="end"
                    fill="clear"
                    style="margin-top: 20px"
                    @click="inputTypePassword = 'text'"
                  >
                    <ion-icon :icon="eyeOutline"></ion-icon>
                  </ion-button>
                </ion-item>
                <div
                  v-for="(error, index) of (v$ as any).formDeleteAccount.password.$errors"
                  :key="index"
                >
                  <div class="error">{{ error.$message }}</div>
                </div>

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
              </form>
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
import { openToast, uploadImage } from "../../../services/system";
import {
  setUserToken,
  saveUserData as saveUserDataService,
} from "../../../services/user";
import useVuelidate from "@vuelidate/core";
import { required, helpers, email } from "@vuelidate/validators";
import {
  eyeOutline,
  eyeOffOutline,
  informationCircleOutline,
  manOutline,
  personOutline,
  mailOpenOutline,
  keyOutline,
} from "ionicons/icons";
import { UPLOAD_IMAGE, USER_BASIC_DETAILS } from "../../../services/graphql";
import userAvatar from "../../../assets/otros/user.png";
import { useUser } from "../../../composables/useUser";
import { useSystem } from "../../../composables/useSystem";

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
const formDeleteAccount = { password: "1" };
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

// mounted
onMounted(async () => {
  await getUser();
  oldEmail.value = form.value.email!;
});

async function getUser() {
  await useUser().loadUser({
    graphql: {
      name: USER_BASIC_DETAILS,
      fragment: "UserBasicDetails",
      refetch: true,
    },
  });

  form.value.name = useUser().user.value.name!;
  form.value.user = useUser().user.value.user!;
  form.value.email = useUser().user.value.email!;
  userImage.value = useUser().imageProfile.value.toString()!;
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
    await saveUserDataService({ name, user, email, imageId });
    getUser();
    openToast({
      message: "Datos actualizados",
    });
  } catch (e: any) {
    if (e.message == "Email already selected") {
      openToast({
        message: "Correo ya en uso",
        color: "warning",
      });
      return;
    }
    console.error(e);
    useSystem().openToastError(e);
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
    const response = await uploadImage({
      image,
      graphql: { name: UPLOAD_IMAGE, fragment: "UploadImage" },
    });

    spinners.value.uploadImage = false;
    if (response.name) {
      userImage.value = "data:image/png;base64," + response.source;
      form.value.userImageId = response.id!;
    }
    useUser().updateUserProps({
      user: {
        imageProfile: response.source,
      },
    });
  } catch (e: any) {
    console.error(e);
    useSystem().openToastError(e);
  } finally {
    spinners.value.uploadImage = false;
  }
}

async function presentAlertDeleteAccount() {
  const alert = await alertController.create({
    cssClass: "my-custom-class",
    header: "Confirmacion",
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
    openToast({
      message: "Gracias por quedarte, prometo no fallarte",
    });
    return;
  }

  if (alertResponse.data) {
    try {
      await useUser().deleteAccount({
        password: formDeleteAccount.password,
      });

      openToast({
        message: "Hasta pronto",
      });
      location.reload();
    } catch (e: any) {
      if (e.message == "Wrong password") {
        openToast({
          message: "Contraseña incorrecta",
          color: "danger",
        });
      }
      console.error(e);
      useSystem().openToastError(e);
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
    setUserToken({ token });
    location.reload();
  } catch (e: any) {
    console.error(e);
    useSystem().openToastError(e);
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
</style>
