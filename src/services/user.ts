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
  Graphql,
} from "./interfaces";

import apolloClient from "../Apollo";
import gql from "graphql-tag";
import { useQuery, useMutation } from "@vue/apollo-composable";
import { provideApolloClient } from "@vue/apollo-composable";
import { executeGrapQuery, graphqlQueryBuilder } from "./system";
import { errorBuilder } from "@/utils/errors";
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

export async function getUser(params: Graphql): Promise<User> {
  const { name, fragment, refetch = false } = params;

  try {
    const query = graphqlQueryBuilder({
      name,
      fragment,
      mutationName: "userAuth",
    });

    let response = await executeGrapQuery({
      query,
      options: { refetch },
    });
    if (!response.value.userAuth) return {} as User;
    response = {
      id: response.value.userAuth.user.id,
      name: response.value.userAuth.user.name,
      email: response.value.userAuth.user.email,
      user: response.value.userAuth.user.user,
      imageProfile: response.value.userAuth.user.image_profile,
      isAdmin: response.value.userAuth.user.is_admin,
    };
    return response;
  } catch (error: any) {
    if (error.message != "Unauthorized")
      throw errorBuilder({ message: error.message, typeError: "authError" });
    throw errorBuilder({ message: error.message });
  }
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
