<template>
  <ion-page>
    <ion-header
      :translucent="true"
      collapse="fade"
      mode="ios"
      class="ion-no-border"
    >
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button fill="clear" @click="router.go(-1)">
            <ion-icon :icon="chevronBackOutline"></ion-icon>
          </ion-button>
        </ion-buttons>

        <ion-title>{{ pageTitle }}</ion-title>

        <ion-buttons slot="end" :collapse="true">
          <!-- save -->
          <ion-button
            :disabled="v$.$invalid || spinnerSavePost"
            @click="save()"
          >
            <ion-icon
              v-if="spinnerSavePost == false"
              slot="start"
              :icon="saveOutline"
            ></ion-icon>
            <ion-spinner
              v-if="spinnerSavePost"
              name="crescent"
              color="primary"
            ></ion-spinner>
          </ion-button>

          <ion-button id="click-trigger-more-options">
            <ion-icon :icon="ellipsisVerticalOutline"></ion-icon>
          </ion-button>
          <ion-popover
            trigger="click-trigger-more-options"
            trigger-action="click"
            :backdrop-dismiss="true"
            :mode="modeDesingElements"
          >
            <ion-content>
              <MqResponsive target="xs">
                <ion-item button @click="activatePreviewMode()">
                  <ion-icon
                    slot="start"
                    :icon="eyeOutline"
                    color="primary"
                  ></ion-icon>
                  <ion-label class="ion-text-wrap">Previsualizacion</ion-label>
                </ion-item>
              </MqResponsive>

              <ion-item button @click="isEditorMaximized = !isEditorMaximized">
                <ion-icon
                  slot="start"
                  :icon="expandOutline"
                  color="primary"
                ></ion-icon>
                <ion-label class="ion-text-wrap">Maximizar editor</ion-label>
              </ion-item>

              <!-- input image -->
              <ion-item
                button
                lines="none"
                :disabled="spinnerSaveImage"
                @click="($refs as any).inputImage.click()"
              >
                <ion-icon
                  v-if="spinnerSaveImage == false"
                  slot="start"
                  :icon="imagesOutline"
                  color="primary"
                ></ion-icon>

                <ion-label class="ion-text-wrap">Subir multimedia</ion-label>

                <ion-spinner
                  v-if="spinnerSaveImage"
                  name="crescent"
                  color="primary"
                ></ion-spinner>
              </ion-item>
              <input
                ref="inputImage"
                accept="image/*"
                type="file"
                style="display: none"
                @change="uploadImage($event)"
              />
            </ion-content>
          </ion-popover>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-header collapse="condense" mode="ios">
        <ion-toolbar>
          <ion-title size="large">{{ pageTitle }}</ion-title>

          <ion-buttons slot="end" :collapse="true">
            <MqResponsive target="xs">
              <ion-button @click="activatePreviewMode()"
                ><ion-icon :icon="eyeOutline"></ion-icon
              ></ion-button>
            </MqResponsive>

            <ion-button @click="isEditorMaximized = !isEditorMaximized"
              ><ion-icon :icon="expandOutline"></ion-icon
            ></ion-button>

            <!-- input image -->
            <ion-item lines="none">
              <ion-button
                slot="end"
                fill="clear"
                :disabled="spinnerSaveImage"
                @click="($refs as any).inputImage.click()"
              >
                <ion-icon
                  v-if="spinnerSaveImage == false"
                  :icon="imagesOutline"
                ></ion-icon>
                <ion-spinner
                  v-if="spinnerSaveImage"
                  name="crescent"
                  color="primary"
                ></ion-spinner>
              </ion-button>
            </ion-item>
            <input
              ref="inputImage"
              accept="image/*"
              type="file"
              style="display: none"
              @change="uploadImage($event)"
            />

            <ion-button
              :disabled="v$.$invalid || spinnerSavePost"
              @click="save()"
            >
              <ion-icon
                v-if="spinnerSavePost == false"
                :icon="saveOutline"
              ></ion-icon>
              <ion-spinner
                v-if="spinnerSavePost"
                name="crescent"
                color="primary"
              ></ion-spinner>
            </ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>

      <ion-row v-if="isEditorMaximized == false">
        <ion-col size="12" size-md="6">
          <!-- title -->
          <ion-item>
            <ion-label position="floating">Titulo</ion-label>
            <ion-input
              v-model="(v$ as any).postTitle.$model"
              :spellcheck="true"
              autocorrect="on"
              pattern="text"
            >
            </ion-input>
          </ion-item>
          <div
            v-for="(error, index) of (v$ as any).postTitle.$errors"
            :key="index"
          >
            <div class="error">{{ error.$message }}</div>
          </div>

          <!-- input cover -->
          <ion-item
            button
            lines="full"
            @click="($refs as any).inputCover.click()"
          >
            <ion-label slot="start">Portada</ion-label>
            <input
              ref="inputCover"
              style="display: none"
              accept="image/*"
              type="file"
              @change="uploadCover($event)"
            />
            <ion-label slot="end">{{ coverName }}</ion-label>
          </ion-item>
          <div
            v-for="(error, index) of (v$ as any).coverSource.$errors"
            :key="index"
          >
            <div class="error">{{ error.$message }}</div>
          </div>
        </ion-col>
      </ion-row>

      <ion-row>
        <ion-col size="12" size-md="6">
          <!-- content -->
          <textarea
            id="editor"
            v-model="postContent"
            :contenteditable="true"
            class="editor"
            style="width: 100%; font-size: 18px"
            @scroll="scrollEditor()"
          ></textarea>
        </ion-col>

        <ion-col size="12" size-md="6">
          <!-- view -->
          <!-- <MarkdownItComponent -->
          <!--   id="viewer" -->
          <!--   :source="postContent" -->
          <!--   style=" -->
          <!--     height: calc(87vh - 50px); -->
          <!--     overflow: scroll; -->
          <!--     width: 100%; -->
          <!--     margin-top: 18px; -->
          <!--   " -->
          <!-- /> -->

          <MdEditor
            id="viewer"
            v-model="postContent"
            :language="'en-US'"
            :toolbar="[]"
          />
        </ion-col>
      </ion-row>
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
import { computed, defineComponent, ref, watch } from "vue";
import {
  saveOutline,
  imageOutline,
  chevronBackOutline,
  imagesOutline,
  expandOutline,
  eyeOutline,
  ellipsisVerticalOutline,
} from "ionicons/icons";
import useVuelidate from "@vuelidate/core";
import { required, helpers } from "@vuelidate/validators";
import MarkdownItComponent from "../../../components/markdownit/MarkdownItComponent.vue";
import PreviewModal from "./PreviewModal.vue";
import { MqResponsive } from "vue3-mq";
import { useRouter } from "vue-router";
import { MdEditor } from "md-editor-v3";
import "md-editor-v3/lib/style.css";

const router = useRouter();

const props = defineProps({
  title: { default: "", type: String },
  content: { default: "", type: String },
  cover: {
    default() {
      return {};
    },
    type: Object,
  },
  spinnerSavePost: Boolean,
  spinnerSaveImage: Boolean,
});

const emits = defineEmits(["save", "uploadImage"]);

const modeDesingElements = isPlatform("ios") ? "ios" : ("md" as "md" | "ios");
v$: useVuelidate();
modeDesingElements;
const pageTitle = "Editor";

const segment = "editor";
const postTitle = ref("");
const postContent = ref("");
const coverName = ref("");
const coverSource = ref("");
const newCoverStatus = ref(false);
const isEditorMaximized = ref(false);
const previewMode = ref(false);

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
  coverSource: {
    required: helpers.withMessage(messageError.required, required),
  },
};
const v$ = useVuelidate(rules, { postTitle, postContent, coverSource });

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
watch(
  () => props.cover,
  (newVal) => {
    coverName.value = newVal.name;
    coverSource.value = "data:image/png;base64," + newVal.source;
  }
);

// functions
function save() {
  const title = postTitle;
  const content = postContent;
  const cover = coverSource;
  emits("save", { title, content, cover, newCoverStatus });
}

async function getImageBase64(e: any): Promise<{ file: string; name: string }> {
  return new Promise((resolve) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = async (e: any) => {
      const fileData = e.target.result;
      resolve({ file: fileData, name: file.name });
    };
    reader.readAsDataURL(file);
  });
}

async function uploadImage(e: any) {
  const image = await getImageBase64(e);
  emits("uploadImage", { image });
}

async function uploadCover(e: any) {
  const image = await getImageBase64(e);
  coverSource.value = image.file;
  coverName.value = image.name;
  newCoverStatus.value = true;
}

function scrollEditor() {
  try {
    const editor = document.getElementById("editor");
    document.getElementById("viewer")!.scrollTop = editor!.scrollTop;
  } catch (e) {
    //
  }
}

function activatePreviewMode() {
  if (window.innerWidth <= 767) openModalPreview();
  else previewMode.value = !previewMode.value;
}

async function openModalPreview() {
  const position = document.getElementById("editor")!.scrollTop;
  const content = postContent;

  const modal = await modalController.create({
    component: PreviewModal,
    componentProps: {
      content,
      position,
    },
  });
  modal.present();
}
</script>

<style scoped>
.editor {
  height: calc(87vh - 50px);
  overflow: scroll;
  font-size: 1.2rem;
  line-height: 2em;
}
@media only screen and (min-width: 768px) {
  .editor {
    height: calc(87vh - 50px);
    overflow: scroll;
    font-size: 1.2rem;
    line-height: 2em;
    margin-top: 20px;
  }
}
</style>
