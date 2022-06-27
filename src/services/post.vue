<script lang="ts">
import {
  UpdatePost,
  Post,
  DeletePost,
  CreatePost,
  GetPost,
  GetPosts,
  GetPostsDates,
  GetPostsDatesResponse,
} from "./interfaces.vue";

import apolloClient from "../Apollo";
import gql from "graphql-tag";
import { useQuery, useMutation } from "@vue/apollo-composable";
import { provideApolloClient } from "@vue/apollo-composable";
provideApolloClient(apolloClient);

export default function () {
  async function createPost(params: CreatePost): Promise<void> {
    const {
      mutate: createPost,
      onDone,
      onError,
    } = useMutation(
      gql`
        mutation CreatePost(
          $title: String!
          $content: String!
          $coverId: ID!
          $images: [ID]
        ) {
          createPost(
            input: {
              title: $title
              content: $content
              coverId: $coverId
              images: $images
            }
          )
        }
      `,
      {
        variables: {
          title: params.title,
          content: params.content,
          coverId: params.coverId,
          images: params.images,
        },
      }
    );
    createPost();

    return new Promise((resolve, reject) => {
      onDone(() => resolve());
      onError((error) => reject(error));
    });
  }

  async function updatePost(params: UpdatePost): Promise<void> {
    const {
      mutate: updatePost,
      onDone,
      onError,
    } = useMutation(
      gql`
          mutation UpdatePost(
            $id: ID!
            $title: String!
            $content: String!
            $coverId: ID!
            $newCoverId: ID!
            $images: [String]
            $imagesRemoved: [String]
          ) {
            updatePost(
              input: {
                id: $id
                title: $title
                content: $content
                coverId: $coverId
                newCoverId: $newCoverId
                images: $images
                imagesRemoved: $imagesRemoved
              }
            ) 
        `,
      {
        variables: {
          id: params.id,
          title: params.title,
          content: params.content,
          coverId: params.coverId,
          newCoverId: params.newCoverId,
          images: params.images,
          imagesRemoved: params.imagesRemoved,
        },
      }
    );
    updatePost();

    return new Promise((resolve, reject) => {
      onDone(() => resolve());
      onError((error) => reject(error));
    });
  }

  async function deletePost(params: DeletePost): Promise<void> {
    const {
      mutate: deletePost,
      onDone,
      onError,
    } = useMutation(
      gql`
        mutation DeletePost($id: ID!) {
          deletePost(input: { id: $id })
        }
      `,
      {
        variables: {
          id: params.id,
        },
      }
    );
    deletePost();

    return new Promise((resolve, reject) => {
      onDone(() => resolve());
      onError((error) => reject(error));
    });
  }

  async function getPosts(params: GetPost): Promise<Array<Post>> {
    const { onResult, onError, result, refetch } = useQuery(
      gql`
        query GetPosts($date: String!) {
          posts(date: $date) {
            posts {
              ...${params.graphql.fragment}
            }
          }
        }
        ${params.graphql.name}
      `,
      {
        date: params.date,
      },
      {
        fetchPolicy: "cache-first",
      }
    );

    return new Promise((resolve, reject) => {
      if (result.value != undefined && params.refetch == false)
        resolve(result.value.posts.posts);

      if (params.refetch)
        refetch()?.then((response) => resolve(response.data.posts.posts));

      onResult((response) => resolve(response.data.posts.posts));

      onError((error) => {
        reject(error);
      });
    });
  }

  async function getPost(params: GetPosts): Promise<Post> {
    const { onResult, onError, result } = useQuery(
      gql`
        query GetPost($id: ID!) {
          post(id: $id) {
            post {
              ...${params.graphql.fragment}
            }
          }
        }
        ${params.graphql.name}
      `,
      {
        id: params.id,
      },
      {
        fetchPolicy: "cache-first",
      }
    );

    return new Promise((resolve, reject) => {
      if (result.value != undefined) resolve(result.value.post.post);
      else {
        onResult((response) => resolve(response.data.post.post));
      }

      onError((error) => {
        reject(error);
      });
    });
  }

  async function getPostsDates(
    params: GetPostsDates
  ): Promise<Array<GetPostsDatesResponse>> {
    const { onResult, onError, result, refetch } = useQuery(
      gql`
        query postsDates {
          postsDates {
            ...${params.graphql.fragment}
          }
        }
          ${params.graphql.name}
      `
    );

    return new Promise((resolve, reject) => {
      if (result.value != undefined) resolve(result.value.postsDates.dates);

      if (params.refetch)
        refetch()?.then((response) =>
          resolve(response.data.postsDates.postsDates)
        );

      onResult((response) => resolve(response.data.postsDates.dates));

      onError((error) => {
        reject(error);
      });
    });
  }
  return {
    createPost,
    getPosts,
    getPost,
    updatePost,
    deletePost,
    getPostsDates,
  };
}
</script>
