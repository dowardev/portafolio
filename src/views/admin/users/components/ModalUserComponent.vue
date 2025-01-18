<template>
  <div>
    <ion-card class="shadow-1">
      <ion-card-content>
        <ion-list>
          <ion-row v-for="user in userDisplay" :key="user.value">
            <ion-col size-xs="12" size-md="6">
              <ion-label style="color: var(--ion-text-color)"
                ><b>{{ user.text }}</b></ion-label
              >
            </ion-col>

            <ion-col
              size-xs="12"
              size-md="6"
              style="display: flex; justify-content: end"
            >
              <ion-label
                v-if="
                  user.name != 'emailVerified' && user.name != 'userDisabled'
                "
                style="color: var(--ion-text-color)"
              >
                {{ user.value }}
              </ion-label>

              <ion-label v-else style="color: var(--ion-text-color)">
                {{ user.value == 0 ? "No" : "Si" }}
              </ion-label>
            </ion-col>
          </ion-row>
        </ion-list>
      </ion-card-content>
    </ion-card>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive } from "vue";
import { User } from "@/services/interfaces";

// vars
const props = defineProps<{
  userProp: User;
  statusProp: string;
}>();
const userDisplay = reactive<
  { name: string; text: string; value: string | number }[]
>([]);

onMounted(() => {
  Object.assign(userDisplay, [
    { name: "id", text: "id", value: props.userProp.id },
    { name: "name", text: "Nombre", value: props.userProp.name },
    { name: "email", text: "Email", value: props.userProp.email },
    {
      name: "emailVerified",
      text: "Email verificado",
      value: props.userProp.isEmailVerified,
    },
    {
      name: "userDisabled",
      text: "Usuario deshabilitado",
      value: props.userProp.isDisabled,
    },
  ]);
});
</script>
