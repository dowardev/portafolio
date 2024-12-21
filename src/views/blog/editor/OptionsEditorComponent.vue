<template>
  <!-- viewer -->
  <ion-row>
    <ion-col>
      <ion-card class="primary-select-border">
        <ion-item lines="none" button>
          <ion-toggle
            :checked="view === 'preview'"
            @ionChange="
              emitView({ view: $event.detail.checked ? 'preview' : 'editor' })
            "
          >
            Vista previa
          </ion-toggle>
        </ion-item>
      </ion-card>
    </ion-col>
  </ion-row>

  <!-- type save -->
  <ion-row>
    <ion-col>
      <ion-card
        :style="{ height: cardHeight }"
        ref="cardPostStatusRef"
        class="primary-select-border"
      >
        <div class="card-content">
          <ion-item
            class="transparent"
            button
            :lines="isCardPostStatusExpanded ? 'full' : 'none'"
            @click="handleCardPostStatusAnimation()"
          >
            <ion-label slot="start">Estado</ion-label>
            <ion-label slot="end">
              {{
                postStatus == "active"
                  ? "Publicar"
                  : postStatus == "draft"
                    ? "Borrador"
                    : "Inactivo"
              }}
            </ion-label>
          </ion-item>

          <!-- active -->
          <ion-item
            v-if="postStatus != 'active'"
            lines="full"
            class="transparent"
            button
            @click="
              setStatus({ status: 'active' });
              handleCardPostStatusAnimation();
            "
          >
            <ion-label>Publicar</ion-label>
          </ion-item>

          <!-- draft -->
          <ion-item
            v-if="postStatus != 'draft'"
            lines="full"
            class="transparent"
            button
            @click="
              setStatus({ status: 'draft' });
              handleCardPostStatusAnimation();
            "
          >
            <ion-label>Borrador</ion-label>
          </ion-item>

          <!-- inactive -->
          <ion-item
            v-if="postStatus != 'inactive'"
            lines="full"
            class="transparent"
            button
            @click="
              setStatus({ status: 'inactive' });
              handleCardPostStatusAnimation();
            "
          >
            <ion-label>Inactivo</ion-label>
          </ion-item>
        </div>
      </ion-card>
    </ion-col>
  </ion-row>

  <!-- cover-->
  <ion-row>
    <ion-col>
      <ion-card class="primary-select-border">
        <ion-item
          button
          :lines="cover.name ? 'full' : 'none'"
          :disabled="props.disableUI"
          @click="($refs as any).inputPostCover.click()"
        >
          <ion-label slot="start">
            <ion-text v-if="cover.name">Seleccionar Portada</ion-text>
            <ion-text v-else>Actualizar Portada</ion-text>
            <p>{{ cover.name }}</p>
          </ion-label>
        </ion-item>

        <ion-button
          v-if="cover.name"
          color="danger"
          fill="clear"
          expand="full"
          @click="removeCover()"
        >
          Quitar portada
        </ion-button>

        <input
          ref="inputPostCover"
          style="display: none"
          accept="image/*"
          type="file"
          @change="emitCover({ file: $event })"
        />
      </ion-card>
    </ion-col>
  </ion-row>

  <!-- delete post button -->
  <ion-row v-if="$route.name == 'UpdatePostPage'">
    <ion-col size="12">
      <ion-card
        class="selectable-danger-card"
        ref="cardDeleteRef"
        style="height: 43%"
        :class="{
          'danger-select-animated-active': deletePostAction == true,
          'danger-border': deletePostAction == 'confirm',
        }"
      >
        <ion-item
          class="transparent"
          button
          lines="none"
          @click="handleConfirmDeletePost()"
        >
          <ion-icon color="danger" slot="start" :icon="trashOutline"></ion-icon>
          <ion-label color="danger">Eliminar post</ion-label>
        </ion-item>

        <ion-item lines="none">
          <ion-label color="danger">Continuar?</ion-label>
          <ion-button
            color="danger"
            fill="clear"
            @click="
              deletePostAction = true;
              deletePost();
            "
            >Si</ion-button
          >
          <ion-button @click="handleConfirmDeletePost()" fill="clear"
            >No</ion-button
          >
        </ion-item>
      </ion-card>
    </ion-col>
  </ion-row>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import {
  IonButton,
  IonCard,
  IonCardContent,
  createAnimation,
  IonItem,
  IonSegment,
  IonSegmentButton,
} from "@ionic/vue";
import type { Animation } from "@ionic/vue";
import useVuelidate from "@vuelidate/core";
import { helpers, required } from "@vuelidate/validators";
import { StatusPost } from "@/services/types";
import { trashOutline } from "ionicons/icons";

// vars
const props = defineProps({
  cover: {
    default() {
      return { name: "" };
    },
    type: Object,
  },
  disableUI: { default: false, type: Boolean, required: false },
  postStatus: {
    type: String as () => StatusPost,
    default: "active",
    required: false,
  },
  view: { type: String as () => "editor" | "preview", default: "editor" },
});
const emits = defineEmits([
  "cover-change",
  "status-change",
  "delete-post",
  "update-view",
]);
const deletePostAction = ref<true | false | "confirm">(false);
const cover = ref({ name: props.cover.name, file: new File([], "") });
const postStatus = ref<StatusPost>(props.postStatus as StatusPost);
const cardDeleteRef = ref(null);
const cardPostStatusRef = ref(null);
const isCardDeletePostExpanded = ref(false);
const isCardPostStatusExpanded = ref(false);
const COLLAPSED_HEIGHT = "54px";
const EXPANDED_HEIGHT = "164px";
const cardHeight = ref(COLLAPSED_HEIGHT);
// animations
let cardDeletePostExpandAnimation: Animation;
let cardDeletePostContractAnimation: Animation;
let cardPostStatusExpandAnimation: Animation;
let cardPostStatusContractAnimation: Animation;
onMounted(() => {
  initAnimations();
});

// functions
function emitCover(params: { file: Event }) {
  const { file: element } = params;
  const input = element.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    const file = input.files[0];
    cover.value.name = file.name;
    cover.value.file = file;
    emits("cover-change", file);
  }
}

async function removeCover() {
  cover.value.name = "";
  cover.value.file = new File([], "");
  emits("cover-change", new File([], ""));
}

function setStatus(params: { status: StatusPost }) {
  const { status } = params;
  postStatus.value = status;
  emits("status-change", status);
}

function deletePost() {
  emits("delete-post");
}

async function handleConfirmDeletePost() {
  if (isCardDeletePostExpanded.value) {
    cardDeletePostContractAnimation.stop();
    await cardDeletePostContractAnimation.play();
    deletePostAction.value = false;
  } else {
    cardDeletePostExpandAnimation.stop();
    await cardDeletePostExpandAnimation.play();
    deletePostAction.value = "confirm";
  }
  isCardDeletePostExpanded.value = !isCardDeletePostExpanded.value;
}

function emitView(params: { view: "editor" | "preview" }) {
  const { view } = params;
  emits("update-view", view);
}

function initAnimations() {
  // card opost delete
  if (cardDeleteRef.value) {
    cardDeletePostExpandAnimation = createAnimation()
      .addElement(cardDeleteRef.value.$el)
      .duration(200)
      .keyframes([
        { offset: 0, height: "43%" },
        { offset: 1, height: "84%" },
      ]);

    cardDeletePostContractAnimation = createAnimation()
      .addElement(cardDeleteRef.value.$el)
      .duration(200)
      .keyframes([
        { offset: 0, height: "84%" },
        { offset: 1, height: "43%" },
      ]);
  }
  // card post status
  if (cardPostStatusRef.value) {
    cardPostStatusExpandAnimation = createAnimation()
      .addElement(cardPostStatusRef.value.$el)
      .duration(200)
      .keyframes([
        { offset: 0, height: COLLAPSED_HEIGHT },
        { offset: 1, height: EXPANDED_HEIGHT },
      ]);

    cardPostStatusContractAnimation = createAnimation()
      .addElement(cardPostStatusRef.value.$el)
      .duration(200)
      .keyframes([
        { offset: 0, height: EXPANDED_HEIGHT },
        { offset: 1, height: COLLAPSED_HEIGHT },
      ]);
  }
}

async function handleCardPostStatusAnimation() {
  if (isCardPostStatusExpanded.value) {
    cardPostStatusContractAnimation.stop();
    await cardPostStatusContractAnimation.play();
    cardHeight.value = COLLAPSED_HEIGHT;
  } else {
    cardPostStatusExpandAnimation.stop();
    await cardPostStatusExpandAnimation.play();
    cardHeight.value = EXPANDED_HEIGHT;
  }
  isCardPostStatusExpanded.value = !isCardPostStatusExpanded.value;
}
</script>

<style scoped>
.card-content {
  overflow: hidden;
}
</style>
