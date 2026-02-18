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
