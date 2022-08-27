import {
  DeleteUserAccountAdmin,
  DisableUser,
  GetUsers,
  GetUsersResponse,
  SearchUsers,
  SearchUsersResponse,
} from "./interfaces";

import apolloClient from "../Apollo";
import gql from "graphql-tag";
import { useQuery, useMutation } from "@vue/apollo-composable";
import { provideApolloClient } from "@vue/apollo-composable";
import { computed, watch } from "vue";
provideApolloClient(apolloClient);

export async function getUsers(params: GetUsers): Promise<GetUsersResponse> {
  const { onResult, onError, result, refetch } = useQuery(
    gql`
        query users($first: Int!,$page:Int!) {
          users(first:$first,page:$page) {
            ...${params.graphql.fragment}
          }
        }
        ${params.graphql.name}
      `,
    {
      first: params.first,
      page: params.page,
    }
  );

  return new Promise((resolve, reject) => {
    if (result.value != undefined && params.graphql.refetch == false)
      resolve({
        users: result.value.users.data,
        paginatorInfo: result.value.users.paginatorInfo,
      });

    if (params.graphql.refetch) {
      refetch()?.then((response) =>
        resolve({
          users: response.data.users.data,
          paginatorInfo: response.data.users.paginatorInfo,
        })
      );
    }

    onResult((response) =>
      resolve({
        users: response.data.users.data,
        paginatorInfo: response.data.users.paginatorInfo,
      })
    );

    onError((error) => {
      reject(error);
    });
  });
}

export async function searchUsers(params: SearchUsers): Promise<any> {
  const { onResult, onError, result, refetch } = useQuery(
    gql`
        query UsersSearch($first: Int!,$page:Int!,$search:String,$filterOptions:String!) {
          usersSearch(first:$first,page:$page,search:$search,filterOptions:$filterOptions) {
             ...${params.graphql.fragment}
          }
        }
          ${params.graphql.name}
      `,
    {
      first: params.first,
      page: params.page,
      search: "%" + params.search + "%",
      filterOptions: params.filterOptions,
    }
  );

  let queryResult = "" as any;
  queryResult = new Promise((resolve, reject) => {
    if (params.graphql.refetch) {
      refetch()?.then((response) => resolve(response));
    }

    if (result.value != undefined)
      resolve({
        users: JSON.parse(JSON.stringify(result.value.usersSearch.data)),
        paginatorInfo: result.value.usersSearch.paginatorInfo,
      });

    if (result.value == undefined)
      onResult(async (response) => {
        resolve({
          users: JSON.parse(
            JSON.stringify(await response.data.usersSearch.data)
          ),
          paginatorInfo: await response.data.usersSearch.paginatorInfo,
        });
      });
  });

  (await queryResult).users.map((element: any) => {
    element.isAdmin = element.is_admin;
    delete element.is_admin;

    element.isEmailVerified = element.is_email_verified;
    delete element.is_email_verified;

    element.isUserDisabled = element.is_user_disabled;
    delete element.is_user_disabled;
    return element;
  });
  return queryResult;
}

export async function disableUser(params: DisableUser): Promise<void> {
  const {
    mutate: disableUser,
    onDone,
    onError,
  } = useMutation(
    gql`
      mutation DisableUser($id: String!, $disableUser: Boolean!) {
        disableUser(input: { id: $id, user_disabled: $disableUser })
      }
    `,
    {
      variables: {
        id: params.id,
        disableUser: params.disableUser,
      },
    }
  );
  disableUser();

  return new Promise((resolve, reject) => {
    onDone(() => resolve());
    onError((error) => reject(error));
  });
}

export async function deleteUserAccount(
  params: DeleteUserAccountAdmin
): Promise<void> {
  const {
    mutate: deleteUserAccount,
    onDone,
    onError,
  } = useMutation(
    gql`
      mutation DeleteUserAccountAdmin($email: String!) {
        deleteUserAccountAdmin(input: { email: $email })
      }
    `,
    {
      variables: {
        email: params.email,
      },
    }
  );
  deleteUserAccount();

  return new Promise((resolve, reject) => {
    onDone(() => resolve());
    onError((error) => reject(error));
  });
}
