import { describe, it, expect, vi, beforeEach } from "vitest";
import PostController from "./postController";

vi.mock("@/store/postStore", () => ({
  usePostStore: () => mockPostStore,
}));

vi.mock("@/apiConnector", () => ({
  getApiConnector: () => mockApi,
}));

vi.mock("@/controllers/errorController", () => ({
  default: class { handleError() {} },
}));

const mockPostStore = {
  getCachedPosts: vi.fn(() => null),
  setCachedPosts: vi.fn(),
  setPosts: vi.fn(),
  getPost: vi.fn(() => undefined),
  addPost: vi.fn(),
  getPosts: vi.fn(() => undefined),
  clearCache: vi.fn(),
  updateDates: vi.fn(),
  updateCurrentPage: vi.fn(),
};

const mockApi = {
  get: vi.fn(),
  post: vi.fn(),
};

describe("PostController cache key", () => {
  let controller: PostController;

  beforeEach(() => {
    vi.clearAllMocks();
    controller = new PostController();
  });

  it("includes fields in cache key when fields are provided", async () => {
    mockApi.get.mockResolvedValue({ posts: [] });

    await controller.loadPosts({
      date: "2026-08",
      filter: "active",
      fields: ["id", "slug", "title"],
    });

    // First call — should fetch and cache
    expect(mockPostStore.setCachedPosts).toHaveBeenCalledTimes(1);
    const cacheKey = mockPostStore.setCachedPosts.mock.calls[0][0].key;
    expect(cacheKey).toContain("id,slug,title");
  });

  it("creates separate cache entries for different field sets", async () => {
    mockApi.get.mockResolvedValue({ posts: [] });

    await controller.loadPosts({
      date: "2026-08",
      filter: "active",
      fields: ["id", "slug", "title"],
    });

    await controller.loadPosts({
      date: "2026-08",
      filter: "active",
      fields: ["id", "title", "cover"],
    });

    expect(mockPostStore.setCachedPosts).toHaveBeenCalledTimes(2);
    const key1 = mockPostStore.setCachedPosts.mock.calls[0][0].key;
    const key2 = mockPostStore.setCachedPosts.mock.calls[1][0].key;
    expect(key1).not.toBe(key2);
  });
});
