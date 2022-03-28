<script lang="ts">
import gql from "graphql-tag";
import apolloClient from "../Apollo";

const apollo = apolloClient;

interface Feedback {
  userId?: string;
  name?: string;
  email?: string;
  description: string;
  contactMe: boolean;
}

export default function () {
  async function createFeedback({
    userId,
    name,
    email,
    description,
    contactMe,
  }: Feedback) {
    return apollo.defaultClient.mutate({
      mutation: gql`
        mutation (
          $userId: String
          $name: String
          $email: String
          $description: String!
          $contactMe: Boolean!
        ) {
          createFeedback(
            input: {
              user_id: $userId
              name: $name
              email: $email
              description: $description
              contact_me: $contactMe
            }
          ) {
            message
          }
        }
      `,
      variables: {
        userId,
        name,
        email,
        description,
        contactMe,
      },
    });
  }

  return {
    createFeedback,
  };
}
</script>
