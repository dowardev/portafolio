source: Error encountered while sourcing file
'/home/dowar/.local/share/icons-in-terminal/icons.fish': source: No such file or
directory
<script lang="ts">
import axios from "axios";
import userService from "./user.vue";
import gql from "graphql-tag";
import apolloClient from "../Apollo";

const apollo = apolloClient;

interface Post {
  id?: string;
  title: string;
  content: string;
  created: string;
  updated: string;
  cover: {
    id?: string;
    name?: string;
    path?: string;
  };
  images?: number[];
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
    coverId: string,
    images: string[]
  ): Promise<{ message: string }> {
    const response = await apollo.defaultClient.mutate({
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
        title,
        content,
        coverId,
        images,
      },
    });

    return { message: response.data.message };
  }

  async function updatePost({
    id,
    title,
    content,
    coverId,
    newCoverId,
    images,
    imagesRemoved,
  }: UpdatePost): Promise<{ message: string }> {
    const response = await apollo.defaultClient.mutate({
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

    return { message: response.data.message };
  }

  async function deletePost(id: string): Promise<{ message: string }> {
    const response = await apollo.defaultClient.mutate({
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

    return { message: response.data.message };
  }

  async function getPosts(data: { date: string }): Promise<{
    message: string;
    posts: Array<Post>;
  }> {
    const posts = await apollo.defaultClient.mutate({
      mutation: gql`
        query ($date: String!) {
          posts(date: $date) {
            message
            posts {
              id
              title
              content
              cover {
                name
                path
              }
            }
          }
        }
      `,
      variables: {
        date: data.date,
      },
    });

    try {
      return {
        message: posts.data.posts.message,
        posts: posts.data.posts.posts,
      };
    } catch (e: any) {
      throw e.message;
    }
  }

  async function getPost(data: { id: string }): Promise<Post> {
    const response = await apollo.defaultClient.mutate({
      mutation: gql`
        query ($id: ID!) {
          post(id: $id) {
            id
            title
            content
            created_at
            updated_at
            cover {
              id
              name
            }
          }
        }
      `,
      variables: {
        id: data.id,
      },
    });

    return {
      title: response.data.post.title,
      content: response.data.post.content,
      created: response.data.post.created_at,
      updated: response.data.post.updated_at,
      cover: {
        id: response.data.post.cover.id,
        name: response.data.post.cover.name,
        path: response.data.post.cover.path,
      },
    };
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

  async function getImage({ id = "", name = "" }: getImage): Promise<{
    message: string;
    image: { id: string; name: string; source: string };
  }> {
    const image = await apollo.defaultClient.mutate({
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

    try {
      return {
        message: image.data.getImage.message,
        image: {
          id: image.data.getImage.image.id,
          name: image.data.getImage.image.name,
          source: image.data.getImage.image.source,
        },
      };
    } catch (e: any) {
      throw e.message;
    }
  }

  async function getNextPostDate(data: {
    date: string;
    option: "new" | "old";
  }): Promise<{
    message: string;
    dates: string[];
    status: boolean;
  }> {
    return new Promise((resolve, reject) => {
      apollo.defaultClient
        .mutate({
          mutation: gql`
            query ($date: String!, $option: String!) {
              getNextPostDate(date: $date, option: $option) {
                message
                dates
                status
              }
            }
          `,
          variables: {
            date: data.date,
            option: data.option,
          },
        })
        .then((response) => {
          const dates = Array<string>();
          (response.data.getNextPostDate.dates as [string]).forEach(
            (element) => {
              dates.push(element.split(" ")[0]);
            }
          );
          resolve({
            message: response.data.getNextPostDate.message,
            dates,
            status: response.data.getNextPostDate.status,
          });
        })
        .catch((e) => {
          reject(e);
        });
    });
  }

  async function getRecentDatePosts(): Promise<{
    message: string;
    dates: string;
  }> {
    return new Promise((resolve, reject) => {
      apollo.defaultClient
        .mutate({
          mutation: gql`
            query {
              recentDatePosts {
                message
                date
              }
            }
          `,
        })
        .then((response) => {
          const dates = (response.data.recentDatePosts.date as string).split(
            " "
          )[0];
          resolve({
            message: response.data.recentDatePosts.message,
            dates,
          });
        })
        .catch((e) => {
          reject(e);
        });
    });
  }

  async function getPostsDates(data: { currentDate: string }): Promise<{
    message: string;
    dates: [string];
  }> {
    return new Promise((resolve, reject) => {
      apollo.defaultClient
        .mutate({
          mutation: gql`
            query ($currentDate: String!) {
              getDates(currentDate: $currentDate) {
                message
                dates
              }
            }
          `,
          variables: {
            currentDate: data.currentDate,
          },
        })
        .then((response) => {
          resolve({
            message: response.data.getDates.message,
            dates: response.data.getDates.dates,
          });
        })
        .catch((e) => {
          reject(e);
        });
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
    getNextPostDate,
    getRecentDatePosts,
    getPostsDates,
  };
}
</script>
