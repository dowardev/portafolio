<template>
  <!-- user -->
  <ion-row>
    <ion-col>
      <ion-input
        type="email"
        label="Usuario o correo electrónico"
        label-placement="stacked"
        fill="outline"
        :value="form.email"
        :error-text="v$.form.email.$errors[0]?.$message.toString()"
        :class="{
          'ion-invalid': v$.form.email.$invalid && v$.form.email.$dirty,
          'ion-touched': v$.form.email.$dirty,
        }"
        @ion-input="form.email = $event.detail.value!.toString()"
        @keydown.enter="($refs as any).inputPassword.$el.setFocus()"
        @click="v$.form.email.$touch()"
      >
        <ion-icon slot="start" :icon="mailOpenOutline"> </ion-icon>
      </ion-input>
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
        :error-text="v$.form.password.$errors[0]?.$message.toString()"
        :type="inputTypePassword"
        :class="{
          'ion-invalid': v$.form.password.$invalid && v$.form.password.$dirty,
          'ion-touched': v$.form.password.$dirty,
        }"
        @ion-input="form.password = $event.detail.value!.toString()"
        @keydown.enter="emits('enterPressed')"
        @click="v$.form.password.$touch()"
      >
        <ion-icon slot="start" :icon="fingerPrintOutline"> </ion-icon>

        <ion-input-password-toggle slot="end"></ion-input-password-toggle>
      </ion-input>
    </ion-col>
  </ion-row>
</template>

<script setup lang="ts">
import { IonInput, IonIcon } from "@ionic/vue";
import { ref } from "vue";
import { fingerPrintOutline, mailOpenOutline } from "ionicons/icons";
import useVuelidate from "@vuelidate/core";
import { required, helpers, email } from "@vuelidate/validators";
import { useRouter } from "vue-router";
import { watch } from "vue";

defineExpose({ getData });
const emits = defineEmits(["formStatus", "enterPressed"]);
const inputTypePassword = ref("password" as "text" | "password");
const form = ref({
  email: "Janelle71@hotmail.com",
  password: "lLo4mbepPRKg8Lg1@",
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
  emits("formStatus", !v$.value.$invalid);
});

// functions
function getData(): { email: string; password: string } | undefined {
  v$.value.$validate();
  if (!v$.value.$invalid) {
    return {
      email: form.value.email,
      password: form.value.password,
    };
  } else return undefined;
}
</script>
