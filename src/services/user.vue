<script lang="ts">
import { Storage } from "@ionic/storage";
const store = new Storage();
store.create();
import axios from "axios";
// import jsonLangSpanish from "../../public/assets/lang/lang-es.json";

export default function () {
  async function setUserToken(token: string) {
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
    return axios.get("http://localhost:8000/api/auth/user", {
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
