<template>
  <ion-row>
    <ion-col>
      <ion-list>
        <ion-list-header mode="ios">
          <ion-label>Usuarios</ion-label>
          <ion-button>
            <ion-icon :icon="addOutline"></ion-icon>
          </ion-button>

          <ion-button :disabled="status == 'loading'" @click="refreshContent()">
            <ion-icon
              v-if="spinners.refreshContent == false"
              :icon="refreshOutline"
            ></ion-icon>
            <ion-spinner
              v-if="spinners.refreshContent == true"
              name="crescent"
            ></ion-spinner>
          </ion-button>
        </ion-list-header>

        <div>
          <ion-card>
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

              <ion-popover
                ref="popoverFilterRef"
                :is-open="popoverFilter.open"
                :dismiss-on-select="false"
                :event="popoverFilter.event"
              >
                <ion-content :scroll-events="true">
                  <div style="height: calc(100dvh - 269px); overflow: auto">
                    <FilterOptionsComponent
                      ref="filterComponentRef"
                      :filters="filterSelected"
                    />
                  </div>

                  <div>
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
                        Eliminar filtros
                      </ion-button>

                      <ion-button
                        fill="clear"
                        @click="
                          getFilters();
                          loadContent();
                          popoverFilter.open = false;
                        "
                        >Aplicar filtros</ion-button
                      >
                    </ion-item>
                  </div>
                </ion-content>
              </ion-popover>
            </ion-item>

            <!-- users -->
            <ion-card-content>
              <section style="overflow-y: scroll; height: 42vh">
                <ion-accordion-group>
                  <div v-for="user in users" :key="user.id">
                    <ion-item lines="none" class="transparent">
                      <ion-icon slot="start" :icon="personOutline"></ion-icon>
                      <ion-label>{{ user.email }}</ion-label>

                      <ion-button
                        :id="'trigger-button-' + user.id"
                        slot="end"
                        fill="clear"
                        :disabled="
                          status == 'loading' || spinners.optionsUser == user.id
                        "
                      >
                        <ion-icon
                          v-if="spinners.optionsUser != user.id"
                          :icon="ellipsisVerticalOutline"
                        ></ion-icon>
                        <ion-spinner
                          v-if="spinners.optionsUser == user.id"
                          name="crescent"
                        ></ion-spinner>
                      </ion-button>

                      <ion-popover
                        :trigger="'trigger-button-' + user.id"
                        dismiss-on-select
                      >
                        <!-- user options -->
                        <ion-content>
                          <ion-item
                            button
                            lines="none"
                            @click="deleteUser(user.email!)"
                          >
                            <ion-icon
                              slot="start"
                              :icon="trashOutline"
                            ></ion-icon>
                            <ion-label>Borrar Usuario</ion-label>
                          </ion-item>

                          <ion-item
                            v-if="user.isDisabled == true"
                            button
                            lines="none"
                            @click="
                              disabledUser({ id: user.id!, disableUser: false })
                            "
                          >
                            <ion-icon
                              slot="start"
                              :icon="checkmarkOutline"
                            ></ion-icon>
                            <ion-label>Habilitar usuario</ion-label>
                          </ion-item>

                          <ion-item
                            v-if="user.isDisabled == false"
                            button
                            lines="none"
                            @click="
                              disabledUser({ id: user.id!, disableUser: true })
                            "
                          >
                            <ion-label>Deshabilitar usuario</ion-label>
                            <ion-icon
                              slot="start"
                              :icon="banOutline"
                            ></ion-icon>
                          </ion-item>

                          <ion-item
                            button
                            lines="none"
                            @click="
                              sendMailResetPassword({ email: user.email! })
                            "
                          >
                            <ion-label>Reiniciar contraseña</ion-label>
                            <ion-icon
                              slot="start"
                              :icon="keyOutline"
                            ></ion-icon>
                          </ion-item>

                          <ion-item
                            button
                            lines="none"
                            @click="
                              resendEmailConfirmation({ email: user.email! })
                            "
                          >
                            <ion-label>Verificar usuario</ion-label>
                            <ion-icon
                              slot="start"
                              :icon="thumbsUpOutline"
                            ></ion-icon>
                          </ion-item>
                        </ion-content>
                      </ion-popover>
                    </ion-item>

                    <ion-accordion :value="user.id" class="transparent">
                      <ion-item slot="header" class="transparent">
                        <ion-label>Información</ion-label>
                      </ion-item>

                      <ion-list slot="content">
                        <ion-item>
                          <ion-label>Nombre</ion-label>
                          <ion-label slot="end">{{ user.name }}</ion-label>
                        </ion-item>

                        <ion-item>
                          <ion-label>Usuario</ion-label>
                          <ion-label slot="end">{{ user.user }}</ion-label>
                        </ion-item>

                        <ion-item>
                          <ion-label>Email verificado</ion-label>
                          <ion-label
                            v-if="user.isEmailVerified == true"
                            slot="end"
                            >Si</ion-label
                          >
                          <ion-label
                            v-if="user.isEmailVerified == false"
                            slot="end"
                            >No</ion-label
                          >
                        </ion-item>

                        <ion-item>
                          <ion-label>Deshabilitado</ion-label>
                          <ion-label v-if="user.isDisabled == true" slot="end"
                            >Si</ion-label
                          >
                          <ion-label v-if="user.isDisabled == false" slot="end"
                            >No</ion-label
                          >
                        </ion-item>
                      </ion-list>
                    </ion-accordion>
                  </div>
                </ion-accordion-group>
              </section>

              <!-- table options -->
              <section class="pagination">
                <ion-item button lines="none" class="transparent">
                  <ion-select
                    slot="end"
                    label="Usuarios a mostrar"
                    interface="popover"
                    :value="pagInfo.pagination"
                    :disabled="status == 'loading'"
                    @ion-change="
                      pagInfo.pagination = $event.target.value;
                      setUsersDisplay();
                    "
                  >
                    <ion-select-option :value="5">5</ion-select-option>
                    <ion-select-option :value="10">10</ion-select-option>
                    <ion-select-option :value="15">15</ion-select-option>
                    <ion-select-option :value="20">20</ion-select-option>
                    <ion-select-option :value="50">50</ion-select-option>
                    <ion-select-option :value="100">100</ion-select-option>
                  </ion-select>
                </ion-item>

                <ion-item lines="none" class="transparent">
                  <ion-label slot="end">Pagina</ion-label>
                  <ion-select
                    slot="end"
                    interface="popover"
                    :value="pagInfo.currentPage"
                    :disabled="status == 'loading'"
                    @ion-change="
                      pagInfo.currentPage = $event.target.value;
                      setUsersPage();
                    "
                  >
                    <ion-select-option
                      v-for="item in pagInfo.totalPaginacionElements"
                      :key="item"
                      :value="item"
                      >{{ item }}
                    </ion-select-option>
                  </ion-select>
                  <ion-spinner
                    v-if="spinners.pageUsers == true"
                    slot="end"
                    name="crescent"
                    color="primary"
                  ></ion-spinner>
                </ion-item>
              </section>
            </ion-card-content>
          </ion-card>
        </div>
      </ion-list>
    </ion-col>
  </ion-row>
</template>

<script setup lang="ts">
import {
  IonAccordion,
  IonAccordionGroup,
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
  IonCheckbox,
  IonCardContent,
  IonSpinner,
  createAnimation,
  Animation,
} from "@ionic/vue";
import { computed, onMounted, reactive, ref, watch } from "vue";
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
} from "ionicons/icons";
// TODO: pending
// import { sendMailResetPassword as sendMailResetPasswordService } from "../../../services/session";
// import { resendEmailConfirmation as resendEmailConfirmationService } from "../../../services/user";

// interface
import { FilterAdminPanelOptions, Link, User } from "@/services/interfaces";
import {
  EmailFilterOption,
  UserFilterOption,
  UserRolFilterOption,
} from "@/utils/types";

// controllers
import UserController from "@/controllers/userController";
import SystemController from "@/controllers/systemController";
const userController = new UserController();
const systemController = new SystemController();

// components
import FilterOptionsComponent from "./components/FilterOptionsComponent.vue";

// vars
const emit = defineEmits(["on-content-loaded"]);
const openToastError = systemController.openToastError;
const pagInfo = ref({
  currentPage: 1,
  totalPaginacionElements: Number(),
  pagination: 10,
});
const searchTerm = ref("");
const searchMode = ref(false);
const filterOptions = [
  {
    label: "Mostrar usuarios verificados",
    value: "emailVerified",
    isChecked: false,
  },
  {
    label: "Mostrar usuario sin verificar",
    value: "emailNoVerified",
    isChecked: false,
  },
  {
    label: "Mostrar usuario habilitados",
    value: "enabled",
    isChecked: false,
  },
  {
    label: "Mostrar usuarios deshabilitados",
    value: "disabled",
    isChecked: false,
  },
  {
    label: "Mostrar usuarios administradores",
    value: "admin",
    isChecked: false,
  },
  {
    label: "Mostrar usuarios no administradores",
    value: "noAdmin",
    isChecked: false,
  },
];
const spinners = {
  refreshContent: false,
  filter: false,
  showUsers: false,
  pageUsers: false,
  optionsUser: "",
};
const status = ref("loaded" as "loading" | "loaded");
let users = ref<User[]>([]);
const filterSelected = reactive<FilterAdminPanelOptions>({
  email: "all",
  user: "all",
  rol: "all",
});
const filterComponentRef = ref<InstanceType<
  typeof FilterOptionsComponent
> | null>(null);
const popoverFilter = reactive({ open: false, event: Event });

// mounted
onMounted(async () => {
  await loadContent();
});
watch(status, (newValue, oldValue) => {
  if (newValue == "loaded") emit("on-content-loaded", true);
  else emit("on-content-loaded", false);
});

// functions
async function loadContent() {
  status.value = "loading";
  await getUsers({
    search: searchTerm.value,
    pagination: pagInfo.value.pagination,
    page: pagInfo.value.currentPage,
    options: filterSelected,
  });
  // await getUsersPaginated();
  status.value = "loaded";
}

async function getUsers(params: {
  search?: string;
  pagination?: number;
  page: number;
  options: FilterAdminPanelOptions;
}): Promise<void> {
  const { search, pagination, page, options } = params;
  searchMode.value = true;
  // const search = searchTerm.value.replace(/ /g, "");

  try {
    const { data, links } = await userController.loadUsers({
      search,
      pagination,
      page,
      options,
    });

    users.value = data;
    userController.updateUsers({ users: data });
    pagInfo.value.totalPaginacionElements = links.filter(
      (item) => !isNaN(Number(item.label)),
    ).length;
  } catch (e: any) {
    console.error(e);
  }
}

async function refreshContent() {
  spinners.refreshContent = true;
  status.value = "loading";
  await getUsers();
  spinners.refreshContent = false;
  status.value = "loaded";
}

function onlyOneUserFilter(index: number) {
  filterOptions.map((option) => {
    option.isChecked = false;
  });

  filterOptions[index].isChecked = true;
}

async function disabledUser(params: { id: string; disableUser: boolean }) {
  spinners.optionsUser = params.id;
  status.value = "loading";

  let alertResponse = true;
  if (params.disableUser == true)
    alertResponse = await systemController.presentAlertConfirmation({
      message:
        "Mientras esté deshabilitada, el usuario no podrá acceder a su cuenta.",
    });

  if (alertResponse == false) return;

  try {
    await userController.disableUser({
      id: params.id,
      disableUser: params.disableUser,
    });

    if (params.disableUser)
      await systemController.presentToast({ message: "Usuario deshabilitado" });
    if (params.disableUser == false)
      await systemController.presentToast({ message: "Usuario habilitado" });
    refreshContent();
  } catch (e: any) {
    if (e.message == "Can't disable admin") {
      await systemController.presentToast({
        message: "No se puede deshabilitar al administrador",
        color: "warning",
      });
      return;
    }
    console.error(e);
    openToastError({ error: e });
  }
  spinners.optionsUser = "";
  status.value = "loaded";
}

async function sendMailResetPassword(params: { email: string }) {
  const { email } = params;
  // spinners.optionsUser = true;

  const alertResponse = await systemController.presentAlertConfirmation({
    message:
      "Se enviarán las instrucciones para restaurar la contraseña al correo electrónico del usuario.",
  });

  if (alertResponse == false) return;

  try {
    // await sendMailResetPasswordService({
    //   email,
    // });

    await systemController.presentToast({ message: "Instrucciones enviadas" });
  } catch (e: any) {
    console.error(e);
    openToastError(e);
  }
  // spinners.optionsUser = false;
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

async function deleteUser(email: string) {
  // spinners.optionsUser = true;

  const alertResponse = await systemController.presentAlertConfirmation({
    message: "Esta acción no es reversible.",
  });

  if (alertResponse == false) return;

  try {
    // await userController.deleteUserAccount({ email });

    await systemController.presentToast({ message: "Usuario eliminado" });
    refreshContent();
  } catch (e: any) {
    console.error(e);
    openToastError({ error: e });
  }
  // spinners.optionsUser = false;
}

function getFilterOptions(): Array<string> {
  const options = Array<string>();
  filterOptions.forEach((element) => {
    if (element.isChecked) options.push(element.value);
  });
  return options;
}

async function filterContent() {
  spinners.filter = true;
  status.value = "loading";
  await getUsers();
  spinners.filter = false;
  status.value = "loaded";
}

async function setUsersDisplay() {
  status.value = "loading";
  await loadContent();
  spinners.showUsers = false;
  status.value = "loaded";
}

async function setUsersPage() {
  spinners.pageUsers = true;
  status.value = "loading";
  await getUsersPaginated();
  spinners.pageUsers = false;
  status.value = "loaded";
  alert();
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
