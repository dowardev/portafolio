import { Post, DeletePost, CreatePost, GetPost } from "./interfaces";

import { errorBuilder } from "@/utils/errors";
import axios from "axios";
import { getUserToken } from "./user";

interface UpdatePost {
  id: string;
  title: string;
  content: string;
  coverId: string;
  newCoverId: string;
  images: string[];
  imagesRemoved: string[];
}

export async function createPost(params: CreatePost): Promise<void> {
  const { title, content, coverId, images } = params;

  await axios.request({
    url: `http://127.0.0.1:8000/api/create-post/`,
    method: "POST",
    headers: {
      accept: "application/json",
      Authorization: getUserToken(),
    },
    data: {
      title,
      content,
      coverId,
      images,
    },
  });
}

export async function updatePost(params: { post: UpdatePost }): Promise<void> {
  const { images, coverId, content, title, id, newCoverId, imagesRemoved } =
    params.post;

  await axios.request({
    url: `http://127.0.0.1:8000/api/update-post`,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: getUserToken(),
    },
    params: {
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

export async function deletePost(params: { id: string }): Promise<void> {
  const { id } = params;

  await axios.request({
    url: `http://127.0.0.1:8000/api/delete-post`,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: getUserToken(),
    },
    params: {
      id,
    },
  });
}

export async function getPosts(params: GetPost): Promise<Array<Post>> {
  const { date, filter = "active" } = params;

  const response = await axios.request({
    url: `http://127.0.0.1:8000/api/posts/${date}/${filter}`,
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: getUserToken(),
    },
  });

  const posts = await Promise.all(
    response.data.posts.map(async (post) => {
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

export async function getPost(params: { id: number | string }): Promise<Post> {
  const { id } = params;

  const response = await axios.request({
    url: `http://127.0.0.1:8000/api/post/${id}`,
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: getUserToken(),
    },
  });

  const post = response.data.post;

  post.createdAt = post.created_at;
  delete post.created_at;

  post.updatedAt = post.updated_at;
  delete post.updated_at;

  return post;
}

export async function getPostsDates(): Promise<Array<string>> {
  try {
    const response = await axios.request({
      url: "http://127.0.0.1:8000/api/post-dates",
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: getUserToken(),
      },
    });

    return response.data;
  } catch (error: any) {
    throw error;
  }
}

export async function searchPosts(params: {
  search: string;
}): Promise<Array<{ id: string; title: string }>> {
  const { search } = params;

  const response = await axios.request({
    url: `http://127.0.0.1:8000/api/search-posts/${search}`,
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: getUserToken(),
    },
  });

  return response.data.posts;
}

export async function uploadImage(params: {
  image: File;
  type: string;
}): Promise<{ id: string; path: string }> {
  const { image, type } = params;

  const formData = new FormData();
  formData.append("file", image);
  formData.append("type", type);

  const response = await axios.request({
    url: `http://127.0.0.1:8000/api/upload-image`,
    method: "POST",
    headers: {
      contentType: "multipart/form-data",
      Authorization: getUserToken(),
    },
    data: formData,
  });

  return { id: response.data.image.id, path: response.data.image.path };
}
