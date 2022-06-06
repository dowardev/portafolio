<template>
  <ion-row>
    <ion-col>
      <ion-list>
        <ion-list-header>
          <ion-label>Usuarios</ion-label>
          <ion-button>
            <ion-icon :icon="addOutline"></ion-icon>
          </ion-button>
          <ion-button>
            <ion-icon :icon="refreshOutline"></ion-icon>
          </ion-button>
        </ion-list-header>

        <div>
          <ion-card>
            <ion-item lines="none">
              <ion-searchbar mode="ios"></ion-searchbar>
              <ion-button fill="clear">
                <ion-icon :icon="filterOutline"></ion-icon>
              </ion-button>
            </ion-item>

            <ion-card-content>
              <section>
                <ion-accordion-group>
                  <div v-for="user in users" :key="user.id">
                    <ion-item lines="none">
                      <ion-label>{{ user.email }}</ion-label>
                      <ion-button
                        :id="'trigger-button-' + user.id"
                        fill="clear"
                        slot="end"
                        ><ion-icon :icon="ellipsisVerticalOutline"></ion-icon
                      ></ion-button>

                      <ion-popover
                        :trigger="'trigger-button-' + user.id"
                        dismiss-on-select
                      >
                        <ion-content>
                          <ion-item button>
                            <ion-label>Borrar Usuario</ion-label>
                          </ion-item>

                          <ion-item button>
                            <ion-label>Deshabilitar usuario</ion-label>
                          </ion-item>

                          <ion-item button>
                            <ion-label>Reiniciar contraseña</ion-label>
                          </ion-item>
                        </ion-content>
                      </ion-popover>
                    </ion-item>

                    <ion-accordion :value="user.id">
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
                            v-if="user.is_email_verified == 1"
                            >Si</ion-label
                          >
                          <ion-label
                            slot="end"
                            v-if="user.is_email_verified == 0"
                            >No</ion-label
                          >
                        </ion-item>

                        <ion-item>
                          <ion-label>Administrador</ion-label>
                          <ion-label slot="end" v-if="user.is_admin == 1"
                            >Si</ion-label
                          >
                          <ion-label slot="end" v-if="user.is_admin == 0"
                            >No</ion-label
                          >
                        </ion-item>
                      </ion-list>
                    </ion-accordion>
                  </div>
                </ion-accordion-group>
              </section>

              <section style="display: flex; float: right">
                <div style="display: inline-block">
                  <ion-item lines="none">
                    <ion-label slot="end">Usuarios a mostrar</ion-label>
                    <ion-select
                      interface="popover"
                      slot="end"
                      v-model="paginatorInfo.pagination"
                    >
                      <ion-select-option :value="10">10</ion-select-option>
                      <ion-select-option :value="15">15</ion-select-option>
                      <ion-select-option :value="20">20</ion-select-option>
                    </ion-select>
                  </ion-item>
                </div>

                <div style="display: inline-block">
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
                    >
                      <ion-select-option :value="1">1</ion-select-option>
                      <ion-select-option
                        v-for="item in paginatorInfo.totalPaginacionElements"
                        :key="item"
                        :value="item"
                        >{{ item }}</ion-select-option
                      >
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
} from "ionicons/icons";

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
    };
  },

  data() {
    return {
      users: Array<any>(),
      paginatorInfo: {
        currentPage: 1,
        hasMorePages: Boolean(),
        totalPaginacionElements: Number(),
        pagination: 10,
      },
    };
  },

  mounted() {
    this.getUsers();
  },

  methods: {
    async getUsers() {
      const query = `
            data {
              id
              name
              email
              is_email_verified
              is_admin
              user
            }
            paginatorInfo {
              currentPage
              lastPage
              hasMorePages
              perPage,
              total
            }
      `;

      const usersResponse = await adminService().getUsers({
        query,
        first: this.paginatorInfo.pagination,
        page: this.paginatorInfo.currentPage,
      });

      this.setData({
        users: usersResponse.users,
        paginatorInfo: usersResponse.paginatorInfo,
      });
    },

    setData(params: { users: Array<any>; paginatorInfo: any }) {
      let total = params.paginatorInfo.total / this.paginatorInfo.pagination;
      if (total < 1) total = 1;
      // const element = [] as any;
      // for (let index = 2; index < total; index++) {
      //   element.push(index);
      // }
      this.paginatorInfo.totalPaginacionElements = total;

      this.users = params.users;
    },
  },
});
</script>
