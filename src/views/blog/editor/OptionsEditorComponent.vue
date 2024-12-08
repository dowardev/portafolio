<template>
  <!-- type save -->
  <ion-row>
    <ion-col>
      <ion-card>
        <ion-item lines="none">
          <ion-select
            label="Estado"
            interface="popover"
            :value="postStatus"
            @ion-change="setStatus({ status: $event.detail.value })"
          >
            <ion-select-option value="active">Publicar</ion-select-option>
            <ion-select-option value="draft">Borrador</ion-select-option>
            <ion-select-option value="inactive">Inactivo</ion-select-option>
          </ion-select>
        </ion-item>
      </ion-card>
    </ion-col>
  </ion-row>

  <!-- cover-->
  <ion-row>
    <ion-col>
      <ion-card>
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
        ref="cardEl"
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
});
const emits = defineEmits(["cover-change", "status-change", "delete-post"]);
const deletePostAction = ref<true | false | "confirm">(false);
const cover = ref({ name: props.cover.name, file: new File([], "") });
const postStatus = ref<StatusPost>(props.postStatus as StatusPost);

const cardEl = ref(null);
const isExpanded = ref(false);

let expandAnimation: Animation;
let contractAnimation: Animation;

onMounted(() => {
  if (cardEl.value) {
    expandAnimation = createAnimation()
      .addElement(cardEl.value.$el)
      .duration(200)
      .keyframes([
        { offset: 0, height: "43%" },
        { offset: 1, height: "84%" },
      ]);

    contractAnimation = createAnimation()
      .addElement(cardEl.value.$el)
      .duration(200)
      .keyframes([
        { offset: 0, height: "84%" },
        { offset: 1, height: "43%" },
      ]);
  }
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
  if (isExpanded.value) {
    contractAnimation.stop();
    await contractAnimation.play();
    deletePostAction.value = false;
  } else {
    expandAnimation.stop();
    await expandAnimation.play();
    deletePostAction.value = "confirm";
  }
  isExpanded.value = !isExpanded.value;
}
</script>
