import { defineStore } from "pinia";
import { ref } from "vue";
import type { Post } from "../utils/interfaces";

export const usePostStore = defineStore("post", () => {
  const posts = ref<Post[]>([]);
  const dates = ref<string[]>([]);
  const currentPage = ref<string | undefined>(undefined);
  const postsCache = ref<Map<string, Post[]>>(new Map());

  function getPosts() {
    return posts.value;
  }

  function getPost(params: { id: string }): Post {
    const id = params.id;
    const post = posts.value.filter((element) => {
      return (element as any).id == id;
    });
    return post[0];
  }

  function addPost(params: { post: Post }) {
    const { post } = params;
    const index = posts.value.findIndex((p) => p.id == post.id);

    if (index === -1) {
      posts.value.push(post);
    } else {
      posts.value[index] = { ...posts.value[index], ...post };
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
      if (element.id == post.id) return { ...element, ...post };
      return element;
    });
  }

  function getCachedPosts(params: { key: string }): Post[] | undefined {
    const { key } = params
    return postsCache.value.get(key)
  }

  function setCachedPosts(params: { key: string; posts: Post[] }) {
    const { key, posts: postsToCache } = params
    postsCache.value.set(key, postsToCache)
  }

  function hasCachedPosts(params: { key: string }): boolean {
    const { key } = params
    return postsCache.value.has(key)
  }

  function clearCache() {
    postsCache.value = new Map()
  }

  return {
    posts,
    dates,
    currentPage,
    postsCache,
    getPosts,
    getPost,
    addPost,
    setPosts,
    updateDates,
    updateCurrentPage,
    updatePost,
    getCachedPosts,
    setCachedPosts,
    hasCachedPosts,
    clearCache,
  };
});
