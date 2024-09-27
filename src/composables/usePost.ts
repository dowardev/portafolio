import { usePostStore } from "../store/postStore";
import { storeToRefs } from "pinia";
import { Post, UpdatePost } from "../services/interfaces";
import {
  getPosts as getPostsService,
  getPost as getPostService,
  getPostsDates,
  deletePost as deletePostService,
  searchPosts as searchPostsService,
  updatePost as updatePostService,
  uploadImage as uploadImageService,
} from "../services/post";
import { useSystem } from "./useSystem";

export const usePost = () => {
  const postStore = usePostStore();
  const postRefs = storeToRefs(postStore);
  const openToastError = useSystem().openToastError;

  async function loadPosts(params: { date: string }) {
    const { date } = params;
    try {
      const posts = await getPostsService({ date });

      posts.forEach((element) => {
        // console.log(JSON.parse(JSON.stringify(element)))
        postStore.addPost({ post: element });
      });
    } catch (e: any) {
      openToastError(e);
      throw e;
    }
  }

  async function loadDates() {
    try {
      const dates = await getPostsDates();

      postStore.updateDates(dates);
    } catch (e: any) {
      openToastError(e);
      throw e;
    }
  }

  async function loadPost(params: { id: string }) {
    const id = params.id;

    try {
      const post = await getPostService({
        id,
      });
      postStore.addPost({ post });
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

  function getCurrentPage(): string | undefined {
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

  async function searchPosts(params: {
    search: string;
  }): Promise<Array<{ id: string; title: string }>> {
    const search = params.search;

    try {
      const result = await searchPostsService({
        search,
      });

      return result;
    } catch (e: any) {
      openToastError(e);
      throw e;
    }
  }

  async function updatePost(params: { post: UpdatePost }): Promise<void> {
    const { id, title, content, cover, images, imagesRemoved } = params.post;
    const post = {
      id: id!,
      title,
      content,
      coverId: cover.oldCoverId,
      newCoverId: cover.newCoverId,
      images: images,
      imagesRemoved: imagesRemoved,
    };

    try {
      await updatePostService({
        post,
      });

      postStore.updatePost({
        post: {
          id,
          title,
          content,
          cover: {
            id: cover.newCoverId,
          },
        },
      });
    } catch (error: any) {
      throw new Error(error);
    }
  }

  async function updateCover(params: {
    image: string;
  }): Promise<{ id: string; path: string }> {
    const { image } = params;
    const { id, path } = await uploadImageService({ image });
    return { id, path };
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
    searchPosts,
    updatePost,
    updateCover,
  };
};
