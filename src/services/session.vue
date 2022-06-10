<script lang="ts">
import axios from "axios";
import systemService from "./system.vue";
import apolloClient from "../Apollo";
import gql from "graphql-tag";
import {
  UserRegister,
  UserLogin,
  EmailResetPassword,
  ResetPassword,
  UserRegisterResponse,
  UserLoginResponse,
  UpdateUserPassword,
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
      if (e.graphQLErrors) throw new Error(e.graphQLErrors[0].debugMessage);
      throw new Error(e.message);
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

      return {
        user: response.data.login.user,
        auth: {
          access_token: response.data.login.auth.access_token,
          token_type: response.data.login.auth.token_type,
        },
      };
    } catch (e: any) {
      if (e.graphQLErrors) throw new Error(e.graphQLErrors[0].debugMessage);
      throw new Error(e.message);
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
      if (e.graphQLErrors) throw new Error(e.graphQLErrors[0].debugMessage);
      throw new Error(e.message);
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
      await apollo.defaultClient.mutate({
        mutation: gql`
          mutation ($email: String!) {
            forgotPassword(input: { email: $email }) {
              message
            }
          }
        `,
        variables: {
          email: params.email,
        },
      });
    } catch (e: any) {
      if (e.graphQLErrors) throw new Error(e.graphQLErrors[0].debugMessage);
      throw new Error(e.message);
    }
  }

  async function resetPassword(params: ResetPassword): Promise<void> {
    try {
      await apollo.defaultClient.mutate({
        mutation: gql`
          mutation ($code: String!, $email: String!, $password: String!) {
            restoreUserPassword(
              input: { code: $code, email: $email, password: $password }
            ) {
              message
            }
          }
        `,
        variables: {
          code: params.code,
          email: params.email,
          password: params.password,
        },
      });
    } catch (e: any) {
      if (e.graphQLErrors) throw new Error(e.graphQLErrors[0].debugMessage);
      throw new Error(e.message);
    }
  }

  async function updateUserPassword(params: UpdateUserPassword) {
    try {
      const response = await apollo.defaultClient.mutate({
        mutation: gql`
          mutation (
            $oldPassword: String!
            $newPassword: String!
            $newPasswordRepeat: String!
          ) {
            updateUserPassword(
              input: {
                oldPassword: $oldPassword
                newPassword: $newPassword
                newPasswordRepeat: $newPasswordRepeat
              }
            ) {
              message
            }
          }
        `,
        variables: {
          oldPassword: params.oldPassword,
          newPassword: params.newPassword,
          newPasswordRepeat: params.newPasswordRepeat,
        },
      });

      return response.data;
    } catch (e: any) {
      if (e.graphQLErrors) throw new Error(e.graphQLErrors[0].debugMessage);
      throw new Error(e.message);
    }
  }

  return {
    userRegister,
    userLogin,
    logout,
    sendMailResetPassword,
    resetPassword,
    removeUserCached,
    updateUserPassword,
  };
}
</script>
