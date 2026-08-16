import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { useBlogPosts } from './useBlogPosts';
import { postsService } from '../../../services/postsService';
import type { PostMetadata } from '../../../entities/post/types';

vi.mock('../../../services/postsService', () => ({
  postsService: {
    getAllPosts: vi.fn(),
    getAllTags: vi.fn(),
    getPostBySlug: vi.fn(),
  },
}));

const mockedPostsService = vi.mocked(postsService);

const posts: PostMetadata[] = [
  { id: '1', title: 'Post Antigo', date: '2024-01-01', tags: ['A'], readingTime: 3, slug: 'post-antigo' },
  { id: '2', title: 'Post Novo', date: '2024-06-01', tags: ['A', 'B'], readingTime: 5, slug: 'post-novo' },
];

describe('useBlogPosts', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('loads posts sorted newest-first and exposes the tag list', async () => {
    mockedPostsService.getAllPosts.mockResolvedValue(posts);
    mockedPostsService.getAllTags.mockResolvedValue(['A', 'B']);

    const { result } = renderHook(() => useBlogPosts());
    expect(result.current.isLoading).toBe(true);

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.posts.map((p) => p.id)).toEqual(['2', '1']);
    expect(result.current.tags).toEqual(['A', 'B']);
    expect(result.current.error).toBeNull();
  });

  it('toggling a tag filters posts, and toggling the same tag again clears the filter', async () => {
    mockedPostsService.getAllPosts.mockResolvedValue(posts);
    mockedPostsService.getAllTags.mockResolvedValue(['A', 'B']);

    const { result } = renderHook(() => useBlogPosts());
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    act(() => result.current.toggleTag('B'));
    expect(result.current.selectedTag).toBe('B');
    expect(result.current.posts.map((p) => p.id)).toEqual(['2']);

    act(() => result.current.toggleTag('B'));
    expect(result.current.selectedTag).toBeNull();
    expect(result.current.posts.map((p) => p.id)).toEqual(['2', '1']);
  });

  it('clearTag resets the filter regardless of which tag was selected', async () => {
    mockedPostsService.getAllPosts.mockResolvedValue(posts);
    mockedPostsService.getAllTags.mockResolvedValue(['A', 'B']);

    const { result } = renderHook(() => useBlogPosts());
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    act(() => result.current.toggleTag('B'));
    act(() => result.current.clearTag());

    expect(result.current.selectedTag).toBeNull();
    expect(result.current.posts).toHaveLength(2);
  });

  it('exposes a user-facing error message when loading fails', async () => {
    mockedPostsService.getAllPosts.mockRejectedValue(new Error('network down'));
    mockedPostsService.getAllTags.mockResolvedValue([]);

    const { result } = renderHook(() => useBlogPosts());
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.error).toBe('Não foi possível carregar os posts. Tente novamente mais tarde.');
    expect(result.current.posts).toEqual([]);
  });
});
