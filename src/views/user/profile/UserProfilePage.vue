<template>
  <section>
    <ion-list>
      <ion-list-header>
        <ion-label>Informacion basica</ion-label>
      </ion-list-header>

      <ion-row class="center">
        <ion-col size="12" size-lg="6" size-xl="4" class="card-form">
          <ion-card>
            <ion-card-content>
              <form>
                <div class="center">
                  <img
                    :src="userImage"
                    style="width: 90px; border-radius: 50%; cursor: pointer"
                    @click="($refs as any).inputUserImage.click()"
                  />
                </div>
                <input
                  accept="image/*"
                  type="file"
                  @change="uploadUserImage($event)"
                  style="display: none"
                  ref="inputUserImage"
                />
                <ion-item>
                  <ion-label position="floating">Nombre</ion-label>
                  <ion-input
                    v-model="(v$.form as any).name.$model"
                    type="text"
                    autocomplete="name"
                  ></ion-input>
                </ion-item>
                <div
                  v-for="(error, index) of (v$.form as any).name.$errors"
                  :key="index"
                >
                  <div class="error">{{ error.$message }}</div>
                </div>

                <ion-item>
                  <ion-label position="floating">Usuario</ion-label>
                  <ion-input
                    v-model="(v$.form as any).user.$model"
                    type="text"
                    autocomplete="username"
                  ></ion-input>
                </ion-item>
                <div
                  v-for="(error, index) of (v$.form as any).user.$errors"
                  :key="index"
                >
                  <div class="error">{{ error.$message }}</div>
                </div>

                <ion-item>
                  <ion-label position="floating">Correo electronico</ion-label>
                  <ion-input
                    v-model="(v$.form as any).email.$model"
                    type="email"
                    autocomplete="email"
                  ></ion-input>
                </ion-item>
                <div
                  v-for="(error, index) of (v$.form as any).email.$errors"
                  :key="index"
                >
                  <div class="error">{{ error.$message }}</div>
                </div>

                <div class="center">
                  <ion-item lines="none">
                    <ion-button
                      fill="clear"
                      @click="saveUserData()"
                      :disabled="(v$.form as any).$invalid"
                    >
                      <ion-spinner
                        name="crescent"
                        v-if="spinners.saveUserData"
                      ></ion-spinner>
                      <ion-label v-if="!spinners.saveUserData"
                        >Guardar</ion-label
                      >
                    </ion-button>
                  </ion-item>
                </div>
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

      <ion-row class="center">
        <ion-col size="12" size-lg="6" size-xl="4" class="card-form">
          <ion-card>
            <ion-card-header>
              <ion-card-title>Borrar cuenta</ion-card-title>
            </ion-card-header>
            <ion-card-content>
              <p>
                Al borrar tu cuenta todos los datos relacionados con ella serán
                eliminados y ya no se podrán recuperar.
              </p>
              <form>
                <ion-item>
                  <ion-label position="floating">Contraseña</ion-label>
                  <ion-input
                    v-model="(v$.formDeleteAccount as any).password.$model"
                    :type="inputTypePassword"
                    autocomplete="password"
                  ></ion-input>
                  <ion-button
                    slot="end"
                    fill="clear"
                    v-if="inputTypePassword == 'text'"
                    v-on:click="inputTypePassword = 'password'"
                    style="margin-top: 20px"
                  >
                    <ion-icon :icon="eyeOffOutline"></ion-icon>
                  </ion-button>
                  <ion-button
                    slot="end"
                    fill="clear"
                    v-if="inputTypePassword == 'password'"
                    v-on:click="inputTypePassword = 'text'"
                    style="margin-top: 20px"
                  >
                    <ion-icon :icon="eyeOutline"></ion-icon>
                  </ion-button>
                </ion-item>
                <div
                  v-for="(error, index) of (v$.formDeleteAccount as any).password.$errors"
                  :key="index"
                >
                  <div class="error">{{ error.$message }}</div>
                </div>

                <div class="center">
                  <ion-item lines="none">
                    <ion-button
                      fill="clear"
                      @click="deleteUserAccount()"
                      :disabled="(v$.formDeleteAccount as any).$invalid"
                      color="danger"
                    >
                      <ion-spinner
                        name="crescent"
                        v-if="spinners.saveUserData"
                      ></ion-spinner>
                      <ion-label v-if="!spinners.saveUserData"
                        >Borrar cuenta</ion-label
                      >
                    </ion-button>
                  </ion-item>
                </div>
              </form>
            </ion-card-content>
          </ion-card>
        </ion-col>
      </ion-row>
    </ion-list>
  </section>
</template>

<script lang="ts">
import {
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonSpinner,
  alertController,
} from "@ionic/vue";
import { defineComponent } from "vue";
import systemService from "../../../services/system.vue";
import userService from "../../../services/user.vue";
import useVuelidate from "@vuelidate/core";
import { required, helpers, email, alpha } from "@vuelidate/validators";
import { eyeOutline, eyeOffOutline } from "ionicons/icons";
import sessionService from "../../../services/session.vue";

export default defineComponent({
  name: "UserProfileComponent",
  components: {
    IonItem,
    IonLabel,
    IonInput,
    IonButton,
    IonSpinner,
  },

  setup() {
    return {
      v$: useVuelidate(),
      eyeOffOutline,
      eyeOutline,
    };
  },

  data() {
    return {
      pageTitle: "Home",
      form: {
        name: "",
        user: "",
        email: "",
        userImageId: "",
      },
      spinners: {
        saveUserData: false,
      },
      oldEmail: "",
      userImage: require("../../../../public/assets/otros/user.png"),
      inputTypePassword: "password",
      formDeleteAccount: { password: "" },
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
      },

      formDeleteAccount: {
        password: {
          required: helpers.withMessage(messageRequired, required),
        },
      },
    };
  },

  async mounted() {
    await this.getUser();
    this.oldEmail = this.form.email!;
  },

  methods: {
    async getUser() {
      const query = `
          user {
            name
            user
            email
          }
    `;
      try {
        const response = await userService().getUser({ query });
        this.form.name = response.name!;
        this.form.user = response.user!;
        this.form.email = response.email!;
      } catch (e: any) {
        if (e.message == "Unauthorized") return;
        else {
          systemService().openToastErrror(e);
          console.error(e);
        }
      }
    },

    saveUserData() {
      this.spinners.saveUserData = true;
      const name = this.form.name!;
      const user = this.form.user!;
      let email = this.form.email!;
      const imageId = this.form.userImageId;

      if (email != this.oldEmail) {
        this.presentAlertEmail();
      }

      try {
        userService().saveUserData({ name, user, email, imageId });
        this.spinners.saveUserData = false;
        systemService().openToast({
          message: "Datos actualizados",
          color: "success",
        });
      } catch (e: any) {
        this.spinners.saveUserData = false;
        console.error(e);
        systemService().openToastErrror(e);
      }
    },

    async presentAlertEmail() {
      const alert = await alertController.create({
        cssClass: "my-custom-class",
        header: "Mensaje",
        message: "Hemos enviado un mensaje de verificación a tu nuevo correo.",
        buttons: ["OK"],
      });
      await alert.present();
    },

    getImage(e: any) {
      const file = e.target.files[0];
      return file;
    },

    async uploadUserImage(e: any) {
      const image = this.getImage(e);

      const query = `
            image {
              id
              name
            }
              `;

      try {
        const response = await systemService().uploadImage({ query, image });
        if (response.name) {
          this.userImage = URL.createObjectURL(image);
          this.form.userImageId = response.id!;
        }
      } catch (e: any) {
        console.error(e);
        systemService().openToastErrror(e);
      }
    },

    async presentAlertDeleteAccount() {
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
    },

    async deleteUserAccount() {
      const alertResponse = await (
        await this.presentAlertDeleteAccount()
      ).onDidDismiss();

      if (alertResponse.data)
        try {
          await userService().deleteUserAccount({
            password: this.formDeleteAccount.password,
          });
          systemService().openToast({
            message: "Hasta pronto",
            color: "success",
          });
          this.logout();
        } catch (e: any) {
          if (e.message == "Wrong password") {
            systemService().openToast({
              message: "Contraseña incorrecta",
              color: "danger",
            });
            return;
          }
          console.error(e);
          systemService().openToastErrror(e);
        }

      if (alertResponse.data == false)
        systemService().openToast({
          message: "Gracias por quedarte, prometo no fallarte",
          color: "success",
        });
    },

    async logout() {
      try {
        await sessionService().logout();
        const token = (document.cookie =
          "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;");
        userService().setUserToken({ token });
        sessionService().removeUserCached();
        location.reload();
      } catch (e: any) {
        console.error(e);
        systemService().openToastErrror(e);
      }
    },
  },
});
</script>
