<template>
  <ion-row>
    <ion-col>
      <ion-list>
        <ion-list-header mode="ios">
          <ion-label>Usuarios</ion-label>

          <div style="display: flex">
            <ion-button
              :disabled="refreshContent.users"
              @click="modals.userRegister.open = true"
            >
              <ion-icon :icon="addOutline"></ion-icon>
            </ion-button>

            <ButtonIconAnimationComponent
              :message="'Cargando'"
              :active="isButtonRefreshUsersActive"
              :disabled="
                refreshContent.users && isButtonRefreshUsersActive == false
              "
              :icon="refreshOutline"
              :fill="isButtonRefreshUsersActive ? 'solid' : 'clear'"
              @click="handleButtonRefreshUsers()"
            />
          </div>
        </ion-list-header>

        <div>
          <ion-card style="height: auto" class="shadow-1">
            <ion-item lines="none" class="transparent">
              <ion-searchbar
                mode="ios"
                :value="searchTerm"
                :debounce="1000"
                :disabled="refreshContent.users"
                @ion-input="
                  searchTerm = $event.target.value!.toString();
                  loadContent();
                "
              ></ion-searchbar>

              <!-- filter -->
              <ion-button
                fill="clear"
                @click="
                  popovers.filter.event = $event;
                  popovers.filter.open = true;
                "
              >
                <ion-icon :icon="filterOutline"></ion-icon>
              </ion-button>
            </ion-item>

            <!-- users -->
            <ion-card-content>
              <section style="overflow-y: scroll; height: calc(100dvh - 318px)">
                <div v-if="refreshContent.users == false">
                  <div v-for="(user, userIndex) in users" :key="user.id">
                    <ion-list>
                      <ion-item
                        lines="full"
                        button
                        class="transparent"
                        @mouseover="
                          userSelected = user;
                          userHoverIndex = userIndex;
                        "
                        @mouseleave="userHoverIndex = -1"
                        @contextmenu.prevent="
                          userSelected = user;
                          popovers.userOptions.event = $event;
                          popovers.userOptions.open = true;
                        "
                      >
                        <ion-icon slot="start" :icon="personOutline"></ion-icon>
                        <ion-label
                          @click="
                            userSelected = Object.assign(userSelected, user);
                            contextMenu = 'modal';
                            modals.userInfo.open = true;
                          "
                          >{{ user.email }}</ion-label
                        >

                        <!-- disable/enable user button -->
                        <ion-button
                          v-if="
                            userHoverIndex == userIndex &&
                            (screenSize.preset == 'md' ||
                              screenSize.preset == 'lg' ||
                              screenSize.preset == 'xl' ||
                              screenSize.preset == 'xxl')
                          "
                          fill="clear"
                          @click="modals.userRegister.open = true"
                        >
                          <ion-icon :icon="createOutline"></ion-icon>
                        </ion-button>

                        <!-- delete user button -->
                        <ion-button
                          v-if="
                            userHoverIndex == userIndex &&
                            (screenSize.preset == 'md' ||
                              screenSize.preset == 'lg' ||
                              screenSize.preset == 'xl' ||
                              screenSize.preset == 'xxl')
                          "
                          fill="clear"
                          @click="modals.userRegister.open = true"
                        >
                          <ion-icon
                            :icon="trashOutline"
                            color="danger"
                          ></ion-icon>
                        </ion-button>

                        <!-- more options -->
                        <ion-button
                          v-if="
                            userHoverIndex == userIndex &&
                            (screenSize.preset == 'md' ||
                              screenSize.preset == 'lg' ||
                              screenSize.preset == 'xl' ||
                              screenSize.preset == 'xxl')
                          "
                          fill="clear"
                          @click="
                            contextMenu = 'main';
                            popovers.userOptions.event = $event;
                            popovers.userOptions.open = true;
                          "
                        >
                          <ion-icon :icon="ellipsisVerticalOutline"></ion-icon>
                        </ion-button>
                      </ion-item>
                    </ion-list>
                  </div>
                </div>

                <div v-if="refreshContent.users == true">
                  <div v-for="n in 8" :key="n">
                    <ion-list>
                      <ion-item lines="full" class="transparent">
                        <ion-icon slot="start" :icon="personOutline"></ion-icon>
                        <ion-label>
                          <ion-skeleton-text
                            animated
                            style="width: 70%"
                          ></ion-skeleton-text>
                        </ion-label>
                      </ion-item>
                    </ion-list>
                  </div>
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
                        :disabled="refreshContent.users"
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
    :is-open="popovers.filter.open"
    :dismiss-on-select="false"
    :event="popovers.filter.event"
    @did-dismiss="popovers.filter.open = false"
  >
    <ion-content :scroll-events="true">
      <div>
        <FilterOptionsComponent
          ref="componentRefs.filterComponent"
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
              popovers.filter.open = false;
            "
          >
            Reiniciar
          </ion-button>

          <ion-button
            fill="clear"
            @click="
              getFilters();
              loadContent();
              popovers.filter.open = false;
            "
            >Aplicar
          </ion-button>
        </ion-item>
      </div>
    </ion-content>
  </ion-popover>

  <!-- popover user options -->
  <ion-popover
    :is-open="popovers.userOptions.open"
    :event="popovers.userOptions.event"
    @did-dismiss="popovers.userOptions.open = false"
  >
    <ion-content>
      <!-- edit user -->
      <ion-item
        v-if="
          contextMenu == 'modal' ||
          (contextMenu == 'main' && screenSize.preset == 'xs')
        "
        button
        lines="none"
        @click="handleUpdateUserProfile()"
      >
        <ion-icon slot="start" :icon="createOutline"></ion-icon>
        <ion-label>Editar usuario</ion-label>
      </ion-item>

      <!-- enable user -->
      <CardOptions
        v-if="userSelected.isDisabled == true"
        ref="cardOptionsEnableUserRef"
        :icon="checkmarkOutline"
        :main-message="{ message: 'Habilitar usuario' }"
        :option1="{ message: 'Si' }"
        :option2="{ message: 'No' }"
        :border="{ active: true, color: 'primary', trigger: 'hover' }"
        style="margin: 2px"
        @click-op1="
          handleUpdateUserStatus({
            id: userSelected.id!,
            status: false,
          })
        "
        @click-op2="cardOptionsDeleUserRef?.toggleExpand()"
      />

      <!-- disable user -->
      <CardOptions
        v-if="userSelected.isDisabled == false"
        ref="cardOptionsDisableUserRef"
        :icon="banOutline"
        :main-message="{ message: 'Deshabilitar usuario' }"
        :option1="{ color: 'danger', message: 'Si' }"
        :option2="{ message: 'No' }"
        :border="{ active: true, color: 'primary', trigger: 'hover' }"
        style="margin: 2px"
        @click-op1="
          handleUpdateUserStatus({
            id: userSelected.id!,
            status: true,
          })
        "
        @click-op2="cardOptionsDeleUserRef?.toggleExpand()"
      />

      <!-- delete user -->
      <CardOptions
        ref="cardOptionsDeleUserRef"
        :icon="trashOutline"
        :main-message="{ color: 'danger', message: 'Eliminar usuario' }"
        :option1="{ color: 'danger', message: 'Si' }"
        :option2="{ color: 'primary', message: 'No' }"
        :border="{ active: true, color: 'danger', trigger: 'hover' }"
        style="margin: 2px"
        @click-op1="
          handleDeleteUser({ email: userSelected.email!, id: userSelected.id! })
        "
        @click-op2="cardOptionsDeleUserRef?.toggleExpand()"
      />
    </ion-content>
  </ion-popover>
  <!-- end popovers -->

  <!-- modals -->
  <!-- modal user info -->
  <ion-modal
    :is-open="modals.userInfo.open"
    @did-dismiss="modals.userInfo.open = false"
  >
    <ion-header mode="ios" class="ion-no-border">
      <ion-toolbar>
        <ion-buttons slot="start" :mode="designMode">
          <ion-button @click="modals.userInfo.open = false">
            <ion-icon :icon="closeOutline"> </ion-icon>
          </ion-button>
        </ion-buttons>

        <ion-title>Información de usuario</ion-title>

        <ion-buttons slot="end" :mode="designMode">
          <ion-button
            slot="end"
            fill="clear"
            :disabled="refreshContent.users"
            @click="
              popovers.userOptions.event = $event;
              popovers.userOptions.open = true;
            "
          >
            <ion-icon
              v-if="refreshContent.users == false"
              :icon="ellipsisVerticalOutline"
            ></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <ModalUserComponent :user-prop="userSelected" />
    </ion-content>
  </ion-modal>

  <!-- moda user register -->
  <ion-modal
    :is-open="modals.userRegister.open"
    @did-dismiss="modals.userRegister.open = false"
  >
    <ion-header mode="ios" class="ion-no-border">
      <ion-toolbar>
        <ion-buttons slot="start" :mode="designMode">
          <ion-button
            :disabled="isButtonSaveUserActive"
            :backdrop-dismiss="isButtonSaveUserActive"
            @click="modals.userRegister.open = false"
          >
            <ion-icon :icon="closeOutline"> </ion-icon>
          </ion-button>
        </ion-buttons>

        <ion-title>Información de usuario</ion-title>

        <ion-buttons slot="end" :mode="designMode">
          <ButtonIconAnimationComponent
            :message="'Guardando'"
            :active="isButtonSaveUserActive"
            :disabled="refreshContent.users"
            :icon="saveOutline"
            :fill="isButtonSaveUserActive ? 'solid' : 'clear'"
            @click="
              handleCreateUserAccount(
                componentRefs.signUpFormComponent?.getData()!,
              )
            "
          />
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <ion-card class="shadow-1 ion-padding">
        <SignUpFormComponent
          ref="componentRefs.signUpFormComponent"
          @enter-pressed="
            handleCreateUserAccount(
              componentRefs.signUpFormComponent?.getData()!,
            )
          "
        />
      </ion-card>
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
  checkmarkOutline,
  closeOutline,
  createOutline,
  saveOutline,
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
import SignUpFormComponent from "@/forms/SignUpFormComponent.vue";
import ButtonIconAnimationComponent from "@/components/buttons/ButtonIconAnimationComponent.vue";
import CardOptions from "@/components/cards/CardOptions.vue";

// vars
const pagInfo = reactive({
  currentPage: 1,
  totalPaginacionElements: Number(),
  pagination: 10,
  totalElements: Number(),
});
const searchTerm = ref("");
let users = reactive<User[]>([]);
const filterSelected = reactive<FilterAdminPanelOptions>({
  email: "all",
  user: "all",
  rol: "all",
});
const componentRefs = reactive({
  filterComponent: ref<InstanceType<typeof FilterOptionsComponent> | null>(
    null,
  ),
  signUpFormComponent: ref<InstanceType<typeof SignUpFormComponent> | null>(
    null,
  ),
});
const popovers = reactive({
  filter: reactive({ open: false, event: Event }),
  userOptions: reactive({ open: false, event: Event }),
});
const modals = reactive({
  userInfo: reactive({ open: false }),
  userRegister: reactive({ open: false }),
});
const userSelected = reactive<User>({});
const designMode = ref<DesignMode>(systemController.getdesignMode());
const userHoverIndex = ref<number>(-1);
const screenSize = ref(systemController.getScreenSize());
const contextMenu = ref<"modal" | "main">("modal");
const refreshContent = reactive({ users: false });
const isButtonRefreshUsersActive = ref(false);
const isButtonSaveUserActive = ref(false);
// end vars

// refs
const cardOptionsDeleUserRef = ref<InstanceType<typeof CardOptions> | null>(
  null,
);
const cardOptionsEnableUserRef = ref<InstanceType<typeof CardOptions> | null>(
  null,
);
const cardOptionsDisableUserRef = ref<InstanceType<typeof CardOptions> | null>(
  null,
);
// end refs

// mounted
onMounted(async () => {
  await loadContent();
});
// watch
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
watch(systemController.getScreenSize(), (newVal) => {
  screenSize.value = newVal;
});

// functions
async function loadContent() {
  refreshContent.users = true;
  await loadUsers({
    search: searchTerm.value,
    pagination: pagInfo.pagination,
    page: pagInfo.currentPage,
    options: filterSelected,
  });
  refreshContent.users = false;
}

async function loadUsers(params: {
  search?: string;
  pagination?: number;
  page: number;
  options: FilterAdminPanelOptions;
}): Promise<void> {
  const { search, pagination, page, options } = params;

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
  } catch (e: unknown) {
    console.error(e);
  }
}

async function updateUserStatus(params: { id: string; status: boolean }) {
  const { id, status } = params;
  try {
    await userController.updateUserStatus({
      id: id,
      status: status,
    });
  } catch (e: unknown) {
    if (e instanceof Error && e.message === "Operation failed") {
      const message = status
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
  const oldValue = !status;
  const cardOptionsRef = status
    ? cardOptionsDisableUserRef
    : cardOptionsEnableUserRef;
  const toastMessage = status ? "Usuario habilitado" : "Usuario deshabilitado";

  cardOptionsRef.value?.toggleExpand();
  cardOptionsRef.value?.updateBorderProp({
    style: "animated",
    trigger: "none",
  });
  await new Promise((resolve) => setTimeout(resolve, 1500));

  popovers.userOptions.open = false;
  await new Promise((resolve) => setTimeout(resolve, 500));

  await systemController.presentToast({ message: toastMessage });

  const index = users.findIndex((user) => user.id === id);
  if (index !== -1) {
    users[index].isDisabled = status;
    userSelected.isDisabled = status;
  }

  try {
    await updateUserStatus(params);
  } catch (e: unknown) {
    console.error(e);
    if (index !== -1) {
      users[index].isDisabled = oldValue;
      userSelected.isDisabled = oldValue;
    }
  }
}

async function deleteUser(params: AdminDeleteUserAccount) {
  const { email, id } = params;

  try {
    await userController.deleteUserAccount({ email, id });
  } catch (e: unknown) {
    if (e instanceof Error && e.message === "Operation failed") {
      const message = "Problema al eliminar el usuario";
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

  cardOptionsDeleUserRef.value?.toggleExpand();
  cardOptionsDeleUserRef.value?.updateBorderProp({
    style: "animated",
    trigger: "none",
  });
  await new Promise((resolve) => setTimeout(resolve, 1500));

  popovers.userOptions.open = false;
  await new Promise((resolve) => setTimeout(resolve, 500));

  users.splice(index, 1);
  modals.userInfo.open = false;
  await new Promise((resolve) => setTimeout(resolve, 500));
  await systemController.presentToast({ message: "Usuario eliminado" });

  try {
    await deleteUser(params);
  } catch (e: unknown) {
    console.error(e);
    users.splice(oldUser.index, 0, oldUser.user);
  }
}

async function setUsersDisplay() {
  refreshContent.users = true;
  await loadContent();
  refreshContent.users = false;
}

async function deleteFilters() {
  componentRefs.filterComponent?.resetFilters();
}

function getFilters() {
  const filters = componentRefs.filterComponent?.getFiltersSelected();
  if (filters) Object.assign(filterSelected, filters);
}

async function handleCreateUserAccount(params: {
  name: string;
  user: string;
  email: string;
  password: string;
}) {
  if (
    !params ||
    !params.name ||
    !params.user ||
    !params.email ||
    !params.password
  ) {
    console.error("Invalid parameters");
    return;
  }

  isButtonSaveUserActive.value = true;

  const { name, user, email, password } = params;
  try {
    await systemController.presentToast({ message: "Usuario agregado" });
    users.push({
      name,
      user,
      email,
      password,
      isDisabled: false,
      id: "",
    });

    await new Promise((resolve) => setTimeout(resolve, 800));
    isButtonSaveUserActive.value = false;
    modals.userRegister.open = false;

    const result = await createUserAccount(params);
    if (result) {
      const index = users.findIndex((user) => user.email === email);
      if (index !== -1) {
        users[index].id = result.id.toString();
        userSelected.id = result.id.toString();
      }
    }
  } catch (e: unknown) {
    console.error(e);
    users.pop();
  } finally {
    isButtonSaveUserActive.value = false;
  }
}

async function createUserAccount(params: {
  name: string;
  user: string;
  email: string;
  password: string;
}): Promise<{ id: number } | undefined> {
  const { name, user, password, email } = params;

  try {
    const { id } = await userController.createUserAccount({
      name,
      user,
      email,
      password,
    });
    return { id };
  } catch (e: unknown) {
    if (e instanceof Error && e.message === "Operation failed") {
      const message = "Problema al crear el usuario";
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

async function handleUpdateUserProfile() {
  await updateUserProfile();
}

async function updateUserProfile() {
  //
}

async function handleButtonRefreshUsers() {
  isButtonRefreshUsersActive.value = true;
  await loadContent();
  isButtonRefreshUsersActive.value = false;
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
