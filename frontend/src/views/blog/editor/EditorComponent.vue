<template>
  <div>
    <ion-row>
      <ion-col
        :class="{ 'col-expanded': !settingsSectionVisible }"
        :size="settingsSectionVisible && isPlatform('desktop') ? '9' : '12'"
      >
        <ion-card class="no-shadow">
          <ion-row>
            <ion-col>
              <!-- title -->
              <ion-row>
                <ion-col>
                  <ion-input
                    ref="inputPostTitle"
                    label="Titulo"
                    label-placement="floating"
                    fill="solid"
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
                    @ion-input="
                      postTitle = $event.target.value as string;
                      emitData();
                    "
                    @ion-focus="
                      ($refs.inputPostTitle as any).$el.classList.add(
                        'ion-touched',
                      );
                      v$.postTitle.$touch();
                    "
                  >
                  </ion-input>
                </ion-col>
              </ion-row>

              <!-- content -->
              <ion-row v-show="viewMode == 'editor'">
                <ion-col
                  size="12"
                  size-md="12"
                  size-lg="12"
                  style="min-height: 27vh; max-height: 77dvh"
                >
                  <MarkdownCreator
                    :content="postContent"
                    @image-upload="uploadImage({ file: $event })"
                    @update-content="
                      postContent = $event;
                      emitData();
                    "
                    style="background: var(--ion-background-color-step-50)"
                  />
                </ion-col>
              </ion-row>

              <!-- preview -->
              <ion-row v-if="viewMode == 'preview'">
                <ion-col size="12" size-md="12" size-lg="12">
                  <div
                    class="content-container ion-padding"
                    style="overflow: auto; min-height: 27dhv; max-height: 74dvh"
                  >
                    <MarkdownViewer :content="postContent" />
                  </div>
                </ion-col>
              </ion-row>
            </ion-col>
          </ion-row>
        </ion-card>
      </ion-col>

      <transition name="slide">
        <ion-col
          size="3"
          class="settings-panel"
          v-if="isPlatform('desktop') && settingsSectionVisible"
        >
          <ion-list>
            <ion-list-header>
              <ion-label>Opciones</ion-label>
              <ion-button
                @click="
                  settingsSectionVisible = false;
                  emits('update-visible-editor-settings', false);
                "
                >Ocultar</ion-button
              >
            </ion-list-header>

            <ion-card>
              <OptionsEditorComponent
                :cover="cover"
                :disableUI="props.disableUI"
                :post-status="props.postStatus"
                @cover-change="(setCover({ file: $event }), emitData())"
                @status-change="setPostStatus({ status: $event })"
                @delete-post="deletePost()"
                @update-view="viewMode = $event"
              />
            </ion-card>
          </ion-list>
        </ion-col>
      </transition>
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

    <!-- modals -->
    <ion-modal :is-open="modalSettings">
      <ion-header class="ion-no-border" mode="ios">
        <ion-toolbar>
          <ion-buttons slot="start">
            <ion-button @click="modalSettings = false">
              <ion-icon :icon="closeOutline"></ion-icon>
            </ion-button>
          </ion-buttons>

          <ion-title>Opciones del Post</ion-title>
        </ion-toolbar>
      </ion-header>

      <ion-content>
        <OptionsEditorComponent
          :cover="cover"
          :disableUI="props.disableUI"
          :post-status="props.postStatus"
          @cover-change="setCover({ file: $event })"
          @status-change="setPostStatus({ status: $event })"
          @delete-post="deletePost()"
          @update-view="viewMode = $event"
        />
      </ion-content>
    </ion-modal>
  </div>
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
  IonModal,
} from "@ionic/vue";
import {
  saveOutline,
  chevronBackOutline,
  imagesOutline,
  eyeOutline,
  ellipsisVerticalOutline,
  trashOutline,
  optionsOutline,
  closeOutline,
  arrowUndoCircleOutline,
  arrowUndoOutline,
  arrowRedoOutline,
} from "ionicons/icons";
import useVuelidate from "@vuelidate/core";
import { required, helpers } from "@vuelidate/validators";
import PreviewModal from "./PreviewModal.vue";
import { useRouter } from "vue-router";
import { ref, watch } from "vue";
import { StatusPost } from "@/services/types";

// components
import OptionsEditorComponent from "../../../../src/views/blog/editor/OptionsEditorComponent.vue";
import MarkdownCreator from "@/components/markdown-creator/MarkdownCreator.vue";
import MarkdownViewer from "@/components/markdown-viewer/MarkdownViewer.vue";

// vars
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
  postStatus: {
    type: String as () => StatusPost,
    default: "active",
    required: false,
  },
});
const emits = defineEmits([
  "updateData",
  "uploadImage",
  "delete-post",
  "update-visible-editor-settings",
]);
const modeDesignElements = isPlatform("ios") ? "ios" : ("md" as "md" | "ios");
v$: useVuelidate();
modeDesignElements;

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
const settingsSectionVisible = ref(isPlatform("desktop") ? true : false);
const modalSettings = ref(false);
const postStatus = ref<StatusPost>(props.postStatus as StatusPost);
const viewMode = ref<"editor" | "preview">("editor");

// watch
watch(
  () => props.title,
  (newVal) => {
    postTitle.value = newVal;
  },
);
watch(
  () => props.content,
  (newVal) => {
    postContent.value += newVal;
  },
);

// functions
defineExpose({
  openSettings,
});
function emitData(): void {
  const title = postTitle.value;
  const content = postContent.value;
  const coverFile = cover.value.file;
  emits("updateData", {
    title,
    content,
    cover: coverFile,
    status: postStatus.value,
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

async function setCover(params: { file: File }) {
  const { file } = params;
  cover.value.name = file.name;
  cover.value.file = file;
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

function openSettings() {
  if (isPlatform("desktop")) {
    settingsSectionVisible.value = true;
  }
  if (isPlatform("mobile")) {
    modalSettings.value = true;
  }
}

function setPostStatus(params: { status: StatusPost }) {
  const { status } = params;
  postStatus.value = status;
}

function deletePost() {
  emits("delete-post");
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

.col-expanded {
  transition: all 0.3s ease-in-out;
}

.settings-panel {
  transition: all 0.3s ease-in-out;
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(30px);
  opacity: 0;
}

.content-container {
  border: 1px solid transparent;
  border-radius: 4px;
}
.content-container:hover {
  border: 1px solid var(--ion-background-color-step-850);
}
</style>
