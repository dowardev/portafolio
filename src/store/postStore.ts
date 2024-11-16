import { defineStore } from "pinia";
import { Post } from "../services/interfaces";
import formatISO from "date-fns/formatISO";
import { ref } from "vue";

interface PostState {
  posts: Array<Post>;
  dates: Array<string>;
  currentPage: string | undefined;
}

export const usePostStore = defineStore("post", () => {
  const posts = ref<Post[]>([]);
  const dates = ref<string[]>([]);
  const currentPage = ref<string | undefined>(undefined);

  function formatDates() {
    const datesResult = Array<string>();
    dates.value.forEach((element: any) => {
      datesResult.push(
        formatISO(new Date(element), {
          representation: "date",
        }).replaceAll("/", "-")
      );
    });
    return datesResult;
  }

  function getPosts() {
    return posts.value;
  }

  function getPost() {
    return (params: { id: string }) => {
      const id = params.id;
      let post = posts.value.filter((element) => {
        return (element as any).id == id;
      });
      post = JSON.parse(JSON.stringify(post));
      if (post.length > 0) {
        post[0].cover.source = "data:image/png;base64," + post[0].cover.source;
      }
      return post[0];
    };
  }

  function addPost(params: { post: Post }) {
    const post = params.post;

    if (posts.value.length == 0) posts = [post];
    else {
      let exists = false as boolean;
      posts.forEach((element) => {
        if (element.id == post.id) exists = true;
      });

      if (exists == false) posts.push(post);

      if (exists == true) {
        posts = posts.value.map((element) => {
          if (element.id == post.id) element = { ...element, ...post };
          return element;
        });
      }
    }
  }

  function setPosts(params: { posts: Array<Post> }) {
    posts.value = params.posts;
  }

  function updateDates(params: { dates: string[] }) {
    const { dates: datesParams } = params;
    dates.value = datesParams;
  }

  function updateCurrentPage(params: { currentPage: string }) {
    currentPage.value = params.currentPage;
  }

  function updatePost(params: { post: Post }) {
    const post = params.post;
    posts = posts.value.map((element) => {
      if (element.id == post.id || post.id == post.id)
        element = { ...element, ...post };
      return element;
    });
  }

  return {
    posts,
    dates,
    currentPage,
    formatDates,
    getPosts,
    getPost,
    addPost,
    setPosts,
    updateDates,
    updateCurrentPage,
    updatePost,
  };
});
