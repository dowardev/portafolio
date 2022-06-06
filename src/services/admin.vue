<script lang="ts">
import gql from "graphql-tag";
import apolloClient from "../Apollo";
import { GetUsers, GetUsersResponse } from "./interfaces.vue";

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

  return {
    getUsers,
  };
}
</script>
