<template>
  <ion-row>
    <ion-col>
      <ion-card>
        <ion-card-content>
          <ion-row>
            <!-- name -->
            <ion-col size="12">
              <ion-input
                type="text"
                autocomplete="name"
                label="Nombre"
                label-placement="stacked"
                fill="outline"
                :autofocus="true"
                :value="contactData.name"
                :class="{
                  'input-error': v$.contactData.name.$invalid,
                }"
                @ion-input="contactData.name = $event.detail.value as any"
                @click="v$.contactData.name.$touch()"
              >
              </ion-input>

              <!-- errors -->
              <span
                class="error"
                v-if="
                  v$.contactData.name.$dirty &&
                  v$.contactData.name.required.$invalid
                "
                >{{ v$.contactData.name.required.$message }}</span
              >
              <span
                class="error"
                v-if="
                  v$.contactData.name.$dirty &&
                  v$.contactData.name.alpha.$invalid
                "
                >{{ v$.contactData.name.alpha.$message }}</span
              >
            </ion-col>

            <!-- subject -->
            <ion-col size="12">
              <ion-input
                type="text"
                label="Asunto"
                label-placement="stacked"
                fill="outline"
                :value="contactData.subject"
                :spellcheck="true"
                :class="{
                  'input-error': v$.contactData.subject.$invalid,
                }"
                @ion-input="contactData.subject = $event.detail.value as any"
                @click="v$.contactData.subject.$touch()"
              >
              </ion-input>

              <!-- errors -->
              <span
                class="error"
                v-if="
                  v$.contactData.subject.$dirty &&
                  v$.contactData.subject.required.$invalid
                "
                >{{ v$.contactData.subject.required.$message }}</span
              >
              <span
                class="error"
                v-if="
                  v$.contactData.subject.$dirty &&
                  v$.contactData.subject.alpha.$invalid
                "
                >{{ v$.contactData.subject.alpha.$message }}</span
              >
            </ion-col>

            <!-- email -->
            <ion-col size="12">
              <ion-input
                label="Correo electrónico"
                label-placement="stacked"
                fill="outline"
                autocomplete="email"
                type="email"
                :value="contactData.email"
                :class="{
                  'input-error': v$.contactData.email.$invalid,
                }"
                @ion-input="contactData.email = $event.detail.value as any"
                @click="v$.contactData.email.$touch()"
              >
              </ion-input>

              <!-- errors -->
              <span
                class="error"
                v-if="
                  v$.contactData.email.$dirty &&
                  v$.contactData.email.required.$invalid
                "
                >{{ v$.contactData.email.required.$message }}</span
              >
              <span
                class="error"
                v-if="
                  v$.contactData.email.$dirty &&
                  v$.contactData.email.email.$invalid
                "
                >{{ v$.contactData.email.email.$message }}</span
              >
            </ion-col>

            <!-- description -->
            <ion-col size="12">
              <ion-textarea
                label="Descripción"
                label-placement="stacked"
                fill="outline"
                :value="contactData.description"
                :class="{
                  'input-error': v$.contactData.description.$invalid,
                }"
                @ion-input="
                  contactData.description = $event.detail.value as any
                "
                @click="v$.contactData.description.$touch()"
              >
              </ion-textarea>

              <!-- errors -->
              <span
                class="error"
                v-if="
                  v$.contactData.description.$dirty &&
                  v$.contactData.description.required.$invalid
                "
                >{{ v$.contactData.description.required.$message }}</span
              >
            </ion-col>
          </ion-row>
        </ion-card-content>
      </ion-card>
    </ion-col>
  </ion-row>
</template>

<script setup lang="ts">
import { IonInput, IonTextarea } from "@ionic/vue";
import { ref } from "vue";
import { email, helpers, required } from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";
import { watch } from "vue";

defineExpose({ getData });
const emits = defineEmits(["formStatus"]);

const pageTitle = "Formulario de contacto";
const spinners = ref({
  sendMessage: false,
});
const contactData = ref({
  name: "",
  subject: "",
  email: "",
  description: "",
});

const messageError = {
  required: "Campo requerido",
};
const rules = {
  contactData: {
    name: {
      required: helpers.withMessage(messageError.required, required),
      alpha: helpers.withMessage(
        "Solo texto",
        helpers.regex(/^[a-zA-ZñÑ\s]+$/)
      ),
    },
    email: {
      required: helpers.withMessage(messageError.required, required),
      email: helpers.withMessage("Correo no valido", email),
    },
    subject: {
      required: helpers.withMessage(messageError.required, required),
      alpha: helpers.withMessage(
        "Solo texto",
        helpers.regex(/^[a-zA-ZñÑ\s]+$/)
      ),
    },
    description: {
      required: helpers.withMessage(messageError.required, required),
    },
  },
};
const v$ = useVuelidate(rules, { contactData });

// watch
watch(contactData.value, (newValue, oldValue) => {
  console.log(!v$.value.$invalid);
  emits("formStatus", !v$.value.$invalid);
});

// functions
function getData() {
  v$.value.$validate();
  if (!v$.value.$invalid) {
    return {
      name: contactData.value.name,
      subject: contactData.value.subject,
      email: contactData.value.name,
      description: contactData.value.description,
    };
  } else return undefined;
}
</script>
