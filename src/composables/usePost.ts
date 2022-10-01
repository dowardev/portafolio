import { usePostStore } from "../store/postStore";
import { storeToRefs } from "pinia";
import { Graphql, Post } from "../services/interfaces";
import { useSystem } from "./useSystem";
import {
  getPosts as getPostsService,
  getPost as getPostService,
  getPostsDates,
  deletePost as deletePostService,
} from "../services/post";

const openToastError = useSystem().openToastError;

export const usePost = () => {
  const postStore = usePostStore();
  const postRefs = storeToRefs(postStore);

  async function loadPosts(params: { date: string; graphql: Graphql }) {
    try {
      const posts = await getPostsService({
        date: params.date,
        graphql: params.graphql,
      });

      postStore.updatePosts({ posts: JSON.parse(JSON.stringify(posts)) });
    } catch (e: any) {
      openToastError(e);
      throw e;
    }
  }

  async function loadDates(params: { graphql: Graphql }) {
    try {
      const dates = await getPostsDates({
        graphql: params.graphql,
      });

      postStore.updateDates(dates);
    } catch (e: any) {
      openToastError(e);
      throw e;
    }
  }

  async function loadPost(params: { id: string; graphql: Graphql }) {
    const id = params.id;
    try {
      const post = await getPostService({
        id,
        graphql: params.graphql,
      });

      postStore.updatePost({ id, post: JSON.parse(JSON.stringify(post)) });
    } catch (e: any) {
      openToastError(e);
      throw e;
    }
  }

  function getPost(params: { id: string }): Post | undefined {
    const id = params.id;
    const post = postStore.getPost({ id });
    return post ? post : undefined;
  }

  function getPosts(): Post[] | undefined {
    const posts = postStore.getPosts();
    return posts ? posts : undefined;
  }

  function getDates(): Array<string> | undefined {
    return postRefs.dates ? postRefs.dates.value : undefined;
  }

  function getCurrentPage() {
    return postRefs.currentPage.value ? postRefs.currentPage.value : undefined;
  }

  function updateCurrentPage(params: { currentPage: string }) {
    postStore.updateCurrentPage({ currentPage: params.currentPage });
  }

  async function deletePost(params: { id: string }): Promise<void> {
    const id = params.id;

    try {
      await deletePostService({ id });
    } catch (error) {
      throw error;
    }
  }

  return {
    // functions
    deletePost,
    getCurrentPage,
    getDates,
    getPost,
    getPosts,
    loadDates,
    loadPost,
    loadPosts,
    updateCurrentPage,
  };
};
