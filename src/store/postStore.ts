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
      return () => {
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
    addPost(params: { post: Post }) {
      const post = params.post;

      if (this.posts.length == 0) this.posts = [post];
      else {
        let exists = false as boolean;
        this.posts.forEach((element) => {
          if (element.id == post.id) exists = true;
        });

        if (exists == false) this.posts.push(post);

        if (exists == true) {
          this.posts = this.posts.map((element) => {
            if (element.id == post.id) element = { ...element, ...post };
            return element;
          });
        }
      }
    },

    updateDates(dates: Array<string>) {
      this.dates = dates;
    },

    updateCurrentPage(params: { currentPage: string }) {
      this.currentPage = params.currentPage;
    },
  },
});
