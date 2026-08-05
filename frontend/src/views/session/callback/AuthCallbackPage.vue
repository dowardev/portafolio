<template>
  <ion-page>
    <ion-content :fullscreen="true" class="callback-content">
      <div class="callback-container">
        <ion-spinner v-if="loading" name="crescent" class="callback-spinner"></ion-spinner>
        <p v-if="loading">Autenticando...</p>
        <div v-if="error" class="error-container">
          <p class="error-message">{{ error }}</p>
          <ion-button @click="redirectToSSO">Intentar de nuevo</ion-button>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { IonPage, IonContent, IonSpinner, IonButton } from "@ionic/vue";
import UserController from "@/controllers/userController";
import { getSSOClient } from "@/ssoClientAccessor";

const router = useRouter();
const userController = new UserController();

const loading = ref(true);
const error = ref("");

onMounted(async () => {
  try {
    await getSSOClient().handleCallback(window.location.href);
    await userController.loadUser();
    loading.value = false;
    router.replace("/");
  } catch (e: unknown) {
    error.value = e instanceof Error ? e.message : "Error en la autenticación";
    loading.value = false;
  }
});

async function redirectToSSO() {
  await getSSOClient().loginWithRedirect({
    redirectUri: `${window.location.origin}/auth/callback`,
  });
}
</script>

<style scoped>
.callback-content {
  --background: var(--ion-background-color);
}

.callback-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 24px;
  text-align: center;
}

.callback-spinner {
  width: 48px;
  height: 48px;
  margin-bottom: 16px;
}

.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.error-message {
  color: var(--ion-color-danger);
  font-size: 16px;
}
</style>
