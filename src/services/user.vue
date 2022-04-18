<script lang="ts">
import { Storage } from "@ionic/storage";
const store = new Storage();
store.create();
import gql from "graphql-tag";
import apolloClient from "../Apollo";

const apollo = apolloClient;

interface User {
  id?: string;
  name?: string;
  email?: string;
  admin?: boolean;
  rol?: Array<any>;
}

export default function () {
  function setUserToken(token: string | null): void {
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

  async function setUserData(data: { user: User }): Promise<void> {
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

    try {
      apollo.defaultClient.cache.writeQuery({
        query,
        data: {
          user: data.user,
        },
      });
    } catch (e: any) {
      throw e.message;
    }
  }

  async function getUser(): Promise<{
    message: string;
    user: User | undefined;
  }> {
    const mutation = gql`
      mutation {
        getUserAuth {
          message
          user {
            id
            name
            email
            is_admin
            rol
          }
        }
      }
    `;

    let message = "Error";
    let user: User | undefined;

    try {
      const response = await apollo.defaultClient.mutate({
        mutation,
      });

      if (response.data.getUserAuth.message == "Success") {
        message = response.data.getUserAuth.message;
        user = {
          id: response.data.getUserAuth.user.id as string,
          name: response.data.getUserAuth.user.name as string,
          email: response.data.getUserAuth.user.email as string,
          admin: response.data.getUserAuth.user.is_admin as boolean,
          rol: response.data.getUserAuth.user.rol as string[],
        };
      }
    } catch (e: any) {
      throw e.message;
    }

    return {
      message,
      user: user,
    };
  }

  async function setUserUploaded(option: boolean | null) {
    await store.set("user-uploaded", option);
  }

  async function getUserName(): Promise<{
    message: string;
    user: User | undefined;
  }> {
    let user: User | undefined;
    let message = "Error";

    try {
      const response = await getUserNameCached();
      if (response.message == "Success") {
        message = response.message;
        user = { name: response.user?.name };
      }
    } catch (e: any) {
      throw e.message;
    }

    try {
      const response = await getUser();
      message = response.message;
      user = { name: response.user?.name };
    } catch (e: any) {
      throw e.message;
    }

    return {
      message,
      user,
    };
  }

  async function getUserNameCached(): Promise<{
    message: string;
    user: User | undefined;
  }> {
    const query = gql`
      query {
        user {
          name
        }
      }
    `;

    let message = "Error";
    let user: User | undefined;

    try {
      const response = apollo.defaultClient.cache.readQuery({
        query: query,
      }) as any;
      if (response != null) {
        message = response.user.name;
        user = { name: response.user.name };
      }
    } catch (e: any) {
      throw e.message;
    }

    return {
      message,
      user,
    };
  }

  async function getUserPermissions(): Promise<{
    message: string;
    user: User;
  }> {
    let admin: boolean | undefined;
    let rol: any[] | undefined;
    let message = "Error";

    try {
      let response = getUserPermissionsCached();

      if (response.user.admin) {
        message = "Success";
        admin = response.user.admin;
        rol = response.user.rol;
      }
    } catch (e: any) {
      throw e.message;
    }

    try {
      const response = await getUser();
      if (response.message == "Success") {
        message = "Success";
        admin = response.user?.admin;
        rol = response.user?.rol;
      }
    } catch (e: any) {
      throw e.message;
    }

    return {
      message,
      user: {
        admin,
        rol: rol,
      },
    };
  }

  function getUserPermissionsCached(): {
    message: string;
    user: User;
  } {
    const query = gql`
      query {
        user {
          is_admin
          rol
        }
      }
    `;

    let message = "Error";
    let admin = undefined;
    let rol = undefined;

    try {
      const response = apollo.defaultClient.cache.readQuery({
        query: query,
      }) as any;

      if (response) {
        message = response.msessage;
        admin = response.user.is_admin;
        rol = response.rol;
      }
    } catch (e: any) {
      throw e.message;
    }

    return {
      message,
      user: {
        admin,
        rol,
      },
    };
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
