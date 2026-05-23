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
          />
        </ion-col>
      </ion-row>
    </ion-grid>
  </ion-content>
</template>

<script setup lang="ts">
import {
  IonBreadcrumb,
  IonBreadcrumbs,
  IonButton,
  IonButtons,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonIcon,
  IonMenuButton,
  IonRow,
  IonSpinner,
  IonTitle,
  IonToolbar,
  alertController,
} from "@ionic/vue";
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import StackEditor from "../editors/StackEditor.vue";
import StackController from "@/controllers/stackController";
import { usePermissionGuard } from "@/composables/usePermissionGuard";
import { saveOutline } from "ionicons/icons";

const { can, guard } = usePermissionGuard();
import type { StackItem } from "@/services/types";

const stackController = new StackController();
const router = useRouter();
const saving = ref(false);

const stackData = ref<StackItem[]>([]);

onMounted(async () => {
  try {
    const data = await stackController.loadStack();
    stackData.value = data || [];
  } catch (error) {
    console.error("Error loading stack:", error);
  }
});

async function handleSave() {
  const canCreate = can({ permission: 'stacks.create' });
  const canUpdate = can({ permission: 'stacks.update' });
  if (!canCreate && !canUpdate) {
    await guard({ permission: 'stacks.update' });
    return;
  }

  saving.value = true;
  try {
    for (const stack of stackData.value) {
      if (stack.id) {
        if (!canUpdate) continue;
        await stackController.updateStack(stack.id, stack);
      } else {
        if (!canCreate) continue;
        await stackController.addStack(stack);
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
