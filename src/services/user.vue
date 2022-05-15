<script lang="ts">
import { Storage } from "@ionic/storage";
const store = new Storage();
store.create();
import gql from "graphql-tag";
import apolloClient from "../Apollo";
import {
  GetUser,
  GetUserPermissionsResponse,
  GetUserResponse,
  SaveUserData,
  SetUserData,
  UserToken,
  DeleteUserAccount,
} from "./interfaces.vue";

const apollo = apolloClient;

export default function () {
  function setUserToken({ token }: UserToken): void {
    document.cookie = "token=" + token;
  }

  async function getUserToken(): Promise<string> {
    const name = "token=";
    const cDecoded = decodeURIComponent(document.cookie);
    const cArr = cDecoded.split("; ");
    let token = "";
    cArr.forEach((val) => {
      if (val.indexOf(name) === 0) token = val.substring(name.length);
    });
    return token;
  }

  async function getUserOffline() {
    let userUploaded = null;
    const interval = setInterval(async () => {
      userUploaded = await store.get("user-uploaded");
      if (userUploaded != null) {
        if (userUploaded) {
          return Object.assign({}, await store.get("userData"))["user"];
        } else {
          return null;
        }
      }
      clearInterval(interval);
    }, 100);
  }

  async function setUserData(params: SetUserData): Promise<void> {
    try {
      const query = gql`
        query {
          user {
            name
            email
            admin
            rol
          }
        }
      `;
      apollo.defaultClient.cache.writeQuery({
        query,
        data: {
          user: {
            name: params.name,
            email: params.email,
            admin: params.is_admin,
            rol: params.rol,
          },
        },
      });
    } catch (e: any) {
      if (e.graphQLErrors) throw new Error(e.graphQLErrors[0].debugMessage);
      throw new Error(e.message);
    }
  }

  async function getUser(params: GetUser): Promise<GetUserResponse> {
    try {
      const response = await apollo.defaultClient.mutate({
        mutation: gql`
        mutation {
          getUserAuth {
            ${params.query}
          }
        }
      `,
      });

      return response.data.getUserAuth.user;
    } catch (e: any) {
      if (e.graphQLErrors) throw Error(e.graphQLErrors[0].debugMessage);
      throw Error(e.message);
    }
  }

  async function setUserUploaded(option: boolean | null) {
    await store.set("user-uploaded", option);
  }

  async function getUserName(): Promise<string> {
    const query = `
          user {
            name
          }
    `;
    try {
      const response = await getUser({ query });
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return response.name!;
      // throw new Error("Bad response");
    } catch (e: any) {
      if (e.graphQLErrors) throw new Error(e.graphQLErrors[0].debugMessage);
      throw new Error(e.message);
    }
  }

  // async function getUserNameCached(): Promise<{
  //   user: User;
  // }> {
  //   const query = gql`
  //     query {
  //       user {
  //         name
  //       }
  //     }
  //   `;

  //   let message = "Error";
  //   let user: User | undefined;

  //   try {
  //     const response = apollo.defaultClient.cache.readQuery({
  //       query: query,
  //     }) as any;
  //     if (response != null) {
  //       message = response.user.name;
  //       user = { name: response.user.name };
  //     }
  //   } catch (e: any) {
  //     throw e.message;
  //   }

  //   return {
  //     message,
  //     user,
  //   };
  // }

  async function getUserPermissions(): Promise<GetUserPermissionsResponse> {
    const query = `
          user {
            name
            is_admin
          }
    `;
    try {
      const response = await getUser({ query });
      if (response) {
        return {
          admin: response.is_admin,
          rol: response.rol,
        };
      }
      throw new Error("Bad response");
    } catch (e: any) {
      if (e.graphQLErrors) throw new Error(e.graphQLErrors[0].debugMessage);
      throw new Error(e.message);
    }
  }

  // function getUserPermissionsCached(): {
  //   message: string;
  //   user: User;
  // } {
  //   const query = gql`
  //     query {
  //       user {
  //         is_admin
  //         rol
  //       }
  //     }
  //   `;

  //   let message = "Error";
  //   let admin = undefined;
  //   let rol = undefined;

  //   try {
  //     const response = apollo.defaultClient.cache.readQuery({
  //       query: query,
  //     }) as any;

  //     if (response) {
  //       message = response.msessage;
  //       admin = response.user.is_admin;
  //       rol = response.rol;
  //     }
  //   } catch (e: any) {
  //     throw e.message;
  //   }

  //   return {
  //     message,
  //     user: {
  //       admin,
  //       rol,
  //     },
  //   };
  // }

  async function saveUserData(params: SaveUserData): Promise<void> {
    try {
      await apollo.defaultClient.mutate({
        mutation: gql`
          mutation (
            $name: String!
            $user: String!
            $email: String!
            $imageId: String
          ) {
            updateUserProfile(
              input: {
                name: $name
                user: $user
                email: $email
                imageId: $imageId
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
          imageId: params.imageId,
        },
      });
    } catch (e: any) {
      if (e.graphQLErrors) throw Error(e.graphQLErrors[0].debugMessage);
      throw Error(e.message);
    }
  }

  async function deleteUserAccount(params: DeleteUserAccount) {
    try {
      await apollo.defaultClient.mutate({
        mutation: gql`
          mutation ($password: String!) {
            deleteUserAccount(input: { password: $password }) {
              message
            }
          }
        `,
        variables: {
          password: params.password,
        },
      });
    } catch (e: any) {
      if (e.graphQLErrors) throw Error(e.graphQLErrors[0].debugMessage);
      throw Error(e.message);
    }
  }

  return {
    getUserToken,
    setUserToken,
    setUserData,
    getUser,
    getUserOffline,
    getUserPermissions,
    setUserUploaded,
    getUserName,
    saveUserData,
    deleteUserAccount,
  };
}
</script>
