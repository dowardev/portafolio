import { defineStore } from "pinia";
import { Post } from "../services/interfaces";
import formatISO from "date-fns/formatISO";

interface PostState {
  posts: Array<Post>;
  dates: Array<string>;
  currentPage: string | undefined;
}

export const usePostStore = defineStore("post", () => {
  const posts = Array<Post>();
  const dates = Array<string>();
  const currentPage = undefined;

  function formatDates(state) {
    const dates = Array<string>();
    state.dates.forEach((element: any) => {
      dates.push(
        formatISO(new Date(element), {
          representation: "date",
        }).replaceAll("/", "-")
      );
    });
    return dates;
  }

  function getPosts(state) {
    return () => {
      let posts = JSON.parse(JSON.stringify(state.posts));
      posts = posts.map((element: Post) => {
        element.cover.source = "data:image/png;base64," + element.cover.source;
        return element;
      });
      return posts;
    };
  }

  function getPost(state) {
    return (params: { id: string }) => {
      const id = params.id;
      let post = state.posts.filter((element) => {
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

    if (posts.length == 0) posts = [post];
    else {
      let exists = false as boolean;
      posts.forEach((element) => {
        if (element.id == post.id) exists = true;
      });

      if (exists == false) posts.push(post);

      if (exists == true) {
        posts = posts.map((element) => {
          if (element.id == post.id) element = { ...element, ...post };
          return element;
        });
      }
    }
  }

  function setPosts(params: { posts: Array<Post> }) {
    posts = params.posts;
  }

  function updateDates(dates: Array<string>) {
    dates = dates;
  }

  function updateCurrentPage(params: { currentPage: string }) {
    currentPage = params.currentPage;
  }

  function updatePost(params: { post: Post }) {
    const post = params.post;
    posts = posts.map((element) => {
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
