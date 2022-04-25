<script lang="ts">
import axios from "axios";
import systemService from "./system.vue";
import apolloClient from "../Apollo";
import gql from "graphql-tag";
import {
  UserRegister,
  UserLogin,
  EmailResetPassword,
  CodeResetPassword,
  ResetPassword,
  UserRegisterResponse,
  UserLoginResponse,
} from "./interfaces.vue";

const apollo = apolloClient;

export default function () {
  async function userRegister(
    params: UserRegister
  ): Promise<UserRegisterResponse> {
    try {
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
          name: params.name,
          user: params.user,
          email: params.email,
          password: params.password,
        },
      });

      if (response.data) return response.data;
      throw new Error("Bad response");
    } catch (e: any) {
      throw new Error(e);
    }
  }

  async function userLogin(params: UserLogin): Promise<UserLoginResponse> {
    const query = gql`
          mutation ($user: String!, $password: String!) {
            login(input: { user: $user, password: $password }) {
              ${params.query} 
            }
          }
        `;
    try {
      const response = await apollo.defaultClient.mutate({
        mutation: query,
        variables: {
          user: params.user,
          password: params.password,
        },
      });

      return response.data.login;
    } catch (e: any) {
      throw new Error(e);
    }
  }

  async function logout(): Promise<void> {
    try {
      await apollo.defaultClient.mutate({
        mutation: gql`
          mutation {
            userLogout {
              message
            }
          }
        `,
      });
    } catch (e: any) {
      throw new Error(e);
    }
  }

  function removeUserCached(): void {
    try {
      apollo.defaultClient.cache.evict({ fieldName: "user" });
    } catch (e: any) {
      console.error(e);
    }
  }

  async function sendMailResetPassword(
    params: EmailResetPassword
  ): Promise<void> {
    try {
      await axios.post(
        systemService().getBaseURL() + "api/auth/mail-reset-password",
        { headers: { Accept: "application/json" } },
        {
          params: {
            email: params.email,
          },
        }
      );
    } catch (e: any) {
      throw new Error(e);
    }
  }

  async function sendCodeResetPassword(
    params: CodeResetPassword
  ): Promise<void> {
    try {
      await axios.post(
        systemService().getBaseURL() + "api/auth/code-reset-password",
        { headers: { Accept: "application/json" } },
        {
          params: {
            email: params.email,
            code: params.code,
          },
        }
      );
    } catch (e: any) {
      throw new Error(e);
    }
  }

  function resetPassword(params: ResetPassword): Promise<void> {
    return axios.post(
      systemService().getBaseURL() + "api/auth/reset-password",
      { headers: { Accept: "application/json" } },
      {
        params: {
          email: params.email,
          password: params.password,
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
