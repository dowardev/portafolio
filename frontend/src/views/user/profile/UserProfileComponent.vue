<template>
  <ion-row
    :class="{
      center: isPlatform('desktop'),
    }"
  >
    <!-- profile -->
    <ion-col
      size-xs="12"
      size-lg="3"
      :class="{
        'separator-column': isPlatform('desktop'),
      }"
    >
      <ion-card>
        <ion-card-header>
          <ion-card-title> Perfil de usuario </ion-card-title>
        </ion-card-header>

        <ion-card-content>
          <!-- img -->
          <ion-row>
            <ion-col size="12" class="center">
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
            </ion-col>
          </ion-row>

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
                  'ion-invalid': v$.form.name.$invalid && v$.form.name.$dirty,
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
                  'ion-invalid': v$.form.user.$invalid && v$.form.user.$dirty,
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
                  'ion-invalid': v$.form.email.$invalid && v$.form.email.$dirty,
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
                :disabled="(v$ as any).form.$invalid"
                expand="block"
                @click="saveUserData()"
              >
                <ion-spinner v-if="spinners.saveUserData" name="crescent">
                </ion-spinner>
                <ion-label v-if="!spinners.saveUserData"> Guardar </ion-label>
              </ion-button>
            </ion-col>
          </ion-row>
        </ion-card-content>
      </ion-card>
    </ion-col>

    <!-- other actions -->
    <ion-col
      size-xs="12"
      size-lg="3"
      :class="{
        'center-vertical': isPlatform('desktop'),
        center: isPlatform('mobile'),
      }"
    >
      <section>
        <!-- update password -->
        <ion-row
          :class="{
            center: isPlatform('mobile'),
          }"
        >
          <ion-col>
            <ion-button fill="clear" class="primary-animation">
              <ion-icon slot="start" :icon="keyOutline"></ion-icon>
              Actualizar contraseña
            </ion-button>
          </ion-col>
        </ion-row>

        <!-- user data police -->
        <ion-row>
          <ion-col>
            <ion-button
              fill="clear"
              class="primary-animation"
              @click="modalInfoProfile.open = true"
            >
              <ion-icon
                slot="start"
                :icon="informationCircleOutline"
              ></ion-icon>
              Uso de datos
            </ion-button>
          </ion-col>
        </ion-row>

        <!-- delete account -->
        <ion-row>
          <ion-col>
            <ion-button
              fill="clear"
              class="danger-animation"
              @click="modalDeleteAccount.open = true"
            >
              <ion-icon slot="start" :icon="trashBinOutline"></ion-icon>
              Eliminar cuenta
            </ion-button>
          </ion-col>
        </ion-row>
      </section>
    </ion-col>
  </ion-row>

  <!-- modals -->
  <!-- modal info profile -->
  <ion-modal
    class="modal"
    :is-open="modalInfoProfile.open"
    @did-dismiss="modalInfoProfile.open = false"
  >
    <ion-header :translucent="true" class="ion-no-border">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button @click="modalInfoProfile.open = false">
            <ion-icon :icon="closeOutline"></ion-icon>
          </ion-button>
        </ion-buttons>

        <ion-title>Información</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <ion-card
        v-for="item in information[0].basicCardInformation"
        :key="item.title"
        class="success-base-content-card success-border-indicator success-border success-fill"
      >
        <ion-card-header>
          <ion-card-title>
            {{ item.title }}
          </ion-card-title>
        </ion-card-header>

        <ion-card-content>
          <ion-text>{{ item.content }}</ion-text>
        </ion-card-content>
      </ion-card>
    </ion-content>
  </ion-modal>

  <!-- modal delete account -->
  <ion-modal
    class="modal"
    :is-open="modalDeleteAccount.open"
    @did-dismiss="modalDeleteAccount.open = false"
  >
    <ion-header :translucent="true" class="ion-no-border">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button @click="modalDeleteAccount.open = false">
            <ion-icon :icon="closeOutline"></ion-icon>
          </ion-button>
        </ion-buttons>

        <ion-title>Eliminar cuenta</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <ion-row>
        <ion-card>
          <ion-card-content>
            <ion-row>
              <ion-col>
                <p>
                  Para confirmar su identidad, por favor ingrese su contraseña
                  una última vez.
                </p>
              </ion-col>
            </ion-row>

            <ion-row>
              <ion-col>
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
              </ion-col>
            </ion-row>

            <ion-row>
              <ion-col>
                <ion-button
                  :disabled="(v$ as any).formDeleteAccount.$invalid"
                  color="danger"
                  expand="block"
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
              </ion-col>
            </ion-row>
          </ion-card-content>
        </ion-card>
      </ion-row>

      <ion-row>
        <ion-col size="12">
          <ion-card class="danger-card-filled">
            <ion-card-header>
              <ion-card-title>Peligro</ion-card-title>
            </ion-card-header>

            <ion-card-content>
              Al eliminar su cuenta, todos los datos asociados serán eliminados
              permanentemente y no podrán recuperarse.
            </ion-card-content>
          </ion-card>
        </ion-col>
      </ion-row>
    </ion-content>
  </ion-modal>
</template>

<script setup lang="ts">
import {
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCol,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonInputPasswordToggle,
  IonLabel,
  IonModal,
  IonRow,
  IonSpinner,
  IonText,
  IonTitle,
  IonToolbar,
  alertController,
  isPlatform,
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
  closeOutline,
  trashBinOutline,
} from "ionicons/icons";
import userAvatar from "../../../assets/otros/user.png";

// controllers
import SystemController from "@/controllers/systemController";
import UserController from "@/controllers/userController";
import ErrorController from "@/controllers/errorController";
const systemController = new SystemController();
const userController = new UserController();
const errorController = new ErrorController();

// vars
const emits = defineEmits(["content-loaded"]);
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
        title: "Nombre",
        content:
          "Tu nombre es visible solo para ti y será utilizado exclusivamente para fines de contacto.",
      },
      {
        title: "Usuario",
        content:
          "Este es el único dato que otros usuarios de este blog podrán ver sobre ti.",
      },
      {
        title: "Correo electrónico",
        content:
          "Al igual que tu nombre, este será utilizado únicamente para fines de contacto.",
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
        helpers.regex(/^[a-zA-Z ]*$/),
      ),
    },
    user: {
      required: helpers.withMessage(messageError.required, required),
      maxLength: helpers.withMessage("Máximo 32 caracteres", maxLength(32)),
      minLength: helpers.withMessage(
        "Mínimo 4 caracteres",
        helpers.regex(/^.{4,}$/),
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
const modalInfoProfile = ref({ open: false });
const modalDeleteAccount = ref({ open: false });

// mounted
onMounted(async () => {
  await loadUser();
  oldEmail.value = form.value.email!;
  emits("content-loaded");
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
  } catch (e) {
    if (e instanceof Error && e.message == "Email already selected") {
      await systemController.presentToast({
        message: "Correo ya en uso",
        color: "warning",
      });
      return;
    }
    console.error(e);
    errorController.openToastError({ error: e as Error });
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

async function getImageBase64(e: Event) {
  return new Promise((resolve) => {
    const target = e.target as HTMLInputElement
    const file = target.files?.[0]
    const reader = new FileReader();
    reader.onload = async (ev: ProgressEvent<FileReader>) => {
      const fileData = (ev.target as FileReader).result;
      resolve(fileData);
    };
    reader.readAsDataURL(file!);
  });
}

async function uploadUserImage(e: Event) {
  const target = e.target as HTMLInputElement
  if (!target.files?.[0]) return;
  spinners.value.uploadImage = true;
  const image = await getImageBase64(e);

  // try {
  //   const response = await userController.uploadImage({
  //     image,
  //   });

  //   spinners.value.uploadImage = false;
  //   if (response.name) {
  //     userImage.value = "data:image/png;base64," + response.source;
  //     form.value.userImageId = response.id!;
  //   }
  //   userController.updateUserProps({
  //     user: {
  //       imageProfile: response.source,
  //     },
  //   });
  // } catch (e: any) {
  //   console.error(e);
  //   systemController.openToastError(e);
  // } finally {
  //   spinners.value.uploadImage = false;
  // }
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
      // await userController.deleteAccount({
      //   password: formDeleteAccount.password,
      // });

      await systemController.presentToast({
        message: "Hasta pronto",
      });
      location.reload();
    } catch (e) {
      if (e instanceof Error && e.message == "Wrong password") {
        await systemController.presentToast({
          message: "Contraseña incorrecta",
          color: "danger",
        });
      }
      console.error(e);
      errorController.openToastError({ error: e as Error });
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
  } catch (e) {
    console.error(e);
    errorController.openToastError({ error: e as Error });
  }
}
</script>

<style scoped>
.separator-column::after {
  content: "";
  position: absolute;
  top: 50%;
  right: -1px;
  width: 2px;
  height: 60%;
  background-color: var(--ion-color-medium);
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  transform: translateY(-50%);
}
</style>
