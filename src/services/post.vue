<script lang="ts">
import axios from "axios";
import userService from "./user.vue";
import systemService from "./system.vue";
import gql from "graphql-tag";
import apolloClient from "../Apollo";

const apollo = apolloClient;

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
            msg
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
  async function getPosts() {
    const token = await userService().getUserToken();

    return axios.get(systemService().getBaseURL() + "api/get-posts", {
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + token,
      },
    });
  }
  async function getPost(id: string) {
    const token = await userService().getUserToken();
    return axios.get(systemService().getBaseURL() + "api/get-post", {
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + token,
      },
      params: { id },
    });
  }
  async function uploadImage(img: any) {
    const operations = {
      query: `
      mutation($file: Upload!) {
        uploadImage(input:{file: $file}) {
         msg
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

    return axios.post("http://127.0.0.1:8000/graphql", fd, {
      headers: {
        Accept: "application/json",
      },
    });
  }
  async function getImage(name: string) {
    return apollo.defaultClient.mutate({
      mutation: gql`
        mutation ($name: String!) {
          getImage(input: { name: $name }) {
            msg
          }
        }
      `,
      variables: {
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
  };
}
</script>
