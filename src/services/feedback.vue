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
        mutation($user_id:String,$name:String,$email:String,
          $description:String!,$contact_me:Boolean!,$type:String!) {
          createFeedback(input:{user_id:$user_id,name:$name,email:$email,
            description:$description,contact_me:$contact_me,type:$type}) {
           ${params.query} 
          }
        }
      `,
        variables: {
          user_id: params.userId,
          name: params.name,
          email: params.email,
          description: params.description,
          contact_me: params.contactMe,
          type: params.type,
        },
      });
    } catch (e: any) {
      console.error(e);
      // throw e.graphQLErrors[0];
      if (e.graphQLErrors[0]) throw new Error(e.graphQLErrors[0].debugMessage);
      throw new Error(e.message);
    }
  }

  return {
    createFeedback,
  };
}
</script>
