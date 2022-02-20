<script lang="ts">
import axios from "axios";
import userService from "./user.vue";
import systemService from "./system.vue";

export default function () {
  async function createPost(post: Record<string, any>) {
    const token = await userService().getUserToken();
    return axios.post("http://localhost:8000/api/auth/create-post", post, {
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + token,
      },
    });
  }
  async function getPosts() {
    const token = await userService().getUserToken();

    return axios.get(systemService().getBaseURL() + "api/auth/get-posts", {
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + token,
      },
    });
  }
  async function getPost(id: string) {
    const token = await userService().getUserToken();
    return axios.get(systemService().getBaseURL() + "api/auth/get-post", {
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + token,
      },
      params: { id },
    });
  }
  async function uploadImage(img: any) {
    const token = await userService().getUserToken();
    return axios.post(
      systemService().getBaseURL() + "api/auth/upload-image-post",
      img,
      {
        headers: {
          Accept: "application/json",
          Authorization: "Bearer " + token,
          "content-type": "multipart/form-data",
        },
      }
    );
  }
  async function getImage(name: string) {
    const token = await userService().getUserToken();
    return axios.get(systemService().getBaseURL() + "api/auth/get-image-post", {
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + token,
        "content-type": "multipart/form-data",
      },
      params: { name },
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
