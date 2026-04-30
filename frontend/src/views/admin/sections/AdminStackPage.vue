<template>
  <ion-header class="ion-no-border" mode="ios">
    <ion-toolbar style="--background: var(--ion-background-color)">
      <ion-buttons slot="start">
        <ion-menu-button></ion-menu-button>
      </ion-buttons>

      <ion-title>Stack</ion-title>

      <ion-buttons slot="end">
        <ion-button
          :disabled="saving"
          @click="handleSave"
        >
          <ion-spinner v-if="saving" slot="start">
          </ion-spinner>

          <ion-icon :icon="saveOutline"></ion-icon>
        </ion-button>
      </ion-buttons>
    </ion-toolbar>
  </ion-header>

  <ion-content class="ion-padding">
    <ion-grid>
      <ion-row class="ion-justify-content-center">
        <ion-col size="4">
          <ion-breadcrumbs>
            <ion-breadcrumb>
              <RouterLink :to="{ name: 'PanelAdminPage' }">Panel</RouterLink>
            </ion-breadcrumb>

            <ion-breadcrumb>Stack editor</ion-breadcrumb>
          </ion-breadcrumbs>
        </ion-col>
      </ion-row>
    </ion-grid>

    <ion-grid>
      <ion-row class="ion-justify-content-center">
        <ion-col size="4">
          <StackEditor
            :model-value="stackData"
            @update:model-value="stackData = $event"
            @update:files="updateStackFiles"
          />
        </ion-col>
      </ion-row>
    </ion-grid>
  </ion-content>
</template>

<script setup lang="ts">
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonContent,
  IonButton,
  IonSpinner,
  IonGrid,
  IonRow,
  IonCol,
  IonBreadcrumbs,
  IonBreadcrumb,
} from "@ionic/vue";
import { ref, reactive, onMounted } from "vue";
import { useRouter } from "vue-router";
import StackEditor from "../editors/StackEditor.vue";
import StackController from "@/controllers/stackController";
import { saveOutline } from "ionicons/icons";
import type { StackItem } from "@/services/types";

const stackController = new StackController();
const router = useRouter();
const saving = ref(false);

const stackData = ref<StackItem[]>([]);
const pendingFiles = reactive<Record<number, File>>({});

onMounted(async () => {
  try {
    const data = await stackController.loadStack();
    stackData.value = data || [];
  } catch (error) {
    console.error("Error loading stack:", error);
  }
});

function updateStackFiles(fileMap: Record<number, File>) {
  Object.keys(fileMap).forEach(key => {
    pendingFiles[Number(key)] = fileMap[Number(key)];
  });
}

async function handleSave() {
  saving.value = true;
  try {
    for (const stack of stackData.value) {
      if (stack.id) {
        const file = pendingFiles[stack.id];
        await stackController.updateStack(stack.id, stack, file);
      } else {
        const file = pendingFiles[stackData.value.indexOf(stack)];
        await stackController.addStack(stack, file);
      }
    }
    await stackController.loadStack();
    router.push("/admin-panel");
  } catch (error) {
    console.error("Error saving stack:", error);
  } finally {
    saving.value = false;
  }
}
</script>