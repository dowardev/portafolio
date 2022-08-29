import { Storage } from "@ionic/storage";
const store = new Storage();
store.create();
import {
  SaveUserData,
  UserToken,
  DeleteUserAccount,
  ResendEmailConfirmation,
  GetUser,
  User,
} from "./interfaces";

import apolloClient from "../Apollo";
import gql from "graphql-tag";
import { useQuery, useMutation } from "@vue/apollo-composable";
import { provideApolloClient } from "@vue/apollo-composable";
provideApolloClient(apolloClient);

export function setUserToken({ token }: UserToken): void {
  document.cookie = "token=" + token;
}

export function getUserToken(): string {
  const name = "token=";
  const cDecoded = decodeURIComponent(document.cookie);
  const cArr = cDecoded.split("; ");
  let token = "";
  cArr.forEach((val) => {
    if (val.indexOf(name) === 0) token = val.substring(name.length);
  });
  return token;
}

export async function getUser(params: GetUser): Promise<User> {
  const { onResult, onError, result, refetch } = useQuery(
    gql`
        query GetUser {
          userAuth {
           ...${params.graphql.fragment}
          }
        }
        ${params.graphql.name}
      `,
    null,
    {
      fetchPolicy: "cache-first",
    }
  );

  return new Promise((resolve, reject) => {
    if (params.graphql.refetch) refetch();

    onResult((response) =>
      resolve({
        id: response.data.userAuth.user.id,
        name: response.data.userAuth.user.name,
        email: response.data.userAuth.user.email,
        user: response.data.userAuth.user.user,
        imageProfile: response.data.userAuth.user.image_profile,
        isAdmin: response.data.userAuth.user.is_admin,
      })
    );

    onError((error) => {
      reject(error);
    });
  });
}

export async function setUserUploaded(option: boolean | null) {
  await store.set("user-uploaded", option);
}

export async function saveUserData(params: SaveUserData): Promise<void> {
  const {
    mutate: updateUserProfile,
    onDone,
    onError,
  } = useMutation(
    gql`
      mutation SaveUserData(
        $name: String!
        $user: String!
        $email: String!
        $image_id: String
      ) {
        updateUserProfile(
          input: {
            name: $name
            user: $user
            email: $email
            image_id: $image_id
          }
        )
      }
    `,
    {
      variables: {
        name: params.name,
        user: params.user,
        email: params.email,
        image_id: params.imageId,
      },
    }
  );
  updateUserProfile();

  return new Promise((resolve, reject) => {
    onDone(() => resolve());
    onError((error) => reject(error));
  });
}

export async function deleteUserAccount(
  params: DeleteUserAccount
): Promise<void> {
  const {
    mutate: deleteUserAccount,
    onDone,
    onError,
  } = useMutation(
    gql`
      mutation DeleteUserAccount($password: String!) {
        deleteUserAccount(input: { password: $password })
      }
    `,
    {
      variables: {
        password: params.password,
      },
    }
  );
  deleteUserAccount();

  return new Promise((resolve, reject) => {
    onDone(() => resolve());
    onError((error) => reject(error));
  });
}

export async function resendEmailConfirmation(
  params: ResendEmailConfirmation
): Promise<void> {
  const {
    mutate: resendEmailConfirmation,
    onDone,
    onError,
  } = useMutation(
    gql`
      mutation ResendEmailConfirmation($email: String!) {
        resendEmailConfirmation(input: { email: $email })
      }
    `,
    {
      variables: {
        email: params.email,
      },
    }
  );
  resendEmailConfirmation();

  return new Promise((resolve, reject) => {
    onDone(() => resolve());
    onError((error) => reject(error));
  });
}
