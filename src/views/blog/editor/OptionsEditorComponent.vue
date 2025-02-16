<template>
  <!-- viewer -->
  <ion-row>
    <ion-col>
      <ion-card class="primary-select-border no-shadow">
        <ion-item lines="full" button>
          <ion-toggle
            :checked="view === 'preview'"
            @ion-change="
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
      <CardOptionsExpand
        ref="cardPostStatusRef"
        class="primary-select-border no-shadow"
      >
        <template #header>
          <ion-item class="transparent" button lines="full">
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
        </template>

        <template #content>
          <!-- active -->
          <ion-item
            v-if="postStatus != 'active'"
            lines="full"
            class="transparent"
            button
            @click="
              setStatus({ status: 'active' });
              cardPostStatusRef?.toggleExpand();
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
              cardPostStatusRef?.toggleExpand();
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
              cardPostStatusRef?.toggleExpand();
            "
          >
            <ion-label>Inactivo</ion-label>
          </ion-item>
        </template>
      </CardOptionsExpand>
    </ion-col>
  </ion-row>

  <!-- cover-->
  <ion-row>
    <ion-col>
      <ion-card class="primary-select-border no-shadow">
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
      <CardOptionsExpand
        ref="cardDeleteRef"
        class="selectable-danger-card no-shadow"
        :class="{
          'danger-select-animated-active': deletePostAction == true,
          'danger-border': deletePostAction == 'confirm',
        }"
      >
        <template #header>
          <ion-item class="transparent" button lines="full">
            <ion-icon
              slot="start"
              color="danger"
              :icon="trashOutline"
            ></ion-icon>
            <ion-label color="danger">Eliminar post</ion-label>
          </ion-item>
        </template>

        <template #content>
          <ion-item lines="full">
            <ion-label color="danger">Continuar?</ion-label>
            <ion-button
              color="danger"
              fill="clear"
              @click="
                deletePostAction = true;
                deletePost();
                cardDeleteRef?.toggleExpand();
              "
              >Si</ion-button
            >
            <ion-button fill="clear" @click="cardDeleteRef?.toggleExpand()"
              >No</ion-button
            >
          </ion-item>
        </template>
      </CardOptionsExpand>
    </ion-col>
  </ion-row>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { IonButton, IonCard, IonItem } from "@ionic/vue";
import { StatusPost } from "@/services/types";
import { trashOutline } from "ionicons/icons";

// components
import { CardOptionsExpand } from "ionic-extra-components";

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
const cardDeleteRef = ref<typeof CardOptionsExpand>(null);
const cardPostStatusRef = ref<typeof CardOptionsExpand>(null);
// animations

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

function emitView(params: { view: "editor" | "preview" }) {
  const { view } = params;
  emits("update-view", view);
}
</script>

<style scoped>
.card-content {
  overflow: hidden;
}
</style>
