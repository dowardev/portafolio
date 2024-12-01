<template>
  <ion-header class="ion-no-border">
    <ion-toolbar class="container-page">
      <ion-buttons slot="start">
        <ion-button
          fill="clear"
          @click="router.go(-1)"
          :disabled="props.disableUI"
        >
          <ion-icon :icon="chevronBackOutline"></ion-icon>
        </ion-button>
      </ion-buttons>

      <ion-title>{{ pageTitle }}</ion-title>

      <ion-buttons slot="end">
        <!-- save -->
        <ion-button
          fill="clear"
          :disabled="v$.$invalid || props.disableUI"
          @click="save()"
        >
          <ion-icon slot="start" :icon="saveOutline"></ion-icon>
        </ion-button>

        <ion-button
          v-if="settingsVisible == false"
          @click="settingsVisible = true"
        >
          <ion-icon :icon="optionsOutline"></ion-icon>
        </ion-button>

        <ion-button id="click-trigger-more-options" fill="clear">
          <ion-icon :icon="ellipsisVerticalOutline"></ion-icon>
        </ion-button>
      </ion-buttons>
    </ion-toolbar>
  </ion-header>

  <ion-content class="container-page">
    <ion-row>
      <ion-col :size="settingsVisible == true ? 9 : 12">
        <ion-row>
          <ion-col>
            <!-- title -->
            <ion-row>
              <ion-col>
                <ion-input
                  ref="inputPostTitle"
                  label="Titulo"
                  label-placement="stacked"
                  fill="outline"
                  autocorrect="on"
                  pattern="text"
                  :error-text="v$.postTitle.$errors[0]?.$message.toString()"
                  :class="[
                    v$.postTitle.$errors.length == 0
                      ? 'ion-valid'
                      : 'ion-invalid',
                  ]"
                  :value="postTitle"
                  :spellcheck="true"
                  :disabled="props.disableUI"
                  @ion-input="postTitle = $event.target.value as string"
                  @ion-focus="
                    ($refs.inputPostTitle as any).$el.classList.add(
                      'ion-touched'
                    );
                    v$.postTitle.$touch();
                  "
                >
                </ion-input>
              </ion-col>
            </ion-row>

            <!-- content -->
            <ion-row>
              <ion-col size="12" size-md="12" size-lg="12">
                <MdEditor
                  v-model="postContent"
                  theme="dark"
                  style="
                    overflow: scroll;
                    width: 100%;
                    margin-top: 18px;
                    --md-bk-color: var(--ion-background-color-rgb);
                    --md-color: var(--ion-color-primary);
                    --md-border-color: var(--ion-text-color-step-700);
                  "
                  class="element-outline-focus"
                  :toolbars="
                    isPlatform('mobile') ? toolbarMobile : toolbarDesktop
                  "
                  :language="'en-US'"
                  :preview="false"
                  :disabled="props.disableUI"
                  @on-upload-img="uploadImage({ file: $event[0] })"
                />
              </ion-col>
            </ion-row>
          </ion-col>
        </ion-row>
      </ion-col>

      <ion-col size="3" v-if="settingsVisible == true">
        <ion-list>
          <ion-list-header>
            <ion-label>Opciones</ion-label>
            <ion-button @click="settingsVisible = false">Ocultar</ion-button>
          </ion-list-header>

          <!-- type save -->
          <ion-row>
            <ion-col>
              <ion-card class="primary-select-animated">
                <ion-item lines="none">
                  <ion-toggle :checked="true">Borrador</ion-toggle>
                </ion-item>
              </ion-card>
            </ion-col>
          </ion-row>

          <!-- cover-->
          <ion-row>
            <ion-col>
              <ion-card class="primary-select-animated">
                <ion-item
                  :lines="cover.file.size > 0 ? 'full' : 'none'"
                  button
                  :disabled="props.disableUI"
                  @click="($refs as any).inputPostCover.click()"
                >
                  <ion-label slot="start">
                    <ion-text v-if="cover.file.size == 0"
                      >Seleccionar Portada</ion-text
                    >
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
                  @change="setCover({ file: $event })"
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
                <ion-item
                  button
                  lines="none"
                  v-if="deletePostAction == false"
                  @click="deletePostAction = true"
                >
                  <ion-icon
                    color="danger"
                    slot="start"
                    :icon="trashOutline"
                  ></ion-icon>
                  <ion-label color="danger">Eliminar post</ion-label>
                </ion-item>

                <ion-item v-else lines="none">
                  <ion-label color="danger">Continuar?</ion-label>

                  <ion-button slot="end" color="danger" fill="clear"
                    >Si</ion-button
                  >
                  <ion-button
                    slot="end"
                    fill="clear"
                    @click="deletePostAction = false"
                    >No</ion-button
                  >
                </ion-item>
              </ion-card>
            </ion-col>
          </ion-row>
        </ion-list>
      </ion-col>
    </ion-row>

    <!-- popovers -->
    <ion-popover
      trigger="click-trigger-more-options"
      trigger-action="click"
      :backdrop-dismiss="true"
      :mode="modeDesignElements"
    >
      <ion-content>
        <MqResponsive target="xs">
          <ion-item lines="none" button @click="openModalPreview()">
            <ion-icon
              slot="start"
              :icon="eyeOutline"
              color="primary"
            ></ion-icon>
            <ion-label class="ion-text-wrap">Previsualización</ion-label>
          </ion-item>
        </MqResponsive>

        <!-- input image -->
        <ion-item
          button
          lines="none"
          :disabled="disableUI"
          @click="($refs as any).inputImage.click()"
        >
          <ion-icon
            v-if="disableUI == false"
            slot="start"
            :icon="imagesOutline"
            color="primary"
          ></ion-icon>

          <ion-label class="ion-text-wrap">Subir multimedia</ion-label>

          <ion-spinner
            v-if="disableUI"
            name="crescent"
            color="primary"
          ></ion-spinner>
        </ion-item>
        <input
          ref="inputImage"
          accept="image/*"
          type="file"
          style="display: none"
          @change="uploadImage(($event.target as any).files[0]!)"
        />
      </ion-content>
    </ion-popover>
  </ion-content>
</template>

<script setup lang="ts">
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonInput,
  IonButtons,
  IonItem,
  IonButton,
  IonIcon,
  IonLabel,
  IonRow,
  IonCol,
  isPlatform,
  modalController,
  IonPopover,
} from "@ionic/vue";
import {
  saveOutline,
  chevronBackOutline,
  imagesOutline,
  eyeOutline,
  ellipsisVerticalOutline,
  trashOutline,
  optionsOutline,
} from "ionicons/icons";
import useVuelidate from "@vuelidate/core";
import { required, helpers } from "@vuelidate/validators";
import PreviewModal from "./PreviewModal.vue";
import { useRouter } from "vue-router";
import { MdEditor, ToolbarNames } from "md-editor-v3";
import "md-editor-v3/lib/style.css";
import { ref, watch } from "vue";

const router = useRouter();

const props = defineProps({
  title: { default: "", type: String },
  content: { default: "", type: String },
  cover: {
    default() {
      return { name: "" };
    },
    type: Object,
  },
  disableUI: { default: false, type: Boolean, required: false },
});

const emits = defineEmits(["save", "uploadImage"]);

const modeDesignElements = isPlatform("ios") ? "ios" : ("md" as "md" | "ios");
v$: useVuelidate();
modeDesignElements;
const pageTitle = "Editor";
const postTitle = ref(props.title);
const postContent = ref(props.content);
const cover = ref({ name: props.cover.name, file: new File([], "") });
const messageError = {
  required: "Campo requerido",
};
const rules = {
  postTitle: {
    required: helpers.withMessage(messageError.required, required),
  },
  postContent: {
    required: helpers.withMessage(messageError.required, required),
  },
  cover: {
    required: helpers.withMessage(messageError.required, required),
  },
};
const v$ = useVuelidate(rules, {
  postTitle,
  postContent,
  cover: cover.value.file,
});
const toolbarDesktop = [
  "revoke",
  "next",
  "image",
  "prettier",
  "pageFullscreen",
  "fullscreen",
  "preview",
] as ToolbarNames[];
const toolbarMobile = [
  "revoke",
  "next",
  "image",
  "prettier",
  "pageFullscreen",
  "fullscreen",
] as ToolbarNames[];
const settingsVisible = ref(true);
const deletePostAction = ref(false);

// watch
watch(
  () => props.title,
  (newVal) => {
    postTitle.value = newVal;
  }
);
watch(
  () => props.content,
  (newVal) => {
    postContent.value += newVal;
  }
);

// functions
function save(): void {
  const title = postTitle.value;
  const content = postContent.value;
  const coverFile = cover.value.file;
  emits("save", {
    title,
    content,
    cover: coverFile,
  });
}

async function uploadImage(params: { file: Event }) {
  const { file: element } = params;
  emits("uploadImage", element);
  // const input = element.target as HTMLInputElement;
  // if (input.files && input.files[0]) {
  //   const file = input.files[0];
  //   emits("uploadImage", { image: file });
  // }
}

async function setCover(params: { file: Event }) {
  const { file: element } = params;
  const input = element.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    const file = input.files[0];
    cover.value.name = file.name;
    cover.value.file = file;
  }
}

async function openModalPreview() {
  const content = postContent.value;

  const modal = await modalController.create({
    component: PreviewModal,
    componentProps: {
      content,
    },
  });
  modal.present();
}

async function removeCover() {
  cover.value.name = "";
  cover.value.file = new File([], "");
}
</script>

<style scoped>
.editor {
  height: calc(87vh - 50px);
  overflow: scroll;
  font-size: 1.2rem;
  line-height: 2em;
}

.editor > #md-editor-v3 {
  height: calc(87vh - 228px) !important;
}

.div-main-content {
  height: calc(100vh - 142px);
}

ion-content,
.editor {
  --overflow: hidden;
}

@media only screen and (min-width: 768px) {
  .editor {
    height: calc(87vh - 50px);
    font-size: 1.2rem;
    line-height: 2em;
  }
}
</style>
