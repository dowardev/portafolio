<template>
  <ion-page>
    <ion-header :translucent="true" class="ion-no-border" mode="ios">
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
                  <ion-accordion value="pwa" class="transparent">
                    <ion-item slot="header" class="transparent">
                      <ion-icon slot="start" :icon="browsersOutline"></ion-icon>
                      <ion-label>Navegador web</ion-label>
                    </ion-item>

                    <ion-list slot="content">
                      <ion-item
                        lines="none"
                        button
                        href="https://support.google.com/chrome/answer/9658361?hl=es&co=GENIE.Platform%3DDesktop"
                        target="_blank"
                      >
                        <ion-icon slot="start" :icon="logoChrome"></ion-icon>
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
                  <ion-accordion value="app-mobile" class="transparent">
                    <ion-item slot="header" class="transparent">
                      <ion-icon slot="start" :icon="logoAndroid"></ion-icon>
                      <ion-label>Android</ion-label>
                    </ion-item>

                    <ion-list slot="content">
                      <ion-item
                        lines="none"
                        href="https://appgallery.huawei.com/app/C106170885"
                        button
                        target="_blank"
                      >
                        <img
                          slot="start"
                          src="../../../assets/otros/huawei-appgallery.svg"
                          alt=""
                          style="width: 5%"
                        />
                        <ion-label>AppGallery</ion-label>
                      </ion-item>

                      <ion-item lines="none">
                        <img
                          slot="start"
                          src="../../../assets/otros/f-droid-svgrepo-com.svg"
                          alt=""
                          style="width: 5%"
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

          <ion-col size="12">
            <ion-card>
              <ion-card-header>
                <ion-card-title>Aplicación de escritorio</ion-card-title>
              </ion-card-header>

              <ion-card-content>
                <ion-accordion-group>
                  <ion-accordion value="app-mobile" class="transparent">
                    <ion-item slot="header" class="transparent">
                      <ion-icon slot="start" :icon="logoTux"></ion-icon>
                      <ion-label>GNU Linux</ion-label>
                    </ion-item>

                    <ion-list slot="content">
                      <ion-item lines="none">
                        <ion-icon
                          slot="start"
                          :icon="browsersOutline"
                        ></ion-icon>
                        <ion-label>Ejecutable</ion-label>
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
                  <ion-accordion value="magazine" class="transparent">
                    <ion-item slot="header" class="transparent">
                      <ion-icon slot="start" :icon="bookOutline"></ion-icon>
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
                          slot="start"
                          src="../../../assets/otros/flipboard.png"
                          alt=""
                          style="width: 5%"
                        />
                        <ion-label>Flipboard</ion-label>
                      </ion-item>

                      <ion-item lines="none">
                        <ion-icon slot="start" :icon="logoRss"></ion-icon>
                        <ion-label>RSS</ion-label>
                        <ion-chip>
                          <ion-label>Proximamente</ion-label>
                        </ion-chip>
                      </ion-item>
                    </ion-list>
                  </ion-accordion>

                  <ion-accordion value="audiovisual" class="transparent">
                    <ion-item slot="header" class="transparent">
                      <ion-icon slot="start" :icon="videocamOutline"></ion-icon>
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
                          slot="start"
                          src="../../../assets/otros/dailymotion-icon.svg"
                          alt=""
                          style="width: 5%"
                        />
                        <ion-label>Dailymotion</ion-label>
                      </ion-item>
                    </ion-list>
                  </ion-accordion>

                  <ion-accordion value="audio" class="transparent">
                    <ion-item slot="header" class="transparent">
                      <ion-icon slot="start" :icon="micOutline"></ion-icon>
                      <ion-label>Contenido auditivo</ion-label>
                    </ion-item>

                    <ion-list slot="content">
                      <ion-item lines="none">
                        <img
                          slot="start"
                          src="../../../assets/otros/spotify-icon.svg"
                          alt=""
                          style="width: 5%"
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

<script setup lang="ts">
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
import {
  closeOutline,
  browsersOutline,
  logoTux,
  logoAndroid,
  logoChrome,
  logoRss,
  bookOutline,
  micOutline,
  videocamOutline,
} from "ionicons/icons";

const pageTitle = "Mas informacion";

// functions
function closeModal() {
  modalController.dismiss();
}
</script>
