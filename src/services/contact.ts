import { ContactMessage } from "./interfaces";

import apolloClient from "../Apollo";
import gql from "graphql-tag";
import { useMutation } from "@vue/apollo-composable";
import { provideApolloClient } from "@vue/apollo-composable";
provideApolloClient(apolloClient);

export async function createContactMessage(
  params: {data:ContactMessage}
): Promise<void> {
  const {
    mutate: createContactMessage,
    onDone,
    onError,
  } = useMutation(
    gql`
      mutation createContactMessage(
        $name: String!
        $subject: String!
        $email: String!
        $description: String!
      ) {
        createContactMessage(
          input: {
            name: $name
            subject: $subject
            email: $email
            description: $description
          }
        )
      }
    `,
    {
      variables: {
        name: params.data.name,
        subject: params.data.subject,
        email: params.data.email,
        description: params.data.description,
      },
    }
  );
  createContactMessage();

  return new Promise((resolve, reject) => {
    onDone(() => resolve());
    onError((error) => reject(error));
  });
}
