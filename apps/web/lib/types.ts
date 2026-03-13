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
  role?: string | null;
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

export type ThreeDDetails = {
  software?: string | null;
  engine?: string | null;
  renderUrl?: string | null;
};

export type PublicationDetails = {
  platform?: string | null;
  postUrl?: string | null;
};

export type ShowcaseItem = {
  name: string;
  slug?: string | null;
  icon?: string | null;
};

export type ShowcaseFeature = {
  name: string;
  icon?: string | null;
  description?: string | null;
};

export type ShowcaseArchitectureNode = {
  layer: string;
  value: string;
  notes?: string | null;
};

export type ShowcaseStat = {
  label: string;
  value: string;
  unit?: string | null;
  source?: string | null;
};

export type ShowcaseLink = {
  label: string;
  url: string;
};

export type VideoProvider = 'YOUTUBE' | 'VIMEO' | 'LOCAL' | 'NONE';

export type ProjectShowcase = {
  technologies?: ShowcaseItem[] | null;
  tools?: ShowcaseItem[] | null;
  software?: ShowcaseItem[] | null;
  features?: ShowcaseFeature[] | null;
  architecture?: ShowcaseArchitectureNode[] | null;
  stats?: ShowcaseStat[] | null;
  links?: ShowcaseLink[] | null;
  challenges?: string[] | null;
  learnings?: string[] | null;
  techSlugs?: string[];
  demoUrl?: string | null;
  videoUrl?: string | null;
  videoProvider?: VideoProvider | null;
  videoAssetId?: string | null;
  videoAsset?: MediaAsset | null;
  views?: number;
  teamSize?: number | null;
  developmentTimeDays?: number | null;
  createdAt?: string;
  updatedAt?: string;
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
  threeDDetails?: ThreeDDetails | null;
  articleDetails?: ArticleDetails | null;
  publicationDetails?: PublicationDetails | null;
  showcase?: ProjectShowcase | null;
  gallery?: { media: MediaAsset }[];
};

export type Paginated<T> = {
  items: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};
