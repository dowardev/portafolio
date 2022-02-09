<script lang="ts">
import axios from "axios";

export default function () {
  async function createPost(post: Record<string, any>) {
    // const token = await userservice()
    //   .getusertoken()
    //   .then((response) => {
    //     return response;
    //   });
    return axios.post("http://localhost:8000/api/auth/create-post", post, {});
  }
  async function getPosts() {
    // const token = await userservice()
    //   .getusertoken()
    //   .then((response) => {
    //     return response;
    //   });
    return axios.get("http://localhost:8000/api/auth/get-posts");
  }
  async function getPost(id: string) {
    // const token = await userservice()
    //   .getusertoken()
    //   .then((response) => {
    //     return response;
    //   });
    return axios.get("http://localhost:8000/api/auth/get-post", {
      params: { id },
    });
  }
  return {
    createPost,
    getPosts,
    getPost,
  };
}
</script>
