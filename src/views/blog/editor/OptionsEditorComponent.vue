<template>
  <!-- type save -->
  <ion-row>
    <ion-col>
      <ion-card>
        <ion-item lines="none">
          <ion-toggle
            :checked="postStatus == 'draft' ? true : false"
            @ion-change="
              setStatus({ status: $event.detail.checked ? 'draft' : 'active' })
            "
          >
            Borrador
          </ion-toggle>
        </ion-item>
      </ion-card>
    </ion-col>
  </ion-row>

  <!-- cover-->
  <ion-row>
    <ion-col>
      <ion-card>
        <ion-item
          :lines="cover.file.size > 0 ? 'full' : 'none'"
          button
          :disabled="props.disableUI"
          @click="($refs as any).inputPostCover.click()"
        >
          <ion-label slot="start">
            <ion-text v-if="cover.file.size == 0">Seleccionar Portada</ion-text>
            <ion-text v-else>Actualizar Portada</ion-text>
            <p>{{ cover.name }}</p>
          </ion-label>
        </ion-item>

        <ion-button
          v-if="cover.file.size > 0"
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
          @click="v$.cover.$touch()"
        />

        <!-- errors -->
        <div
          v-for="(error, index) of (v$ as any).cover.$errors"
          :key="index"
          class="ion-padding-start"
        >
          <span class="error" style="font-size: 12px">{{
            error.$message
          }}</span>
        </div>
      </ion-card>
    </ion-col>
  </ion-row>

  <!-- delete post button -->
  <ion-row>
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
    default: "draft",
    required: false,
  },
});
const emits = defineEmits(["cover-change", "status-change"]);
const deletePostAction = ref(false);
const cover = ref({ name: props.cover.name, file: new File([], "") });
const messageError = {
  required: "Campo requerido",
};
const rules = {
  cover: {
    required: helpers.withMessage(messageError.required, required),
  },
};
const v$ = useVuelidate(rules, {
  cover: cover.value.file,
});
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
}

function setStatus(params: { status: StatusPost }) {
  const { status } = params;
  postStatus.value = status;
  emits("status-change", status);
}
</script>
