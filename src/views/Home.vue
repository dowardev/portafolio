<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <!-- Descripcion -->
      <section>
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
          <ion-col size="12" class="ion-padding" style="margin-top: 18px">
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
          <ion-col>
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
              <ion-button
                expand="block"
                fill="clear"
                v-on:click="
                  navegador(
                    'mailto:contacto@dowar.xyz?Subject=Contacto%20laboral'
                  )
                "
              >
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

      <!-- skills -->
      <section class="ion-padding">
        <h2>Conocimientos</h2>
        <ion-grid>
          <ion-row>
            <ion-col size-md="6" size-sm="12" size="12">
              <ion-card>
                <ion-card-header>
                  <ion-card-title>Desarrollo Front-End</ion-card-title>
                </ion-card-header>
                <ion-card-content>
                  <ion-col>
                    <!-- html -->
                    <svg width="24" height="24" viewBox="0 0 24 24">
                      <path
                        fill="#777777"
                        d="M12,17.56L16.07,16.43L16.62,10.33H9.38L9.2,8.3H16.8L17,6.31H7L7.56,12.32H14.45L14.22,14.9L12,15.5L9.78,14.9L9.64,13.24H7.64L7.93,16.43L12,17.56M4.07,3H19.93L18.5,19.2L12,21L5.5,19.2L4.07,3Z"
                      />
                    </svg>
                  </ion-col>
                  <ion-col>
                    <!-- css -->
                    <svg width="24" height="24" viewBox="0 0 24 24">
                      <path
                        fill="#777777"
                        d="M5,3L4.35,6.34H17.94L17.5,8.5H3.92L3.26,11.83H16.85L16.09,15.64L10.61,17.45L5.86,15.64L6.19,14H2.85L2.06,18L9.91,21L18.96,18L20.16,11.97L20.4,10.76L21.94,3H5Z"
                      />
                    </svg>
                  </ion-col>
                  <ion-col>
                    <!-- bootstrap -->
                    <svg width="24" height="24" viewBox="0 0 24 24">
                      <path
                        fill="#777777"
                        d="M11.79 11.5H9.72V8.19H12.19C13.45 8.19 14.15 8.75 14.15 9.78C14.15 10.9 13.32 11.5 11.79 11.5M12.16 12.63H9.72V16.27L12.28 16.27C13.84 16.27 14.66 15.64 14.66 14.44S13.81 12.63 12.16 12.63M22 5.31V18.69C22 20.5 20.5 22 18.69 22H5.31C3.5 22 2 20.5 2 18.69V5.31C2 3.5 3.5 2 5.31 2H18.69C20.5 2 22 3.5 22 5.31M16 14.5C16 13.12 15.08 12.13 13.67 11.95V11.89C14.67 11.71 15.46 10.71 15.46 9.63C15.46 8.08 14.26 7.05 12.5 7.05H8.43V17.41H12.47C14.68 17.41 16 16.32 16 14.5Z"
                      />
                    </svg>
                  </ion-col>
                  <ion-col>
                    <!-- vuetify -->
                    <svg width="24" height="24" viewBox="0 0 24 24">
                      <path
                        fill="#777777"
                        d="M12,11.64L7.92,2H16.08L12,11.64M12,21.95L3.27,4.91H7.84L12,14.47L16.16,4.91H20.73L12,21.95Z"
                      />
                    </svg>
                  </ion-col>
                  <ion-col>
                    <!-- javascript -->
                    <svg width="24" height="24" viewBox="0 0 24 24">
                      <path
                        fill="#777777"
                        d="M3,3H21V21H3V3M7.73,18.04C8.13,18.89 8.92,19.59 10.27,19.59C11.77,19.59 12.8,18.79 12.8,17.04V11.26H11.1V17C11.1,17.86 10.75,18.08 10.2,18.08C9.62,18.08 9.38,17.68 9.11,17.21L7.73,18.04M13.71,17.86C14.21,18.84 15.22,19.59 16.8,19.59C18.4,19.59 19.6,18.76 19.6,17.23C19.6,15.82 18.79,15.19 17.35,14.57L16.93,14.39C16.2,14.08 15.89,13.87 15.89,13.37C15.89,12.96 16.2,12.64 16.7,12.64C17.18,12.64 17.5,12.85 17.79,13.37L19.1,12.5C18.55,11.54 17.77,11.17 16.7,11.17C15.19,11.17 14.22,12.13 14.22,13.4C14.22,14.78 15.03,15.43 16.25,15.95L16.67,16.13C17.45,16.47 17.91,16.68 17.91,17.26C17.91,17.74 17.46,18.09 16.76,18.09C15.93,18.09 15.45,17.66 15.09,17.06L13.71,17.86Z"
                      />
                    </svg>
                  </ion-col>
                  <ion-col>
                    <!-- Angular -->
                    <svg width="24" height="24" viewBox="0 0 24 24">
                      <path
                        fill="#777777"
                        d="M12,2.5L20.84,5.65L19.5,17.35L12,21.5L4.5,17.35L3.16,5.65L12,2.5M12,4.6L6.47,17H8.53L9.64,14.22H14.34L15.45,17H17.5L12,4.6M13.62,12.5H10.39L12,8.63L13.62,12.5Z"
                      />
                    </svg>
                  </ion-col>
                  <ion-col>
                    <!-- vue -->
                    <svg width="24" height="24" viewBox="0 0 24 24">
                      <path
                        fill="#777777"
                        d="M2,3H5.5L12,15L18.5,3H22L12,21L2,3M6.5,3H9.5L12,7.58L14.5,3H17.5L12,13.08L6.5,3Z"
                      />
                    </svg>
                  </ion-col>
                  <ion-col>
                    <!-- react -->
                    <svg width="24" height="24" viewBox="0 0 24 24">
                      <path
                        fill="#777777"
                        d="M12,10.11C13.03,10.11 13.87,10.95 13.87,12C13.87,13 13.03,13.85 12,13.85C10.97,13.85 10.13,13 10.13,12C10.13,10.95 10.97,10.11 12,10.11M7.37,20C8,20.38 9.38,19.8 10.97,18.3C10.45,17.71 9.94,17.07 9.46,16.4C8.64,16.32 7.83,16.2 7.06,16.04C6.55,18.18 6.74,19.65 7.37,20M8.08,14.26L7.79,13.75C7.68,14.04 7.57,14.33 7.5,14.61C7.77,14.67 8.07,14.72 8.38,14.77C8.28,14.6 8.18,14.43 8.08,14.26M14.62,13.5L15.43,12L14.62,10.5C14.32,9.97 14,9.5 13.71,9.03C13.17,9 12.6,9 12,9C11.4,9 10.83,9 10.29,9.03C10,9.5 9.68,9.97 9.38,10.5L8.57,12L9.38,13.5C9.68,14.03 10,14.5 10.29,14.97C10.83,15 11.4,15 12,15C12.6,15 13.17,15 13.71,14.97C14,14.5 14.32,14.03 14.62,13.5M12,6.78C11.81,7 11.61,7.23 11.41,7.5C11.61,7.5 11.8,7.5 12,7.5C12.2,7.5 12.39,7.5 12.59,7.5C12.39,7.23 12.19,7 12,6.78M12,17.22C12.19,17 12.39,16.77 12.59,16.5C12.39,16.5 12.2,16.5 12,16.5C11.8,16.5 11.61,16.5 11.41,16.5C11.61,16.77 11.81,17 12,17.22M16.62,4C16,3.62 14.62,4.2 13.03,5.7C13.55,6.29 14.06,6.93 14.54,7.6C15.36,7.68 16.17,7.8 16.94,7.96C17.45,5.82 17.26,4.35 16.62,4M15.92,9.74L16.21,10.25C16.32,9.96 16.43,9.67 16.5,9.39C16.23,9.33 15.93,9.28 15.62,9.23C15.72,9.4 15.82,9.57 15.92,9.74M17.37,2.69C18.84,3.53 19,5.74 18.38,8.32C20.92,9.07 22.75,10.31 22.75,12C22.75,13.69 20.92,14.93 18.38,15.68C19,18.26 18.84,20.47 17.37,21.31C15.91,22.15 13.92,21.19 12,19.36C10.08,21.19 8.09,22.15 6.62,21.31C5.16,20.47 5,18.26 5.62,15.68C3.08,14.93 1.25,13.69 1.25,12C1.25,10.31 3.08,9.07 5.62,8.32C5,5.74 5.16,3.53 6.62,2.69C8.09,1.85 10.08,2.81 12,4.64C13.92,2.81 15.91,1.85 17.37,2.69M17.08,12C17.42,12.75 17.72,13.5 17.97,14.26C20.07,13.63 21.25,12.73 21.25,12C21.25,11.27 20.07,10.37 17.97,9.74C17.72,10.5 17.42,11.25 17.08,12M6.92,12C6.58,11.25 6.28,10.5 6.03,9.74C3.93,10.37 2.75,11.27 2.75,12C2.75,12.73 3.93,13.63 6.03,14.26C6.28,13.5 6.58,12.75 6.92,12M15.92,14.26C15.82,14.43 15.72,14.6 15.62,14.77C15.93,14.72 16.23,14.67 16.5,14.61C16.43,14.33 16.32,14.04 16.21,13.75L15.92,14.26M13.03,18.3C14.62,19.8 16,20.38 16.62,20C17.26,19.65 17.45,18.18 16.94,16.04C16.17,16.2 15.36,16.32 14.54,16.4C14.06,17.07 13.55,17.71 13.03,18.3M8.08,9.74C8.18,9.57 8.28,9.4 8.38,9.23C8.07,9.28 7.77,9.33 7.5,9.39C7.57,9.67 7.68,9.96 7.79,10.25L8.08,9.74M10.97,5.7C9.38,4.2 8,3.62 7.37,4C6.74,4.35 6.55,5.82 7.06,7.96C7.83,7.8 8.64,7.68 9.46,7.6C9.94,6.93 10.45,6.29 10.97,5.7Z"
                      />
                    </svg>
                  </ion-col>
                </ion-card-content>
              </ion-card>
            </ion-col>
            <ion-col size-md="6" size-sm="12" size="12">
              <ion-card>
                <ion-card-header>
                  <ion-card-title>Desarrollo Back-End</ion-card-title>
                </ion-card-header>
                <ion-card-content>
                  <ion-col>
                    <!-- php -->
                    <svg width="24" height="24" viewBox="0 0 24 24">
                      <path
                        fill="#777777"
                        d="M12,18.08C5.37,18.08 0,15.36 0,12C0,8.64 5.37,5.92 12,5.92C18.63,5.92 24,8.64 24,12C24,15.36 18.63,18.08 12,18.08M6.81,10.13C7.35,10.13 7.72,10.23 7.9,10.44C8.08,10.64 8.12,11 8.03,11.47C7.93,12 7.74,12.34 7.45,12.56C7.17,12.78 6.74,12.89 6.16,12.89H5.29L5.82,10.13H6.81M3.31,15.68H4.75L5.09,13.93H6.32C6.86,13.93 7.3,13.87 7.65,13.76C8,13.64 8.32,13.45 8.61,13.18C8.85,12.96 9.04,12.72 9.19,12.45C9.34,12.19 9.45,11.89 9.5,11.57C9.66,10.79 9.55,10.18 9.17,9.75C8.78,9.31 8.18,9.1 7.35,9.1H4.59L3.31,15.68M10.56,7.35L9.28,13.93H10.7L11.44,10.16H12.58C12.94,10.16 13.18,10.22 13.29,10.34C13.4,10.46 13.42,10.68 13.36,11L12.79,13.93H14.24L14.83,10.86C14.96,10.24 14.86,9.79 14.56,9.5C14.26,9.23 13.71,9.1 12.91,9.1H11.64L12,7.35H10.56M18,10.13C18.55,10.13 18.91,10.23 19.09,10.44C19.27,10.64 19.31,11 19.22,11.47C19.12,12 18.93,12.34 18.65,12.56C18.36,12.78 17.93,12.89 17.35,12.89H16.5L17,10.13H18M14.5,15.68H15.94L16.28,13.93H17.5C18.05,13.93 18.5,13.87 18.85,13.76C19.2,13.64 19.5,13.45 19.8,13.18C20.04,12.96 20.24,12.72 20.38,12.45C20.53,12.19 20.64,11.89 20.7,11.57C20.85,10.79 20.74,10.18 20.36,9.75C20,9.31 19.37,9.1 18.54,9.1H15.79L14.5,15.68Z"
                      />
                    </svg>
                  </ion-col>
                  <ion-col>
                    <!-- laravel -->
                    <svg width="24" height="24" viewBox="0 0 24 24">
                      <path
                        fill="#777777"
                        d="M21.7 6.53C21.71 6.55 21.71 6.58 21.71 6.61V10.9C21.71 11 21.65 11.12 21.56 11.17L17.95 13.25V17.36C17.95 17.47 17.9 17.57 17.8 17.63L10.28 21.96C10.26 21.97 10.24 22 10.22 22L10.2 22C10.15 22 10.09 22 10.04 22C10.03 22 10 22 10 22C10 22 10 21.97 9.96 21.96L2.44 17.63C2.35 17.58 2.29 17.47 2.29 17.36V4.5C2.29 4.45 2.29 4.42 2.3 4.4C2.3 4.39 2.31 4.38 2.31 4.37C2.31 4.35 2.32 4.34 2.33 4.32C2.33 4.31 2.34 4.3 2.35 4.29C2.36 4.28 2.37 4.27 2.38 4.26C2.39 4.25 2.4 4.24 2.41 4.23C2.42 4.22 2.43 4.21 2.44 4.21L6.2 2.04C6.3 2 6.42 2 6.5 2.04L10.28 4.21H10.28C10.29 4.22 10.3 4.22 10.31 4.23C10.32 4.24 10.33 4.25 10.34 4.26C10.35 4.27 10.36 4.28 10.37 4.29C10.38 4.3 10.39 4.31 10.39 4.32C10.4 4.34 10.41 4.35 10.41 4.37C10.41 4.38 10.42 4.39 10.42 4.4C10.43 4.43 10.43 4.45 10.43 4.5V12.5L13.57 10.72V6.61C13.57 6.58 13.57 6.55 13.58 6.53L13.59 6.5C13.59 6.5 13.6 6.47 13.61 6.45C13.61 6.44 13.62 6.43 13.63 6.42C13.64 6.41 13.65 6.4 13.66 6.39C13.67 6.38 13.68 6.37 13.69 6.36C13.7 6.35 13.71 6.34 13.72 6.34L17.5 4.17C17.58 4.11 17.7 4.11 17.8 4.17L21.56 6.34C21.57 6.34 21.58 6.35 21.59 6.36L21.62 6.39C21.63 6.4 21.64 6.41 21.65 6.42C21.66 6.43 21.66 6.44 21.67 6.45C21.68 6.47 21.68 6.5 21.69 6.5C21.7 6.5 21.7 6.5 21.7 6.53M21.09 10.72V7.15L17.95 8.95V12.5L21.09 10.72M17.33 17.18V13.6L10.43 17.54V21.15L17.33 17.18M2.91 5V17.18L9.81 21.15V17.54L6.21 15.5L6.2 15.5L6.2 15.5C6.19 15.5 6.18 15.5 6.17 15.47C6.16 15.47 6.15 15.46 6.14 15.45V15.45C6.13 15.44 6.12 15.43 6.11 15.42C6.1 15.41 6.1 15.4 6.09 15.39V15.39C6.08 15.37 6.08 15.36 6.07 15.35C6.07 15.33 6.06 15.32 6.06 15.31C6.05 15.3 6.05 15.28 6.05 15.27C6.05 15.25 6.05 15.24 6.05 15.23V6.82L2.91 5M6.36 2.68L3.23 4.5L6.36 6.28L9.5 4.5L6.36 2.68M9.81 12.88V5L6.67 6.82V14.69L9.81 12.88M17.64 4.8L14.5 6.61L17.64 8.41L20.77 6.61L17.64 4.8M17.33 8.95L14.19 7.15V10.72L17.33 12.5V8.95M10.12 17L17 13.06L13.88 11.26L7 15.23L10.12 17Z"
                      />
                    </svg>
                  </ion-col>
                </ion-card-content>
              </ion-card>
            </ion-col>
            <ion-col size-md="6" size-sm="12" size="12">
              <ion-card>
                <ion-card-header>
                  <ion-card-title
                    >Desarrollo de aplicaciones Moviles</ion-card-title
                  >
                </ion-card-header>
                <ion-card-content>
                  <ion-col>
                    <ion-icon
                      :icon="logoIonic"
                      style="font-size: 24px"
                    ></ion-icon>
                  </ion-col>
                </ion-card-content>
              </ion-card>
            </ion-col>
            <ion-col size-md="6" size-sm="12" size="12">
              <ion-card>
                <ion-card-header>
                  <ion-card-title
                    >Desarrollo de aplicaciones de Escritorio</ion-card-title
                  >
                </ion-card-header>
                <ion-card-content>
                  <ion-col>
                    <!-- c# -->
                    <svg width="24" height="24" viewBox="0 0 24 24">
                      <path
                        fill="#777777"
                        d="M11.5,15.97L11.91,18.41C11.65,18.55 11.23,18.68 10.67,18.8C10.1,18.93 9.43,19 8.66,19C6.45,18.96 4.79,18.3 3.68,17.04C2.56,15.77 2,14.16 2,12.21C2.05,9.9 2.72,8.13 4,6.89C5.32,5.64 6.96,5 8.94,5C9.69,5 10.34,5.07 10.88,5.19C11.42,5.31 11.82,5.44 12.08,5.59L11.5,8.08L10.44,7.74C10.04,7.64 9.58,7.59 9.05,7.59C7.89,7.58 6.93,7.95 6.18,8.69C5.42,9.42 5.03,10.54 5,12.03C5,13.39 5.37,14.45 6.08,15.23C6.79,16 7.79,16.4 9.07,16.41L10.4,16.29C10.83,16.21 11.19,16.1 11.5,15.97M13.89,19L14.5,15H13L13.34,13H14.84L15.16,11H13.66L14,9H15.5L16.11,5H18.11L17.5,9H18.5L19.11,5H21.11L20.5,9H22L21.66,11H20.16L19.84,13H21.34L21,15H19.5L18.89,19H16.89L17.5,15H16.5L15.89,19H13.89M16.84,13H17.84L18.16,11H17.16L16.84,13Z"
                      />
                    </svg>
                  </ion-col>
                  <ion-col>
                    <!-- java -->
                    <svg width="24" height="24" viewBox="0 0 24 24">
                      <path
                        fill="#777777"
                        d="M16.5,6.08C16.5,6.08 9.66,7.79 12.94,11.56C13.91,12.67 12.69,13.67 12.69,13.67C12.69,13.67 15.14,12.42 14,10.82C12.94,9.35 12.14,8.62 16.5,6.08M12.03,7.28C16.08,4.08 14,2 14,2C14.84,5.3 11.04,6.3 9.67,8.36C8.73,9.76 10.13,11.27 12,13C11.29,11.3 8.78,9.84 12.03,7.28M9.37,17.47C6.29,18.33 11.25,20.1 15.16,18.43C14.78,18.28 14.41,18.1 14.06,17.89C12.7,18.2 11.3,18.26 9.92,18.07C8.61,17.91 9.37,17.47 9.37,17.47M14.69,15.79C12.94,16.17 11.13,16.26 9.35,16.05C8.04,15.92 8.9,15.28 8.9,15.28C5.5,16.41 10.78,17.68 15.5,16.3C15.21,16.19 14.93,16 14.69,15.79M18.11,19.09C18.11,19.09 18.68,19.56 17.5,19.92C15.22,20.6 8.07,20.81 6.09,19.95C5.38,19.64 6.72,19.21 7.14,19.12C7.37,19.06 7.6,19.04 7.83,19.04C7.04,18.5 2.7,20.14 5.64,20.6C13.61,21.9 20.18,20 18.11,19.09M15.37,14.23C15.66,14.04 15.97,13.88 16.29,13.74C16.29,13.74 14.78,14 13.27,14.14C11.67,14.3 10.06,14.32 8.46,14.2C6.11,13.89 9.75,13 9.75,13C8.65,13 7.57,13.26 6.59,13.75C4.54,14.75 11.69,15.2 15.37,14.23M16.27,16.65C16.25,16.69 16.23,16.72 16.19,16.75C21.2,15.44 19.36,12.11 16.96,12.94C16.83,13 16.72,13.08 16.65,13.19C16.79,13.14 16.93,13.1 17.08,13.07C18.28,12.83 20,14.7 16.27,16.65M16.4,21.26C13.39,21.78 10.31,21.82 7.28,21.4C7.28,21.4 7.74,21.78 10.09,21.93C13.69,22.16 19.22,21.8 19.35,20.1C19.38,20.11 19.12,20.75 16.4,21.26Z"
                      />
                    </svg>
                  </ion-col>
                </ion-card-content>
              </ion-card>
            </ion-col>
            <ion-col size-md="6" size-sm="12" size="12">
              <ion-card>
                <ion-card-header>
                  <ion-card-title
                    >Sistemas Gestores de Base de Datos</ion-card-title
                  >
                </ion-card-header>
                <ion-card-content>
                  <ion-col>
                    <!-- firebase -->
                    <svg width="24" height="24" viewBox="0 0 24 24">
                      <path
                        fill="#777777"
                        d="M20,18.69L12.7,22.74C12.2,23 11.7,23 11.2,22.74L4,18.69L17.05,5.54L17.4,5.44C17.7,5.44 17.87,5.57 17.9,5.84L20,18.69M9.35,5.74L4.8,13.29L6.7,1.34C6.73,1.07 6.9,0.94 7.2,0.94C7.4,0.94 7.53,1 7.6,1.19L9.75,5.14L9.35,5.74M13.85,7L4.3,16.59L11.55,4.29C11.65,4.09 11.8,4 12,4C12.2,4 12.33,4.09 12.4,4.29L13.85,7Z"
                      />
                    </svg>
                  </ion-col>
                  <ion-col> MySql </ion-col>
                </ion-card-content>
              </ion-card>
            </ion-col>
            <ion-col size-md="6" size-sm="12" size="12">
              <ion-card>
                <ion-card-header>
                  <ion-card-title>Otros</ion-card-title>
                </ion-card-header>
                <ion-card-content>
                  <ion-col>
                    <!-- linux -->
                    <svg width="24" height="24" viewBox="0 0 24 24">
                      <path
                        fill="#777777"
                        d="M14.62,8.35C14.2,8.63 12.87,9.39 12.67,9.54C12.28,9.85 11.92,9.83 11.53,9.53C11.33,9.37 10,8.61 9.58,8.34C9.1,8.03 9.13,7.64 9.66,7.42C11.3,6.73 12.94,6.78 14.57,7.45C15.06,7.66 15.08,8.05 14.62,8.35M21.84,15.63C20.91,13.54 19.64,11.64 18,9.97C17.47,9.42 17.14,8.8 16.94,8.09C16.84,7.76 16.77,7.42 16.7,7.08C16.5,6.2 16.41,5.3 16,4.47C15.27,2.89 14,2.07 12.16,2C10.35,2.05 9,2.81 8.21,4.4C8,4.83 7.85,5.28 7.75,5.74C7.58,6.5 7.43,7.29 7.25,8.06C7.1,8.71 6.8,9.27 6.29,9.77C4.68,11.34 3.39,13.14 2.41,15.12C2.27,15.41 2.13,15.7 2.04,16C1.85,16.66 2.33,17.12 3.03,16.96C3.47,16.87 3.91,16.78 4.33,16.65C4.74,16.5 4.9,16.6 5,17C5.65,19.15 7.07,20.66 9.24,21.5C13.36,23.06 18.17,20.84 19.21,16.92C19.28,16.65 19.38,16.55 19.68,16.65C20.14,16.79 20.61,16.89 21.08,17C21.57,17.09 21.93,16.84 22,16.36C22.03,16.1 21.94,15.87 21.84,15.63"
                      />
                    </svg>
                  </ion-col>
                  <ion-col>
                    <!-- git -->
                    <svg width="24" height="24" viewBox="0 0 24 24">
                      <path
                        fill="#777777"
                        d="M2.6,10.59L8.38,4.8L10.07,6.5C9.83,7.35 10.22,8.28 11,8.73V14.27C10.4,14.61 10,15.26 10,16A2,2 0 0,0 12,18A2,2 0 0,0 14,16C14,15.26 13.6,14.61 13,14.27V9.41L15.07,11.5C15,11.65 15,11.82 15,12A2,2 0 0,0 17,14A2,2 0 0,0 19,12A2,2 0 0,0 17,10C16.82,10 16.65,10 16.5,10.07L13.93,7.5C14.19,6.57 13.71,5.55 12.78,5.16C12.35,5 11.9,4.96 11.5,5.07L9.8,3.38L10.59,2.6C11.37,1.81 12.63,1.81 13.41,2.6L21.4,10.59C22.19,11.37 22.19,12.63 21.4,13.41L13.41,21.4C12.63,22.19 11.37,22.19 10.59,21.4L2.6,13.41C1.81,12.63 1.81,11.37 2.6,10.59Z"
                      />
                    </svg>
                  </ion-col>
                </ion-card-content>
              </ion-card>
            </ion-col>
          </ion-row>
        </ion-grid>
      </section>

      <!-- proyectos -->
      <section class="ion-padding">
        <h2>Proyectos</h2>
        <ion-row>
          <ion-col size="auto">
            <ion-card>
              <img
                src="../../public/assets/otros/globtec.webp"
                alt=""
                class="img-proyecto"
              />
              <ion-card-header>
                <ion-card-title>Globalizaciones</ion-card-title>
                <ion-card-subtitle>PWA</ion-card-subtitle>
              </ion-card-header>
              <ion-card-content>
                <ion-button expand="block" v-on:click="modalGlobalizaciones">
                  Ver mas
                </ion-button>
              </ion-card-content>
            </ion-card>
          </ion-col>
          <ion-col size="auto">
            <ion-card>
              <img
                src="../../public/assets/otros/color.png"
                alt=""
                class="img-proyecto"
              />
              <ion-card-header>
                <ion-card-title>Full Color Memories</ion-card-title>
                <ion-card-subtitle>Sitio web</ion-card-subtitle>
              </ion-card-header>
              <ion-card-content>
                <ion-button expand="block" v-on:click="modalFullColorMemories">
                  Ver mas
                </ion-button>
              </ion-card-content>
            </ion-card>
          </ion-col>
          <ion-col size="auto">
            <ion-card>
              <img
                src="../../public/assets/otros/agendaris.jpg"
                alt=""
                class="img-proyecto"
              />
              <ion-card-header>
                <ion-card-title>Agendaris</ion-card-title>
                <ion-card-subtitle>PWA</ion-card-subtitle>
              </ion-card-header>
              <ion-card-content>
                <ion-button expand="block" v-on:click="modalAgendaris">
                  Ver mas
                </ion-button>
              </ion-card-content>
            </ion-card>
          </ion-col>
        </ion-row>
      </section>

      <!-- otras participaciones -->
      <section class="ion-padding">
        <h2>Otras participaciones</h2>
        <ion-row>
          <ion-col size="auto">
            <ion-card>
              <img
                src="../../public/assets/otros/workana.png"
                alt=""
                class="img-proyecto"
              />
              <ion-card-header>
                <ion-card-title>Freelance de sitios web</ion-card-title>
              </ion-card-header>
              <ion-card-content>
                <ion-button
                  expand="block"
                  v-on:click="
                    navegador(
                      'https://www.workana.com/freelancer/9d94c3955c99290d9311a2aef1da7f4c?ref=user_dropdown'
                    )
                  "
                >
                  Ver perfil
                </ion-button>
              </ion-card-content>
            </ion-card>
          </ion-col>
          <ion-col size="auto">
            <ion-card>
              <img
                src="../../public/assets/otros/init.png"
                alt=""
                style="width: 241px"
              />
              <ion-card-header>
                <ion-card-title>Colaborador de contenido</ion-card-title>
              </ion-card-header>
              <ion-card-content>
                <ion-button expand="block" v-on:click="modalInit">
                  Mas informacion
                </ion-button>
              </ion-card-content>
            </ion-card>
          </ion-col>
        </ion-row>
      </section>
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
  modalController,
} from "@ionic/vue";
import { defineComponent } from "vue";
import { Plugins } from "@capacitor/core";
const { Browser } = Plugins;
import { logoIonic } from "ionicons/icons";
import Globalizaciones from "./modal/globalizaciones/Globalizaciones.vue";
import FullColorMemories from "./modal/full color memories/FullColorMemories.vue";
import Init from "./modal/init/Init.vue";
import Agendaris from "./modal/agendaris/Agendaris.vue";

export default defineComponent({
  name: "Home",
  components: {
    IonContent,
    IonPage,
  },
  setup() {
    return {
      logoIonic,
    };
  },
  methods: {
    async navegador(url: string) {
      await Browser.open({ url });
    },
    async modalGlobalizaciones() {
      const modal = await modalController.create({
        component: Globalizaciones,
        cssClass: "my-custom-class",
      });
      return modal.present();
    },
    async modalFullColorMemories() {
      const modal = await modalController.create({
        component: FullColorMemories,
        cssClass: "my-custom-class",
      });
      return modal.present();
    },
    async modalInit() {
      const modal = await modalController.create({
        component: Init,
        cssClass: "my-custom-class",
      });
      return modal.present();
    },
    async modalAgendaris() {
      const modal = await modalController.create({
        component: Agendaris,
        cssClass: "my-custom-class",
      });
      return modal.present();
    },
  },
});
</script>

<style scoped>
#container {
  text-align: center;

  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
}

#container strong {
  font-size: 20px;
  line-height: 26px;
}

#container p {
  font-size: 16px;
  line-height: 22px;

  color: #8c8c8c;

  margin: 0;
}

#container a {
  text-decoration: none;
}

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
/* escritorio */
@media (min-width: 992px) {
  .img-proyecto {
    width: 241px;
  }
  #iconos-redes {
    margin-left: 35%;
  }
  #texto-descr {
    text-align: center;
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
  width: 24px;
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