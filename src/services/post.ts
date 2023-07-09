import {
  Post,
  DeletePost,
  CreatePost,
  GetPost,
  GetPosts,
  GetPostsDates,
  Graphql,
} from "./interfaces";

import apolloClient from "../Apollo";
import gql from "graphql-tag";
import { useQuery, useMutation } from "@vue/apollo-composable";
import { provideApolloClient } from "@vue/apollo-composable";
import {
  executeGrapMutation,
  graphqlMutationBuilder,
  POSTS_UPDATE_DETAILS,
  UPDATE_POST,
  UPLOAD_IMAGE,
} from "./graphql";
import { errorBuilder } from "@/utils/errors";
provideApolloClient(apolloClient);

interface UpdatePost {
  id: string;
  title: string;
  content: string;
  coverId: string;
  newCoverId: string;
  images: string[];
  imagesRemoved: string[];
}

export async function createPost(params: CreatePost): Promise<void> {
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

export async function updatePost(params: { post: UpdatePost }): Promise<void> {
  try {
    const query = graphqlMutationBuilder({
      name: UPDATE_POST,
      fragment: "updatePost",
      mutationName: "updatePost",
      inputName: "updatePostInput",
    });

    await executeGrapMutation({
      query,
      input: params.post,
    });
  } catch (error: any) {
    if (error.message != "Unauthorized")
      throw errorBuilder({ message: error.message, typeError: "authError" });
    throw errorBuilder({ message: error.message });
  }
}

export async function deletePost(params: DeletePost): Promise<void> {
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

export async function getPosts(params: GetPost): Promise<Array<Post>> {
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
    }
  );

  return new Promise((resolve, reject) => {
    if (params.graphql.refetch) refetch();
    if (result.value && result.value.posts.posts != undefined) {
      const posts = JSON.parse(JSON.stringify(result.value.posts.posts)).map(
        (element: any) => {
          element.createdAt = element.created_at;
          delete element.created_at;
          return element;
        }
      );
      resolve(result.value.posts.posts);
    } else {
      onResult((response) => {
        const posts = JSON.parse(JSON.stringify(response.data.posts.posts)).map(
          (element: any) => {
            element.createdAt = element.created_at;
            delete element.created_at;
            return element;
          }
        );
        resolve(posts);
      });
    }

    onError((error) => {
      reject(error);
    });
  });
}

export async function getPost(params: GetPosts): Promise<Post> {
  const { onResult, onError, result, refetch } = useQuery(
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

  const isRefetchEnabled = params.graphql.refetch;
  let queryResult = "" as any;
  queryResult = new Promise((resolve, reject) => {
    if (isRefetchEnabled) refetch();

    if (result.value != undefined && isRefetchEnabled == false)
      resolve({ post: JSON.parse(JSON.stringify(result.value.post.post)) });
    else
      onResult((response) =>
        resolve({ post: JSON.parse(JSON.stringify(response.data.post.post)) })
      );

    onError((error) => {
      reject(error);
    });
  });

  const post = (await queryResult).post;

  post.createdAt = post.created_at;
  delete post.created_at;

  post.updatedAt = post.updated_at;
  delete post.updated_at;

  return post;
}

export async function getPostsDates(
  params: GetPostsDates
): Promise<Array<string>> {
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
    if (params.graphql.refetch) refetch();

    onResult((response) => resolve(response.data.postsDates.dates));

    onError((error) => {
      reject(error);
    });
  });
}

export async function searchPosts(params: {
  search: string;
  graphql: Graphql;
}): Promise<Array<{ id: string; title: string }>> {
  const { onResult, onError, result, refetch } = useQuery(
    gql`
      query searchPosts($search: String!) {
        searchPosts(search: $search) {
          id
          title
        }
      }
    `,
    {
      search: params.search,
    }
  );

  return new Promise((resolve, reject) => {
    if (params.graphql.refetch) refetch();
    if (result.value && result.value != undefined)
      resolve(result.value.searchPosts);
    else {
      onResult((response) => resolve(response.data.searchPosts));
    }

    onError((error) => {
      reject(error);
    });
  });
}

export async function uploadImage(params: {
  image: string;
}): Promise<{ id: string; path: string }> {
  const { image } = params;

  try {
    const query = graphqlMutationBuilder({
      name: UPLOAD_IMAGE,
      fragment: "UploadImage",
      mutationName: "uploadImage",
      inputName: "FileInput",
    });

    const { id, path } = (
      await executeGrapMutation({
        query,
        input: { file: image },
      })
    ).uploadImage.image;

    return { id, path };
  } catch (error: any) {
    if (error.message != "Unauthorized")
      throw errorBuilder({ message: error.message, typeError: "authError" });
    throw errorBuilder({ message: error.message });
  }
}
