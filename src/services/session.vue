<script lang="ts">
import axios from "axios";
import systemService from "./system.vue";
import apolloClient from "../Apollo";
import gql from "graphql-tag";

const apollo = apolloClient;

export default function () {
  async function userRegister(
    name: string,
    user: string,
    email: string,
    password: string
  ): Promise<{
    user: {
      name: string;
      user: string;
      email: string;
      password: string;
    };
  }> {
    const response = await apollo.defaultClient.mutate({
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
            message
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

    try {
      return {
        user: {
          name: response.data.name,
          user: response.data.user,
          email: response.data.email,
          password: response.data.password,
        },
      };
    } catch (e: any) {
      throw e.message;
    }
  }

  function userLogin(user: string, password: string): Promise<any> {
    return apollo.defaultClient.mutate({
      mutation: gql`
        mutation ($user: String!, $password: String!) {
          login(input: { user: $user, password: $password }) {
            message
            auth {
              access_token
            }
            user {
              name
              email
              is_admin
              rol
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

  async function logout(): Promise<any> {
    return apollo.defaultClient.mutate({
      mutation: gql`
        mutation {
          userLogout {
            message
          }
        }
      `,
    });
  }

  function removeUserCached(): void {
    apollo.defaultClient.cache.evict({ fieldName: "user" });
  }

  async function sendMailResetPassword(
    email: string
  ): Promise<{ message: string }> {
    const response = await axios.post(
      systemService().getBaseURL() + "api/auth/mail-reset-password",
      { headers: { Accept: "application/json" } },
      {
        params: {
          email,
        },
      }
    );

    return { message: response.data.message };
  }

  async function sendCodeResetPassword(
    email: string,
    code: string
  ): Promise<{ message: string }> {
    const response = await axios.post(
      systemService().getBaseURL() + "api/auth/code-reset-password",
      { headers: { Accept: "application/json" } },
      {
        params: {
          email,
          code,
        },
      }
    );

    return { message: response.data.message };
  }

  function resetPassword(email: string, password: string): Promise<void> {
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
    removeUserCached,
  };
}
</script>
