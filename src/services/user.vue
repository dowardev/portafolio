<script lang="ts">
import { Storage } from "@ionic/storage";
const store = new Storage();
store.create();
import gql from "graphql-tag";
import apolloClient from "../Apollo";

const apollo = apolloClient;

interface User {
  id: string;
  name: string;
  email: string;
  admin: boolean;
  role: string[];
}

export default function () {
  function setUserToken(token: string | null) {
    document.cookie = "token=" + token;
  }
  async function getUserToken() {
    const name = "token=";
    const cDecoded = decodeURIComponent(document.cookie);
    const cArr = cDecoded.split("; ");
    let token = "";
    cArr.forEach((val) => {
      if (val.indexOf(name) === 0) token = val.substring(name.length);
    });
    return token;
  }
  function getUserOffline() {
    let userUploaded = null;
    return new Promise((resolve) => {
      const interval = setInterval(async () => {
        userUploaded = await store.get("user-uploaded");
        if (userUploaded != null) {
          if (userUploaded) {
            resolve(Object.assign({}, await store.get("userData"))["user"]);
          } else {
            resolve(null);
          }
          clearInterval(interval);
        }
      }, 100);
    });
  }
  async function setUserData(data: any) {
    const query = gql`
      query {
        user {
          name
          email
          is_admin
          role
        }
      }
    `;
    apollo.defaultClient.cache.writeQuery({
      query,
      data: {
        user: data,
      },
    });
  }

  function getUser(): Promise<{
    message: string;
    user: User | null;
  }> {
    return new Promise((resolve, reject) => {
      const mutation = gql`
        mutation {
          getUserAuth {
            message
            user {
              id
              name
              email
              is_admin
              role
            }
          }
        }
      `;
      apollo.defaultClient
        .mutate({
          mutation,
        })
        .then((response) => {
          if (response.data.getUserAuth.message == "Success") {
            resolve({
              message: response.data.getUserAuth.message,
              user: {
                id: response.data.getUserAuth.user[0].id as string,
                name: response.data.getUserAuth.user[0].name as string,
                email: response.data.getUserAuth.user[0].email as string,
                admin: response.data.getUserAuth.user[0].is_admin as boolean,
                role: response.data.getUserAuth.user[0].role as string[],
              },
            });
          }
          resolve({
            message: response.data.message,
            user: null,
          });
        })
        .catch((e) => {
          reject(e);
        });
    });
  }
  async function setUserUploaded(option: boolean | null) {
    await store.set("user-uploaded", option);
  }

  async function getUserName(): Promise<{
    message: string;
    name: string | null;
  }> {
    return new Promise((resolve, reject) => {
      getUserNameCached().then((response) => {
        if (response.name != null) {
          resolve({ message: "Success", name: response.name });
        }

        getUser()
          .then(
            (response) => {
              resolve({ message: "Success", name: response.user!.name });
            },
            (e) => {
              throw new Error(e);
            }
          )
          .catch((e) => {
            reject(e);
          });
      });
    });
  }
  async function getUserNameCached(): Promise<{ name: string | null }> {
    return new Promise((resolve) => {
      const query = gql`
        query {
          user {
            name
          }
        }
      `;
      const user = apollo.defaultClient.cache.readQuery({
        query: query,
      }) as any;

      let name = null;
      if (user) {
        name = user.user.name;
      }

      resolve({
        name,
      });
    });
  }

  function getUserPermissions(): Promise<{
    message: string;
    admin: null | boolean;
    rol: null | string[];
  }> {
    return new Promise((resolve, reject) => {
      getUserPermissionsCached().then((response) => {
        if (response.admin != null) {
          resolve({
            message: "Success",
            admin: response.admin,
            rol: response.rol,
          });
        }

        getUser()
          .then(
            (response) => {
              resolve({
                message: "Success",
                admin: response.user![0].admin,
                rol: response.user![0].role,
              });
            },
            (e) => {
              throw new Error(e);
            }
          )
          .catch((e) => {
            reject(e);
          });
      });
    });
  }
  function getUserPermissionsCached(): Promise<{
    admin: boolean | null;
    rol: string[] | null;
  }> {
    return new Promise((resolve) => {
      const query = gql`
        query {
          user {
            is_admin
            role
          }
        }
      `;
      const userPermissions = apollo.defaultClient.cache.readQuery({
        query: query,
      }) as any;

      let admin = null;
      let rol = null;
      if (userPermissions) {
        admin = userPermissions.user.is_admin;
        rol = userPermissions.rol;
      }

      resolve({
        admin,
        rol,
      });
    });
  }

  return {
    getUserToken,
    setUserToken,
    setUserData,
    getUser,
    getUserOffline,
    getUserPermissions,
    getUserPermissionsCached,
    setUserUploaded,
    getUserName,
    getUserNameCached,
  };
}
</script>
