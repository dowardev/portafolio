<template>
  <ion-content class="ion-padding">
    <ion-item
      button
      lines="none"
      @click="openRoute('login')"
      v-if="!userLogged"
    >
      <ion-icon :icon="logInOutline" slot="start"></ion-icon>
      <ion-label>Iniciar sesión</ion-label>
    </ion-item>
    <ion-item
      button
      lines="none"
      @click="openRoute('signup')"
      v-if="!userLogged"
      disabled
    >
      <ion-icon :icon="personAddOutline" slot="start"></ion-icon>
      <ion-label>Registrar</ion-label>
    </ion-item>
    <ion-item button lines="none" @click="userLogout()" v-if="userLogged">
      <ion-icon :icon="logOutOutline" slot="start"></ion-icon>
      <ion-label>Salir</ion-label>
    </ion-item>
  </ion-content>
</template>

<script>
import { IonContent } from "@ionic/vue";
import { defineComponent } from "vue";
import { personAddOutline, logInOutline, logOutOutline } from "ionicons/icons";

export default defineComponent({
  name: "PopoverSessionOptions",
  components: { IonContent },
  setup() {
    return {
      personAddOutline,
      logInOutline,
      logOutOutline,
    };
  },
});
</script>
