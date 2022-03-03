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
  async function getUserLogged() {
    const token = await getUserToken();
    if (token == null) {
      return null;
    }

    return axios.get(systemService().getBaseURL() + "api/auth/user", {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    });
  }
  function getUserLang() {
    return store.get("lang");
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
  async function prueba() {
    const query = gql`
      query pp($id: ID) {
        pr(id: $id) {
          name
          user
        }
      }
    `;
    apollo.defaultClient
      .query({
        query: query,
      })
      .then((data) => {
        // console.log(data.data);
        apollo.defaultClient.cache.writeQuery({
          query: query,
          data: {
            pr: data.data.pr,
          },
          variables: {
            id: 1,
          },
        });
        const todo = apollo.defaultClient.cache.readQuery({
          query: query,
          variables: {
            id: 1,
          },
        });
        // console.log(todo);
      })
      .catch((error) => {
        console.error(error);
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
  function getUser() {
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
    return apollo.defaultClient.mutate({
      mutation,
    });
  }
  async function getUserName(): Promise<string> {
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
      resolve(user.user.name);
    });
  }
  function getUserPermissions() {
    const query = gql`
      query {
        user {
          is_admin
          role
        }
      }
    `;
    return apollo.defaultClient.cache.readQuery({
      query: query,
    });
  }
  function getUserPermissionsOffline(): Promise<{
    admin: boolean | null;
    roles: string[] | null;
  }> {
    let userUploaded = null;
    return new Promise((resolve) => {
      const interval = setInterval(async () => {
        userUploaded = await store.get("user-uploaded");
        if (userUploaded != null) {
          if (userUploaded) {
            const admin = Object.assign({}, await store.get("userData"))[
              "is_admin"
            ];
            const roles = Object.assign({}, await store.get("userData"))[
              "role"
            ];
            resolve({ admin, roles });
          } else {
            resolve({ admin: null, roles: null });
          }
          clearInterval(interval);
        }
      }, 100);
    });
  }
  async function setUserUploaded(option: boolean | null) {
    await store.set("user-uploaded", option);
  }

  return {
    getUserToken,
    setUserToken,
    getUserLogged,
    setUserData,
    getUser,
    getUserOffline,
    getUserPermissions,
    getUserPermissionsOffline,
    setUserUploaded,
    prueba,
    getUserName,
  };
}
</script>
