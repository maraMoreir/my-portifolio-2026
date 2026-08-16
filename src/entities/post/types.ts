export interface Post {
  id: string;
  title: string;
  date: string;
  tags: string[];
  readingTime: number;
  content: string;
  slug: string;
  excerpt?: string;
}

export interface PostMetadata {
  id: string;
  title: string;
  date: string;
  tags: string[];
  readingTime: number;
  slug: string;
  excerpt?: string;
}

// --- Admin-only contract ---
// The public Post/PostMetadata above stay minimal on purpose (they mirror
// what the public blog UI needs). The admin panel legitimately needs more
// (draft/published status, timestamps), so that lives in its own type
// instead of growing the public contract for every reader of the site.

export type PostStatus = 'Draft' | 'Published';

export interface AdminPostSummary {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  tags: string[];
  readingTime: number;
  status: PostStatus;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AdminPost extends AdminPostSummary {
  content: string;
}

export interface PostInput {
  title: string;
  content: string;
  excerpt?: string;
  tags: string[];
}
