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

export async function searchUsers(
  params: SearchUsers
): Promise<SearchUsersResponse> {
  const { onResult, onError, result } = useQuery(
    gql`
        query SearchUsers($first: Int!,$page:Int!,$name:Mixed,$email:Mixed) {
          usersSearch(first:$first,page:$page,where:{
              OR: [
               { column: name, operator: EQ, value: $name },
               { column: email, operator: EQ, value: $email }
              ]
           }
) {
             ...${params.graphql.fragment}
          }
        }
          ...${params.graphql.name}
      `,
    {
      first: params.first,
      page: params.page,
      name: params.name,
      email: params.email,
    }
  );

  return new Promise((resolve, reject) => {
    if (result.value != undefined)
      resolve({
        users: result.value.usersSearch.data,
        paginatorInfo: result.value.usersSearch.paginatorInfo,
      });
    else {
      onResult((response) =>
        resolve({
          users: response.data.usersSearch.data,
          paginatorInfo: response.data.usersSearch.paginatorInfo,
        })
      );
    }

    onError((error) => {
      reject(error);
    });
  });
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
