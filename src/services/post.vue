<script lang="ts">
import axios from "axios";
import userService from "./user.vue";
import gql from "graphql-tag";
import apolloClient from "../Apollo";
import {
  UpdatePost,
  Post,
  GetImage,
  DeletePost,
  CreatePost,
  GetPost,
  GetPosts,
  Image,
  UploadImage,
  GetPostsDatesResponse,
} from "./interfaces.vue";
import systemService from "./system.vue";

const apollo = apolloClient;

export default function () {
  async function createPost(params: CreatePost): Promise<void> {
    try {
      await apollo.defaultClient.mutate({
        mutation: gql`
          mutation (
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
            ) {
              message
            }
          }
        `,
        variables: {
          title: params.title,
          content: params.content,
          coverId: params.coverId,
          images: params.images,
        },
      });
    } catch (e: any) {
      if (e.graphQLErrors[0]) throw e.graphQLErrors[0];
      throw new Error(e);
    }
  }

  async function updatePost(params: UpdatePost): Promise<void> {
    try {
      await apollo.defaultClient.mutate({
        mutation: gql`
          mutation (
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
            ) {
              message
            }
          }
        `,
        variables: {
          id: params.id,
          title: params.title,
          content: params.content,
          coverId: params.coverId,
          newCoverId: params.newCoverId,
          images: params.images,
          imagesRemoved: params.imagesRemoved,
        },
      });
    } catch (e: any) {
      if (e.graphQLErrors[0]) throw e.graphQLErrors[0];
      throw new Error(e);
    }
  }

  async function deletePost(params: DeletePost): Promise<void> {
    try {
      await apollo.defaultClient.mutate({
        mutation: gql`
          mutation ($id: ID!) {
            deletePost(input: { id: $id }) {
              message
            }
          }
        `,
        variables: {
          id: params.id,
        },
      });
    } catch (e: any) {
      if (e.graphQLErrors[0]) throw e.graphQLErrors[0];
      throw new Error(e);
    }
  }

  async function getPosts(params: GetPost): Promise<Array<Post>> {
    try {
      const response = await apollo.defaultClient.mutate({
        mutation: gql`
        query($date:String!){
          posts(date:$date) {
            posts{
              ${params.query}
            }
          }
        }
      `,
        variables: {
          date: params.date,
        },
      });

      if (response.data.posts.posts) return response.data.posts.posts;
      throw new Error("Bad response");
    } catch (e: any) {
      if (e.graphQLErrors[0]) throw e.graphQLErrors[0];
      throw new Error(e);
    }
  }

  async function getPost(params: GetPosts): Promise<Post> {
    try {
      const response = await apollo.defaultClient.mutate({
        mutation: gql`
        query ($id: ID!) {
          post(id: $id) {
            post {
             ${params.query}
            }
          }
        }
      `,
        variables: {
          id: params.id,
        },
      });

      if (response.data.post.post) return response.data.post.post;
      throw new Error("Bad response");
    } catch (e: any) {
      if (e.graphQLErrors[0]) throw e.graphQLErrors[0];
      throw new Error(e);
    }
  }

  async function uploadImage(params: UploadImage): Promise<Image> {
    let operations = "" as any;
    try {
      operations = {
        query: `
          mutation ($file: Upload!) {
            uploadImage(input: { file: $file }) {
             ${params.query}
            }
          }
        `,
        variables: {
          file: null,
        },
      };
    } catch (e: any) {
      if (e.graphQLErrors) throw Error(e.graphQLErrors[0].debugMessage);
      throw Error(e.message);
    }

    try {
      const _map = {
        file: ["variables.file"],
      };
      const file = params.image;
      const fd = new FormData();
      fd.append("operations", JSON.stringify(operations));
      fd.append("map", JSON.stringify(_map));
      fd.append("file", file, file.name);

      const token = await userService().getUserToken();

      const response = await axios.post(systemService().getBaseURL(), fd, {
        headers: {
          Accept: "application/json",
          Authorization: token,
        },
      });

      return response.data.data.uploadImage.image;
    } catch (e: any) {
      // throw new Error(e.response.data.message);
      throw new Error(e.message);
    }
  }

  async function getImage(params: GetImage): Promise<Image> {
    try {
      const response = await apollo.defaultClient.mutate({
        mutation: gql`
          mutation ($id: String, $name: String) {
            getImage(input: { id: $id, name: $name }) {
             ${params.query}
            }
          }
        `,
        variables: {
          id: params.id,
          name: params.name,
        },
      });

      if (response.data) return response.data;
      throw new Error("Bad response");
    } catch (e: any) {
      if (e.graphQLErrors[0]) throw e.graphQLErrors[0];
      throw new Error(e);
    }
  }

  async function getPostsDates(): Promise<Array<GetPostsDatesResponse>> {
    try {
      const response = await apollo.defaultClient.mutate({
        mutation: gql`
          query {
            getDates {
              message
              dates
            }
          }
        `,
      });

      return response.data.getDates.dates;
    } catch (e: any) {
      if (e.graphQLErrors[0]) throw e.graphQLErrors[0];
      throw new Error(e);
    }
  }
  return {
    createPost,
    getPosts,
    getPost,
    uploadImage,
    getImage,
    updatePost,
    deletePost,
    getPostsDates,
  };
}
</script>
