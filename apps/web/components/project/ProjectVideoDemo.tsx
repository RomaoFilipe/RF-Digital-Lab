import { MediaAsset, VideoProvider } from '../../lib/types';
import { Button } from '../ui/button';

type Props = {
  demoUrl?: string | null;
  videoUrl?: string | null;
  videoProvider?: VideoProvider | null;
  videoAsset?: MediaAsset | null;
  videoAssetSrc?: string | null;
};

function toEmbedUrl(url: string, provider: VideoProvider) {
  if (provider === 'YOUTUBE') {
    const match = url.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{6,})/);
    if (!match) return null;
    return `https://www.youtube.com/embed/${match[1]}`;
  }
  if (provider === 'VIMEO') {
    const match = url.match(/vimeo\.com\/(\d+)/);
    if (!match) return null;
    return `https://player.vimeo.com/video/${match[1]}`;
  }
  return null;
}

export function ProjectVideoDemo({ demoUrl, videoUrl, videoProvider, videoAsset, videoAssetSrc }: Props) {
  const hasContent = Boolean(demoUrl || videoUrl || videoAsset);
  if (!hasContent) return null;

  const provider = videoProvider || 'NONE';
  const embedUrl = videoUrl ? toEmbedUrl(videoUrl, provider) : null;

  return (
    <section className="panel p-8">
      <h2 className="font-display text-2xl text-white">Video or demo</h2>
      <div className="mt-5 space-y-4">
        {embedUrl ? (
          <div className="overflow-hidden rounded-2xl border border-white/10">
            <iframe
              src={embedUrl}
              className="h-[240px] w-full md:h-[320px] xl:h-[380px]"
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
              title="Project demo"
            />
          </div>
        ) : null}

        {provider === 'LOCAL' && videoAsset ? (
          <video controls className="w-full rounded-2xl border border-white/10 bg-black">
            <source src={videoAssetSrc || videoAsset.path} />
          </video>
        ) : null}

        {!embedUrl && !videoAsset && videoUrl ? (
          <Button asChild variant="outline" size="sm">
            <a href={videoUrl} target="_blank" rel="noreferrer">
              Open video
            </a>
          </Button>
        ) : null}

        {demoUrl ? (
          <Button asChild size="sm">
            <a href={demoUrl} target="_blank" rel="noreferrer">
              Open live demo
            </a>
          </Button>
        ) : null}
      </div>
    </section>
  );
}
