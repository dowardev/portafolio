<template>
  <section>
    <ion-list>
      <ion-list-header>
        <ion-label>Seguridad basica</ion-label>
      </ion-list-header>

      <ion-row class="center">
        <ion-col size="12" size-lg="6" size-xl="4" class="card-form">
          <ion-card>
            <ion-card-content>
              <ion-item>
                <ion-label position="floating">Contraseña actual</ion-label>
                <ion-input
                  v-model="(v$.form as any).oldPassword.$model"
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
                v-for="(error, index) of (v$.form as any).oldPassword.$errors"
                :key="index"
              >
                <div class="error">{{ error.$message }}</div>
              </div>

              <ion-item>
                <ion-label position="floating">Contraseña nueva</ion-label>
                <ion-input
                  v-model="(v$.form as any).newPassword.$model"
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
                v-for="(error, index) of (v$.form as any).newPassword.$errors"
                :key="index"
              >
                <div class="error">{{ error.$message }}</div>
              </div>

              <ion-item>
                <ion-label position="floating">Repetir contraseña</ion-label>
                <ion-input
                  v-model="(v$.form as any).newPasswordRepeat.$model"
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
                v-for="(error, index) of (v$.form as any).newPasswordRepeat.$errors"
                :key="index"
              >
                <div class="error">{{ error.$message }}</div>
              </div>

              <div class="center">
                <ion-item lines="none">
                  <ion-button
                    fill="clear"
                    @click="saveUserPassword()"
                    :disabled="(v$.form as any).$invalid"
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
import { IonItem, IonLabel, IonInput, IonButton, IonSpinner } from "@ionic/vue";
import { defineComponent } from "vue";
import useVuelidate from "@vuelidate/core";
import { required, helpers, sameAs } from "@vuelidate/validators";
import sessionService from "../../../services/session.vue";
import systemService from "../../../services/system.vue";
import { eyeOutline, eyeOffOutline } from "ionicons/icons";

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
      eyeOutline,
      eyeOffOutline,
    };
  },
  data() {
    return {
      form: {
        oldPassword: "",
        newPassword: "",
        newPasswordRepeat: "",
      },
      spinners: {
        saveUserPassword: false,
      },
      inputTypePassword1: "password",
      inputTypePassword2: "password",
      inputTypePassword3: "password",
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
    saveUserPassword() {
      console.log(this.form);
      try {
        sessionService().updateUserPassword(this.form);
        systemService().openToast({
          message: "Contraseña actualizada",
          color: "success",
        });
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
    },
  },
});
</script>
