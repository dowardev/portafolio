<template>
  <div>
    <ion-toolbar>
      <ion-buttons slot="start">
        <ion-button @click="$router.go(-1)">
          <ion-icon :icon="chevronBackOutline"></ion-icon>
        </ion-button>
      </ion-buttons>

      <!-- <ion-title -->
      <!--   v-if="usePost().getPost({ id: postId as string })! != undefined" -->
      <!-- > -->
      <!--   {{ usePost().getPost({ id: postId })!.title }} -->
      <!-- </ion-title> -->
      <ion-title
        v-if="
          props.showTitle ||
          (isPlatform('desktop') && usePost().getPost({ id: postId }))
        "
        class="fade-in-title ion-text-wrap"
        >{{ usePost().getPost({ id: postId })!.title }}</ion-title
      >

      <ion-buttons slot="end">
        <section v-if="useUser().user.value.isAdmin">
          <ion-button fill="clear" @click="updatePost()">
            <ion-icon :icon="createOutline"></ion-icon>
          </ion-button>

          <ion-button fill="clear" @click="deletePost()">
            <ion-icon :icon="trashOutline" color="danger"></ion-icon>
          </ion-button>
        </section>

        <ion-button
          v-if="hideIndexContentComponentvalue == false"
          fill="clear"
          @click="emits('openModalIndex')"
        >
          <ion-icon :icon="menuOutline"></ion-icon>
        </ion-button>
      </ion-buttons>
    </ion-toolbar>
  </div>
</template>

<script setup lang="ts">
import {
  IonTitle,
  IonToolbar,
  IonButtons,
  IonIcon,
  isPlatform,
  modalController,
} from "@ionic/vue";
import {
  chevronBackOutline,
  createOutline,
  menuOutline,
  trashOutline,
} from "ionicons/icons";
import { usePost } from "@/composables/usePost";
import { useUser } from "@/composables/useUser";
import "md-editor-v3/lib/style.css";
import { useRoute, useRouter } from "vue-router";
import { ref } from "vue";
import { useSystem } from "@/composables/useSystem";
import eventBus from "@/EventBus";
import { presentAlertConfirmation } from "@/services/system";
import modalIndexContent from "../modalIndexContent.vue";

const route = useRoute();
const router = useRouter();
const props = defineProps({
  showTitle: { type: Boolean, required: true, default: false },
  pageTitle: { type: String, required: true, default: "Inicio" },
});
const emits = defineEmits(["openModalIndex"]);
isPlatform("desktop") == true ? true : false;
const postId = route.params.id as string;
const spinners = ref({ buttonUpdate: false, buttonDelete: false });
const hideIndexContentComponentvalue =
  isPlatform("desktop") == true ? true : false;

async function updatePost(): Promise<void> {
  spinners.value.buttonUpdate = true;
  await router.push("/blog/editor/update/" + postId);
  spinners.value.buttonUpdate = false;
}
const indexContent = ref(
  [] as Array<{ name: string; id: string; type: string }>,
);

async function deletePost(): Promise<void> {
  spinners.value.buttonDelete = true;

  const alertResponse = await presentAlertConfirmation({
    message: "¿Desea eliminar el post?",
  });

  if (alertResponse == false) {
    spinners.value.buttonDelete = false;
    return;
  }

  try {
    await deletePost({ id: postId as string });
    spinners.value.buttonDelete = false;
    router.go(-1);
    eventBus().emitter.emit("new-post");
  } catch (e: any) {
    spinners.value.buttonDelete = false;
    useSystem().openToastError(e);
  }
}
</script>

<style scoped>
.post-date {
  font-size: 12px !important;
}

.div-main-content {
  height: 82vh;
  overflow: hidden;
}

.section-content {
  max-height: 82vh;
  overflow: auto;
}

ion-content {
  --overflow: hidden;
}

.section-content::-webkit-scrollbar {
  display: none;
}

@media only screen and (min-width: 1200px) {
  .indexContent {
    display: block;
  }
}
</style>
<style>
.default-theme code {
  --md-theme-code-inline-color: white !important;
  background-color: var(--ion-color-primary);
}
</style>
