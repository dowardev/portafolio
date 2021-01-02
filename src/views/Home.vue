<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <ion-row>
        <ion-col size="12"
          ><img
            src="../../public/assets/portafolio/dowar.png"
            alt=""
            id="img-logo"
        /></ion-col>
      </ion-row>
      <!-- Descripcion -->
      <section id="section-descripcion">
        <ion-row>
          <ion-col size="12">
            <img
              src="../../public/assets/portafolio/gonzalo.png"
              alt=""
              id="img-perfil"
              class="center"
            />
          </ion-col>
          <ion-col size="12" class="ion-padding">
            <div style="text-align: center">
              <div class="wrapper">
                <div class="letters">
                  <span class="letter">G</span><span class="letter">o</span
                  ><span class="letter">n</span><span class="letter">z</span
                  ><span class="letter">a</span><span class="letter">l</span
                  ><span class="letter">o</span><span class="letter"></span
                  ><span class="letter">P</span> <span class="letter">o</span
                  ><span class="letter">n</span><span class="letter">c</span
                  ><span class="letter">e</span><span class="letter"></span>
                </div>
                <p>Desarrollador de aplicaciones y sitios web</p>
              </div>
            </div>
          </ion-col>
        </ion-row>
        <ion-row>
          <ion-col size="12" class="ion-padding texto-bienvenida">
            <h5 style="text-align: center">
              Hola!, Es un gusto tenerte aqui <br />
              Cualquier cosa que necesites te ayudare con mucho gusto.
            </h5>
          </ion-col>
          <ion-col size="12" style="display: flex; justify-content: center"
            ><img
              src="https://www.codewars.com/users/dowar/badges/small"
              alt=""
              srcset=""
              @click="navegador('https://www.codewars.com/users/dowar/')"
          /></ion-col>
          <ion-col style="display: flex; justify-content: center">
            <ion-row id="iconos-redes">
              <ion-button
                fill="clear"
                v-on:click="navegador('http://t.me/dowar')"
              >
                <svg style="width: 24px; height: 24px" viewBox="0 0 24 24">
                  <path
                    fill="#777777"
                    d="M9.78,18.65L10.06,14.42L17.74,7.5C18.08,7.19 17.67,7.04 17.22,7.31L7.74,13.3L3.64,12C2.76,11.75 2.75,11.14 3.84,10.7L19.81,4.54C20.54,4.21 21.24,4.72 20.96,5.84L18.24,18.65C18.05,19.56 17.5,19.78 16.74,19.36L12.6,16.3L10.61,18.23C10.38,18.46 10.19,18.65 9.78,18.65Z"
                  />
                </svg>
              </ion-button>
              <ion-button expand="block" fill="clear" v-on:click="mail">
                <svg style="width: 24px; height: 24px" viewBox="0 0 24 24">
                  <path
                    fill="#777777"
                    d="M20,8L12,13L4,8V6L12,11L20,6M20,4H4C2.89,4 2,4.89 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V6C22,4.89 21.1,4 20,4Z"
                  />
                </svg>
              </ion-button>
              <ion-button
                fill="clear"
                v-on:click="
                  navegador('https://mastodon.social/web/accounts/864151')
                "
              >
                <svg
                  style="width: 24px; height: 24px"
                  viewBox="0 0 24 24"
                  enable-background="green"
                >
                  <path
                    fill="#777777"
                    d="M20.94,14C20.66,15.41 18.5,16.96 15.97,17.26C14.66,17.41 13.37,17.56 12,17.5C9.75,17.39 8,16.96 8,16.96V17.58C8.32,19.8 10.22,19.93 12.03,20C13.85,20.05 15.47,19.54 15.47,19.54L15.55,21.19C15.55,21.19 14.27,21.87 12,22C10.75,22.07 9.19,21.97 7.38,21.5C3.46,20.45 2.78,16.26 2.68,12L2.67,8.57C2.67,4.23 5.5,2.96 5.5,2.96C6.95,2.3 9.41,2 11.97,2H12.03C14.59,2 17.05,2.3 18.5,2.96C18.5,2.96 21.33,4.23 21.33,8.57C21.33,8.57 21.37,11.78 20.94,14M18,8.91C18,7.83 17.7,7 17.15,6.35C16.59,5.72 15.85,5.39 14.92,5.39C13.86,5.39 13.05,5.8 12.5,6.62L12,7.5L11.5,6.62C10.94,5.8 10.14,5.39 9.07,5.39C8.15,5.39 7.41,5.72 6.84,6.35C6.29,7 6,7.83 6,8.91V14.17H8.1V9.06C8.1,8 8.55,7.44 9.46,7.44C10.46,7.44 10.96,8.09 10.96,9.37V12.16H13.03V9.37C13.03,8.09 13.53,7.44 14.54,7.44C15.44,7.44 15.89,8 15.89,9.06V14.17H18V8.91Z"
                  />
                </svg>
              </ion-button>
              <ion-button
                fill="clear"
                v-on:click="navegador('https://twitter.com/dowar_r')"
              >
                <svg style="width: 24px; height: 24px" viewBox="0 0 24 24">
                  <path
                    fill="#777777"
                    d="M22.46,6C21.69,6.35 20.86,6.58 20,6.69C20.88,6.16 21.56,5.32 21.88,4.31C21.05,4.81 20.13,5.16 19.16,5.36C18.37,4.5 17.26,4 16,4C13.65,4 11.73,5.92 11.73,8.29C11.73,8.63 11.77,8.96 11.84,9.27C8.28,9.09 5.11,7.38 3,4.79C2.63,5.42 2.42,6.16 2.42,6.94C2.42,8.43 3.17,9.75 4.33,10.5C3.62,10.5 2.96,10.3 2.38,10C2.38,10 2.38,10 2.38,10.03C2.38,12.11 3.86,13.85 5.82,14.24C5.46,14.34 5.08,14.39 4.69,14.39C4.42,14.39 4.15,14.36 3.89,14.31C4.43,16 6,17.26 7.89,17.29C6.43,18.45 4.58,19.13 2.56,19.13C2.22,19.13 1.88,19.11 1.54,19.07C3.44,20.29 5.7,21 8.12,21C16,21 20.33,14.46 20.33,8.79C20.33,8.6 20.33,8.42 20.32,8.23C21.16,7.63 21.88,6.87 22.46,6Z"
                  />
                </svg>
              </ion-button>
              <ion-button
                expand="block"
                fill="clear"
                v-on:click="navegador('https://gitlab.com/gonzam4')"
              >
                <svg style="width: 24px; height: 24px" viewBox="0 0 24 24">
                  <path
                    fill="#777777"
                    d="M21.94 13.11L20.89 9.89C20.89 9.86 20.88 9.83 20.87 9.8L18.76 3.32C18.65 3 18.33 2.75 17.96 2.75C17.6 2.75 17.28 3 17.17 3.33L15.17 9.5H8.84L6.83 3.33C6.72 3 6.4 2.75 6.04 2.75H6.04C5.67 2.75 5.35 3 5.24 3.33L3.13 9.82C3.13 9.82 3.13 9.83 3.13 9.83L2.06 13.11C1.9 13.61 2.07 14.15 2.5 14.45L11.72 21.16C11.89 21.28 12.11 21.28 12.28 21.15L21.5 14.45C21.93 14.15 22.1 13.61 21.94 13.11M8.15 10.45L10.72 18.36L4.55 10.45M13.28 18.37L15.75 10.78L15.85 10.45H19.46L13.87 17.61M17.97 3.94L19.78 9.5H16.16M14.86 10.45L13.07 15.96L12 19.24L9.14 10.45M6.03 3.94L7.84 9.5H4.23M3.05 13.69C2.96 13.62 2.92 13.5 2.96 13.4L3.75 10.97L9.57 18.42M20.95 13.69L14.44 18.42L14.46 18.39L20.25 10.97L21.04 13.4C21.08 13.5 21.04 13.62 20.95 13.69"
                  />
                </svg>
              </ion-button>
              <ion-button
                fill="clear"
                v-on:click="
                  navegador(
                    'https://www.linkedin.com/in/jes%C3%BAs-gonzalo-p-993531179/'
                  )
                "
              >
                <svg style="width: 24px; height: 24px" viewBox="0 0 24 24">
                  <path
                    fill="#777777"
                    d="M19 3A2 2 0 0 1 21 5V19A2 2 0 0 1 19 21H5A2 2 0 0 1 3 19V5A2 2 0 0 1 5 3H19M18.5 18.5V13.2A3.26 3.26 0 0 0 15.24 9.94C14.39 9.94 13.4 10.46 12.92 11.24V10.13H10.13V18.5H12.92V13.57C12.92 12.8 13.54 12.17 14.31 12.17A1.4 1.4 0 0 1 15.71 13.57V18.5H18.5M6.88 8.56A1.68 1.68 0 0 0 8.56 6.88C8.56 5.95 7.81 5.19 6.88 5.19A1.69 1.69 0 0 0 5.19 6.88C5.19 7.81 5.95 8.56 6.88 8.56M8.27 18.5V10.13H5.5V18.5H8.27Z"
                  />
                </svg>
              </ion-button>
              <ion-button
                fill="clear"
                v-on:click="navegador('https://dev.to/dowar')"
              >
                <svg style="width: 24px; height: 24px" viewBox="0 0 24 24">
                  <path
                    fill="#777777"
                    d="M7.73 11.93C7.73 13.65 7.71 13.76 7.5 14C7.31 14.17 7.12 14.23 6.74 14.23L6.23 14.24L6.2 11.97L6.18 9.7H6.7C7.05 9.7 7.3 9.77 7.47 9.91C7.71 10.12 7.73 10.16 7.73 11.93M22 7.5V16.5C22 17.61 21.11 18.5 20 18.5H4C2.89 18.5 2 17.61 2 16.5V7.5C2 6.39 2.89 5.5 4 5.5H20C21.11 5.5 22 6.39 22 7.5M8.93 11.73C8.9 9.89 8.88 9.74 8.64 9.34C8.24 8.66 7.79 8.5 6.28 8.5H5V15.5H6.21C7.54 15.5 8.1 15.33 8.5 14.79C8.91 14.26 9 13.81 8.93 11.73M13.12 8.5H11.64C10.15 8.5 10.14 8.5 9.93 8.78S9.7 9.21 9.7 12V14.96L9.97 15.23C10.22 15.5 10.28 15.5 11.68 15.5H13.12V14.31L12.03 14.27L10.93 14.24V12.6L11.61 12.57L12.27 12.53V11.34H10.88V9.7H13.12V8.5M19 8.56C19 8.5 18.7 8.5 18.34 8.5L17.66 8.56L17.07 10.91C16.69 12.39 16.45 13.18 16.4 13.04C16.32 12.77 15.26 8.6 15.26 8.55C15.26 8.5 14.95 8.5 14.58 8.5H13.89L14.3 10.05C14.5 10.92 14.89 12.33 15.11 13.2C15.45 14.55 15.57 14.85 15.86 15.14C16.06 15.36 16.31 15.5 16.47 15.5C16.8 15.5 17.23 15.16 17.37 14.77C17.5 14.5 19 8.69 19 8.56Z"
                  />
                </svg>
              </ion-button>
            </ion-row>
          </ion-col>
        </ion-row>
      </section>

      <ion-row>
        <ion-col>
          <ion-fab horizontal="center">
            <ion-fab-button v-on:click="$router.push('/informacion')">
              <ion-icon :icon="arrowForward"></ion-icon>
            </ion-fab-button>
          </ion-fab>
        </ion-col>
      </ion-row>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { IonPage, IonContent, IonFab, IonFabButton } from "@ionic/vue";
import { defineComponent } from "vue";
import { arrowForward } from "ionicons/icons";
import { isPlatform } from "@ionic/vue";

export default defineComponent({
  name: "Home",
  components: { IonPage, IonContent, IonFab, IonFabButton },
  setup() {
    return {
      arrowForward,
    };
  },
  methods: {
    mail() {
      if (
        isPlatform("desktop") ||
        isPlatform("mobile") ||
        isPlatform("mobileweb")
      ) {
        location.href = "mailto:contacto@dowar.xyz?Subject=Contacto%20laboral";
      }
    },
  },
});
</script>

<style scoped>
#img-perfil {
  border-radius: 50%;
  width: 182px;
}
.center {
  display: block;
  margin-left: auto;
  margin-right: auto;
  width: 50%;
}
/*iPhone 5, 5C, 5S, SE vertical */
@media only screen and (min-width: 320px) and (max-width: 568px) and (-webkit-min-device-pixel-ratio: 2) and (device-aspect-ratio: 320/568) {
  #img-perfil {
    border-radius: 50%;
    width: 145px;
  }
  .texto-bienvenida {
    margin-top: 28px;
  }
}
/* escritorio */
@media (min-width: 992px) {
  .img-proyecto {
    width: 241px;
  }
  #img-perfil {
    margin-top: 40px;
  }
  .texto-bienvenida {
    margin-top: 18px;
  }
  #section-descripcion {
    margin-top: 16px;
  }
  #img-logo {
    width: 215px;
  }
}
/* smartphones vertical */
@media (min-width: 320px) and (max-width: 480px) {
  .texto-bienvenida {
    margin-top: 21px;
  }
  #img-logo {
    width: 215px;
  }
  #img-perfil {
    width: 166px;
  }
}
/* smartphones horizontal */
@media (min-width: 481px) and (max-width: 767px) {
  #img-logo {
    width: 186px;
  }
  .texto-bienvenida {
    margin-top: 16px;
  }
}
/*tablet, ipad */
@media (min-width: 768px) and (max-width: 1024px) {
  #img-logo {
    width: 226px;
  }
  .texto-bienvenida {
    margin-top: 16px;
  }
}
/* iPhone 6 Plus, 6S Plus, 7 Plus, 8 Plus horizontal */
@media only screen and (min-width: 414px) and (max-width: 736px) and (device-aspect-ratio: 736/414) and (-webkit-min-device-pixel-ratio: 3) {
  .texto-bienvenida {
    margin-top: 14px;
  }
}
body {
  text-align: center;
  background-color: #1d1f20;
}
.wrapper {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 90%;
  font-size: 0;
  transform: translate(-50%);
}
p {
  font-family: sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: #eee;
  opacity: 0.3;
}
.letter {
  width: 21px;
  display: inline-block;
  vertical-align: middle;
  position: relative;
  overflow: hidden;
  margin: 0 0;
  font-family: sans-serif;
  font-size: 24px;
  font-weight: 600;
  line-height: 24px;
  text-transform: uppercase;
  color: #eee;
}
.letter:before {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  word-break: break-all;
  background-color: #1d1f20;
}
.letter:nth-child(1):before {
  content: "9413782506";
  margin-top: -72px;
  animation-name: letter1;
  animation-duration: 1.32s;
  animation-delay: 0.56s;
  animation-fill-mode: forwards;
}
@keyframes letter1 {
  from {
    margin-top: -72px;
  }
  to {
    margin-top: 24px;
  }
}
.letter:nth-child(2):before {
  content: "3246815907";
  margin-top: -48px;
  animation-name: letter2;
  animation-duration: 0.6933333333s;
  animation-delay: 0.74s;
  animation-fill-mode: forwards;
}
@keyframes letter2 {
  from {
    margin-top: -48px;
  }
  to {
    margin-top: 24px;
  }
}
.letter:nth-child(3):before {
  content: "5307264198";
  margin-top: -96px;
  animation-name: letter3;
  animation-duration: 0.256s;
  animation-delay: 0.92s;
  animation-fill-mode: forwards;
}
@keyframes letter3 {
  from {
    margin-top: -96px;
  }
  to {
    margin-top: 24px;
  }
}
.letter:nth-child(4):before {
  content: "2846105937";
  margin-top: -216px;
  animation-name: letter4;
  animation-duration: 3.024s;
  animation-delay: 0.16s;
  animation-fill-mode: forwards;
}
@keyframes letter4 {
  from {
    margin-top: -216px;
  }
  to {
    margin-top: 24px;
  }
}
.letter:nth-child(5):before {
  content: "7604953218";
  margin-top: -24px;
  animation-name: letter5;
  animation-duration: 0.36s;
  animation-delay: 0.82s;
  animation-fill-mode: forwards;
}
@keyframes letter5 {
  from {
    margin-top: -24px;
  }
  to {
    margin-top: 24px;
  }
}
.letter:nth-child(6):before {
  content: "8051374692";
  margin-top: -168px;
  animation-name: letter6;
  animation-duration: 3.01s;
  animation-delay: 0.14s;
  animation-fill-mode: forwards;
}
@keyframes letter6 {
  from {
    margin-top: -168px;
  }
  to {
    margin-top: 24px;
  }
}
.letter:nth-child(7):before {
  content: "9256410873";
  margin-top: -24px;
  animation-name: letter7;
  animation-duration: 0.24s;
  animation-delay: 0.88s;
  animation-fill-mode: forwards;
}
@keyframes letter7 {
  from {
    margin-top: -24px;
  }
  to {
    margin-top: 24px;
  }
}
.letter:nth-child(8):before {
  content: "1073954862";
  margin-top: -192px;
  animation-name: letter8;
  animation-duration: 0.7466666667s;
  animation-delay: 0.79s;
  animation-fill-mode: forwards;
}
@keyframes letter8 {
  from {
    margin-top: -192px;
  }
  to {
    margin-top: 24px;
  }
}
.letter:nth-child(9):before {
  content: "1205467938";
  margin-top: -24px;
  animation-name: letter9;
  animation-duration: 1.24s;
  animation-delay: 0.38s;
  animation-fill-mode: forwards;
}
@keyframes letter9 {
  from {
    margin-top: -24px;
  }
  to {
    margin-top: 24px;
  }
}
.letter:nth-child(10):before {
  content: "6431502798";
  margin-top: -48px;
  animation-name: letter10;
  animation-duration: 0.7733333333s;
  animation-delay: 0.71s;
  animation-fill-mode: forwards;
}
@keyframes letter10 {
  from {
    margin-top: -48px;
  }
  to {
    margin-top: 24px;
  }
}
.letter:nth-child(11):before {
  content: "6957081324";
  margin-top: -168px;
  animation-name: letter11;
  animation-duration: 3.43s;
  animation-delay: 0.02s;
  animation-fill-mode: forwards;
}
@keyframes letter11 {
  from {
    margin-top: -168px;
  }
  to {
    margin-top: 24px;
  }
}
.letter:nth-child(12):before {
  content: "5497380612";
  margin-top: -120px;
  animation-name: letter12;
  animation-duration: 0.7333333333s;
  animation-delay: 0.78s;
  animation-fill-mode: forwards;
}
@keyframes letter12 {
  from {
    margin-top: -120px;
  }
  to {
    margin-top: 24px;
  }
}
.letter:nth-child(13):before {
  content: "0689347251";
  margin-top: -72px;
  animation-name: letter13;
  animation-duration: 2.67s;
  animation-delay: 0.11s;
  animation-fill-mode: forwards;
}
@keyframes letter13 {
  from {
    margin-top: -72px;
  }
  to {
    margin-top: 24px;
  }
}
.letter:nth-child(14):before {
  content: "0576928314";
  margin-top: -144px;
  animation-name: letter14;
  animation-duration: 0.8914285714s;
  animation-delay: 0.74s;
  animation-fill-mode: forwards;
}
@keyframes letter14 {
  from {
    margin-top: -144px;
  }
  to {
    margin-top: 24px;
  }
}
.letter:nth-child(15):before {
  content: "0274159386";
  margin-top: 0px;
  animation-name: letter15;
  animation-duration: 0s;
  animation-delay: 0.22s;
  animation-fill-mode: forwards;
}
@keyframes letter15 {
  from {
    margin-top: 0px;
  }
  to {
    margin-top: 24px;
  }
}
.letter:nth-child(16):before {
  content: "3421569087";
  margin-top: -144px;
  animation-name: letter16;
  animation-duration: 1.8857142857s;
  animation-delay: 0.45s;
  animation-fill-mode: forwards;
}
@keyframes letter16 {
  from {
    margin-top: -144px;
  }
  to {
    margin-top: 24px;
  }
}
</style>
