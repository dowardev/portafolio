import {
  CreatePost,
  GetPost,
  Image,
  PostServerResponse,
} from "../utils/interfaces";
import { usePostStore } from "../store/postStore";
import { storeToRefs } from "pinia";
import { Post, UpdatePost } from "../utils/interfaces";
import { filterPostOptions, PostFields } from "@/services/types";
import { apiConnector } from "@/main";

// controllers
import ErrorController from "./errorController";

// services
// import PostService from "../services/postService";

export default class PostController {
  private postStore = usePostStore();
  private postRefs = storeToRefs(this.postStore);
  private errorController = new ErrorController();

  async loadPosts(params: {
    date: string;
    filter?: filterPostOptions;
    fields?: PostFields[];
  }) {
    const { date, filter, fields } = params;
    try {
      const serverResponse = await apiConnector.get({
        url: `posts/${date}/${filter}`,
        data: { fields },
      });
      const responseData = serverResponse as { posts: PostServerResponse[] };

      const posts = await Promise.all(
        responseData.posts.map(async (post: PostServerResponse) => {
          return this.formatPostResponse({ response: post });
        }),
      );

      this.postStore.setPosts({ posts });
    } catch (error: unknown) {
      return this.errorController.handleError({ error });
    }
  }

  async loadDates(params: { status?: filterPostOptions }) {
    const { status } = params;

    try {
      const dates = await apiConnector.get({
        url: `post-dates`,
        data: { status },
      });

      this.postStore.updateDates({ dates });
    } catch (error: unknown) {
      return this.errorController.handleError({ error });
    }
  }

  async loadPost(params: { id: number | string; fields?: PostFields[] }) {
    const { id, fields } = params;

    try {
      const serverResponse = (await apiConnector.get({
        url: `post/${id}`,
        data: { fields },
      })) as PostServerResponse;
      const post = this.formatPostResponse({ response: serverResponse.post });

      this.postStore.addPost({ post });
    } catch (error: unknown) {
      return this.errorController.handleError({ error });
    }
  }

  getPost(params: { id: number }): void | Post {
    try {
      const id = params.id;
      const post = this.postStore.getPost({ id });
      return post ? post : undefined;
    } catch (error: unknown) {
      return this.errorController.handleError({ error });
    }
  }

  getPosts(): Post[] | void {
    try {
      const posts = this.postStore.getPosts();
      return posts ? posts : undefined;
    } catch (error: unknown) {
      return this.errorController.handleError({ error });
    }
  }

  getDates(): Array<string> | undefined {
    return this.postRefs.dates ? this.postRefs.dates.value : undefined;
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
      await apiConnector.post({ url: `delete-post`, data: { id } });
    } catch (error) {
      return this.errorController.handleError({ error });
    }
  }

  async searchPosts(params: {
    search: string;
  }): Promise<void | { id: string; title: string }[]> {
    const search = params.search;

    try {
      // const result = await this.postService.searchPosts({
      //   search,
      // });
      //
      // return result;
      return [];
    } catch (error: unknown) {
      return this.errorController.handleError({ error });
    }
  }

  async updatePost(params: { post: UpdatePost }): Promise<void> {
    const { id, title, content, coverId, images, imagesRemoved, status } =
      params.post;

    try {
      await apiConnector.post({
        url: `update-post`,
        data: {
          images,
          coverId,
          content,
          title,
          id,
          imagesRemoved,
          status,
        },
      });
    } catch (error: unknown) {
      return this.errorController.handleError({ error });
    }
  }

  async updateCover(params: {
    image: File;
  }): Promise<{ id: string; path: string; name: string } | void> {
    try {
      const { image } = params;
      const formData = new FormData();
      formData.append("file", image);
      formData.append("type", "post");

      const serverResponse = await apiConnector.post({
        url: `upload-image`,
        data: formData,
        contentType: "multipart/form-data",
      });

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

      await apiConnector.post({
        url: `create-post`,
        data: { title, content, coverId, images, status },
      });
    } catch (error: unknown) {
      return this.errorController.handleError({ error });
    }
  }

  async uploadImage(params: {
    image: File;
    type: string;
  }): Promise<Image | void> {
    const { image, type } = params;
    try {
      const formData = new FormData();
      formData.append("file", image);
      formData.append("type", type);

      const serverResponse = await apiConnector.post({
        url: `upload-image`,
        data: formData,
        contentType: "multipart/form-data",
      });

      const id = serverResponse.data.image.id;
      const url = serverResponse.data.image.url;
      const name = serverResponse.data;

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
      title: response.title,
      content: response.content,
      createdAt: response.created_at,
      updatedAt: response.updated_at,
      cover: response.cover,
      status: response.status,
    };
  }
}
