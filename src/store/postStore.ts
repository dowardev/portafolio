import { defineStore } from "pinia";
import { Post } from "../services/interfaces";
import { formatISO } from "date-fns/formatISO";
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

  function getPost(params: { id: string }): Post {
    const id = params.id;
    let post = posts.value.filter((element) => {
      return (element as any).id == id;
    });
    return post[0];
  }

  function addPost(params: { post: Post }) {
    const { post } = params;

    if (posts.value.length == 0) posts.value = [post];
    else {
      let exists = false as boolean;
      posts.value.forEach((element) => {
        if (element.id == post.id) exists = true;
      });

      if (exists == false) posts.value.push(post);

      if (exists == true) {
        posts.value = posts.value.map((element) => {
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

  function updatePost(params: Post) {
    const post = params;
    posts.value = posts.value.map((element) => {
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
