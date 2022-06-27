<script lang="ts">
import { FeedbackParams } from "./interfaces.vue";

import apolloClient from "../Apollo";
import gql from "graphql-tag";
import { useMutation } from "@vue/apollo-composable";
import { provideApolloClient } from "@vue/apollo-composable";
provideApolloClient(apolloClient);

export default function () {
  async function createFeedback(params: FeedbackParams): Promise<void> {
    const {
      mutate: createFeedback,
      onDone,
      onError,
    } = useMutation(
      gql`
        mutation CreateFeedback(
          $user_id: String
          $name: String
          $email: String
          $description: String!
          $contact_me: Boolean!
          $type: String!
        ) {
          createFeedback(
            input: {
              user_id: $user_id
              name: $name
              email: $email
              description: $description
              contact_me: $contact_me
              type: $type
            }
          )
        }
      `,
      {
        variables: {
          user_id: params.userId,
          name: params.name,
          email: params.email,
          description: params.description,
          contact_me: params.contactMe,
          type: params.type,
        },
      }
    );
    createFeedback();

    return new Promise((resolve, reject) => {
      onDone(() => resolve());
      onError((error) => reject(error));
    });
  }

  return {
    createFeedback,
  };
}
</script>
