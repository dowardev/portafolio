<template>
  <section>
    <ion-list>
      <ion-list-header>
        <ion-label>Seguridad basica</ion-label>
      </ion-list-header>

      <ion-row>
        <ion-modal
          trigger="trigger-cardDeleteAccount"
          :breakpoints="[0.1, 0.5, 1]"
          :initialBreakpoint="0.5"
        >
          <ion-content class="ion-padding">
            <ul v-for="item in information[0].cardPassword" :key="item[0]">
              <li>
                {{ item.content }}
              </li>
            </ul>
          </ion-content>
        </ion-modal>

        <ion-col
          size-xs="12"
          size-md="12"
          size-lg="6"
          size-xl="5"
          class="ion-padding-start ion-hide-lg-down"
        >
          <p>Una buena contraña debe incluir</p>
          <ul v-for="item in information[0].cardPassword" :key="item[0]">
            <li>
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
                    Cambiar contraseña
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
              <ion-item>
                <ion-icon
                  :icon="keyOutline"
                  slot="start"
                  class="item-icon"
                ></ion-icon>
                <ion-label position="floating">Contraseña actual</ion-label>
                <ion-input
                  v-model="(v$ as any).form.oldPassword.$model"
                  :type="inputTypePassword1"
                  autocomplete="current-password"
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
                v-for="(error, index) of (v$ as any).form.oldPassword.$errors"
                :key="index"
              >
                <div class="error">{{ error.$message }}</div>
              </div>

              <ion-item>
                <ion-icon
                  :icon="keyOutline"
                  slot="start"
                  class="item-icon"
                ></ion-icon>
                <ion-label position="floating">Contraseña nueva</ion-label>
                <ion-input
                  v-model="(v$ as any).form.newPassword.$model"
                  :type="inputTypePassword2"
                  autocomplete="new-password"
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
                v-for="(error, index) of (v$ as any).form.newPassword.$errors"
                :key="index"
              >
                <div class="error">{{ error.$message }}</div>
              </div>

              <ion-item>
                <ion-icon
                  :icon="keyOutline"
                  slot="start"
                  class="item-icon"
                ></ion-icon>
                <ion-label position="floating">Repetir contraseña</ion-label>
                <ion-input
                  v-model="(v$ as any).form.newPasswordRepeat.$model"
                  :type="inputTypePassword3"
                ></ion-input>
                <ion-button
                  slot="end"
                  fill="clear"
                  v-if="inputTypePassword3 == 'text'"
                  v-on:click="inputTypePassword3 = 'password'"
                  style="margin-top: 20px"
                >
                  <ion-icon :icon="eyeOffOutline"></ion-icon>
                </ion-button>
                <ion-button
                  slot="end"
                  fill="clear"
                  v-if="inputTypePassword3 == 'password'"
                  v-on:click="inputTypePassword3 = 'text'"
                  style="margin-top: 20px"
                >
                  <ion-icon :icon="eyeOutline"></ion-icon>
                </ion-button>
              </ion-item>
              <div
                v-for="(error, index) of (v$ as any).form.newPasswordRepeat.$errors"
                :key="index"
              >
                <div class="error">{{ error.$message }}</div>
              </div>

              <div class="center">
                <ion-item lines="none">
                  <ion-button
                    fill="clear"
                    @click="saveUserPassword()"
                    :disabled="(v$ as any).form.$invalid"
                  >
                    <ion-spinner
                      name="crescent"
                      v-if="spinners.saveUserPassword"
                    ></ion-spinner>
                    <ion-label v-if="!spinners.saveUserPassword"
                      >Guardar</ion-label
                    >
                  </ion-button>
                </ion-item>
              </div>
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
  IonModal,
  IonList,
  IonListHeader,
  IonRow,
  IonCol,
  IonIcon,
} from "@ionic/vue";
import { defineComponent } from "vue";
import useVuelidate from "@vuelidate/core";
import { required, helpers, sameAs } from "@vuelidate/validators";
import { updateUserPassword } from "../../../services/session";
import { openToastErrror, openToast } from "../../../services/system";
import {
  eyeOutline,
  eyeOffOutline,
  informationCircleOutline,
  keyOutline,
} from "ionicons/icons";

export default defineComponent({
  name: "UserProfileComponent",
  components: {
    IonItem,
    IonLabel,
    IonInput,
    IonButton,
    IonSpinner,
    IonModal,
    IonList,
    IonListHeader,
    IonRow,
    IonCol,
    IonIcon,
  },
  setup() {
    return {
      v$: useVuelidate(),
      eyeOutline,
      eyeOffOutline,
      informationCircleOutline,
      keyOutline,
    };
  },
  data() {
    return {
      form: {
        oldPassword: "d3D9jFEubBSRo",
        newPassword: "d3D9jFEubBSRo",
        newPasswordRepeat: "d3D9jFEubBSRo",
      },
      spinners: {
        saveUserPassword: false,
      },
      inputTypePassword1: "password" as "text" | "password",
      inputTypePassword2: "password" as "text" | "password",
      inputTypePassword3: "password" as "text" | "password",
      information: [
        {
          cardPassword: [
            {
              content:
                "El tamaño ideal para una contraseña es de 9 caracteres o más.",
            },
            {
              content: "Debe contener mayúsculas y minúsculas.",
            },
            {
              content: "Debe contener al menos un número.",
            },
          ],
        },
      ],
    };
  },

  validations() {
    const messageRequired = "Campo requerido";
    return {
      form: {
        oldPassword: {
          required: helpers.withMessage(messageRequired, required),
        },
        newPassword: {
          required: helpers.withMessage(messageRequired, required),
          minLength: helpers.withMessage(
            "La contraseña debe tener al menos una mayúscula, un numero y tener un tamaño de 8",
            helpers.regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)
          ),
        },
        newPasswordRepeat: {
          same: helpers.withMessage(
            "Las contraseñas no coinciden",
            sameAs(this.form.newPassword)
          ),
        },
      },
    };
  },

  methods: {
    async saveUserPassword() {
      this.spinners.saveUserPassword = true;
      try {
        await updateUserPassword(this.form);
        this.spinners.saveUserPassword = false;
        openToast({
          message: "Contraseña actualizada",
          color: "success",
        });
      } catch (e: any) {
        this.spinners.saveUserPassword = false;
        if (e.message == "Wrong password") {
          openToast({
            message: "Contraseña incorrecta",
          });
          return;
        }
        console.error(e);
        openToastErrror(e);
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
