import { defineStore } from "pinia";
import { Post } from "../services/interfaces";
import formatISO from "date-fns/formatISO";

interface PostState {
  posts: Array<Post>;
  dates: Array<string>;
  currentPage: string;
}

export const usePostStore = defineStore("post", {
  state: (): PostState => ({
    posts: Array<Post>(),
    dates: Array<string>(),
    currentPage: "",
  }),

  getters: {
    formatDates(state) {
      const dates = Array<string>();
      state.dates.forEach((element: any) => {
        dates.push(
          formatISO(new Date(element), {
            representation: "date",
          }).replaceAll("/", "-")
        );
      });
      return dates;
    },

    getPosts(state) {
      return (params: { date: string }) => {
        const date = params.date;
        let posts = JSON.parse(JSON.stringify(state.posts));
        posts = posts.map((element: Post) => {
          element.cover.source =
            "data:image/png;base64," + element.cover.source;
          return element;
        });
        return posts;
      };
    },

    getPost(state) {
      return (params: { id: string }) => {
        const id = params.id;
        let post = state.posts.filter((element) => {
          return (element as any).id == id;
        });
        post = JSON.parse(JSON.stringify(post));
        if (post.length > 0) {
          post[0].cover.source =
            "data:image/png;base64," + post[0].cover.source;
        }
        return post[0];
      };
    },
  },

  actions: {
    updatePosts(params: { posts: Post[] }) {
      const posts = params.posts;

      if (this.posts.length == 0) this.posts = posts;
      else {
        const id = this.posts[0].id;
        const post = this.posts[0];
        const postMerge = posts.filter((element) => {
          return (element.id as any) == id;
        })[0];
        const result = { ...post, ...postMerge };
        this.posts = posts.map((element) => {
          if ((element.id as any) == id) element = result;
          return element;
        });
      }
    },

    updateDates(dates: Array<string>) {
      this.dates = dates;
    },

    updatePost(params: { id: string; post: Array<Post> }) {
      const post = params.post;

      if (this.posts.length == 0) this.posts.push(post as any);
      else {
        const id = parseInt(params.id);
        const postMerge = this.posts.filter((element) => {
          return (element.id as any) == id;
        })[0];
        const merge = { ...postMerge, ...post };
        this.posts = this.posts.map((element) => {
          if ((element.id as any) == id) (element as any) = merge;
          return element;
        });
      }
    },

    updateCurrentPage(params: { currentPage: string }) {
      this.currentPage = params.currentPage;
    },
  },
});
