<template>
  <ion-page>
    <ion-header
      :translucent="true"
      collapse="fade"
      mode="ios"
      class="ion-no-border"
    >
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button
            menu="mainMenu"
            :smode="modeDesingElements"
          ></ion-menu-button>
        </ion-buttons>
        <ion-title>Iniciar sesión</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-row class="center">
        <ion-col size-xs="12" size-md="11">
          <section class="section-options">
            <ion-row>
              <ion-col size="12">
                <ion-segment
                  :value="mainSegment"
                  :mode="modeDesingElements"
                  scrollable
                  class="main-section"
                  @ion-change="mainSegment = $event.detail.value as string"
                >
                  <ion-segment-button
                    value="login"
                    @ion-change="mainSegment = 'login'"
                  >
                    <ion-label>Iniciar sesión</ion-label>
                  </ion-segment-button>

                  <ion-segment-button
                    value="signup"
                    @ion-change="mainSegment = 'signup'"
                  >
                    <ion-label>Registrar</ion-label>
                  </ion-segment-button>
                </ion-segment>
              </ion-col>
            </ion-row>
          </section>

          <section>
            <ion-row>
              <ion-col size="12" class="main-content" style="height: 85vh">
                <ion-row class="center">
                  <ion-col size-xs="12" size-md="12" size-lg="12">
                    <div v-if="mainSegment == 'login'"><LoginComponent /></div>
                    <div v-if="mainSegment == 'signup'">
                      <SignupComponent />
                    </div>
                  </ion-col>
                </ion-row>
                <!-- end posts -->
              </ion-col>
            </ion-row>
          </section>
        </ion-col>
      </ion-row>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonRow,
  IonCol,
  IonButtons,
  IonMenuButton,
  IonLabel,
  isPlatform,
  IonSegment,
  IonSegmentButton,
} from "@ionic/vue";
import { ref } from "vue";
import { required, helpers } from "@vuelidate/validators";

// components
import LoginComponent from "./login/LoginPage.vue";
import SignupComponent from "./signup/SignUpPage.vue";

const props = defineProps({
  type: { default: "login", type: String },
});

const modeDesingElements = isPlatform("ios") ? "ios" : "md";

const messageError = {
  email: "Correo electronico no valido",
  required: "Campo requerido",
};
const rules = {
  form: {
    email: {
      required: helpers.withMessage(messageError.required, required),
    },
    password: {
      required: helpers.withMessage(messageError.required, required),
    },
  },
};
const mainSegment = ref(props.type);
</script>

<style scoped>
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
.main-content {
  --wallpaper-main-content: url("https://image.winudf.com/v2/image/Y29tLnNhcmFzLkJlc3RNaW5pbWFsaXN0V2FsbHBhcGVyX3NjcmVlbl81Xzk4dHZtbnNw/screen-5.jpg?h=800&fakeurl=1&type=.jpg");
  --wallpaper-opacity: 0.8;
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
  .main-section {
    float: right;
  }
}
@media only screen and (min-width: 992px) {
  .img-fondo {
    width: 100%;
    height: auto;
    position: absolute;
  }
  .card-form {
    margin-top: 12vh;
  }
}
@media only screen and (min-width: 1200px) {
  .img-fondo {
    width: 100%;
    height: 50%;
    position: absolute;
  }
  .card-form {
    margin-top: 4vh;
  }
}
</style>
