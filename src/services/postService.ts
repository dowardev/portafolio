import {
  Post,
  CreatePost,
  GetPostsServer,
  ImageServer,
  PostServerResponse,
} from "./interfaces";
import { apiConnector } from "@/main";

import { filterPostOptions, PostFields } from "./types";

interface UpdatePost {
  id: number;
  title: string;
  content: string;
  coverId: number;
  images: string[];
  imagesRemoved: string[];
  status: string;
}

export default class PostService {
  async createPost(params: CreatePost): Promise<void> {
    const { title, content, coverId, images, status } = params;

    await apiConnector.post({
      url: `create-post`,
      data: { title, content, coverId, images, status },
    });
  }

  async updatePost(params: { post: UpdatePost }): Promise<void> {
    const { images, coverId, content, title, id, imagesRemoved, status } =
      params.post;

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

    const responseData = response as { posts: PostServerResponse[] };

    return await Promise.all(
      responseData.posts.map(async (post: PostServerResponse) => {
        return this.formatPostResponse({ response: post });
      }),
    );
  }

  async getPost(params: {
    id: number | string;
    fields?: PostFields[];
  }): Promise<Post> {
    const { id, fields } = params;

    const response = (await apiConnector.get({
      url: `post/${id}`,
      data: { fields },
    })) as PostServerResponse;

    const post = response.post;

    return this.formatPostResponse({ response: post });
  }

  async getPostsDates(params: {
    status?: filterPostOptions;
  }): Promise<Array<string>> {
    const { status } = params;

    return await apiConnector.get({
      url: `post-dates`,
      data: { status },
    });
  }

  // TODO: Fix
  async searchPosts(params: {
    search: string;
  }): Promise<Array<{ id: string; title: string }>> {
    const { search } = params;

    // const response = await apiConnector.get({ url: `search-posts/${search}` });
    //
    // return response.posts;
  }

  async uploadImage(params: {
    image: File;
    type: string;
  }): Promise<ImageServer> {
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
      url: response.data.image.url,
      name: response.data.image.name,
    };
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
