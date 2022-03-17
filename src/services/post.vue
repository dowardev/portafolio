<script lang="ts">
import axios from "axios";
import userService from "./user.vue";
import systemService from "./system.vue";
import gql from "graphql-tag";
import apolloClient from "../Apollo";

const apollo = apolloClient;

interface Post {
  title: string;
  content: string;
  coverId: string;
  images: number[];
}
interface UpdatePost {
  id: string;
  title: string;
  content: string;
  coverId: string;
  newCoverId: string;
  images: string[];
  imagesRemoved: string[];
}
interface getImage {
  id?: string;
  name?: string;
}

export default function () {
  async function createPost(
    title: string,
    content: string,
    coverId: number,
    images: number[]
  ) {
    return apollo.defaultClient.mutate({
      mutation: gql`
        mutation (
          $title: String!
          $content: String!
          $coverId: Int!
          $images: [Int]
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
        title,
        content,
        coverId,
        images,
      },
    });
  }
  async function updatePost({
    id,
    title,
    content,
    coverId,
    newCoverId,
    images,
    imagesRemoved,
  }: UpdatePost) {
    return apollo.defaultClient.mutate({
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
        id,
        title,
        content,
        coverId,
        newCoverId,
        images,
        imagesRemoved,
      },
    });
  }
  async function deletePost(id: string) {
    return apollo.defaultClient.mutate({
      mutation: gql`
        mutation ($id: ID!) {
          deletePost(input: { id: $id }) {
            message
          }
        }
      `,
      variables: {
        id,
      },
    });
  }
  async function getPosts(first: number, page: number) {
    return apollo.defaultClient.mutate({
      mutation: gql`
        query ($first: Int!, $page: Int) {
          posts(first: $first, page: $page) {
            data {
              id
              title
              content
              cover {
                name
              }
            }
            paginatorInfo {
              currentPage
              lastPage
            }
          }
        }
      `,
      variables: {
        first,
        page,
      },
    });
  }
  async function getPost(id: string) {
    return apollo.defaultClient.mutate({
      mutation: gql`
        query ($id: ID!) {
          post(id: $id) {
            id
            title
            content
            cover {
              id
              name
            }
          }
        }
      `,
      variables: {
        id,
      },
    });
  }
  async function uploadImage(img: any) {
    const operations = {
      query: `
      mutation($file: Upload!) {
        uploadImage(input:{file: $file}) {
        message
         image{
          id
          name
          path
          source
         }
        }
      }
    `,
      variables: {
        file: null,
      },
    };
    const _map = {
      file: ["variables.file"],
    };
    const file = img;
    const fd = new FormData();
    fd.append("operations", JSON.stringify(operations));
    fd.append("map", JSON.stringify(_map));
    fd.append("file", file, file.name);

    const token = await userService().getUserToken();

    return axios.post("http://127.0.0.1:8000/graphql", fd, {
      headers: {
        Accept: "application/json",
        Authorization: token,
      },
    });
  }
  async function getImage({ id = "", name = "" }: getImage) {
    return apollo.defaultClient.mutate({
      mutation: gql`
        mutation ($id: String, $name: String) {
          getImage(input: { id: $id, name: $name }) {
            message
            image {
              id
              name
              source
            }
          }
        }
      `,
      variables: {
        id,
        name,
      },
    });
  }
  return {
    createPost,
    getPosts,
    getPost,
    uploadImage,
    getImage,
    updatePost,
    deletePost,
  };
}
</script>
