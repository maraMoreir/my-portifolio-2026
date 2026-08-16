import { useCallback, useEffect, useMemo, useState } from 'react';
import type { PostMetadata } from '../../../entities/post/types';
import { getAllPosts, getAllTags } from '../../../services/blogService';

interface UseBlogPostsResult {
  /** Posts already sorted (newest first) and filtered by the selected tag. */
  posts: PostMetadata[];
  tags: string[];
  selectedTag: string | null;
  /** Selects a tag, or clears the filter if the same tag is clicked again. */
  toggleTag: (tag: string) => void;
  clearTag: () => void;
  isLoading: boolean;
  error: string | null;
}

/**
 * Loads and filters blog posts for the public listing.
 * Owns all data-fetching/state concerns so `Blog.tsx` only renders.
 * Talks to `blogService` today (mock); swapping it for the .NET API later
 * requires no change in this hook's consumers.
 */
export const useBlogPosts = (): UseBlogPostsResult => {
  const [allPosts, setAllPosts] = useState<PostMetadata[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadPosts = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const [postsData, tagsData] = await Promise.all([
          getAllPosts(),
          getAllTags(),
        ]);
        if (cancelled) return;

        const sorted = [...postsData].sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
        );
        setAllPosts(sorted);
        setTags(tagsData);
      } catch (err) {
        if (cancelled) return;
        console.error('Failed to load posts:', err);
        setError('Não foi possível carregar os posts. Tente novamente mais tarde.');
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    loadPosts();
    return () => {
      cancelled = true;
    };
  }, []);

  const posts = useMemo(
    () =>
      selectedTag
        ? allPosts.filter((post) => post.tags.includes(selectedTag))
        : allPosts,
    [allPosts, selectedTag],
  );

  const toggleTag = useCallback((tag: string) => {
    setSelectedTag((prev) => (prev === tag ? null : tag));
  }, []);

  const clearTag = useCallback(() => setSelectedTag(null), []);

  return { posts, tags, selectedTag, toggleTag, clearTag, isLoading, error };
};
