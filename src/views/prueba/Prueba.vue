<template>
  <ion-page class="page-container">
    <ion-header class="ion-no-border">
      <ion-toolbar class="container-page">
        <ion-title>ss</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-row>
        <ion-col size="6">
          <div class="gradient-border">
            <ion-card>
              <ion-card-content>ssss</ion-card-content>
            </ion-card>
          </div>
        </ion-col>
      </ion-row>
    </ion-content>
  </ion-page>
</template>

<script lang="ts" setup>
import { IonPage } from "@ionic/vue";
</script>

<style scoped>
.gradient-border {
  --border-width: 4px;
  position: relative;
  display: inline-flex; /* Cambiado a inline-flex para ajustarse al contenido */
  justify-content: center;
  align-items: center;
  width: auto; /* Cambiado a auto para ajustarse al contenido */
  height: auto;
  padding: var(--border-width); /* Añadido padding para el borde */
  font-family: Lato, sans-serif;
  font-size: 2.5rem;
  text-transform: uppercase;
  color: white;
  border-radius: 4px;
}

.gradient-border::after {
  position: absolute;
  content: "";
  top: 0;
  left: 0;
  z-index: -1;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    60deg,
    hsl(224, 85%, 66%),
    hsl(269, 85%, 66%),
    hsl(314, 85%, 66%),
    hsl(359, 85%, 66%),
    hsl(44, 85%, 66%),
    hsl(89, 85%, 66%),
    hsl(134, 85%, 66%),
    hsl(179, 85%, 66%)
  );
  background-size: 300% 300%;
  background-position: 0 50%;
  border-radius: inherit; /* Heredar el border-radius del padre */
  animation: moveGradient 4s alternate infinite;
}

@keyframes moveGradient {
  50% {
    background-position: 100% 50%;
  }
}

/* Asegúrate de que el ion-card ocupe todo el espacio disponible */
ion-card {
  width: 100%;
  margin: 0;
}
</style>
