<script lang="ts">
import axios from "axios";
import userService from "./user.vue";
import systemService from "./system.vue";
import apolloClient from "../Apollo";
const apollo = apolloClient.defaultClient;
import gql from "graphql-tag";

export default function () {
  async function userRegister(
    name: string,
    user: string,
    email: string,
    password: string
  ) {
    return apollo.mutate({
      mutation: gql`
        mutation (
          $name: String!
          $user: String!
          $email: String!
          $password: String!
        ) {
          register(
            input: {
              name: $name
              user: $user
              email: $email
              password: $password
            }
          ) {
            msg
          }
        }
      `,
      variables: {
        name,
        user,
        email,
        password,
      },
    });
  }
  function userLogin(user: string, password: string) {
    return apollo.mutate({
      mutation: gql`
        mutation ($user: String!, $password: String!) {
          login(input: { user: $user, password: $password }) {
            auth {
              access_token
            }
          }
        }
      `,
      variables: {
        user,
        password,
      },
    });
  }
  async function logout() {
    const token = await userService()
      .getUserToken()
      .then((response) => {
        return response;
      });

    return axios.get(systemService().getBaseURL() + "api/auth/logout", {
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + token,
      },
    });
  }
  function sendMailResetPassword(email: string) {
    return axios.post(
      systemService().getBaseURL() + "api/auth/mail-reset-password",
      { headers: { Accept: "application/json" } },
      {
        params: {
          email,
        },
      }
    );
  }
  function sendCodeResetPassword(email: string, code: string) {
    return axios.post(
      systemService().getBaseURL() + "api/auth/code-reset-password",
      { headers: { Accept: "application/json" } },
      {
        params: {
          email,
          code,
        },
      }
    );
  }
  function resetPassword(email: string, password: string) {
    return axios.post(
      systemService().getBaseURL() + "api/auth/reset-password",
      { headers: { Accept: "application/json" } },
      {
        params: {
          email,
          password,
        },
      }
    );
  }

  return {
    userRegister,
    userLogin,
    logout,
    sendMailResetPassword,
    sendCodeResetPassword,
    resetPassword,
  };
}
</script>
