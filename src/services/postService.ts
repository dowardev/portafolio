import { Post, DeletePost, CreatePost, GetPost } from "./interfaces";
import { apiConnector } from "@/main";

import { filterPostOptions } from "./types";

interface UpdatePost {
  id: string;
  title: string;
  content: string;
  coverId: string;
  newCoverId: string;
  images: string[];
  imagesRemoved: string[];
}

export default class PostService {
  async createPost(params: CreatePost): Promise<void> {
    const { title, content, coverId, images } = params;

    await apiConnector.post({ url: `create-post/` });
  }

  async updatePost(params: { post: UpdatePost }): Promise<void> {
    const { images, coverId, content, title, id, newCoverId, imagesRemoved } =
      params.post;

    await apiConnector.post({
      url: `update-post`,
      data: {
        images,
        coverId,
        content,
        title,
        id,
        newCoverId,
        imagesRemoved,
      },
    });
  }

  async deletePost(params: { id: string }): Promise<void> {
    const { id } = params;

    await apiConnector.post({ url: `delete-post`, data: { id } });
  }

  async getPosts(params: GetPost): Promise<Array<Post>> {
    const { date, filter = "active" } = params;

    const response = await apiConnector.get({ url: `posts/${date}/${filter}` });

    const posts = await Promise.all(
      response.posts.map(async (post) => {
        post.createdAt = post.created_at;
        delete post.created_at;
        post.updatedAt = post.updated_at;
        delete post.updated_at;
        post.cover = post.cover;
        return post;
      })
    );
    return posts;
  }

  async getPost(params: { id: number | string }): Promise<Post> {
    const { id } = params;

    const response = await apiConnector.get({ url: `post/${id}` });

    const post = response.post;

    post.createdAt = post.created_at;
    delete post.created_at;

    post.updatedAt = post.updated_at;
    delete post.updated_at;

    return post;
  }

  async getPostsDates(params: {
    status?: filterPostOptions;
  }): Promise<Array<string>> {
    const { status } = params;

    try {
      const response = await apiConnector.get({
        url: `post-dates`,
        data: { status },
      });

      return response;
    } catch (error: any) {
      throw error;
    }
  }

  async searchPosts(params: {
    search: string;
  }): Promise<Array<{ id: string; title: string }>> {
    const { search } = params;

    const response = await apiConnector.get({ url: `search-posts/${search}` });

    return response.posts;
  }

  async uploadImage(params: {
    image: File;
    type: string;
  }): Promise<{ id: string; path: string; name }> {
    const { image, type } = params;

    const formData = new FormData();
    formData.append("file", image);
    formData.append("type", type);

    const response = await apiConnector.post({
      url: `upload-image`,
      data: formData,
    });

    return {
      id: response.data.image.id,
      path: response.data.image.path,
      name: response.data.image.name,
    };
  }
}
