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
          :initialBreakpoint="0.5"
        >
          <ion-content class="ion-padding">
            <ul
              v-for="item in information[0].basicCardInformation"
              :key="item[0]"
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
            :key="item[0]"
          >
            <li>
              <span class="important-text"> {{ item.title }} </span>
              {{ item.content }}
            </li>
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
                    Perfil de usuario
                  </ion-card-title>
                </div>
                <div>
                  <ion-button
                    fill="clear"
                    id="trigger-basicCardInformation"
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
                  name="crescent"
                  v-if="spinners.uploadImage == true"
                ></ion-spinner>
                <input
                  accept="image/*"
                  type="file"
                  @change="uploadUserImage($event)"
                  style="display: none"
                  ref="inputUserImage"
                  :disabled="spinners.uploadImage == true"
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
                      <ion-spinner name="crescent" v-if="spinners.saveUserData">
                      </ion-spinner>
                      <ion-label v-if="!spinners.saveUserData">
                        Guardar
                      </ion-label>
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

      <ion-row>
        <ion-modal
          trigger="trigger-cardDeleteAccount"
          :breakpoints="[0.1, 0.5, 1]"
          :initialBreakpoint="0.5"
        >
          <ion-content class="ion-padding">
            <ul v-for="item in information[0].cardDeleteAccount" :key="item[0]">
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
          <ul v-for="item in information[0].cardDeleteAccount" :key="item[0]">
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
                    fill="clear"
                    id="trigger-cardDeleteAccount"
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
                        v-if="spinners.deleteUserAccount"
                        color="danger"
                      >
                      </ion-spinner>
                      <ion-label v-if="!spinners.deleteUserAccount">
                        Borrar cuenta
                      </ion-label>
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
  IonModal,
} from "@ionic/vue";
import { defineComponent } from "vue";
import systemService from "../../../services/system.vue";
import userService from "../../../services/user.vue";
import useVuelidate from "@vuelidate/core";
import { required, helpers, email, alpha } from "@vuelidate/validators";
import {
  eyeOutline,
  eyeOffOutline,
  informationCircleOutline,
} from "ionicons/icons";
import sessionService from "../../../services/session.vue";
import eventBus from "../../../EventBus";

export default defineComponent({
  name: "UserProfileComponent",
  components: {
    IonItem,
    IonLabel,
    IonInput,
    IonButton,
    IonSpinner,
    IonModal,
  },

  setup() {
    return {
      v$: useVuelidate(),
      eyeOffOutline,
      eyeOutline,
      informationCircleOutline,
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
        uploadImage: false,
        deleteUserAccount: false,
      },
      oldEmail: "",
      userImage: require("../../../../public/assets/otros/user.png"),
      inputTypePassword: "password",
      formDeleteAccount: { password: "" },
      information: [
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
                "Es el único dato que los otros usuarios de este blog podrán conocer de ti",
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
                "Antes de irte, nos podrías regalar un poco de tu tiempo para que nos cuentes por qué decidiste irte.",
            },
          ],
        },
      ],
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
    // eslint-disable-next-line
    this.oldEmail = this.form.email!;
  },

  methods: {
    async getUser() {
      const query = `
          user {
            name
            user
            email
            image_source
          }
    `;
      try {
        const response = await userService().getUser({ query });
        // eslint-disable-next-line
        this.form.name = response.name!;

        // eslint-disable-next-line
        this.form.user = response.user!;

        // eslint-disable-next-line
        this.form.email = response.email!;

        if (response.image_source) {
          // eslint-disable-next-line
          this.userImage = "data:image/png;base64," + response.image_source!;
        }
      } catch (e: any) {
        if (e.message == "Unauthorized") return;
        else {
          systemService().openToastErrror(e);
          console.error(e);
        }
      }
    },

    async saveUserData() {
      this.spinners.saveUserData = true;
      // eslint-disable-next-line
      const name = this.form.name!;
      // eslint-disable-next-line
      const user = this.form.user!;
      // eslint-disable-next-line
      let email = this.form.email!;
      const imageId = this.form.userImageId;

      if (email != this.oldEmail) {
        this.presentAlertEmail();
      }

      try {
        await userService().saveUserData({ name, user, email, imageId });
        this.spinners.saveUserData = false;
        systemService().openToast({
          message: "Datos actualizados",
          color: "success",
        });
        eventBus().emitter.emit("refresh-user-content");
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

    async getImageBase64(e: any) {
      return new Promise((resolve) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = async (e: any) => {
          const fileData = e.target.result;
          resolve(fileData);
        };
        reader.readAsDataURL(file);
      });
    },

    async uploadUserImage(e: any) {
      if (!e.target.files[0]) return;
      this.spinners.uploadImage = true;
      const image = await this.getImageBase64(e);

      const query = `
            image {
              id
              name
              source
            }
              `;

      try {
        const response = await systemService().uploadImage({
          query,
          image,
        });
        this.spinners.uploadImage = false;
        if (response.name) {
          this.userImage = "data:image/png;base64," + response.source;
          // eslint-disable-next-line
          this.form.userImageId = response.id!;
        }
      } catch (e: any) {
        this.spinners.uploadImage = false;
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
      this.spinners.deleteUserAccount = true;
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

          this.spinners.deleteUserAccount = false;
          this.logout();
        } catch (e: any) {
          this.spinners.deleteUserAccount = false;
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

      if (alertResponse.data == false) this.spinners.deleteUserAccount = false;
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
