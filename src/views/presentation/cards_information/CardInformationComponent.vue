<template>
  <ion-list>
    <ion-list-header>
      <ion-label>Contacto profesional</ion-label>
    </ion-list-header>

    <ion-card>
      <ion-card-content>
        <!-- bussines email -->
        <ion-item
          lines="none"
          @mouseover="fillEmailContact = '#d94f4f'"
          @mouseleave="fillEmailContact = '#777777'"
        >
          <ion-icon
            slot="start"
            :style="{ color: fillEmailContact }"
            :icon="mail"
          ></ion-icon>

          <ion-label> Correo electrónico </ion-label>

          <ion-button id="click-trigger-bussiness-email" fill="clear">
            <ion-icon :icon="ellipsisVerticalOutline"></ion-icon>
          </ion-button>
          <ion-popover
            trigger="click-trigger-bussiness-email"
            trigger-action="click"
            :dismiss-on-select="true"
          >
            <ion-content>
              <ion-item
                button
                lines="none"
                @click="copyToClipboard({ text: 'contacto@dowar.xyz' })"
              >
                <ion-icon
                  slot="start"
                  :icon="copyOutline"
                  color="primary"
                ></ion-icon>

                <ion-label class="ion-text-wrap"
                  >Copiar correo electronico</ion-label
                >
              </ion-item>

              <ion-item lines="none" button @click="openMailContact()">
                <ion-icon
                  slot="start"
                  :icon="openOutline"
                  color="primary"
                ></ion-icon>
                <ion-label class="ion-text-wrap"
                  >Abrir cliente de correo</ion-label
                >
              </ion-item>
            </ion-content>
          </ion-popover>
        </ion-item>

        <!-- LinkedIn -->
        <ion-item
          lines="none"
          @mouseover="fillLinkedIn = '#0074b1'"
          @mouseleave="fillLinkedIn = '#777777'"
        >
          <ion-icon
            slot="start"
            :style="{ color: fillLinkedIn }"
            :icon="logoLinkedin"
          ></ion-icon>

          <ion-label> LinkedIn </ion-label>

          <ion-button id="click-trigger-bussiness-linkedin" fill="clear">
            <ion-icon :icon="ellipsisVerticalOutline"></ion-icon>
          </ion-button>
          <ion-popover
            trigger="click-trigger-bussiness-linkedin"
            trigger-action="click"
            :dismiss-on-select="true"
          >
            <ion-content>
              <ion-item
                button
                lines="none"
                @click="copyToClipboard({ text: 'dowar' })"
              >
                <ion-icon
                  slot="start"
                  :icon="copyOutline"
                  color="primary"
                ></ion-icon>
                <ion-label class="ion-text-wrap">Copiar usuario</ion-label>
              </ion-item>

              <ion-item
                button
                lines="none"
                @click="
                  copyToClipboard({
                    text: 'https://www.linkedin.com/in/dowar/',
                  })
                "
              >
                <ion-icon
                  slot="start"
                  :icon="copyOutline"
                  color="primary"
                ></ion-icon>

                <ion-label class="ion-text-wrap">Copiar enlace</ion-label>
              </ion-item>

              <ion-item
                button
                href="https://www.linkedin.com/in/dowar/"
                target="_blank"
                lines="none"
              >
                <ion-icon
                  slot="start"
                  :icon="openOutline"
                  color="primary"
                ></ion-icon>
                <ion-label class="ion-text-wrap">Abrir perfil</ion-label>
              </ion-item>
            </ion-content>
          </ion-popover>
        </ion-item>

        <ion-item
          id="open-modal"
          button
          lines="none"
          @mouseover="fillContactForm = '#4dba87'"
          @mouseleave="fillContactForm = defaultColorFill"
        >
          <ion-icon
            slot="start"
            :icon="chatbubble"
            :style="{ color: fillContactForm }"
          ></ion-icon>
          <ion-label>Formulario de contacto</ion-label>
        </ion-item>
        <ion-modal ref="modal" trigger="open-modal">
          <ContactModal />
        </ion-modal>
      </ion-card-content>
    </ion-card>
  </ion-list>

  <ion-list>
    <ion-list-header>
      <ion-label>Social</ion-label>
    </ion-list-header>

    <ion-card>
      <ion-card-content>
        <!-- email help -->
        <ion-item
          lines="none"
          @mouseover="fillEmailHelp = '#d94f4f'"
          @mouseleave="fillEmailHelp = '#777777'"
        >
          <ion-icon
            slot="start"
            :style="{ color: fillEmailHelp }"
            :icon="mail"
          ></ion-icon>

          <ion-label> Correo electrónico </ion-label>

          <ion-button id="click-trigger-email" fill="clear">
            <ion-icon :icon="ellipsisVerticalOutline"></ion-icon>
          </ion-button>
          <ion-popover
            trigger="click-trigger-email"
            trigger-action="click"
            :dismiss-on-select="true"
          >
            <ion-content>
              <ion-item
                button
                lines="none"
                @click="copyToClipboard({ text: 'ayuda@dowar.xyz' })"
              >
                <ion-icon
                  slot="start"
                  :icon="copyOutline"
                  color="primary"
                ></ion-icon>
                <ion-label class="ion-text-wrap"
                  >Copiar correo electronico</ion-label
                >
              </ion-item>

              <ion-item lines="none" button @click="openMailHelp()">
                <ion-icon
                  slot="start"
                  :icon="openOutline"
                  color="primary"
                ></ion-icon>
                <ion-label class="ion-text-wrap"
                  >Abrir cliente de correo</ion-label
                >
              </ion-item>
            </ion-content>
          </ion-popover>
        </ion-item>

        <!-- mastodon -->
        <ion-item
          lines="none"
          @mouseover="fillMastodon = '#2791da'"
          @mouseleave="fillMastodon = '#777777'"
        >
          <ion-icon
            slot="start"
            :style="{ color: fillMastodon }"
            :icon="logoMastodon"
          ></ion-icon>

          <ion-label> Mastodon </ion-label>

          <ion-button id="click-trigger-mastodon" fill="clear">
            <ion-icon :icon="ellipsisVerticalOutline"></ion-icon>
          </ion-button>
          <ion-popover
            trigger="click-trigger-mastodon"
            trigger-action="click"
            :dismiss-on-select="true"
          >
            <ion-content>
              <ion-item
                button
                lines="none"
                @click="
                  copyToClipboard({
                    text: '@dowar@mastodon.social',
                  })
                "
              >
                <ion-icon
                  slot="start"
                  :icon="copyOutline"
                  color="primary"
                ></ion-icon>
                <ion-label class="ion-text-wrap">Copiar usuario</ion-label>
              </ion-item>

              <ion-item
                button
                lines="none"
                @click="
                  copyToClipboard({
                    text: 'https://mastodon.social/web/@dowar',
                  })
                "
              >
                <ion-icon
                  slot="start"
                  :icon="copyOutline"
                  color="primary"
                ></ion-icon>

                <ion-label class="ion-text-wrap">Copiar enlace</ion-label>
              </ion-item>

              <ion-item
                button
                href="https://mastodon.social/web/@dowar"
                target="_blank"
                lines="none"
              >
                <ion-icon
                  slot="start"
                  :icon="openOutline"
                  color="primary"
                ></ion-icon>
                <ion-label class="ion-text-wrap">Abrir perfil</ion-label>
              </ion-item>
            </ion-content>
          </ion-popover>
        </ion-item>

        <!-- telegram group -->
        <ion-item
          lines="none"
          @mouseover="fillTelegramGroup = '#2497d6'"
          @mouseleave="fillTelegramGroup = '#777777'"
        >
          <ion-icon
            slot="start"
            :style="{ color: fillTelegramGroup }"
            :src="iconTelegram"
          ></ion-icon>

          <ion-label> Grupo de Telegram</ion-label>

          <ion-button id="click-trigger-telegram-group" fill="clear">
            <ion-icon :icon="ellipsisVerticalOutline"></ion-icon>
          </ion-button>
          <ion-popover
            trigger="click-trigger-telegram-group"
            trigger-action="click"
            :dismiss-on-select="true"
          >
            <ion-content>
              <ion-item
                button
                lines="none"
                @click="
                  copyToClipboard({
                    text: 'https://t.me/+qSXz6T6rF7djOTkz',
                  })
                "
              >
                <ion-icon
                  slot="start"
                  :icon="copyOutline"
                  color="primary"
                ></ion-icon>

                <ion-label class="ion-text-wrap">Copiar enlace</ion-label>
              </ion-item>

              <ion-item
                button
                href="https://t.me/+qSXz6T6rF7djOTkz"
                target="_blank"
                lines="none"
              >
                <ion-icon
                  slot="start"
                  :icon="openOutline"
                  color="primary"
                ></ion-icon>
                <ion-label class="ion-text-wrap">Abrir perfil</ion-label>
              </ion-item>
            </ion-content>
          </ion-popover>
        </ion-item>

        <!-- telegram channel -->
        <ion-item
          lines="none"
          @mouseover="fillTelegramChannel = '#2497d6'"
          @mouseleave="fillTelegramChannel = '#777777'"
        >
          <ion-icon
            slot="start"
            :style="{ color: fillTelegramChannel }"
            :src="iconTelegram"
          ></ion-icon>

          <ion-label> Canal de Telegram</ion-label>

          <ion-button id="click-trigger-telegram-channel" fill="clear">
            <ion-icon :icon="ellipsisVerticalOutline"></ion-icon>
          </ion-button>
          <ion-popover
            trigger="click-trigger-telegram-channel"
            trigger-action="click"
            :dismiss-on-select="true"
          >
            <ion-content>
              <ion-item
                button
                lines="none"
                @click="
                  copyToClipboard({
                    text: 'https://t.me/news_dowar_blog',
                  })
                "
              >
                <ion-icon
                  slot="start"
                  :icon="copyOutline"
                  color="primary"
                ></ion-icon>

                <ion-label class="ion-text-wrap">Copiar enlace</ion-label>
              </ion-item>

              <ion-item
                button
                href="https://t.me/news_dowar_blog"
                target="_blank"
                lines="none"
              >
                <ion-icon
                  slot="start"
                  :icon="openOutline"
                  color="primary"
                ></ion-icon>
                <ion-label class="ion-text-wrap">Abrir perfil</ion-label>
              </ion-item>
            </ion-content>
          </ion-popover>
        </ion-item>
      </ion-card-content>
    </ion-card>
  </ion-list>
</template>

<script lang="ts">
import { IonContent, isPlatform, IonModal } from "@ionic/vue";
import { defineComponent } from "vue";
import {
  mail,
  logoMastodon,
  logoGitlab,
  logoLinkedin,
  copyOutline,
  openOutline,
  ellipsisVerticalOutline,
  chatbubble,
} from "ionicons/icons";
import telegramLogo from "../../../assets/otros/icons8-telegram-app.svg";
import ContactModal from "../../contact/ContactPage.vue";

export default defineComponent({
  name: "CardInformationComponent",
  components: {
    IonContent,
    IonModal,
    ContactModal,
  },

  setup() {
    const modeDesingElements = isPlatform("ios")
      ? "ios"
      : ("md" as "ios" | "md");
    return {
      mail,
      logoMastodon,
      logoGitlab,
      logoLinkedin,
      modeDesingElements,
      iconTelegram: telegramLogo,
      copyOutline,
      openOutline,
      ellipsisVerticalOutline,
      chatbubble,
    };
  },

  data() {
    const defaultColorFill = "#777777";
    return {
      defaultColorFill,
      fillTelegramGroup: defaultColorFill,
      fillTelegramChannel: defaultColorFill,
      fillEmailContact: defaultColorFill,
      fillEmailHelp: defaultColorFill,
      fillMastodon: defaultColorFill,
      fillLinkedIn: defaultColorFill,
      fillDev: defaultColorFill,
      fillContactForm: defaultColorFill,
    };
  },

  methods: {
    openMailContact() {
      location.href = "mailto:contacto@dowar.xyz?Subject=Contacto%20laboral";
    },

    openMailHelp() {
      location.href = "mailto:ayuda@dowar.xyz?Subject=Ayuda";
    },

    async copyToClipboard(params: { text: any }) {
      const text = params.text;
      try {
        await navigator.clipboard.writeText(text);
      } catch ($e) {
        alert("Cannot copy");
      }
    },
  },
});
</script>
