import { CreatePost, GetPost, Image } from "./../services/interfaces";
import { usePostStore } from "../store/postStore";
import { storeToRefs } from "pinia";
import { Post, UpdatePost } from "../services/interfaces";
import { filterPostOptions, PostFields } from "@/services/types";

// controllers
import ErrorController from "./errorController";

// services
import PostService from "../services/postService";

export default class PostController {
  private postStore = usePostStore();
  private postRefs = storeToRefs(this.postStore);
  private postService = new PostService();
  private errorController = new ErrorController();

  async loadPosts(params: {
    date: string;
    filter?: filterPostOptions;
    fields?: PostFields[];
  }) {
    const { date, filter, fields } = params;
    try {
      const posts = await this.postService.getPostsServer({
        date,
        filter,
        fields,
      });

      this.postStore.setPosts({ posts });
    } catch (error: unknown) {
      return this.errorController.handleError({ error });
    }
  }

  async loadDates(params: { status?: filterPostOptions }) {
    const { status } = params;

    try {
      const dates = await this.postService.getPostsDates({ status });

      this.postStore.updateDates({ dates });
    } catch (error: unknown) {
      return this.errorController.handleError({ error });
    }
  }

  async loadPost(params: { id: number | string; fields?: PostFields[] }) {
    const { id, fields } = params;

    try {
      const post = await this.postService.getPost({
        id,
        fields,
      });
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
      await this.postService.deletePost({ id });
    } catch (error) {
      return this.errorController.handleError({ error });
    }
  }

  async searchPosts(params: {
    search: string;
  }): Promise<void | { id: string; title: string }[]> {
    const search = params.search;

    try {
      const result = await this.postService.searchPosts({
        search,
      });

      return result;
    } catch (error: unknown) {
      return this.errorController.handleError({ error });
    }
  }

  async updatePost(params: { post: UpdatePost }): Promise<void> {
    const { id, title, content, coverId, images, imagesRemoved, status } =
      params.post;
    const post = {
      id: id!,
      title,
      content,
      coverId: coverId!,
      images: images,
      imagesRemoved: imagesRemoved,
      status,
    };

    try {
      await this.postService.updatePost({
        post,
      });

      // this.postStore.updatePost({
      //   id,
      //   title,
      //   content,
      //   cover: {
      //     id: cover.newCoverId,
      //   },
      //   status: "active",
      // });
    } catch (error: unknown) {
      return this.errorController.handleError({ error });
    }
  }

  async updateCover(params: {
    image: File;
  }): Promise<{ id: string; path: string; name: string } | void> {
    try {
      const { image } = params;
      const { id, path, name } = await this.postService.uploadImage({
        image,
        type: "post",
      });
      return { id, path, name };
    } catch (error: unknown) {
      return this.errorController.handleError({ error });
    }
  }

  async createPost(params: CreatePost) {
    try {
      const { title, content, coverId, images, status } = params;
      const post = {
        title,
        content,
        coverId,
        images,
        status,
      };
      await this.postService.createPost(post);
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
      const { id, url, name } = await this.postService.uploadImage({
        image,
        type,
      });
      return { id, url, name };
    } catch (error: unknown) {
      return this.errorController.handleError({ error });
    }
  }
}
