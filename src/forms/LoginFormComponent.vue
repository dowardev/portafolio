<template>
  <div class="center">
    <img src="../../../assets/otros/key.png" alt="" class="imagen-usuario" />
  </div>

  <!-- user -->
  <ion-row>
    <ion-col>
      <ion-input
        type="email"
        label="Usuario o correo electrónico"
        label-placement="stacked"
        fill="outline"
        :value="form.email"
        :class="{
          'input-error': v$.form.email.$invalid && v$.form.email.$dirty,
        }"
        @ion-input="form.email = $event.detail.value as any"
        @keydown.enter="($refs as any).inputPassword.$el.setFocus()"
        @click="v$.form.email.$touch()"
      >
        <ion-icon slot="start" :icon="mailOpenOutline"> </ion-icon>
      </ion-input>

      <!-- errors -->
      <span
        class="error ion-padding-start"
        v-if="v$.form.email.$dirty && v$.form.email.required.$invalid"
        >{{ v$.form.email.required.$message }}</span
      >
      <span
        class="error"
        v-if="v$.form.email.$dirty && v$.form.email.email.$invalid"
        >{{ v$.form.email.email.$message }}</span
      >
    </ion-col>
  </ion-row>

  <ion-row>
    <ion-col>
      <!-- password -->
      <ion-input
        ref="inputPassword"
        label="Contraseña"
        label-placement="stacked"
        fill="outline"
        :value="form.password"
        :type="inputTypePassword"
        :class="{
          'input-error': v$.form.password.$invalid && v$.form.password.$dirty,
        }"
        @ion-input="form.password = $event.detail.value as any"
        @keydown.enter="emits('enterPressed')"
        @click="v$.form.password.$touch()"
      >
        <ion-icon slot="start" :icon="fingerPrintOutline"> </ion-icon>

        <ion-button
          slot="end"
          fill="clear"
          @click="
            inputTypePassword == 'password'
              ? (inputTypePassword = 'text')
              : (inputTypePassword = 'password')
          "
        >
          <ion-icon
            v-if="inputTypePassword == 'text'"
            :icon="eyeOffOutline"
          ></ion-icon>

          <ion-icon
            v-if="inputTypePassword == 'password'"
            :icon="eyeOutline"
          ></ion-icon>
        </ion-button>
      </ion-input>

      <!-- errors -->
      <span
        class="error ion-padding-start"
        v-if="v$.form.password.$dirty && v$.form.password.required.$invalid"
        >{{ v$.form.password.required.$message }}</span
      >
    </ion-col>
  </ion-row>
</template>

<script setup lang="ts">
import { IonInput, IonIcon, IonButton } from "@ionic/vue";
import { ref } from "vue";
import {
  eyeOffOutline,
  eyeOutline,
  fingerPrintOutline,
  mailOpenOutline,
} from "ionicons/icons";
import useVuelidate from "@vuelidate/core";
import { required, helpers, email } from "@vuelidate/validators";
import { useRouter } from "vue-router";
import { watch } from "vue";

const router = useRouter();
defineExpose({ getData });
const emits = defineEmits(["formStatus", "enterPressed"]);
const inputTypePassword = ref("password" as "text" | "password");
const form = ref({
  // email: "admin@admin.com",
  // password: "d2f%PF",
  email: "",
  password: "",
});
const spinners = ref({
  buttonLogin: false,
  buttonForgotPassword: false,
  buttonCreateAccount: false,
});

const messageError = {
  email: "Correo electrónico no valido",
  required: "Campo requerido",
};
const rules = {
  form: {
    email: {
      required: helpers.withMessage(messageError.required, required),
      email: helpers.withMessage("Correo no valido", email),
    },
    password: {
      required: helpers.withMessage(messageError.required, required),
    },
  },
};
const v$ = useVuelidate(rules, { form });

// watch
watch(form.value, (newValue, oldValue) => {
  console.log(!v$.value.$invalid);
  emits("formStatus", !v$.value.$invalid);
});

// functions
function getData() {
  v$.value.$validate();
  if (!v$.value.$invalid) {
    return {
      email: form.value.email,
      password: form.value.password,
    };
  } else return undefined;
}
</script>

<style scoped>
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
.main-content {
  background-image: "https://image.winudf.com/v2/image/Y29tLnNhcmFzLkJlc3RNaW5pbWFsaXN0V2FsbHBhcGVyX3NjcmVlbl81Xzk4dHZtbnNw/screen-5.jpg?h=800&fakeurl=1&type=.jpg" !important;
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
  .main-section {
    float: right;
  }
}
@media only screen and (min-width: 992px) {
  .img-fondo {
    width: 100%;
    height: auto;
    position: absolute;
  }
  .card-form {
    margin-top: 12vh;
  }
}
@media only screen and (min-width: 1200px) {
  .img-fondo {
    width: 100%;
    height: 50%;
    position: absolute;
  }
  .card-form {
    margin-top: 4vh;
  }
}
</style>
