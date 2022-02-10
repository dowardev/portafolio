<script lang="ts">
import axios from "axios";
import userService from "./user.vue";

export default function () {
  function userRegister(
    name: string,
    user: string,
    email: string,
    password: string
  ) {
    return axios.post(
      "http://localhost:8000/api/auth/signup",
      { headers: { Accept: "application/json" } },
      {
        params: {
          name,
          user,
          email,
          password,
        },
      }
    );
  }
  function userLogin(email: string, password: string) {
    return axios.post(
      "http://localhost:8000/api/auth/login",
      { headers: { Accept: "application/json" } },
      {
        params: {
          email,
          password,
        },
      }
    );
  }
  async function logout() {
    const token = await userService()
      .getUserToken()
      .then((response) => {
        return response;
      });

    return axios.get("http://localhost:8000/api/auth/logout", {
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + token,
      },
    });
  }
  return {
    userRegister,
    userLogin,
    logout,
  };
}
</script>
