<template>
  <ion-row>
    <ion-col>
      <ion-list>
        <ion-list-header>
          <ion-label>Usuarios</ion-label>
          <ion-button>
            <ion-icon :icon="addOutline"></ion-icon>
          </ion-button>

          <ion-button @click="refreshContent()" :disabled="status == 'loading'">
            <ion-icon
              :icon="refreshOutline"
              v-if="spinners.refreshContent == false"
            ></ion-icon>
            <ion-spinner
              name="crescent"
              v-if="spinners.refreshContent == true"
            ></ion-spinner>
          </ion-button>
        </ion-list-header>

        <div>
          <ion-card>
            <ion-item lines="none" class="transparent">
              <ion-searchbar
                mode="ios"
                @ionChange="filterContent()"
                v-model="searchTerm"
                :debounce="500"
                :disabled="status == 'loading'"
              ></ion-searchbar>

              <!-- filter -->
              <ion-button
                id="trigger-button-filter"
                fill="clear"
                :disabled="status == 'loading'"
              >
                <ion-icon
                  :icon="filterOutline"
                  v-if="spinners.filter == false"
                ></ion-icon>
                <ion-spinner
                  name="crescent"
                  v-if="spinners.filter == true"
                ></ion-spinner>
              </ion-button>
              <ion-popover
                trigger="trigger-button-filter"
                @didDismiss="filterContent()"
                :dismiss-on-select="true"
              >
                <ion-content :scroll-events="true">
                  <ion-item
                    button
                    v-for="(option, index) in filterOptions"
                    :key="option.value"
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
                      <ion-icon :icon="personOutline" slot="start"></ion-icon>
                      <ion-label>{{ user.email }}</ion-label>

                      <ion-button
                        :id="'trigger-button-' + user.id"
                        fill="clear"
                        slot="end"
                        :disabled="
                          status == 'loading' || spinners.optionsUser == user.id
                        "
                      >
                        <ion-icon
                          :icon="ellipsisVerticalOutline"
                          v-if="spinners.optionsUser != user.id"
                        ></ion-icon>
                        <ion-spinner
                          name="crescent"
                          v-if="spinners.optionsUser == user.id"
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
                              :icon="trashOutline"
                              slot="start"
                            ></ion-icon>
                            <ion-label>Borrar Usuario</ion-label>
                          </ion-item>

                          <ion-item
                            button
                            lines="none"
                            @click="
                              disabledUser({ id: user.id!, disableUser: false })
                            "
                            v-if="user.isUserDisabled == true"
                          >
                            <ion-icon
                              :icon="checkmarkOutline"
                              slot="start"
                            ></ion-icon>
                            <ion-label>Habilitar usuario</ion-label>
                          </ion-item>

                          <ion-item
                            button
                            lines="none"
                            @click="
                              disabledUser({ id: user.id!, disableUser: true })
                            "
                            v-if="user.isUserDisabled == false"
                          >
                            <ion-label>Deshabilitar usuario</ion-label>
                            <ion-icon
                              :icon="banOutline"
                              slot="start"
                            ></ion-icon>
                          </ion-item>

                          <ion-item
                            button
                            lines="none"
                            @click="sendMailResetPassword(user.email!)"
                          >
                            <ion-label>Reiniciar contraseña</ion-label>
                            <ion-icon
                              :icon="keyOutline"
                              slot="start"
                            ></ion-icon>
                          </ion-item>

                          <ion-item
                            button
                            lines="none"
                            @click="resendEmailConfirmation(user.email!)"
                          >
                            <ion-label>Verificar usuario</ion-label>
                            <ion-icon
                              :icon="thumbsUpOutline"
                              slot="start"
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
                            slot="end"
                            v-if="user.isEmailVerified == true"
                            >Si</ion-label
                          >
                          <ion-label
                            slot="end"
                            v-if="user.isEmailVerified == false"
                            >No</ion-label
                          >
                        </ion-item>

                        <ion-item>
                          <ion-label>Deshabilitado</ion-label>
                          <ion-label
                            slot="end"
                            v-if="user.isUserDisabled == true"
                            >Si</ion-label
                          >
                          <ion-label
                            slot="end"
                            v-if="user.isUserDisabled == false"
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
                    interface="popover"
                    slot="end"
                    v-model="paginatorInfo.pagination"
                    @ionChange="setUsersDisplay()"
                    v-if="spinners.showUsers == false"
                    :disabled="status == 'loading'"
                  >
                    <ion-select-option value="10">10</ion-select-option>
                    <ion-select-option value="15">15</ion-select-option>
                    <ion-select-option value="20">20</ion-select-option>
                    <ion-select-option value="50">50</ion-select-option>
                    <ion-select-option value="100">100</ion-select-option>
                  </ion-select>
                  <ion-spinner
                    name="crescent"
                    v-if="spinners.showUsers == true"
                    slot="end"
                    color="primary"
                  ></ion-spinner>
                </ion-item>

                <ion-item lines="none" class="transparent">
                  <ion-label slot="end">Pagina</ion-label>
                  <ion-select
                    interface="popover"
                    slot="end"
                    v-model="paginatorInfo.currentPage"
                    @ionChange="setUsersPage()"
                    v-if="spinners.pageUsers == false"
                    :disabled="status == 'loading'"
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
                    name="crescent"
                    v-if="spinners.pageUsers == true"
                    slot="end"
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
import {
  openToast,
  openToastErrror,
  presentAlertConfirmation,
} from "../../../services/system";
import { sendMailResetPassword } from "../../../services/session";
import { resendEmailConfirmation } from "../../../services/user";
import { USERS_ADMINISTRATION_DETAILS } from "../../../services/graphql";
import { useUsers } from "../../../composables/useUsers";

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
        openToastErrror({ error: e });
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
        openToastErrror(e);
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
        openToastErrror({ error: e });
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
        openToastErrror({ error: e });
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
