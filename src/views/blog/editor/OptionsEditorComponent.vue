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
          :lines="cover.name ? 'full' : 'none'"
          button
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
  <ion-row v-if="$route.name == 'UpdatePost'">
    <ion-col size="12">
      <ion-card class="danger-select-animated">
        <ion-item button lines="none" v-if="deletePostAction == false">
          <ion-icon color="danger" slot="start" :icon="trashOutline"></ion-icon>
          <ion-label color="danger">Eliminar post</ion-label>
        </ion-item>

        <ion-item v-else>
          <ion-button>Si</ion-button>
          <ion-button>No</ion-button>
        </ion-item>
      </ion-card>
    </ion-col>
  </ion-row>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { trashOutline } from "ionicons/icons";
import useVuelidate from "@vuelidate/core";
import { helpers, required } from "@vuelidate/validators";
import { StatusPost } from "@/services/types";

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
const emits = defineEmits(["cover-change", "status-change"]);
const deletePostAction = ref(false);
const cover = ref({ name: props.cover.name, file: new File([], "") });
const postStatus = ref<StatusPost>(props.postStatus as StatusPost);

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
</script>
