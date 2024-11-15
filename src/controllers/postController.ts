import { CreatePost, GetPost } from "./../services/interfaces";
import { usePostStore } from "../store/postStore";
import { storeToRefs } from "pinia";
import { Post, UpdatePost } from "../services/interfaces";
import { filterPostOptions } from "@/services/types";

// services
import PostService from "../services/postService";

export default class PostController {
  postStore = usePostStore();
  postRefs = storeToRefs(this.postStore);
  postService = new PostService();

  async loadPosts(params: { date: string; filter?: filterPostOptions }) {
    const { date, filter } = params;
    try {
      const posts = await this.postService.getPosts({ date, filter });

      this.postStore.setPosts({ posts });
    } catch (e: any) {
      // this.openToastError(e);
      throw e;
    }
  }

  async loadDates(params: { status?: filterPostOptions }) {
    const { status } = params;

    try {
      const dates = await this.postService.getPostsDates({ status });

      this.postStore.updateDates(dates);
    } catch (e: any) {
      // this.openToastError(e);
      throw e;
    }
  }

  async loadPost(params: { id: number | string }) {
    const id = params.id;

    try {
      const post = await this.postService.getPost({
        id,
      });
      this.postStore.addPost({ post });
    } catch (e: any) {
      // this.openToastError(e);
      throw e;
    }
  }

  getPost(params: { id: string }): Post | undefined {
    const id = params.id;
    const post = this.postStore.getPost({ id });
    return post ? post : undefined;
  }

  getPosts(): Post[] | undefined {
    const posts = this.postStore.getPosts();
    return posts ? posts : undefined;
  }

  getDates(): Array<string> | undefined {
    return this.postRefs.dates ? this.postRefs.dates.value : undefined;
  }

  getCurrentPage(): string | undefined {
    return this.postRefs.currentPage.value
      ? this.postRefs.currentPage.value
      : undefined;
  }

  updateCurrentPage(params: { currentPage: string }) {
    this.postStore.updateCurrentPage({ currentPage: params.currentPage });
  }

  async deletePost(params: { id: string }): Promise<void> {
    const id = params.id;

    try {
      await this.postService.deletePost({ id });
    } catch (error) {
      throw error;
    }
  }

  async searchPosts(params: {
    search: string;
  }): Promise<Array<{ id: string; title: string }>> {
    const search = params.search;

    try {
      const result = await this.postService.searchPosts({
        search,
      });

      return result;
    } catch (e: any) {
      // this.openToastError(e);
      throw e;
    }
  }

  async updatePost(params: { post: UpdatePost }): Promise<void> {
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
      await this.postService.updatePost({
        post,
      });

      this.postStore.updatePost({
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

  async updateCover(params: {
    image: File;
  }): Promise<{ id: string; path: string }> {
    const { image } = params;
    const { id, path } = await this.postService.uploadImage({
      image,
      type: "post",
    });
    return { id, path };
  }

  async createPost(params: CreatePost) {
    try {
      const { title, content, coverId, images } = params;
      const post = {
        title,
        content,
        coverId,
        images,
      };
      await this.postService.createPost(post);
    } catch (error: any) {
      throw new Error(error);
    }
  }
  async uploadImage(params: {
    image: File;
    type: string;
  }): Promise<{ id: string; path: string; name }> {
    const { image, type } = params;
    try {
      const { id, path, name } = await this.postService.uploadImage({
        image,
        type,
      });
      return { id, path, name };
    } catch (error: any) {
      throw new Error(error);
    }
  }
}
