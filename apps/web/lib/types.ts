export type ContentStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
export type ContentType = 'VIDEO' | 'IMAGE' | 'EDITING' | 'DEV' | 'THREE_D' | 'ARTICLE' | 'PUBLICATION' | 'OTHER';

export type Tag = {
  id: string;
  name: string;
  slug: string;
};

export type MediaAsset = {
  id: string;
  kind: 'IMAGE' | 'VIDEO' | 'FILE';
  path: string;
  originalName: string;
  mime: string;
  size: number;
  width?: number | null;
  height?: number | null;
  duration?: number | null;
  createdAt?: string;
};

export type VideoDetails = {
  youtubeUrl?: string | null;
  vimeoUrl?: string | null;
  duration?: number | null;
};

export type DevDetails = {
  repoUrl?: string | null;
  liveUrl?: string | null;
  stack?: string | null;
  highlights?: string | null;
};

export type ArticleDetails = {
  readingTime?: number | null;
  canonicalUrl?: string | null;
};

export type ContentItem = {
  id: string;
  type: ContentType;
  title: string;
  slug: string;
  summary?: string | null;
  content?: string | null;
  status: ContentStatus;
  featured: boolean;
  year?: number | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  seoKeywords?: string | null;
  coverMedia?: MediaAsset | null;
  tags?: { tag: Tag }[];
  createdAt: string;
  updatedAt: string;
  publishedAt?: string | null;
  videoDetails?: VideoDetails | null;
  devDetails?: DevDetails | null;
  articleDetails?: ArticleDetails | null;
  gallery?: { media: MediaAsset }[];
};

export type Paginated<T> = {
  items: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};
