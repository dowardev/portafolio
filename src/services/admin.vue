<script lang="ts">
import gql from "graphql-tag";
import apolloClient from "../Apollo";
import {
  DeleteUserAccountAdmin,
  DisableUser,
  GetUsers,
  GetUsersResponse,
  SearchUsers,
  SearchUsersResponse,
} from "./interfaces.vue";

const apollo = apolloClient;

export default function () {
  async function getUsers(params: GetUsers): Promise<GetUsersResponse> {
    try {
      const response = await apollo.defaultClient.mutate({
        mutation: gql`
        query ($first: Int!,$page:Int!) {
          users(first:$first,page:$page) {
             ${params.query}
          }
        }
      `,
        variables: {
          first: params.first,
          page: params.page,
        },
      });

      return {
        users: response.data.users.data,
        paginatorInfo: response.data.users.paginatorInfo,
      };
    } catch (e: any) {
      if (e.graphQLErrors[0]) throw e.graphQLErrors[0];
      throw new Error(e);
    }
  }

  async function searchUsers(
    params: SearchUsers
  ): Promise<SearchUsersResponse> {
    try {
      const response = await apollo.defaultClient.mutate({
        mutation: gql`
        query ($first: Int!,$page:Int!,$name:Mixed,$email:Mixed) {
          usersSearch(first:$first,page:$page,where:{
              OR: [
               { column: name, operator: EQ, value: $name },
               { column: email, operator: EQ, value: $email }
              ]
           }
) {
             ${params.query}
          }
        }
      `,
        variables: {
          first: params.first,
          page: params.page,
          name: params.name,
          email: params.email,
        },
      });

      return {
        users: response.data.usersSearch.data,
        paginatorInfo: response.data.usersSearch.paginatorInfo,
      };
    } catch (e: any) {
      if (e.graphQLErrors[0]) throw e.graphQLErrors[0];
      throw new Error(e);
    }
  }

  async function disableUser(params: DisableUser): Promise<void> {
    try {
      await apollo.defaultClient.mutate({
        mutation: gql`
          mutation ($id: String!, $disableUser: Boolean!) {
            disableUser(input: { id: $id, user_disabled: $disableUser })
          }
        `,
        variables: {
          id: params.id,
          disableUser: params.disableUser,
        },
      });
    } catch (e: any) {
      if (e.graphQLErrors[0]) throw e.graphQLErrors[0];
      throw new Error(e);
    }
  }

  async function deleteUserAccount(
    params: DeleteUserAccountAdmin
  ): Promise<void> {
    try {
      await apollo.defaultClient.mutate({
        mutation: gql`
          mutation ($email: String!) {
            deleteUserAccountAdmin(input: { email: $email })
          }
        `,
        variables: {
          email: params.email,
        },
      });
    } catch (e: any) {
      if (e.graphQLErrors[0]) throw e.graphQLErrors[0];
      throw new Error(e);
    }
  }

  return {
    getUsers,
    searchUsers,
    disableUser,
    deleteUserAccount,
  };
}
</script>
