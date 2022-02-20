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
  function getUserToken() {
    let token = null;
    return new Promise((resolve) => {
      setTimeout(async () => {
        token = await store.get("token");
        if (token != null) {
          resolve(token);
        } else {
          resolve(null);
        }
      }, 300);
    });
  }
  async function getUserLogged() {
    const token = await getUserToken().then((response) => {
      return response;
    });

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
  return {
    setUserToken,
    getUserToken,
    getUserLogged,
    getUserLang,
  };
}
</script>
