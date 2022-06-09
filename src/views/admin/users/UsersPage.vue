<template>
  <ion-row>
    <ion-col>
      <ion-list>
        <ion-list-header>
          <ion-label>Usuarios</ion-label>
          <ion-button>
            <ion-icon :icon="addOutline"></ion-icon>
          </ion-button>

          <ion-button
            @click="refreshContent()"
            :disabled="spinners.refreshContent == true"
          >
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
            <ion-item lines="none">
              <ion-searchbar
                mode="ios"
                @ionChange="search()"
                v-model="searchTerm"
              ></ion-searchbar>

              <ion-button id="trigger-button-filter" fill="clear">
                <ion-icon :icon="filterOutline"></ion-icon>
              </ion-button>
              <!-- NOTE: show backdrop false -->
              <ion-popover
                trigger="trigger-button-filter"
                @didDismiss="userFilter()"
                style="max-height: 68vh"
                show-backdrop="false"
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

            <ion-card-content>
              <section>
                <ion-accordion-group>
                  <div v-for="user in displayedUsers" :key="user.id">
                    <ion-item lines="none" v-if="user.is_admin != true">
                      <ion-icon :icon="personOutline" slot="start"></ion-icon>
                      <ion-label>{{ user.email }}</ion-label>

                      <ion-button
                        :id="'trigger-button-' + user.id"
                        fill="clear"
                        slot="end"
                      >
                        <ion-icon :icon="ellipsisVerticalOutline"></ion-icon>
                      </ion-button>

                      <ion-popover
                        :trigger="'trigger-button-' + user.id"
                        dismiss-on-select
                      >
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
                            @click="disabledUser({id:user.id!,disableUser:false})"
                            v-if="user.is_user_disabled == true"
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
                            @click="disabledUser({id:user.id!,disableUser:true})"
                            v-if="user.is_user_disabled == false"
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

                    <ion-accordion
                      :value="user.id"
                      v-if="user.is_admin != true"
                    >
                      <ion-item slot="header">
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
                            v-if="user.is_email_verified == true"
                            >Si</ion-label
                          >
                          <ion-label
                            slot="end"
                            v-if="user.is_email_verified == false"
                            >No</ion-label
                          >
                        </ion-item>

                        <ion-item>
                          <ion-label>Deshabilitado</ion-label>
                          <ion-label
                            slot="end"
                            v-if="user.is_user_disabled == true"
                            >Si</ion-label
                          >
                          <ion-label
                            slot="end"
                            v-if="user.is_user_disabled == false"
                            >No</ion-label
                          >
                        </ion-item>
                      </ion-list>
                    </ion-accordion>
                  </div>
                </ion-accordion-group>
              </section>

              <section class="pagination">
                <div>
                  <ion-item lines="none">
                    <ion-label slot="end">Usuarios a mostrar</ion-label>
                    <ion-select
                      interface="popover"
                      slot="end"
                      v-model="paginatorInfo.pagination"
                      @ionChange="getUsers()"
                    >
                      <ion-select-option :value="10">10</ion-select-option>
                      <ion-select-option :value="15">15</ion-select-option>
                      <ion-select-option :value="20">20</ion-select-option>
                      <ion-select-option :value="50">50</ion-select-option>
                      <ion-select-option :value="100">100</ion-select-option>
                    </ion-select>
                  </ion-item>
                </div>

                <div>
                  <ion-item lines="none">
                    <ion-button
                      slot="end"
                      fill="clear"
                      :disabled="paginatorInfo.currentPage == 0"
                    >
                      <ion-icon :icon="chevronBackOutline"></ion-icon>
                    </ion-button>

                    <ion-select
                      interface="popover"
                      slot="end"
                      v-model="paginatorInfo.currentPage"
                      @ionChange="getUsers()"
                    >
                      <ion-select-option :value="1">1</ion-select-option>
                      <ion-select-option
                        v-for="item in calculatePages"
                        :key="item"
                        :value="item"
                        >{{ item }}
                      </ion-select-option>
                    </ion-select>

                    <ion-button
                      slot="end"
                      fill="clear"
                      :disabled="paginatorInfo.hasMorePages == false"
                    >
                      <ion-icon :icon="chevronForwardOutline"></ion-icon>
                    </ion-button>
                  </ion-item>
                </div>
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
import adminService from "../../../services/admin.vue";
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
import { User } from "../../../services/interfaces.vue";
import systemService from "../../../services/system.vue";
import sessionService from "../../../services/session.vue";
import userService from "../../../services/user.vue";

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
          this.paginatorInfo.pagination
      );
      if (total < 1) total = 1;

      for (let index = 2; index <= total; index++) {
        elements.push(index);
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
    };
  },

  data() {
    return {
      displayedUsers: Array<User>(),
      users: Array<User>(),
      searchUsers: Array<User>(),
      paginatorInfo: {
        currentPage: 1,
        hasMorePages: Boolean(),
        totalPaginacionElements: Number(),
        pagination: 10,
      },
      searchTerm: "",
      searchMode: false,
      filterOptions: [
        {
          label: "Sin filtro",
          value: "no filter",
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
      },
    };
  },

  mounted() {
    this.getUsers();
  },

  methods: {
    async getUsers() {
      this.spinners.refreshContent = true;

      const query = `
            data {
              id
              name
              email
              is_email_verified
              is_admin
              user
              is_user_disabled
            }
            paginatorInfo {
              currentPage
              lastPage
              hasMorePages
              perPage,
              total
            }
      `;

      try {
        const usersResponse = await adminService().getUsers({
          query,
          first: this.paginatorInfo.pagination,
          page: this.paginatorInfo.currentPage,
        });

        this.displayedUsers = usersResponse.users;
        this.users = usersResponse.users;
        this.paginatorInfo.totalPaginacionElements =
          usersResponse.paginatorInfo.total;
        this.userFilter();
        this.spinners.refreshContent = false;
      } catch (e: any) {
        console.error(e);
        systemService().openToastErrror({ error: e });
      }
    },

    setData(params: { users: Array<any>; paginatorInfo: any }) {
      this.paginatorInfo.totalPaginacionElements = params.paginatorInfo.total;
      this.users = params.users;
    },

    async search() {
      this.searchMode = true;
      const search = this.searchTerm;

      if (search == "") {
        this.displayedUsers = this.users;
        this.searchMode = false;
        return;
      }

      const query = `
            data {
              id
              name
              email
              is_email_verified
              is_admin
              user
              is_user_disabled
            }
            paginatorInfo {
              currentPage
              lastPage
              hasMorePages
              perPage,
              total
            }
    `;

      try {
        const usersResponse = await adminService().searchUsers({
          query,
          first: this.paginatorInfo.pagination,
          page: this.paginatorInfo.currentPage,
          name: search,
          email: search,
        });

        this.displayedUsers = usersResponse.users;
        this.searchUsers = usersResponse.users;
        this.paginatorInfo.totalPaginacionElements =
          usersResponse.paginatorInfo.total;
        this.userFilter();
      } catch (e: any) {
        console.error(e);
        systemService().openToastErrror({ error: e });
      }
    },

    userFilter() {
      const users = this.searchMode ? this.searchUsers : this.users;

      this.filterOptions.forEach((option) => {
        if (option.value == "no filter" && option.isChecked)
          this.displayedUsers = users;

        if (option.value == "verified" && option.isChecked) {
          this.displayedUsers = users.filter((item) => {
            return item.is_email_verified == true;
          });
        }

        if (option.value == "no verified" && option.isChecked) {
          this.displayedUsers = users.filter((item) => {
            return item.is_email_verified == false;
          });
        }

        if (option.value == "enabled" && option.isChecked) {
          this.displayedUsers = users.filter((item) => {
            return item.is_user_disabled == true;
          });
        }

        if (option.value == "disabled" && option.isChecked) {
          this.displayedUsers = users.filter((item) => {
            return item.is_user_disabled == false;
          });
        }

        if (option.value == "admin" && option.isChecked) {
          this.displayedUsers = users.filter((item) => {
            return item.is_admin == true;
          });
        }

        if (option.value == "no admin" && option.isChecked) {
          this.displayedUsers = users.filter((item) => {
            return item.is_admin == false;
          });
        }
      });
    },

    refreshContent() {
      if (this.searchMode) this.search();
      else this.getUsers();
    },

    onlyOneUserFilter(index: number) {
      this.filterOptions.map((option) => {
        option.isChecked = false;
      });

      this.filterOptions[index].isChecked = true;
    },

    async disabledUser(params: { id: string; disableUser: boolean }) {
      const alertResponse = await systemService().presentAlertConfirmation({
        message:
          "Mientras esté deshabilitada, el usuario no podrá acceder a su cuenta.",
      });

      if (alertResponse == false) return;

      try {
        const response = await adminService().disableUser({
          id: params.id,
          disableUser: params.disableUser,
        });

        if (response.message == "User disabled")
          systemService().openToast({ message: "Usuario deshabilitado" });
        if (response.message == "User enabled")
          systemService().openToast({ message: "Usuario habilitado" });
        if (response.message == "Can't disable admin")
          systemService().openToast({
            message: "No se puede deshabilitar al administrador",
            color: "warning",
          });
        this.refreshContent();
      } catch (e: any) {
        console.error(e);
        systemService().openToastErrror({ error: e });
      }
    },

    // TODO: pending
    async sendMailResetPassword(email: string) {
      const alertResponse = await systemService().presentAlertConfirmation({
        message:
          "Se enviarán las instrucciones para restaurar la contraseña al correo electrónico del usuario.",
      });

      if (alertResponse == false) return;

      try {
        await sessionService().sendMailResetPassword({
          email,
        });
      } catch (e: any) {
        console.error(e);
        systemService().openToastErrror(e);
      }
    },

    async resendEmailConfirmation(email: string) {
      const alertResponse = await systemService().presentAlertConfirmation({
        message:
          "Se enviarán las instrucciones para la verificación de la cuenta al correo electrónico del usuario.",
      });

      if (alertResponse == false) return;

      try {
        const response = await userService().resendEmailConfirmation({ email });

        if (response.message == "Email Sent")
          systemService().openToast({ message: "Instrucciones enviadas" });

        if (response.message == "User already verified")
          systemService().openToast({ message: "Ya se encuentra activado" });
      } catch (e: any) {
        console.error(e);
        systemService().openToastErrror({ error: e });
      }
    },

    async deleteUser(email: string) {
      const alertResponse = await systemService().presentAlertConfirmation({
        message: "Esta acción no es reversible.",
      });

      if (alertResponse == false) return;

      try {
        await adminService().deleteUserAccount({ email });

        systemService().openToast({ message: "Usuario eliminado" });
        this.refreshContent();
      } catch (e: any) {
        console.error(e);
        systemService().openToastErrror({ error: e });
      }
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
