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
          <ion-button class="close-button" @click="closeModal()">
            <ion-icon :icon="closeOutline"></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-title>{{ pageTitle }}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-header collapse="condense" mode="ios">
        <ion-toolbar>
          <h1>{{ pageTitle }}</h1>
        </ion-toolbar>
      </ion-header>

      <ion-list>
        <ion-list-header>
          <ion-label> Nuestras aplicaciones </ion-label>
        </ion-list-header>
        <ion-row class="center">
          <ion-col size="12">
            <ion-card>
              <ion-card-header>
                <ion-card-title>PWA</ion-card-title>
              </ion-card-header>
              <ion-card-content>
                <ion-accordion-group>
                  <ion-accordion value="pwa">
                    <ion-item slot="header">
                      <ion-icon :icon="browsersOutline" slot="start"></ion-icon>
                      <ion-label>Navegador web</ion-label>
                    </ion-item>

                    <ion-list slot="content">
                      <ion-item
                        lines="none"
                        button
                        href="https://support.google.com/chrome/answer/9658361?hl=es&co=GENIE.Platform%3DDesktop"
                        target="_blank"
                      >
                        <ion-icon :icon="logoChrome" slot="start"></ion-icon>
                        <ion-label>Chrome</ion-label>
                      </ion-item>
                    </ion-list>
                  </ion-accordion>
                </ion-accordion-group>
              </ion-card-content>
            </ion-card>
          </ion-col>

          <ion-col size="12">
            <ion-card>
              <ion-card-header>
                <ion-card-title>Aplicación móvil</ion-card-title>
              </ion-card-header>

              <ion-card-content>
                <ion-accordion-group>
                  <ion-accordion value="app-mobile">
                    <ion-item slot="header">
                      <ion-icon :icon="logoAndroid" slot="start"></ion-icon>
                      <ion-label>Android</ion-label>
                    </ion-item>

                    <ion-list slot="content">
                      <ion-item lines="none">
                        <img
                          src="../../../../public/assets/otros/huawei-appgallery.svg"
                          alt=""
                          style="width: 5%"
                          slot="start"
                        />
                        <ion-label>AppGallery</ion-label>
                        <ion-chip>
                          <ion-label>Proximamente</ion-label>
                        </ion-chip>
                      </ion-item>

                      <ion-item lines="none">
                        <img
                          src="../../../../public/assets/otros/f-droid-svgrepo-com.svg"
                          alt=""
                          style="width: 5%"
                          slot="start"
                        />
                        <ion-label>F-Droid</ion-label>
                        <ion-chip>
                          <ion-label>Proximamente</ion-label>
                        </ion-chip>
                      </ion-item>
                    </ion-list>
                  </ion-accordion>
                </ion-accordion-group>
              </ion-card-content>
            </ion-card>
          </ion-col>
        </ion-row>
      </ion-list>

      <ion-list>
        <ion-list-header>
          <ion-label> Alternativas </ion-label>
        </ion-list-header>
        <ion-row class="center">
          <ion-col size="12">
            <ion-card>
              <ion-card-header>
                <ion-card-title
                  >Nuestro contenido en otras plataformas</ion-card-title
                >
              </ion-card-header>

              <ion-card-content>
                <ion-accordion-group>
                  <ion-accordion value="magazine">
                    <ion-item slot="header">
                      <ion-icon :icon="bookOutline" slot="start"></ion-icon>
                      <ion-label>Contenido escrito</ion-label>
                    </ion-item>

                    <ion-list slot="content">
                      <ion-item
                        lines="none"
                        button
                        href="https://flipboard.com/@gonzam4/dowar-blog-jgh0k43pz?from=share&utm_source=flipboard&utm_medium=curator_share"
                        target="_blank"
                      >
                        <img
                          src="../../../../public/assets/otros/flipboard.png"
                          alt=""
                          style="width: 5%"
                          slot="start"
                        />
                        <ion-label>Flipboard</ion-label>
                      </ion-item>

                      <ion-item lines="none">
                        <ion-icon :icon="logoRss" slot="start"></ion-icon>
                        <ion-label>RSS</ion-label>
                        <ion-chip>
                          <ion-label>Proximamente</ion-label>
                        </ion-chip>
                      </ion-item>
                    </ion-list>
                  </ion-accordion>

                  <ion-accordion value="audiovisual">
                    <ion-item slot="header">
                      <ion-icon :icon="videocamOutline" slot="start"></ion-icon>
                      <ion-label>Contenido audiovisual</ion-label>
                    </ion-item>

                    <ion-list slot="content">
                      <ion-item
                        lines="none"
                        button
                        href="https://www.dailymotion.com/glob_know"
                        target="_blank"
                      >
                        <img
                          src="../../../../public/assets/otros/dailymotion-icon.svg"
                          alt=""
                          style="width: 5%"
                          slot="start"
                        />
                        <ion-label>Dailymotion</ion-label>
                      </ion-item>
                    </ion-list>
                  </ion-accordion>

                  <ion-accordion value="audio">
                    <ion-item slot="header">
                      <ion-icon :icon="micOutline" slot="start"></ion-icon>
                      <ion-label>Contenido auditivo</ion-label>
                    </ion-item>

                    <ion-list slot="content">
                      <ion-item lines="none">
                        <img
                          src="../../../../public/assets/otros/spotify-icon.svg"
                          alt=""
                          style="width: 5%"
                          slot="start"
                        />
                        <ion-label>Spotify Podcast</ion-label>
                        <ion-chip>
                          <ion-label>Proximamente</ion-label>
                        </ion-chip>
                      </ion-item>
                    </ion-list>
                  </ion-accordion>
                </ion-accordion-group>
              </ion-card-content>
            </ion-card>
          </ion-col>
        </ion-row>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonItem,
  IonLabel,
  modalController,
  IonAccordionGroup,
  IonAccordion,
} from "@ionic/vue";
import { defineComponent } from "vue";
import {
  closeOutline,
  logoPwa,
  browsersOutline,
  downloadOutline,
  logoTux,
  logoWindows,
  logoApple,
  logoAndroid,
  logoFirefox,
  logoChrome,
  logoRss,
  bookOutline,
  micOutline,
  videocamOutline,
} from "ionicons/icons";

export default defineComponent({
  name: "AppsComponent",
  components: {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonItem,
    IonLabel,
    IonAccordionGroup,
    IonAccordion,
  },
  setup() {
    return {
      pageTitle: "Mas informacion",
      closeOutline,
      logoPwa,
      browsersOutline,
      downloadOutline,
      logoTux,
      logoWindows,
      logoApple,
      logoAndroid,
      logoFirefox,
      logoChrome,
      logoRss,
      bookOutline,
      micOutline,
      videocamOutline,
    };
  },
  data() {
    const darkMode = false as boolean | null;
    return {
      darkMode,
    };
  },
  methods: {
    closeModal() {
      modalController.dismiss();
    },
  },
});
</script>
