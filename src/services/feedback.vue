<script lang="ts">
import gql from "graphql-tag";
import apolloClient from "../Apollo";
import { FeedbackParams } from "./interfaces.vue";

const apollo = apolloClient;

export default function () {
  async function createFeedback(params: FeedbackParams): Promise<void> {
    try {
      await apollo.defaultClient.mutate({
        mutation: gql`
        mutation($user_id:String,$name:String,$email:String,$description:String!,$contact_me:Boolean!) {
          createFeedback(input:{user_id:$user_id,name:$name,email:$email,description:$description,contact_me:$contact_me}) {
           ${params.query} 
          }
        }
      `,
        variables: {
          user_id: params.userId,
          name: params.name,
          email: params.email,
          description: params.email,
          contact_me: params.contactMe,
        },
      });
    } catch (e: any) {
      throw new Error(e);
    }
  }

  return {
    createFeedback,
  };
}
</script>
