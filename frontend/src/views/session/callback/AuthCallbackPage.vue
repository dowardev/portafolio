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
import { useRouter, useRoute } from "vue-router";
import { IonPage, IonContent, IonSpinner, IonButton } from "@ionic/vue";
import UserController from "@/controllers/userController";
import ServerConfig from "@/controllers/serverConfigController";
import { ssoApiConnector, dpopService, serverConfigController } from "@/main";

const router = useRouter();
const route = useRoute();
const userController = new UserController();

const loading = ref(true);
const error = ref("");

onMounted(async () => {
  const { code, state } = route.query;

  if (!code || typeof code !== "string") {
    error.value = "Código de autorización no recibido";
    loading.value = false;
    return;
  }

  try {
    await exchangeCodeForToken(code);
  } catch (e: any) {
    error.value = e?.message || "Error en la autenticación";
    loading.value = false;
  }
});

async function exchangeCodeForToken(code: string) {
  const dpopPublicKey = dpopService.getPublicKeyJwk();
  const data: Record<string, unknown> = {
    code,
    client_id: import.meta.env.VITE_SSO_CLIENT_ID,
    redirect_uri: `${window.location.origin}/auth/callback`,
  };

  if (dpopPublicKey) {
    data.dpop_public_key = JSON.stringify(dpopPublicKey);
  }

  const response = await ssoApiConnector.post<{
    token: string;
    token_type: string;
    expires_in: number;
    user: any;
  }>({
    url: "oauth/token",
    data,
  });

  console.log("Token response:", response);

  const token = `Bearer ${response.token}`;
  const tokenType = response.token_type;

  userController.storeUserToken({ token, tokenType });
  
  console.log("Token stored, loading user...");

  await userController.loadUser();
  
  console.log("User loaded successfully");
  loading.value = false;
  router.replace("/");
}

function redirectToSSO() {
  const ssoFrontendUrl = import.meta.env.VITE_SSO_FRONTEND_URL;
  const clientId = import.meta.env.VITE_SSO_CLIENT_ID;
  const redirectUri = `${window.location.origin}/auth/callback`;
  const state = crypto.randomUUID();
  const url = new URL("/login", ssoFrontendUrl);
  url.searchParams.set("client_id", clientId);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("state", state);
  window.location.href = url.toString();
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