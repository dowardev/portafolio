import {
  CreatePost,
  GetPost,
  Image,
  PostServerResponse,
} from "../utils/interfaces";
import { usePostStore } from "../store/postStore";
import { storeToRefs } from "pinia";
import { Post, UpdatePost } from "../utils/interfaces";
import { StatusPost, filterPostOptions, PostFields } from "@/services/types";
import { getApiConnector } from "@/apiConnector";

// controllers
import ErrorController from "./errorController";

// services
// import PostService from "../services/postService";

export type { StatusPost, filterPostOptions, PostFields }

export default class PostController {
  private postStore = usePostStore();
  private postRefs = storeToRefs(this.postStore);
  private errorController = new ErrorController();
  private pendingRequests = new Map<string, Promise<void>>();

  private getCacheKey(params: { date: string; filter?: filterPostOptions }): string {
    const { date, filter } = params
    return `${date}_${filter ?? 'active'}`
  }

  async loadPosts(params: {
    date: string;
    filter?: filterPostOptions;
    fields?: PostFields[];
    preload?: boolean;
  }) {
    const { date, filter, fields, preload } = params;
    const cacheKey = this.getCacheKey({ date, filter: filter ?? 'active' })

    if (this.pendingRequests.has(cacheKey)) {
      return this.pendingRequests.get(cacheKey)
    }

    const cached = this.postStore.getCachedPosts({ key: cacheKey })
    if (cached) {
      if (!preload) {
        this.postStore.setPosts({ posts: cached })
      }
      return Promise.resolve()
    }

    const promise = this.fetchPosts({ date, filter, fields, preload })
    this.pendingRequests.set(cacheKey, promise)

    try {
      await promise
    } finally {
      this.pendingRequests.delete(cacheKey)
    }
  }

  async fetchPosts(params: {
    date: string;
    filter?: filterPostOptions;
    fields?: PostFields[];
    preload?: boolean;
  }) {
    const { date, filter, fields, preload } = params;
    const cacheKey = this.getCacheKey({ date, filter: filter ?? 'active' })

    try {
      const serverResponse = await getApiConnector().get(
        `posts/${date}/${filter}`,
        { params: { fields } },
      );
      const responseData = serverResponse as { posts?: PostServerResponse[] };
      const postsData = responseData.posts ?? [];

      const posts = await Promise.all(
        postsData.map(async (post: PostServerResponse) => {
          return this.formatPostResponse({ response: post });
        }),
      );

      this.postStore.setCachedPosts({ key: cacheKey, posts })
      if (!preload) {
        this.postStore.setPosts({ posts });
      }
    } catch (error: unknown) {
      return this.errorController.handleError({ error });
    }
  }

  async loadDates(params: { status?: filterPostOptions }) {
    const { status } = params;

    try {
      const response = await getApiConnector().get<string[]>(
        "post-dates",
        { params: { status } },
      );

      this.postStore.updateDates({ dates: response });
    } catch (error: unknown) {
      return this.errorController.handleError({ error });
    }
  }

  async loadPost(params: { slug: string; fields?: PostFields[] }) {
    const { slug, fields } = params;

    try {
      const serverResponse = await getApiConnector().get<PostServerResponse>(
        `post-by-slug/${slug}`,
        { params: { fields } },
      );
      const post = this.formatPostResponse({ response: serverResponse.post });

      this.postStore.addPost({ post });
    } catch (error: unknown) {
      return this.errorController.handleError({ error });
    }
  }

  async loadPostById(params: { id: number; fields?: PostFields[] }) {
    const { id, fields } = params;

    try {
      const serverResponse = await getApiConnector().get<PostServerResponse>(
        `post/${id}`,
        { params: { fields } },
      );
      const post = this.formatPostResponse({ response: serverResponse.post });

      this.postStore.addPost({ post });
    } catch (error: unknown) {
      return this.errorController.handleError({ error });
    }
  }

  getPost(params: { slug: string }): Post | undefined {
    try {
      const { slug } = params;
      return this.postStore.getPost({ slug });
    } catch (error: unknown) {
      return this.errorController.handleError({ error });
    }
  }

  getPostById(params: { id: number }): Post | undefined {
    try {
      const { id } = params;
      return this.postStore.getPost({ id });
    } catch (error: unknown) {
      return this.errorController.handleError({ error });
    }
  }

  getPosts(): Post[] | undefined {
    try {
      const posts = this.postStore.getPosts();
      return posts ? posts : undefined;
    } catch (error: unknown) {
      return this.errorController.handleError({ error });
    }
  }

  get dates() {
    return this.postRefs.dates;
  }

  getDates(): Array<string> | undefined {
    return this.postRefs.dates ? this.postRefs.dates.value : undefined;
  }

  clearCache() {
    this.postStore.clearCache()
    this.pendingRequests = new Map()
  }

  clearPosts() {
    this.postStore.setPosts({ posts: [] })
  }

  getCurrentPage(): string | undefined {
    return this.postRefs.currentPage
      ? this.postRefs.currentPage.value
      : undefined;
  }

  updateCurrentPage(params: { currentPage: string }) {
    this.postStore.updateCurrentPage({ currentPage: params.currentPage });
  }

  async deletePost(params: { id: number }): Promise<void> {
    const id = params.id;

    try {
      await getApiConnector().post("delete-post", { id });
    } catch (error) {
      return this.errorController.handleError({ error });
    }
  }

  async searchPosts(params: {
    search: string;
  }): Promise<{ id: string; title: string; slug: string }[]> {
    const search = params.search;

    try {
      const response = await getApiConnector().get<{ posts: { id: string; title: string; slug: string }[] }>(
        `search-posts/${encodeURIComponent(search)}`,
      );
      return response.posts ?? [];
    } catch (error: unknown) {
      return this.errorController.handleError({ error });
    }
  }

  async updatePost(params: { post: UpdatePost }): Promise<void> {
    const { id, title, content, coverId, images, imagesRemoved, status } =
      params.post;

    try {
      await getApiConnector().post("update-post", {
          images,
          coverId,
          content,
          title,
          id,
          imagesRemoved,
          status,
        });
    } catch (error: unknown) {
      return this.errorController.handleError({ error });
    }
  }

  async updateCover(params: {
    image: File;
  }): Promise<{ id: string; path: string; name: string }> {
    try {
      const { image } = params;
      const formData = new FormData();
      formData.append("file", image);
      formData.append("type", "post");

      const serverResponse = await getApiConnector().post<{
        data: { image: { id: string; url: string; name: string } };
      }>("upload-image", formData);

      const id = serverResponse.data.image.id;
      const path = serverResponse.data.image.url;
      const name = serverResponse.data.image.name;

      return { id, path, name };
    } catch (error: unknown) {
      return this.errorController.handleError({ error });
    }
  }

  async createPost(params: CreatePost) {
    try {
      const { title, content, coverId, images, status } = params;

      await getApiConnector().post("create-post", { title, content, coverId, images, status });
    } catch (error: unknown) {
      return this.errorController.handleError({ error });
    }
  }

  async uploadImage(params: {
    image: File;
    type: string;
  }): Promise<Image> {
    const { image, type } = params;
    try {
      const formData = new FormData();
      formData.append("file", image);
      formData.append("type", type);

      const serverResponse = await getApiConnector().post<{
        data: { image: { id: string; url: string; name: string } };
      }>("upload-image", formData);

      const id = serverResponse.data.image.id;
      const url = serverResponse.data.image.url;
      const name = serverResponse.data.image.name;

      return { id, url, name };
    } catch (error: unknown) {
      return this.errorController.handleError({ error });
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  formatPostResponse(params: { response: any }): Post {
    const { response } = params;

    return {
      id: response.id,
      slug: response.slug,
      title: response.title,
      description: response.description,
      content: response.content,
      createdAt: response.created_at,
      updatedAt: response.updated_at,
      cover: response.cover,
      status: response.status,
    };
  }
}
