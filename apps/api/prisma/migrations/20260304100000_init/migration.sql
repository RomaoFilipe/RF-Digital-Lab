CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TYPE "ContentType" AS ENUM ('VIDEO', 'IMAGE', 'EDITING', 'DEV', 'THREE_D', 'ARTICLE', 'PUBLICATION', 'OTHER');
CREATE TYPE "ContentStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');
CREATE TYPE "MediaKind" AS ENUM ('IMAGE', 'VIDEO', 'FILE');

CREATE TABLE "AdminUser" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastLoginAt" TIMESTAMP(3),
    CONSTRAINT "AdminUser_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "MediaAsset" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "kind" "MediaKind" NOT NULL,
    "path" TEXT NOT NULL,
    "originalName" TEXT NOT NULL,
    "mime" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "width" INTEGER,
    "height" INTEGER,
    "duration" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "MediaAsset_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ContentItem" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "type" "ContentType" NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "summary" TEXT,
    "content" TEXT,
    "status" "ContentStatus" NOT NULL DEFAULT 'DRAFT',
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "year" INTEGER,
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "seoKeywords" TEXT,
    "coverMediaId" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "publishedAt" TIMESTAMP(3),
    CONSTRAINT "ContentItem_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ContentMedia" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "contentId" UUID NOT NULL,
    "mediaId" UUID NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "ContentMedia_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Tag" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ContentTag" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "contentId" UUID NOT NULL,
    "tagId" UUID NOT NULL,
    CONSTRAINT "ContentTag_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "VideoDetails" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "contentId" UUID NOT NULL,
    "youtubeUrl" TEXT,
    "vimeoUrl" TEXT,
    "duration" INTEGER,
    "role" TEXT,
    CONSTRAINT "VideoDetails_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "DevDetails" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "contentId" UUID NOT NULL,
    "repoUrl" TEXT,
    "liveUrl" TEXT,
    "stack" TEXT,
    "highlights" TEXT,
    CONSTRAINT "DevDetails_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ThreeDDetails" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "contentId" UUID NOT NULL,
    "software" TEXT,
    "engine" TEXT,
    "renderUrl" TEXT,
    CONSTRAINT "ThreeDDetails_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ArticleDetails" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "contentId" UUID NOT NULL,
    "readingTime" INTEGER,
    "canonicalUrl" TEXT,
    CONSTRAINT "ArticleDetails_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "PublicationDetails" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "contentId" UUID NOT NULL,
    "platform" TEXT,
    "postUrl" TEXT,
    CONSTRAINT "PublicationDetails_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "SiteSettings" (
    "id" SERIAL NOT NULL,
    "siteTitle" TEXT NOT NULL DEFAULT 'Meu Portfolio',
    "heroTitle" TEXT,
    "heroSubtitle" TEXT,
    "contactEmail" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "SiteSettings_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "AdminUser_email_key" ON "AdminUser"("email");
CREATE UNIQUE INDEX "ContentItem_slug_key" ON "ContentItem"("slug");
CREATE UNIQUE INDEX "Tag_slug_key" ON "Tag"("slug");
CREATE UNIQUE INDEX "ContentMedia_contentId_mediaId_key" ON "ContentMedia"("contentId", "mediaId");
CREATE UNIQUE INDEX "ContentTag_contentId_tagId_key" ON "ContentTag"("contentId", "tagId");
CREATE UNIQUE INDEX "VideoDetails_contentId_key" ON "VideoDetails"("contentId");
CREATE UNIQUE INDEX "DevDetails_contentId_key" ON "DevDetails"("contentId");
CREATE UNIQUE INDEX "ThreeDDetails_contentId_key" ON "ThreeDDetails"("contentId");
CREATE UNIQUE INDEX "ArticleDetails_contentId_key" ON "ArticleDetails"("contentId");
CREATE UNIQUE INDEX "PublicationDetails_contentId_key" ON "PublicationDetails"("contentId");

CREATE INDEX "ContentMedia_contentId_idx" ON "ContentMedia"("contentId");
CREATE INDEX "ContentMedia_mediaId_idx" ON "ContentMedia"("mediaId");
CREATE INDEX "ContentTag_tagId_idx" ON "ContentTag"("tagId");

ALTER TABLE "ContentItem" ADD CONSTRAINT "ContentItem_coverMediaId_fkey" FOREIGN KEY ("coverMediaId") REFERENCES "MediaAsset"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "ContentMedia" ADD CONSTRAINT "ContentMedia_contentId_fkey" FOREIGN KEY ("contentId") REFERENCES "ContentItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ContentMedia" ADD CONSTRAINT "ContentMedia_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "MediaAsset"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "ContentTag" ADD CONSTRAINT "ContentTag_contentId_fkey" FOREIGN KEY ("contentId") REFERENCES "ContentItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ContentTag" ADD CONSTRAINT "ContentTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "VideoDetails" ADD CONSTRAINT "VideoDetails_contentId_fkey" FOREIGN KEY ("contentId") REFERENCES "ContentItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "DevDetails" ADD CONSTRAINT "DevDetails_contentId_fkey" FOREIGN KEY ("contentId") REFERENCES "ContentItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ThreeDDetails" ADD CONSTRAINT "ThreeDDetails_contentId_fkey" FOREIGN KEY ("contentId") REFERENCES "ContentItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ArticleDetails" ADD CONSTRAINT "ArticleDetails_contentId_fkey" FOREIGN KEY ("contentId") REFERENCES "ContentItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "PublicationDetails" ADD CONSTRAINT "PublicationDetails_contentId_fkey" FOREIGN KEY ("contentId") REFERENCES "ContentItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
