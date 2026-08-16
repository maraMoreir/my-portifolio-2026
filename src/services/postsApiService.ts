import { apiFetch, ApiError } from './http/httpClient';
import type {
  Post,
  PostMetadata,
  AdminPost,
  AdminPostSummary,
  PostInput,
  PostStatus,
} from '../entities/post/types';

/** Shape returned by the .NET API — kept private to this file so the rest of the app only ever sees the frontend's own Post/AdminPost types. */
interface BackendPostSummary {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  tags: string[];
  readingTimeMinutes: number;
  status: string;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

interface BackendPost extends BackendPostSummary {
  contentMarkdown: string;
}

const toPostMetadata = (dto: BackendPostSummary): PostMetadata => ({
  id: dto.id,
  title: dto.title,
  date: dto.publishedAt ?? dto.createdAt,
  tags: dto.tags,
  readingTime: dto.readingTimeMinutes,
  slug: dto.slug,
  excerpt: dto.excerpt ?? undefined,
});

const toPost = (dto: BackendPost): Post => ({
  ...toPostMetadata(dto),
  content: dto.contentMarkdown,
});

const toAdminSummary = (dto: BackendPostSummary): AdminPostSummary => ({
  id: dto.id,
  title: dto.title,
  slug: dto.slug,
  excerpt: dto.excerpt ?? undefined,
  tags: dto.tags,
  readingTime: dto.readingTimeMinutes,
  status: dto.status as PostStatus,
  publishedAt: dto.publishedAt,
  createdAt: dto.createdAt,
  updatedAt: dto.updatedAt,
});

const toAdminPost = (dto: BackendPost): AdminPost => ({
  ...toAdminSummary(dto),
  content: dto.contentMarkdown,
});

const toRequestBody = (input: PostInput) => ({
  title: input.title,
  contentMarkdown: input.content,
  excerpt: input.excerpt,
  tags: input.tags,
});

// --- Public (same signatures as services/blogService.ts's mock) ---

export const getAllPosts = async (): Promise<PostMetadata[]> =>
  (await apiFetch<BackendPostSummary[]>('/posts', { skipAuth: true })).map(toPostMetadata);

export const getPostBySlug = async (slug: string): Promise<Post | null> => {
  try {
    return toPost(await apiFetch<BackendPost>(`/posts/${encodeURIComponent(slug)}`, { skipAuth: true }));
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return null;
    }
    throw error;
  }
};

export const getAllTags = async (): Promise<string[]> =>
  apiFetch<string[]>('/posts/tags', { skipAuth: true });

// --- Admin (requires an authenticated Admin session; no mock equivalent) ---

export const getAllPostsAdmin = async (): Promise<AdminPostSummary[]> =>
  (await apiFetch<BackendPostSummary[]>('/admin/posts')).map(toAdminSummary);

export const getPostByIdAdmin = async (id: string): Promise<AdminPost> =>
  toAdminPost(await apiFetch<BackendPost>(`/admin/posts/${id}`));

export const createPost = async (input: PostInput): Promise<AdminPost> =>
  toAdminPost(
    await apiFetch<BackendPost>('/admin/posts', {
      method: 'POST',
      body: JSON.stringify(toRequestBody(input)),
    }),
  );

export const updatePost = async (id: string, input: PostInput): Promise<AdminPost> =>
  toAdminPost(
    await apiFetch<BackendPost>(`/admin/posts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(toRequestBody(input)),
    }),
  );

export const deletePost = async (id: string): Promise<void> =>
  apiFetch<void>(`/admin/posts/${id}`, { method: 'DELETE' });

export const publishPost = async (id: string): Promise<AdminPost> =>
  toAdminPost(await apiFetch<BackendPost>(`/admin/posts/${id}/publish`, { method: 'POST' }));

export const unpublishPost = async (id: string): Promise<AdminPost> =>
  toAdminPost(await apiFetch<BackendPost>(`/admin/posts/${id}/unpublish`, { method: 'POST' }));
