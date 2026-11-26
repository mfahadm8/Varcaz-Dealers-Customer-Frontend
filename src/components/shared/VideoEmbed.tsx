import { ExternalLink } from "lucide-react";
import {
  isSupportedVideoPlatform,
  getVideoEmbedUrl,
  getVideoWatchUrl,
  getPlatformDisplayName,
} from "@/utils/videoHelpers";

interface VideoEmbedProps {
  url: string;
  title?: string;
  className?: string;
}

export default function VideoEmbed({ url, title, className }: VideoEmbedProps) {
  if (!url || !isSupportedVideoPlatform(url)) return null;

  const embedUrl = getVideoEmbedUrl(url, false);
  const watchUrl = getVideoWatchUrl(url);
  const platform = getPlatformDisplayName(url);

  return (
    <div className={className}>
      <div className="relative pt-[56.25%] rounded-lg overflow-hidden bg-gray-100">
        {embedUrl ? (
          <iframe
            className="absolute top-0 left-0 w-full h-full"
            src={embedUrl}
            title={title || `${platform} video`}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-sm text-gray-500">
            Video unavailable
          </div>
        )}
      </div>
      <a
        href={watchUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-1.5 inline-flex items-center gap-1 text-xs hover:underline"
        style={{ color: "#dc425f" }}
      >
        <ExternalLink className="w-3 h-3" />
        Open on {platform}
      </a>
    </div>
  );
}
