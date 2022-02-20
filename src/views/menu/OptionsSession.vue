<template>
  <ion-content>
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

<script lang="ts">
import { IonContent, popoverController } from "@ionic/vue";
import { defineComponent } from "vue";
import { personAddOutline, logInOutline, logOutOutline } from "ionicons/icons";
import userService from "../../services/user.vue";
import sessionService from "../../services/session.vue";

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
  data() {
    return { userLogged: false };
  },
  mounted() {
    this.getUserLogged();
  },
  methods: {
    closePopover() {
      popoverController.dismiss();
    },
    openRoute(route: string) {
      this.$router.push(route);
      this.closePopover();
    },
    async getUserLogged() {
      userService()
        .getUserToken()
        .then(async (response) => {
          if (response != null) {
            this.userLogged = true;
          }
        });
    },
    userLogout() {
      sessionService()
        .logout()
        .then(() => {
          userService().setUserToken("");
          this.userLogged = false;
        });
    },
  },
});
</script>
