<template>
  <div>
    <ion-row>
      <ion-col>
        <ion-header
          v-if="!isPlatform('desktop') && !isPlatform('tablet')"
          class="fade-in-title ion-no-border"
        >
          <ion-toolbar style="--background: transparent">
            <ion-title size="large">{{ props.pageTitle }}</ion-title>
          </ion-toolbar>
        </ion-header>
      </ion-col>
    </ion-row>

    <ion-row class="center">
      <ion-col size-xs="12" size-md="12" size-lg="4">
        <div v-if="props.mainSegment == 'login'"><LoginComponent /></div>
        <div v-if="props.mainSegment == 'signup'">
          <SignupComponent />
        </div>
      </ion-col>
    </ion-row>
  </div>
</template>

<script setup lang="ts">
import { IonRow, IonCol, isPlatform } from "@ionic/vue";

// components
import LoginComponent from "../login/LoginPage.vue";
import SignupComponent from "../signup/SignUpPage.vue";

// vars
const props = defineProps({
  mainSegment: { default: "login", type: String },
  pageTitle: { type: String, required: true, default: "Iniciar sesión" },
});
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

.element-post-no-selected {
  border: 1px solid var(--ion-background-color);
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
