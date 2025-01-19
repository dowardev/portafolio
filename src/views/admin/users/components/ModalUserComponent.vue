<template>
  <div>
    <ion-card class="shadow-1">
      <ion-card-content>
        <ion-list>
          <ion-row v-for="user in userDisplay" :key="user.value">
            <ion-col size="6">
              <ion-label style="color: var(--ion-text-color)"
                ><b>{{ user.text }}</b></ion-label
              >
            </ion-col>

            <ion-col size="6" style="display: flex; justify-content: end">
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
            <hr id="pr" class="style1" />
          </ion-row>
        </ion-list>
      </ion-card-content>
    </ion-card>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, watch } from "vue";
import { User } from "@/services/interfaces";

// vars
const props = defineProps<{
  userProp: User;
  statusProp: string;
}>();
const userDisplay = reactive<
  { name: string; text: string; value: string | number }[]
>([]);

const updateUserDisplay = (user: User) => {
  Object.assign(userDisplay, [
    { name: "id", text: "id", value: user.id },
    { name: "name", text: "Nombre", value: user.name },
    { name: "email", text: "Email", value: user.email },
    {
      name: "emailVerified",
      text: "Email verificado",
      value: user.isEmailVerified,
    },
    {
      name: "userDisabled",
      text: "Usuario deshabilitado",
      value: user.isDisabled,
    },
  ]);
};

onMounted(() => {
  updateUserDisplay(props.userProp);
});

watch(
  () => props.userProp,
  (newVal) => {
    updateUserDisplay(newVal);
  },
  { deep: true, immediate: true },
);
</script>
