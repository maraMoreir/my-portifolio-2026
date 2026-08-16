import { env } from '../config/env';
import type { Post, PostMetadata } from '../entities/post/types';
import * as mockService from './blogService';
import * as apiService from './postsApiService';

interface PublicPostsService {
  getAllPosts: () => Promise<PostMetadata[]>;
  getPostBySlug: (slug: string) => Promise<Post | null>;
  getAllTags: () => Promise<string[]>;
}

/**
 * The single swap point between the mock blog data and the real .NET API.
 * Components/hooks depend only on this interface, never on `blogService`
 * or `postsApiService` directly — see features/blog/hooks/useBlogPosts.ts
 * and pages/PostPage.tsx.
 *
 * Switches automatically once VITE_API_BASE_URL is configured (env.hasApi);
 * until then the site keeps working on the bundled mock posts, per the
 * gradual-migration plan — mocks aren't removed until the API is actually
 * deployed somewhere the frontend can reach.
 */
export const postsService: PublicPostsService = env.hasApi ? apiService : mockService;
