<template>
  <!-- name -->
  <ion-row>
    <ion-col>
      <ion-input
        autocomplete="name"
        label-placement="stacked"
        label="Nombre"
        fill="outline"
        :value="form.name"
        :error-text="v$.form.name.$errors[0]?.$message.toString()"
        :class="{
          'ion-invalid': v$.form.name.$invalid && v$.form.name.$dirty,
          'ion-touched': v$.form.name.$dirty,
        }"
        @ion-input="form.name = $event.detail.value!.toString()"
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
        fill="outline"
        label="Usuario"
        :value="form.user"
        :error-text="v$.form.user.$errors[0]?.$message.toString()"
        :class="{
          'ion-invalid': v$.form.user.$invalid && v$.form.user.$dirty,
          'ion-touched': v$.form.user.$dirty,
        }"
        @ion-input="form.user = $event.detail.value!.toString()"
        @click="v$.form.user.$touch()"
      >
        <ion-icon slot="start" :icon="personOutline"></ion-icon>
      </ion-input>
    </ion-col>
  </ion-row>

  <!-- email -->
  <ion-row>
    <ion-col>
      <ion-input
        autocomplete="email"
        label-placement="stacked"
        fill="outline"
        label="Correo electrónico"
        :value="form.email"
        :error-text="v$.form.email.$errors[0]?.$message.toString()"
        :class="{
          'ion-invalid': v$.form.email.$invalid && v$.form.email.$dirty,
          'ion-touched': v$.form.email.$dirty,
        }"
        @ion-input="form.email = $event.detail.value!.toString()"
        @click="v$.form.email.$touch()"
      >
        <ion-icon slot="start" :icon="mailOpenOutline"></ion-icon>
      </ion-input>
    </ion-col>
  </ion-row>

  <!-- password -->
  <ion-row>
    <ion-col>
      <ion-input
        label-placement="stacked"
        fill="outline"
        label="Contraseña"
        :value="form.password"
        :error-text="v$.form.password.$errors[0]?.$message.toString()"
        :type="inputTypePassword1"
        :class="{
          'ion-invalid': v$.form.password.$invalid && v$.form.password.$dirty,
          'ion-touched': v$.form.password.$dirty,
        }"
        :clear-on-edit="false"
        @ion-input="form.password = $event.detail.value!.toString()"
        @click="v$.form.password.$touch()"
      >
        <ion-icon slot="start" :icon="keyOutline"> </ion-icon>
        <ion-input-password-toggle slot="end"></ion-input-password-toggle>
      </ion-input>
    </ion-col>
  </ion-row>

  <!-- password_confirmation -->
  <ion-row>
    <ion-col>
      <ion-input
        label-placement="stacked"
        fill="outline"
        label="Repite contraseña"
        :value="form.password_confirmation"
        :error-text="v$.form.password_confirmation.$errors[0]?.$message.toString()"
        :type="inputTypePassword2"
        :class="{
          'ion-invalid': v$.form.password_confirmation.$invalid && v$.form.password_confirmation.$dirty,
          'ion-touched': v$.form.password_confirmation.$dirty,
        }"
        :clear-on-edit="false"
        @ion-input="form.password_confirmation = $event.detail.value!.toString()"
        @click="v$.form.password_confirmation.$touch()"
        @keydown.enter="emits('enterPressed')"
      >
        <ion-icon slot="start" :icon="keyOutline"></ion-icon>
        <ion-input-password-toggle slot="end"></ion-input-password-toggle>
      </ion-input>
    </ion-col>
  </ion-row>
</template>

<script setup lang="ts">
import { IonInput, IonIcon } from "@ionic/vue";
import { onMounted, ref, watch } from "vue";
import {
  manOutline,
  personOutline,
  mailOpenOutline,
  keyOutline,
} from "ionicons/icons";
import useVuelidate from "@vuelidate/core";
import {
  required,
  email,
  helpers,
  minLength,
  maxLength,
} from "@vuelidate/validators";
import { faker } from "@faker-js/faker";

// componente props
const props = withDefaults(
  defineProps<{
    form?: {
      user: string;
      name: string;
      email: string;
      password: string;
       password_confirmation: string;
    };
  }>(),
  {
    form: () => ({
      user: "",
      name: "",
      email: "",
      password: "",
      password_confirmation: "",
    }),
  },
);
const emits = defineEmits(["formStatus", "enterPressed"]);
defineExpose({ getData, setFormData, generateRandomData });
// end componente props

// vars
const inputTypePassword1 = ref("password" as "text" | "password");
const inputTypePassword2 = ref("password" as "text" | "password");
const form = ref(props.form);

// validation
const samePassword = () => form.value.password == form.value.password_confirmation;
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
    password: {
      required: helpers.withMessage(messageError.required, required),
      minLength: helpers.withMessage(
        "La contraseña debe tener al menos 8 caracteres",
        minLength(8),
      ),
      regexLower: helpers.withMessage(
        "La contraseña debe contener al menos una letra minúscula",
        helpers.regex(/[a-z]/),
      ),
      regexUpper: helpers.withMessage(
        "La contraseña debe contener al menos una letra mayúscula",
        helpers.regex(/[A-Z]/),
      ),
      regexNumber: helpers.withMessage(
        "La contraseña debe contener al menos un número",
        helpers.regex(/[0-9]/),
      ),
      regexSpecial: helpers.withMessage(
        "La contraseña debe contener al menos un carácter especial",
        helpers.regex(/[@$!%*?&]/),
      ),
    },
    password_confirmation: {
      required: helpers.withMessage(messageError.required, required),
      same: helpers.withMessage("Las contraseñas no coinciden", samePassword),
    },
  },
};
const v$ = useVuelidate(rules, { form });
// end vars

onMounted(() => {
  generateRandomData();
});
watch(form.value, () => {
  emits("formStatus", !v$.value.$invalid);
});
watch(
  () => props.form,
  (newForm) => {
    form.value = newForm;
  },
);
// end life

// functions
function getData():
  | { name: string; user: string; email: string; password: string; password_confirmation: string }
  | undefined {
  v$.value.$validate();
  if (!v$.value.$invalid) {
    return {
      name: form.value.name,
      user: form.value.user,
      email: form.value.email,
      password: form.value.password,
      password_confirmation: form.value.password_confirmation,
    };
  } else return undefined;
}

function generateRandomData() {
  form.value.user = faker.internet.username();
  form.value.name = faker.person.fullName();
  form.value.email = faker.internet.email();
  form.value.password = faker.internet.password() + "1@";
  form.value.password_confirmation = form.value.password;
}

function setFormData(data: {
  name: string;
  user: string;
  email: string;
  password: string;
}) {
  form.value.name = data.name;
  form.value.user = data.user;
  form.value.email = data.email;
  form.value.password = data.password;
  form.value.password_confirmation = data.password;
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
