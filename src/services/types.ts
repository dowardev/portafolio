export type Theme = "light" | "nord" | "gruvbox";

export type StatusPost = "active" | "inactive" | "draft";

export type filterPostOptions = "all" | "active" | "inactive" | "draft";

export type PostFields =
  | "id"
  | "title"
  | "content"
  | "created_at"
  | "updated_at"
  | "cover";
