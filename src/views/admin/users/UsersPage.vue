<template>
  <ion-row>
    <ion-col>
      <ion-list>
        <ion-list-header>
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
                v-model="searchTerm"
                mode="ios"
                :debounce="500"
                :disabled="status == 'loading'"
                @ion-change="filterContent()"
              ></ion-searchbar>

              <!-- filter -->
              <ion-button
                id="trigger-button-filter"
                fill="clear"
                :disabled="status == 'loading'"
              >
                <ion-icon
                  v-if="spinners.filter == false"
                  :icon="filterOutline"
                ></ion-icon>
                <ion-spinner
                  v-if="spinners.filter == true"
                  name="crescent"
                ></ion-spinner>
              </ion-button>
              <ion-popover
                trigger="trigger-button-filter"
                :dismiss-on-select="true"
                @did-dismiss="filterContent()"
              >
                <ion-content :scroll-events="true">
                  <ion-item
                    v-for="(option, index) in filterOptions"
                    :key="option.value"
                    button
                    @click="onlyOneUserFilter(index)"
                  >
                    <ion-checkbox
                      slot="start"
                      :checked="option.isChecked"
                    ></ion-checkbox>
                    <ion-label class="ion-text-wrap">{{
                      option.label
                    }}</ion-label>
                  </ion-item>
                </ion-content>
              </ion-popover>
            </ion-item>

            <!-- users -->
            <ion-card-content>
              <section style="overflow-y: scroll; height: 42vh">
                <ion-accordion-group>
                  <div v-for="user in useUsers.users.value" :key="user.id">
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
                            @click="sendMailResetPassword(user.email!)"
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
                            @click="resendEmailConfirmation(user.email!)"
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
                        <ion-label>Informacion</ion-label>
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

              <section class="pagination">
                <ion-item lines="none" class="transparent">
                  <ion-label slot="end">Usuarios a mostrar</ion-label>
                  <ion-select
                    v-if="spinners.showUsers == false"
                    slot="end"
                    v-model="paginatorInfo.pagination"
                    interface="popover"
                    :disabled="status == 'loading'"
                    @ion-change="setUsersDisplay()"
                  >
                    <ion-select-option value="10">10</ion-select-option>
                    <ion-select-option value="15">15</ion-select-option>
                    <ion-select-option value="20">20</ion-select-option>
                    <ion-select-option value="50">50</ion-select-option>
                    <ion-select-option value="100">100</ion-select-option>
                  </ion-select>
                  <ion-spinner
                    v-if="spinners.showUsers == true"
                    slot="end"
                    name="crescent"
                    color="primary"
                  ></ion-spinner>
                </ion-item>

                <ion-item lines="none" class="transparent">
                  <ion-label slot="end">Pagina</ion-label>
                  <ion-select
                    v-if="spinners.pageUsers == false"
                    slot="end"
                    v-model="paginatorInfo.currentPage"
                    interface="popover"
                    :disabled="status == 'loading'"
                    @ion-change="setUsersPage()"
                  >
                    <ion-select-option value="1">1</ion-select-option>
                    <ion-select-option
                      v-for="item in calculatePages"
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

<script lang="ts">
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
} from "@ionic/vue";
import { defineComponent } from "vue";
import {
  getUsers,
  disableUser,
  deleteUserAccount,
  searchUsers,
} from "../../../services/admin";
import {
  refreshOutline,
  ellipsisVerticalOutline,
  addOutline,
  filterOutline,
  chevronBackOutline,
  chevronForwardOutline,
  personOutline,
  banOutline,
  trashOutline,
  keyOutline,
  checkmarkOutline,
  thumbsUpOutline,
} from "ionicons/icons";
import { User } from "../../../services/interfaces";
import { openToast, presentAlertConfirmation } from "../../../services/system";
import { sendMailResetPassword } from "../../../services/session";
import { resendEmailConfirmation } from "../../../services/user";
import { USERS_ADMINISTRATION_DETAILS } from "../../../services/graphql";
import { useUsers } from "../../../composables/useUsers";
import { useSystem } from "../../../composables/useSystem";

export default defineComponent({
  name: "UserAdminPanel",

  components: {
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
  },

  setup() {
    return {
      pageTitle: "Administracion de usuarios",
      refreshOutline,
      ellipsisVerticalOutline,
      addOutline,
      filterOutline,
      chevronBackOutline,
      chevronForwardOutline,
      personOutline,
      banOutline,
      trashOutline,
      keyOutline,
      checkmarkOutline,
      thumbsUpOutline,
      useUsers: useUsers(),
      openToastError: useSystem().openToastError,
    };
  },

  data() {
    return {
      users: Array<User>(),
      paginatorInfo: {
        currentPage: "1",
        hasMorePages: Boolean(),
        totalPaginacionElements: Number(),
        pagination: "10",
      },
      searchTerm: "",
      searchMode: false,
      filterOptions: [
        {
          label: "Sin filtro",
          value: "unfiltered",
          isChecked: true,
        },
        {
          label: "Mostrar usuarios verificados",
          value: "verified",
          isChecked: false,
        },
        {
          label: "Mostrar usaurio sin virificar",
          value: "no verified",
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
          value: "no admin",
          isChecked: false,
        },
      ],
      spinners: {
        refreshContent: false,
        filter: false,
        showUsers: false,
        pageUsers: false,
        optionsUser: "",
      },
      status: "loaded" as "loading" | "loaded",
    };
  },

  computed: {
    calculatePages() {
      const elements = [] as any;
      let total = Math.round(
        this.paginatorInfo.totalPaginacionElements /
          parseInt(this.paginatorInfo.pagination)
      );
      if (total < 1) total = 1;

      for (let index = 2; index <= total; index++) {
        elements.push(index.toString());
      }
      return elements;
    },
  },

  mounted() {
    this.loadContent();
  },

  methods: {
    async loadContent() {
      this.status = "loading";
      await this.getUsers({ refetch: true });
      this.status = "loaded";
    },

    async getUsers(params: { refetch: boolean }) {
      this.searchMode = true;
      const search = this.searchTerm.replace(/ /g, "");

      try {
        const { users, paginatorInfo } = await this.useUsers.loadUsers({
          graphql: {
            name: USERS_ADMINISTRATION_DETAILS,
            fragment: "UsersDetails",
            refetch: params.refetch,
          },
          paginatorInfo: {
            pagination: parseInt(this.paginatorInfo.pagination),
            page: parseInt(this.paginatorInfo.currentPage),
          },
          search,
          filterOptions: JSON.stringify(this.getFilterOptions()),
        });

        this.useUsers.updateUsers({ users });
        this.paginatorInfo.totalPaginacionElements = paginatorInfo.total;
      } catch (e: any) {
        console.error(e);
      }
    },

    async refreshContent() {
      this.spinners.refreshContent = true;
      this.status = "loading";
      await this.getUsers({ refetch: true });
      this.spinners.refreshContent = false;
      this.status = "loaded";
    },

    onlyOneUserFilter(index: number) {
      this.filterOptions.map((option) => {
        option.isChecked = false;
      });

      this.filterOptions[index].isChecked = true;
    },

    async disabledUser(params: { id: string; disableUser: boolean }) {
      this.spinners.optionsUser = params.id;
      this.status = "loading";

      let alertResponse = true;
      if (params.disableUser == true)
        alertResponse = await presentAlertConfirmation({
          message:
            "Mientras esté deshabilitada, el usuario no podrá acceder a su cuenta.",
        });

      if (alertResponse == false) return;

      try {
        await disableUser({
          id: params.id,
          disableUser: params.disableUser,
        });

        if (params.disableUser) openToast({ message: "Usuario deshabilitado" });
        if (params.disableUser == false)
          openToast({ message: "Usuario habilitado" });
        this.refreshContent();
      } catch (e: any) {
        if (e.message == "Can't disable admin") {
          openToast({
            message: "No se puede deshabilitar al administrador",
            color: "warning",
          });
          return;
        }
        console.error(e);
        this.openToastError({ error: e });
      }
      this.spinners.optionsUser = "";
      this.status = "loaded";
    },

    async sendMailResetPassword(email: string) {
      // this.spinners.optionsUser = true;

      const alertResponse = await presentAlertConfirmation({
        message:
          "Se enviarán las instrucciones para restaurar la contraseña al correo electrónico del usuario.",
      });

      if (alertResponse == false) return;

      try {
        await sendMailResetPassword({
          email,
        });

        openToast({ message: "Instrucciones enviadas" });
      } catch (e: any) {
        console.error(e);
        this.openToastError(e);
      }
      // this.spinners.optionsUser = false;
    },

    async resendEmailConfirmation(email: string) {
      // this.spinners.optionsUser = true;

      const alertResponse = await presentAlertConfirmation({
        message:
          "Se enviarán las instrucciones para la verificación de la cuenta al correo electrónico del usuario.",
      });

      if (alertResponse == false) return;

      try {
        await resendEmailConfirmation({ email });

        openToast({ message: "Instrucciones enviadas" });
      } catch (e: any) {
        if (e.message == "User already verified") {
          openToast({ message: "Ya se encuentra activado" });
          return;
        }
        console.error(e);
        this.openToastError({ error: e });
      }
      // this.spinners.optionsUser = false;
    },

    async deleteUser(email: string) {
      // this.spinners.optionsUser = true;

      const alertResponse = await presentAlertConfirmation({
        message: "Esta acción no es reversible.",
      });

      if (alertResponse == false) return;

      try {
        await deleteUserAccount({ email });

        openToast({ message: "Usuario eliminado" });
        this.refreshContent();
      } catch (e: any) {
        console.error(e);
        this.openToastError({ error: e });
      }
      // this.spinners.optionsUser = false;
    },

    getFilterOptions(): Array<string> {
      const options = Array<string>();
      this.filterOptions.forEach((element) => {
        if (element.isChecked) options.push(element.value);
      });
      return options;
    },

    async filterContent() {
      this.spinners.filter = true;
      this.status = "loading";
      await this.getUsers({ refetch: false });
      this.spinners.filter = false;
      this.status = "loaded";
    },

    async setUsersDisplay() {
      this.spinners.showUsers = true;
      this.status = "loading";
      await this.getUsers({ refetch: false });
      this.spinners.showUsers = false;
      this.status = "loaded";
    },

    async setUsersPage() {
      this.spinners.pageUsers = true;
      this.status = "loading";
      await this.getUsers({ refetch: false });
      this.spinners.pageUsers = false;
      this.status = "loaded";
    },
  },
});
</script>

<style scoped>
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
