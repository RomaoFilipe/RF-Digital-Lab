CREATE TYPE "VideoProvider" AS ENUM ('YOUTUBE', 'VIMEO', 'LOCAL', 'NONE');

CREATE TABLE "ProjectShowcase" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "contentId" UUID NOT NULL,
    "technologies" JSONB,
    "tools" JSONB,
    "software" JSONB,
    "features" JSONB,
    "architecture" JSONB,
    "stats" JSONB,
    "links" JSONB,
    "challenges" JSONB,
    "learnings" JSONB,
    "techSlugs" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "demoUrl" TEXT,
    "videoUrl" TEXT,
    "videoProvider" "VideoProvider" NOT NULL DEFAULT 'NONE',
    "videoAssetId" UUID,
    "views" INTEGER NOT NULL DEFAULT 0,
    "teamSize" INTEGER,
    "developmentTimeDays" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ProjectShowcase_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "ProjectShowcase_contentId_key" ON "ProjectShowcase"("contentId");
CREATE INDEX "ProjectShowcase_techSlugs_idx" ON "ProjectShowcase" USING GIN ("techSlugs");

ALTER TABLE "ProjectShowcase"
ADD CONSTRAINT "ProjectShowcase_contentId_fkey"
FOREIGN KEY ("contentId") REFERENCES "ContentItem"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "ProjectShowcase"
ADD CONSTRAINT "ProjectShowcase_videoAssetId_fkey"
FOREIGN KEY ("videoAssetId") REFERENCES "MediaAsset"("id")
ON DELETE SET NULL ON UPDATE CASCADE;
