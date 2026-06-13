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

  async loadPosts(params: {
    date: string;
    filter?: filterPostOptions;
    fields?: PostFields[];
  }) {
    const { date, filter, fields } = params;
    try {
      const serverResponse = await getApiConnector().get(
        `posts/${date}/${filter}`,
        { params: { fields } },
      );
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
      const response = await getApiConnector().get<string[]>(
        "post-dates",
        { params: { status } },
      );

      this.postStore.updateDates({ dates: response });
    } catch (error: unknown) {
      return this.errorController.handleError({ error });
    }
  }

  async loadPost(params: { id: number | string; fields?: PostFields[] }) {
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

  getPost(params: { id: number }): Post | undefined {
    try {
      const id = params.id;
      const post = this.postStore.getPost({ id: id.toString() });
      return post ? post : undefined;
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
      await getApiConnector().post("delete-post", { id });
    } catch (error) {
      return this.errorController.handleError({ error });
    }
  }

  async searchPosts(params: {
    search: string;
  }): Promise<{ id: string; title: string }[]> {
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
      title: response.title,
      content: response.content,
      createdAt: response.created_at,
      updatedAt: response.updated_at,
      cover: response.cover,
      status: response.status,
    };
  }
}
