<template>
  <ion-page class="page-container">
    <ion-header class="ion-no-border">
      <ion-toolbar class="container-page">
        <ion-buttons slot="start">
          <ion-button fill="clear" @click="router.go(-1)">
            <ion-icon :icon="chevronBackOutline"></ion-icon>
          </ion-button>
        </ion-buttons>

        <ion-title>{{ pageTitle }}</ion-title>

        <ion-buttons slot="end">
          <!-- save -->
          <ion-button fill="clear" :disabled="v$.$invalid" @click="save()">
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

          <ion-button id="click-trigger-more-options" fill="clear">
            <ion-icon :icon="ellipsisVerticalOutline"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="container-page">
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

          <ion-row>
            <ion-col>
              <!-- input cover -->
              <ion-item
                button
                lines="none"
                fill="solid"
                @click="($refs as any).inputPostCover.click()"
                class="transparent element-outline-focus"
              >
                <ion-label slot="start">
                  <ion-text>Portada</ion-text>
                  <p>{{ coverName }}</p>
                </ion-label>
                <input
                  ref="inputPostCover"
                  style="display: none"
                  accept="image/*"
                  type="file"
                  @change="uploadCover({ file: $event })"
                  @click="v$.coverSource.$touch()"
                />
              </ion-item>
              <div
                v-for="(error, index) of (v$ as any).coverSource.$errors"
                :key="index"
                class="ion-padding-start"
              >
                <span class="error" style="font-size: 12px">{{
                  error.$message
                }}</span>
              </div>
            </ion-col>
          </ion-row>

          <ion-row>
            <!-- content -->
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
                @on-upload-img="uploadImage({ file: $event[0] })"
              />
            </ion-col>
          </ion-row>
        </ion-col>
      </ion-row>

      <!-- popovers -->
      <ion-popover
        trigger="click-trigger-more-options"
        trigger-action="click"
        :backdrop-dismiss="true"
        :mode="modeDesingElements"
      >
        <ion-content>
          <MqResponsive target="xs">
            <ion-item lines="none" button @click="openModalPreview()">
              <ion-icon
                slot="start"
                :icon="eyeOutline"
                color="primary"
              ></ion-icon>
              <ion-label class="ion-text-wrap">Previsualizacion</ion-label>
            </ion-item>
          </MqResponsive>

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
            @change="uploadImage(($event.target as any).files[0]!)"
          />
        </ion-content>
      </ion-popover>
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
import {
  saveOutline,
  chevronBackOutline,
  imagesOutline,
  eyeOutline,
  ellipsisVerticalOutline,
} from "ionicons/icons";
import useVuelidate from "@vuelidate/core";
import { required, helpers } from "@vuelidate/validators";
import PreviewModal from "./PreviewModal.vue";
import { useRouter } from "vue-router";
import { MdEditor, ToolbarNames } from "md-editor-v3";
import "md-editor-v3/lib/style.css";
import { ref, watch } from "vue";

const router = useRouter();
1;

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

const postTitle = ref("");
const postContent = ref("");
const coverName = ref("");
const coverSource = ref("");
const newCoverStatus = ref(false);

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
function save(): void {
  const title = postTitle.value;
  const content = postContent.value;
  const cover = coverSource.value;
  const newCover = newCoverStatus.value;
  emits("save", {
    title,
    content,
    coverSource: cover,
    newCoverStatus: newCover,
  });
}

async function getImageBase64(e: any): Promise<{ file: string; name: string }> {
  return new Promise((resolve) => {
    const file = e;
    const reader = new FileReader();
    reader.onload = async (e: any) => {
      const fileData = e.target.result;
      resolve({ file: fileData, name: file.name });
    };
    reader.readAsDataURL(file);
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

async function uploadCover(params: { file: Event }) {
  const { file: element } = params;
  const input = element.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    const file = input.files[0];
    coverName.value = file.name;
    newCoverStatus.value = true;
    coverSource.value = input.files[0] as any;
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
