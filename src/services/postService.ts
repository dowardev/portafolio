import { Post, CreatePost, GetPost, GetPostsServer } from "./interfaces";
import { apiConnector } from "@/main";

import { filterPostOptions, PostFields } from "./types";

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

    await apiConnector.post({
      url: `create-post/`,
      data: { title, content, coverId, images },
    });
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

  async getPostsServer(params: GetPostsServer): Promise<Array<Post>> {
    const { date, filter = "active", fields = {} } = params;

    const response = await apiConnector.get({
      url: `posts/${date}/${filter}`,
      data: { fields },
    });

    const posts = await Promise.all(
      response.posts.map(async (post: any) => {
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

  async getPost(params: {
    id: number | string;
    fields?: PostFields[];
  }): Promise<Post> {
    const { id, fields } = params;

    const response = await apiConnector.get({
      url: `post/${id}`,
      data: { fields },
    });

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
  }): Promise<{ id: string; path: string; name: string }> {
    const { image, type } = params;

    const formData = new FormData();
    formData.append("file", image);
    formData.append("type", type);

    const response = await apiConnector.post({
      url: `upload-image`,
      data: formData,
      contentType: "multipart/form-data",
    });

    return {
      id: response.data.image.id,
      path: response.data.image.path,
      name: response.data.image.name,
    };
  }
}
