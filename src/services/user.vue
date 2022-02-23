<script lang="ts">
import { Storage } from "@ionic/storage";
const store = new Storage();
store.create();
import axios from "axios";
// import jsonLangSpanish from "../../public/assets/lang/lang-es.json";
import systemService from "./system.vue";

export default function () {
  async function setUserToken(token: string | null) {
    await store.set("token", token);
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
  // async function translate() {
  //   const lang = await getUserLang().then((response) => {
  //     return response;
  //   });
  //   if (lang == "es" || lang == null) {
  //     return jsonLangSpanish as any;
  //   }
  // }
  async function setUserData(data: any) {
    await store.set("userData", data);
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
  async function getUser() {
    const token = await getUserToken();
    return axios.get(systemService().getBaseURL() + "api/auth/user", {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
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
  async function getUserPermissions(): Promise<{
    admin: boolean | null;
    roles: string[] | null;
  }> {
    return new Promise((resolve) => {
      getUser().then((response) => {
        if (response.data) {
          resolve({ admin: response.data.is_admin, roles: response.data.role });
        } else {
          resolve({ admin: null, roles: response.data.role });
        }
      });
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
  };
}
</script>
