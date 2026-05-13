<template>
  <div>
    <ion-card class="shadow-1">
      <ion-card-content>
        <ion-list>
          <ion-row v-for="user in userDisplay" :key="user.value">
            <ion-col size="6" style="display: flex; align-items: center">
              <ion-label style="color: var(--ion-text-color)">
                <b>{{ user.text }}</b>
              </ion-label>
            </ion-col>

            <ion-col size="6" style="display: flex; justify-content: end">
              <!-- fields that are neither emailVerified nor userDisabled -->
              <div
                v-if="user.name === 'email'"
                style="display: flex; align-items: center; height: 28px"
                @mouseenter="emailValueHover = true"
                @mouseleave="emailValueHover = false"
              >
                <ion-label
                  :class="{ 'slide-left': emailValueHover }"
                  style="
                    color: var(--ion-text-color);
                    transition: transform 0.3s ease;
                  "
                >
                  {{ user.value }}
                </ion-label>
                <ion-button
                  v-if="emailValueHover"
                  size="small"
                  fill="clear"
                  @click="
                    copyToClipboard({ content: user.value.toString() });
                    emailValueHover = false;
                  "
                >
                  <ion-icon :icon="copyOutline"></ion-icon>
                </ion-button>
              </div>

              <!-- normal fields that are not email -->
              <ion-label
                v-else-if="
                  user.name !== 'emailVerified' && user.name !== 'userDisabled'
                "
                style="color: var(--ion-text-color)"
              >
                {{ user.value }}
              </ion-label>

              <!-- emailVerified and userDisabled -->
              <ion-chip v-else :color="user.value == 1 ? 'danger' : 'primary'">
                {{ user.value == 0 ? "No" : "Si" }}
              </ion-chip>
            </ion-col>
            <hr class="style1" />
          </ion-row>
        </ion-list>
      </ion-card-content>
    </ion-card>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, watch } from "vue";
import { User } from "@/services/interfaces";
import { copyOutline } from "ionicons/icons";
import { IonButton, IonCard, IonCardContent, IonChip, IonCol, IonIcon, IonLabel, IonList, IonRow, toastController } from "@ionic/vue";

// controllers
import SystemController from "@/controllers/systemController";
const systemController = new SystemController();

// vars
const props = defineProps<{
  userProp: User;
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
const emailValueHover = ref(false);
// end vars

onMounted(() => {
  // updateUserDisplay(props.userProp);
});

watch(
  () => props.userProp,
  (newVal) => {
    updateUserDisplay(newVal);
  },
  { deep: true, immediate: true },
);

// functions
async function copyToClipboard(params: { content: string }) {
  const { content } = params;
  try {
    await navigator.clipboard.writeText(content);
    await systemController.presentToast({
      message: "Email copiado al portapapeles",
      duration: 2000,
      position: "bottom",
    });
  } catch (e: unknown) {
    const toast = await toastController.create({
      message: "Error al copiar al portapapeles",
      color: "danger",
    });
    toast.present();
    console.error(e);
  }
}
</script>

<style scoped>
.slide-left {
  transform: translateX(-8px);
}
</style>
