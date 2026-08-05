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
</template>

<script setup lang="ts">
import { IonCol, IonIcon, IonInput, IonRow } from "@ionic/vue";
import { ref, watch } from "vue";
import { manOutline, personOutline, mailOpenOutline } from "ionicons/icons";
import useVuelidate from "@vuelidate/core";
import {
  required,
  email,
  helpers,
  maxLength,
} from "@vuelidate/validators";

// componente props
const props = withDefaults(
  defineProps<{
    form?: {
      user: string;
      name: string;
      email: string;
    };
  }>(),
  {
    form: () => ({
      user: "",
      name: "",
      email: "",
    }),
  },
);
const emits = defineEmits(["formStatus", "enterPressed"]);
defineExpose({ getData, setFormData });
// end componente props

// vars
const form = ref(props.form);

// validation
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
};
const v$ = useVuelidate(rules, { form });
// end vars

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
function getData(): { name: string; user: string; email: string } | undefined {
  v$.value.$validate();
  if (!v$.value.$invalid) {
    return {
      name: form.value.name,
      user: form.value.user,
      email: form.value.email,
    };
  } else return undefined;
}

function setFormData(data: { name: string; user: string; email: string }) {
  form.value.name = data.name;
  form.value.user = data.user;
  form.value.email = data.email;
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
