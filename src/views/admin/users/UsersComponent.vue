<template>
  <ion-row>
    <ion-col>
      <ion-list>
        <ion-list-header mode="ios">
          <ion-label>Usuarios</ion-label>
          <ion-button :disabled="status == 'loading'">
            <ion-icon :icon="addOutline"></ion-icon>
          </ion-button>

          <ion-button :disabled="status == 'loading'" @click="loadContent()">
            <ion-icon :icon="refreshOutline"></ion-icon>
          </ion-button>
        </ion-list-header>

        <div>
          <ion-card style="height: auto" class="shadow-1">
            <ion-item lines="none" class="transparent">
              <ion-searchbar
                mode="ios"
                :value="searchTerm"
                :debounce="1000"
                :disabled="status == 'loading'"
                @ion-input="
                  searchTerm = $event.target.value!.toString();
                  loadContent();
                "
              ></ion-searchbar>

              <!-- filter -->
              <ion-button
                fill="clear"
                @click="
                  popoverFilter.event = $event;
                  popoverFilter.open = true;
                "
              >
                <ion-icon :icon="filterOutline"></ion-icon>
              </ion-button>
            </ion-item>

            <!-- users -->
            <ion-card-content>
              <section style="overflow-y: scroll; height: calc(100dvh - 318px)">
                <div v-for="user in users" :key="user.id">
                  <ion-list>
                    <ion-item
                      lines="full"
                      class="transparent"
                      button
                      @click="
                        userSelected = Object.assign(userSelected, user);
                        modalUserInfo.open = true;
                      "
                    >
                      <ion-icon slot="start" :icon="personOutline"></ion-icon>
                      <ion-label>{{ user.email }}</ion-label>
                    </ion-item>
                  </ion-list>
                </div>
              </section>

              <!-- table options -->
              <section class="pagination">
                <ion-row>
                  <!-- users show -->
                  <ion-col>
                    <ion-item button lines="none" class="transparent">
                      <ion-select
                        slot="end"
                        label="Usuarios a mostrar"
                        interface="popover"
                        :value="pagInfo.pagination"
                        :disabled="status == 'loading'"
                        @ion-change="pagInfo.pagination = $event.target.value"
                      >
                        <ion-select-option
                          v-if="pagInfo.totalElements >= 5"
                          :value="5"
                          >5</ion-select-option
                        >
                        <ion-select-option
                          v-if="pagInfo.totalElements >= 10"
                          :value="10"
                          >10</ion-select-option
                        >
                        <ion-select-option
                          v-if="pagInfo.totalElements >= 15"
                          :value="15"
                          >15</ion-select-option
                        >
                        <ion-select-option
                          v-if="pagInfo.totalElements >= 20"
                          :value="20"
                          >20</ion-select-option
                        >
                        <ion-select-option
                          v-if="pagInfo.totalElements >= 50"
                          :value="50"
                          >50</ion-select-option
                        >
                        <ion-select-option
                          v-if="pagInfo.totalElements >= 100"
                          :value="100"
                          >100</ion-select-option
                        >
                      </ion-select>
                    </ion-item>
                  </ion-col>

                  <!-- pagination -->
                  <ion-col>
                    <ion-item lines="none" class="transparent">
                      <ion-select
                        slot="end"
                        label="Pagina"
                        interface="popover"
                        :value="pagInfo.currentPage"
                        :disabled="status == 'loading'"
                        @ion-change="
                          pagInfo.currentPage = $event.target.value;
                          loadContent();
                        "
                      >
                        <ion-select-option
                          v-for="item in pagInfo.totalPaginacionElements"
                          :key="item"
                          :value="item"
                          >{{ item }}
                        </ion-select-option>
                      </ion-select>
                    </ion-item>
                  </ion-col>
                </ion-row>
              </section>
            </ion-card-content>
          </ion-card>
        </div>
      </ion-list>
    </ion-col>
  </ion-row>

  <!-- popovers -->
  <!-- popover filter options -->
  <ion-popover
    ref="popoverFilterRef"
    :is-open="popoverFilter.open"
    :dismiss-on-select="false"
    :event="popoverFilter.event"
    @did-dismiss="popoverFilter.open = false"
  >
    <ion-content :scroll-events="true">
      <div>
        <FilterOptionsComponent
          ref="filterComponentRef"
          :filters="filterSelected"
        />
      </div>

      <div style="display: flex" class="ion-justify-content-center">
        <ion-item>
          <!-- clear filters -->
          <ion-button
            fill="clear"
            color="danger"
            @click="
              deleteFilters();
              getFilters();
              loadContent();
              popoverFilter.open = false;
            "
          >
            Reiniciar
          </ion-button>

          <ion-button
            fill="clear"
            @click="
              getFilters();
              loadContent();
              popoverFilter.open = false;
            "
            >Aplicar
          </ion-button>
        </ion-item>
      </div>
    </ion-content>
  </ion-popover>

  <!-- popover user options -->
  <ion-popover
    :is-open="popoverUserOptions.open"
    :event="popoverUserOptions.event"
    dismiss-on-select
    @did-dismiss="popoverUserOptions.open = false"
  >
    <!-- user options -->
    <ion-content>
      <!-- enable user -->
      <ion-item
        v-if="userSelected.isDisabled == true"
        button
        lines="none"
        @click="
          handleUpdateUserStatus({
            id: userSelected.id!,
            status: false,
          })
        "
      >
        <ion-icon slot="start" :icon="checkmarkOutline"></ion-icon>
        <ion-label>Habilitar usuario</ion-label>
      </ion-item>

      <ion-item
        v-if="userSelected.isDisabled == false"
        button
        lines="none"
        @click="
          handleUpdateUserStatus({
            id: userSelected.id!,
            status: true,
          })
        "
      >
        <ion-label>Deshabilitar usuario</ion-label>
        <ion-icon slot="start" :icon="banOutline"></ion-icon>
      </ion-item>

      <!-- delete user -->
      <ion-item
        button
        lines="none"
        @click="
          handleDeleteUser({ email: userSelected.email, id: userSelected.id })
        "
      >
        <ion-icon slot="start" :icon="trashOutline" color="danger"></ion-icon>
        <ion-label color="danger">Borrar Usuario</ion-label>
      </ion-item>
    </ion-content>
  </ion-popover>
  <!-- end popovers -->

  <!-- modals -->
  <!-- modal user info -->
  <ion-modal
    :is-open="modalUserInfo.open"
    @did-dismiss="modalUserInfo.open = false"
  >
    <ion-header mode="ios" class="ion-no-border">
      <ion-toolbar>
        <ion-buttons slot="start" :mode="designMode">
          <ion-button @click="modalUserInfo.open = false">
            <ion-icon :icon="closeOutline"> </ion-icon>
          </ion-button>
        </ion-buttons>

        <ion-title>Información de usuario</ion-title>

        <ion-buttons slot="end" :mode="designMode">
          <ion-button
            slot="end"
            fill="clear"
            :disabled="status == 'loading'"
            @click="
              popoverUserOptions.event = $event;
              popoverUserOptions.open = true;
            "
          >
            <ion-icon
              v-if="status != 'loading'"
              :icon="ellipsisVerticalOutline"
            ></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <ModalUserComponent :user-prop="userSelected" :status-prop="status" />
    </ion-content>
  </ion-modal>
</template>

<script setup lang="ts">
import {
  IonButton,
  IonItem,
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonSearchbar,
  IonRow,
  IonCol,
  IonList,
  IonListHeader,
  IonIcon,
  IonCard,
  IonPopover,
  IonContent,
  IonCardContent,
  IonSpinner,
  IonModal,
} from "@ionic/vue";
import { onMounted, reactive, ref, watch } from "vue";
import {
  refreshOutline,
  ellipsisVerticalOutline,
  addOutline,
  filterOutline,
  personOutline,
  banOutline,
  trashOutline,
  keyOutline,
  checkmarkOutline,
  thumbsUpOutline,
  closeOutline,
} from "ionicons/icons";
// TODO: pending

// interface
import {
  AdminDeleteUserAccount,
  FilterAdminPanelOptions,
  User,
} from "@/services/interfaces";
import { DesignMode } from "@/utils/types";

// controllers
import UserController from "@/controllers/userController";
import SystemController from "@/controllers/systemController";
const userController = new UserController();
const systemController = new SystemController();

// components
import FilterOptionsComponent from "./components/FilterOptionsComponent.vue";
import ModalUserComponent from "./components/ModalUserComponent.vue";

// vars
const emit = defineEmits(["on-content-loaded"]);
const openToastError = systemController.openToastError;
const pagInfo = reactive({
  currentPage: 1,
  totalPaginacionElements: Number(),
  pagination: 10,
  totalElements: Number(),
});
const searchTerm = ref("");
const searchMode = ref(false);
const status = ref("loaded" as "loading" | "loaded");
let users = reactive<User[]>([]);
const filterSelected = reactive<FilterAdminPanelOptions>({
  email: "all",
  user: "all",
  rol: "all",
});
const filterComponentRef = ref<InstanceType<
  typeof FilterOptionsComponent
> | null>(null);
const popoverFilter = reactive({ open: false, event: Event });
const userSelected = reactive<User>({});
const modalUserInfo = reactive({ open: false });
const popoverUserOptions = reactive({ open: false, event: Event });
const designMode = ref<DesignMode>(systemController.getdesignMode());

// mounted
onMounted(async () => {
  await loadContent();
});
// watch
watch(status, (newValue) => {
  if (newValue == "loaded") emit("on-content-loaded", true);
  else emit("on-content-loaded", false);
});

watch(
  () => pagInfo.pagination,
  () => {
    pagInfo.currentPage = 1;
    setUsersDisplay();
  },
);
watch(
  () => systemController.getdesignMode(),
  (newValue) => {
    designMode.value = newValue;
  },
);

// functions
async function loadContent() {
  status.value = "loading";
  await loadUsers({
    search: searchTerm.value,
    pagination: pagInfo.pagination,
    page: pagInfo.currentPage,
    options: filterSelected,
  });
  status.value = "loaded";
}

async function loadUsers(params: {
  search?: string;
  pagination?: number;
  page: number;
  options: FilterAdminPanelOptions;
}): Promise<void> {
  const { search, pagination, page, options } = params;
  searchMode.value = true;

  try {
    const { data, links, total } = await userController.loadUsers({
      search,
      pagination,
      page,
      options,
    });

    Object.assign(users, data);
    // userController.updateUsers({ users: data });
    pagInfo.totalPaginacionElements = links.filter(
      (item) => !isNaN(Number(item.label)),
    ).length;
    pagInfo.totalElements = total;
  } catch (e: any) {
    console.error(e);
  }
}

async function updateUserStatus(params: { id: string; status: boolean }) {
  try {
    await userController.updateUserStatus({
      id: params.id,
      status: params.status,
    });
  } catch (e: unknown) {
    if (e instanceof Error && e.message === "Operation failed") {
      const message = status.value
        ? "Problema al habilitar el usuario"
        : "Problema al deshabilitar el usuario";
      await systemController.presentToast({
        message,
        color: "danger",
      });
      throw e.message;
    } else {
      console.error(e);
      throw e;
    }
  }
}

async function handleUpdateUserStatus(params: { id: string; status: boolean }) {
  const { id, status } = params;
  const oldValue = !params.status;
  let alertResponse = true;

  if (status == true)
    alertResponse = await systemController.presentAlertConfirmation({
      message:
        "Mientras esté deshabilitada, el usuario no podrá acceder a su cuenta.",
    });

  if (alertResponse == false) return;

  if (status) {
    await systemController.presentToast({ message: "Usuario habilitado" });
  } else {
    await systemController.presentToast({ message: "Usuario deshabilitado" });
  }

  const index = users.findIndex((user) => user.id === id);
  if (index !== -1) {
    users[index].isDisabled = status;
    userSelected.isDisabled = status;
  }

  try {
    await updateUserStatus(params);
  } catch (e: unknown) {
    console.error(e);
    users[index].isDisabled = oldValue;
    userSelected.isDisabled = oldValue;
  }
}

async function resendEmailConfirmation(params: { email: string }) {
  const { email } = params;
  // spinners.optionsUser = true;

  const alertResponse = await systemController.presentAlertConfirmation({
    message:
      "Se enviarán las instrucciones para la verificación de la cuenta al correo electrónico del usuario.",
  });

  if (alertResponse == false) return;

  try {
    // await resendEmailConfirmationService({ email });

    await systemController.presentToast({ message: "Instrucciones enviadas" });
  } catch (e: any) {
    if (e.message == "User already verified") {
      await systemController.presentToast({
        message: "Ya se encuentra activado",
      });
      return;
    }
    console.error(e);
    openToastError({ error: e });
  }
  // spinners.optionsUser = false;
}

async function deleteUser(params: AdminDeleteUserAccount) {
  const { email, id } = params;

  try {
    await userController.deleteUserAccount({ email, id });
  } catch (e: unknown) {
    if (e instanceof Error && e.message === "Operation failed") {
      const message = status.value
        ? "Problema al eliminar el usuario"
        : "Problema al eliminar el usuario";
      await systemController.presentToast({
        message,
        color: "danger",
      });
      throw e.message;
    } else {
      console.error(e);
      throw e;
    }
  }
}

async function handleDeleteUser(params: AdminDeleteUserAccount) {
  const { email, id } = params;
  const index = users.findIndex(
    (user) => user.id === id || user.email === email,
  );

  if (index === -1) return;

  const oldUser = { user: users[index], index };

  const alertResponse = await systemController.presentAlertConfirmation({
    message: "Esta acción no es reversible.",
  });

  if (!alertResponse) return;

  modalUserInfo.open = false;
  users.splice(index, 1);
  await systemController.presentToast({ message: "Usuario eliminado" });

  try {
    await deleteUser(params);
  } catch (e: unknown) {
    console.error(e);
    users.splice(oldUser.index, 0, oldUser.user);
  }
}

async function setUsersDisplay() {
  status.value = "loading";
  await loadContent();
  // spinners.showUsers = false;
  status.value = "loaded";
}

async function deleteFilters() {
  filterComponentRef.value?.resetFilters();
}

function getFilters() {
  const filters = filterComponentRef.value?.getFiltersSelected();
  if (filters) Object.assign(filterSelected, filters);
}
</script>

<style scoped>
.wrap-text-item {
  --min-height: auto;
  white-space: normal;
}

.wrap-text-checkbox {
  --ion-item-white-space: normal;
  white-space: normal;
}

.card-content {
  overflow: hidden;
}
@media only screen and (min-width: 600px) {
  .pagination {
    display: flex;
    float: right;
  }

  .pagination > div {
    display: inline-block;
  }
}
</style>
