import {
  UserRegister,
  UserLogin,
  EmailResetPassword,
  ResetPassword,
  UserLoginResponse,
  UpdateUserPassword,
} from "./interfaces";

import apolloClient from "../Apollo";
import gql from "graphql-tag";
import { useMutation } from "@vue/apollo-composable";
import { provideApolloClient } from "@vue/apollo-composable";
provideApolloClient(apolloClient);

export async function userRegister(params: UserRegister): Promise<void> {
  const {
    mutate: register,
    onDone,
    onError,
  } = useMutation(
    gql`
      mutation UserRegister(
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
        )
      }
    `,
    {
      variables: {
        name: params.name,
        user: params.user,
        email: params.email,
        password: params.password,
      },
    }
  );
  register();

  return new Promise((resolve, reject) => {
    onDone(() => {
      resolve();
    });

    onError((error) => reject(error));
  });
}

export async function userLogin(params: UserLogin): Promise<UserLoginResponse> {
  const {
    mutate: login,
    onDone,
    onError,
  } = useMutation(
    gql`
        mutation UserLogin($user: String!, $password: String!) {
          login(input: { user: $user, password: $password }) {
            ...${params.graphql.fragment}
          }
        }
        ${params.graphql.name}
      `,
    {
      variables: {
        user: params.user,
        password: params.password,
      },
    }
  );
  login();

  return new Promise((resolve, reject) => {
    onDone((response) => {
      resolve({
        user: response.data.login.user,
        auth: {
          access_token: response.data.login.auth.access_token,
          token_type: response.data.login.auth.token_type,
        },
      });
    });

    onError((error) => reject(error));
  });
}

export async function logout(): Promise<void> {
  const {
    mutate: logout,
    onDone,
    onError,
  } = useMutation(
    gql`
      mutation Logout {
        userLogout
      }
    `
  );
  logout();

  return new Promise((resolve, reject) => {
    onDone(() => resolve());
    onError((error) => reject(error));
  });
}

export async function sendMailResetPassword(
  params: EmailResetPassword
): Promise<void> {
  const {
    mutate: forgotPassword,
    onDone,
    onError,
  } = useMutation(
    gql`
      mutation SendMailResetPassword($email: String!) {
        forgotPassword(input: { email: $email })
      }
    `,

    {
      variables: {
        email: params.email,
      },
    }
  );
  forgotPassword();

  return new Promise((resolve, reject) => {
    onDone(() => resolve());
    onError((error) => reject(error));
  });
}

export async function resetPassword(params: ResetPassword): Promise<void> {
  const {
    mutate: restoreUserPassword,
    onDone,
    onError,
  } = useMutation(
    gql`
      mutation ResetPassword(
        $code: String!
        $email: String!
        $password: String!
      ) {
        restoreUserPassword(
          input: { code: $code, email: $email, password: $password }
        )
      }
    `,
    {
      variables: {
        code: params.code,
        email: params.email,
        password: params.password,
      },
    }
  );
  restoreUserPassword();

  return new Promise((resolve, reject) => {
    onDone(() => resolve());
    onError((error) => reject(error));
  });
}

export async function updateUserPassword(
  params: UpdateUserPassword
): Promise<void> {
  const {
    mutate: updateUserPassword,
    onDone,
    onError,
  } = useMutation(
    gql`
      mutation UpdateUserPassword(
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
        )
      }
    `,
    {
      variables: {
        oldPassword: params.oldPassword,
        newPassword: params.newPassword,
        newPasswordRepeat: params.newPasswordRepeat,
      },
    }
  );
  updateUserPassword();

  return new Promise((resolve, reject) => {
    onDone(() => {
      resolve();
    });

    onError((error) => reject(error));
  });
}
