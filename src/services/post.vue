<script lang="ts">
import axios from "axios";
import userService from "./user.vue";

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

    return axios.get("http://localhost:8000/api/auth/get-posts", {
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + token,
      },
    });
  }
  async function getPost(id: string) {
    const token = await userService().getUserToken();
    return axios.get("http://localhost:8000/api/auth/get-post", {
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + token,
      },
      params: { id },
    });
  }
  async function uploadImage(img: any) {
    const token = await userService().getUserToken();
    return axios.post("http://localhost:8000/api/auth/upload-image-post", img, {
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + token,
        "content-type": "multipart/form-data",
      },
    });
  }
  return {
    createPost,
    getPosts,
    getPost,
    uploadImage,
  };
}
</script>
