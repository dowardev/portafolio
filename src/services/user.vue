<script lang="ts">
import { Storage } from "@ionic/storage";
const store = new Storage();
store.create();
import axios from "axios";
import systemService from "./system.vue";
import gql from "graphql-tag";
import apolloClient from "../Apollo";
import userService from "./user.vue";

const apollo = apolloClient;

export default function () {
  function setUserToken(token: string | null) {
    document.cookie = "token=" + token;
  }
  async function getUserToken() {
    return await store.get("token");
  }
  function getUserOffline() {
    let userUploaded = null;
    return new Promise((resolve) => {
      const interval = setInterval(async () => {
        userUploaded = await store.get("user-uploaded");
        if (userUploaded != null) {
          if (userUploaded) {
            resolve(Object.assign({}, await store.get("userData"))["user"]);
          } else {
            resolve(null);
          }
          clearInterval(interval);
        }
      }, 100);
    });
  }
  async function setUserData(data: any) {
    const query = gql`
      query {
        user {
          name
          email
          is_admin
          role
        }
      }
    `;
    apollo.defaultClient.cache.writeQuery({
      query,
      data: {
        user: data,
      },
    });
  }
  function getUser(): Promise<{
    msg: string;
    user:
      | [{ name: string; email: string; admin: boolean; role: string[] }]
      | null;
  }> {
    return new Promise((resolve) => {
      const mutation = gql`
        mutation {
          getUserAuth {
            msg
            user {
              name
              email
              is_admin
              role
            }
          }
        }
      `;
      apollo.defaultClient
        .mutate({
          mutation,
        })
        .then((response) => {
          if (response.data.getUserAuth.msg == "Success") {
            resolve({
              msg: response.data.getUserAuth.msg,
              user: [
                {
                  name: response.data.getUserAuth.user[0].name as string,
                  email: response.data.getUserAuth.user[0].email as string,
                  admin: response.data.getUserAuth.user[0].is_admin as boolean,
                  role: response.data.getUserAuth.user[0].role as string[],
                },
              ],
            });
          }
          resolve({
            msg: response.data.msg,
            user: null,
          });
        });
    });
  }
  async function setUserUploaded(option: boolean | null) {
    await store.set("user-uploaded", option);
  }

  async function getUserName(): Promise<{ name: string | null }> {
    return new Promise((resolve) => {
      getUserNameCached().then((response) => {
        if (response.name != null) {
          resolve({ name: response.name });
        }

        getUser().then((response) => {
          if (response.msg == "Success") {
            resolve({ name: response.user![0].name });
          }

          resolve({ name: null });
        });
      });
    });
  }
  async function getUserNameCached(): Promise<{ name: string | null }> {
    return new Promise((resolve) => {
      const query = gql`
        query {
          user {
            name
          }
        }
      `;
      const user = apollo.defaultClient.cache.readQuery({
        query: query,
      }) as any;

      let name = null;
      if (user) {
        name = user.user.name;
      }

      resolve({
        name,
      });
    });
  }

  function getUserPermissions(): Promise<{
    admin: null | boolean;
    rol: null | string[];
  }> {
    return new Promise((resolve) => {
      getUserPermissionsCached().then((response) => {
        if (response.admin != null) {
          resolve({ admin: response.admin, rol: response.rol });
        }

        getUser().then((response) => {
          if (response.msg == "Success") {
            resolve({
              admin: response.user![0].admin,
              rol: response.user![0].role,
            });
          }

          resolve({ admin: null, rol: null });
        });
      });
    });
  }
  function getUserPermissionsCached(): Promise<{
    admin: boolean | null;
    rol: string[] | null;
  }> {
    return new Promise((resolve) => {
      const query = gql`
        query {
          user {
            is_admin
            role
          }
        }
      `;
      const userPermissions = apollo.defaultClient.cache.readQuery({
        query: query,
      }) as any;

      let admin = null;
      let rol = null;
      if (userPermissions) {
        admin = userPermissions.user.is_admin;
        rol = userPermissions.rol;
      }

      resolve({
        admin,
        rol,
      });
    });
  }

  return {
    getUserToken,
    setUserToken,
    setUserData,
    getUser,
    getUserOffline,
    getUserPermissions,
    getUserPermissionsCached,
    setUserUploaded,
    getUserName,
    getUserNameCached,
  };
}
</script>
