/**
 * Video Platform Helpers
 * Centralized utilities for detecting and extracting video IDs from various platforms
 */

export type VideoPlatform =
  | "youtube"
  | "vimeo"
  | "wistia"
  | "dailymotion"
  | "loom"
  | "vidyard"
  | "twitch"
  | "twitchClip"
  | "unknown";

// ---------- Platform Detection ----------

export const isYouTubeUrl = (url: string): boolean =>
  url.includes("youtube.com") || url.includes("youtu.be");

export const isVimeoUrl = (url: string): boolean => url.includes("vimeo.com");

export const isWistiaUrl = (url: string): boolean => url.includes("wistia.com");

export const isDailymotionUrl = (url: string): boolean =>
  url.includes("dailymotion.com");

export const isLoomUrl = (url: string): boolean => url.includes("loom.com");

export const isVidyardUrl = (url: string): boolean => url.includes("vidyard.com");

export const isTwitchUrl = (url: string): boolean => url.includes("twitch.tv");

export const isTwitchClipUrl = (url: string): boolean =>
  url.includes("clips.twitch.tv");

/**
 * Determines the video platform from a URL
 */
export const getVideoPlatform = (url: string): VideoPlatform => {
  if (isYouTubeUrl(url)) return "youtube";
  if (isVimeoUrl(url)) return "vimeo";
  if (isWistiaUrl(url)) return "wistia";
  if (isDailymotionUrl(url)) return "dailymotion";
  if (isLoomUrl(url)) return "loom";
  if (isVidyardUrl(url)) return "vidyard";
  if (isTwitchClipUrl(url)) return "twitchClip";
  if (isTwitchUrl(url)) return "twitch";
  return "unknown";
};

// ---------- Video ID Extraction ----------

/**
 * Extracts YouTube video ID from URL
 * Supports: youtube.com/watch?v=xxx, youtu.be/xxx, youtube.com/embed/xxx
 */
export const getYouTubeId = (url: string): string | null => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
};

/**
 * Extracts Vimeo video ID from URL
 */
export const getVimeoId = (url: string): string | null => {
  const regExp = /vimeo\.com\/(?:.*\/)?([0-9]{6,11})(?:$|\/|\?)/;
  const match = url.match(regExp);
  return match && match[1] ? match[1] : null;
};

/**
 * Extracts Wistia video ID from URL
 * Supports both wmediaid parameter and embed URLs
 */
export const getWistiaId = (url: string): string | null => {
  const mediaIdMatch = url.match(/wmediaid=([a-zA-Z0-9]+)/);
  if (mediaIdMatch && mediaIdMatch[1]) {
    return mediaIdMatch[1];
  }
  const embedMatch = url.match(/wistia\.com\/(medias|embed)\/([a-zA-Z0-9]+)/);
  return embedMatch ? embedMatch[2] : null;
};

/**
 * Extracts Wistia video details including channel ID
 */
export const getWistiaDetails = (
  url: string
): { mediaId: string | null; channelId: string | null } => {
  try {
    const urlObj = new URL(url);
    const mediaId = urlObj.searchParams.get("wmediaid");
    const channelId = urlObj.searchParams.get("wchannelid");
    return { mediaId, channelId };
  } catch {
    return { mediaId: null, channelId: null };
  }
};

/**
 * Extracts Dailymotion video ID from URL
 */
export const getDailymotionId = (url: string): string | null => {
  const regExp = /dailymotion\.com\/(?:video|hub)\/([a-zA-Z0-9]+)/;
  const match = url.match(regExp);
  return match ? match[1] : null;
};

/**
 * Extracts Loom video ID from URL
 */
export const getLoomId = (url: string): string | null => {
  const regExp = /loom\.com\/(?:share|embed)\/([a-zA-Z0-9]+)/;
  const match = url.match(regExp);
  return match ? match[1] : null;
};

/**
 * Extracts Vidyard video ID from URL
 */
export const getVidyardId = (url: string): string | null => {
  const regExp = /vidyard\.com\/(?:watch|share)\/([a-zA-Z0-9]+)/;
  const match = url.match(regExp);
  return match ? match[1] : null;
};

/**
 * Extracts Twitch video ID from URL
 */
export const getTwitchId = (url: string): string | null => {
  const regExp = /twitch\.tv\/videos\/([0-9]+)/;
  const match = url.match(regExp);
  return match ? match[1] : null;
};

/**
 * Extracts Twitch clip ID from URL
 */
export const getTwitchClipId = (url: string): string | null => {
  const regExp = /clips\.twitch\.tv\/([a-zA-Z0-9_-]+)/;
  const match = url.match(regExp);
  return match ? match[1] : null;
};

// ---------- Embed URL Generation ----------

/**
 * Generates an embed URL for a video platform
 * @param url - The original video URL
 * @param autoplay - Whether to enable autoplay (default: false)
 * @returns Embed URL or null if platform not supported
 */
export const getVideoEmbedUrl = (
  url: string,
  autoplay: boolean = false
): string | null => {
  const platform = getVideoPlatform(url);

  switch (platform) {
    case "youtube": {
      const videoId = getYouTubeId(url);
      return videoId
        ? `https://www.youtube.com/embed/${videoId}?autoplay=${autoplay ? 1 : 0}&controls=1&modestbranding=1&rel=0`
        : null;
    }

    case "vimeo": {
      const videoId = getVimeoId(url);
      return videoId
        ? `https://player.vimeo.com/video/${videoId}?autoplay=${autoplay ? 1 : 0}&background=0`
        : null;
    }

    case "wistia": {
      const videoId = getWistiaId(url);
      return videoId
        ? `https://fast.wistia.net/embed/iframe/${videoId}?autoPlay=${autoplay}&playerColor=54bbff`
        : null;
    }

    case "dailymotion": {
      const videoId = getDailymotionId(url);
      return videoId
        ? `https://www.dailymotion.com/embed/video/${videoId}?autoplay=${autoplay ? 1 : 0}`
        : null;
    }

    case "loom": {
      const videoId = getLoomId(url);
      if (!videoId) return null;
      const params = autoplay
        ? `?autoplay=1`
        : `?hide_owner=true&hide_share=true&hide_title=true&hideEmbedTopBar=true`;
      return `https://www.loom.com/embed/${videoId}${params}`;
    }

    case "vidyard": {
      const videoId = getVidyardId(url);
      return videoId
        ? `https://play.vidyard.com/${videoId}.html?${autoplay ? "autoplay=1" : ""}`
        : null;
    }

    case "twitchClip": {
      const clipId = getTwitchClipId(url);
      return clipId
        ? `https://clips.twitch.tv/embed?clip=${clipId}&parent=${window.location.hostname}&autoplay=${autoplay}`
        : null;
    }

    case "twitch": {
      const videoId = getTwitchId(url);
      return videoId
        ? `https://player.twitch.tv/?video=${videoId}&parent=${window.location.hostname}&autoplay=${autoplay}`
        : null;
    }

    default:
      return null;
  }
};

// ---------- Platform Display Names ----------

/**
 * Gets the display name for a video platform
 */
export const getPlatformDisplayName = (url: string): string => {
  const platform = getVideoPlatform(url);

  const platformNames: Record<VideoPlatform, string> = {
    youtube: "YouTube",
    vimeo: "Vimeo",
    wistia: "Wistia",
    dailymotion: "Dailymotion",
    loom: "Loom",
    vidyard: "Vidyard",
    twitch: "Twitch",
    twitchClip: "Twitch Clip",
    unknown: "Video",
  };

  return platformNames[platform];
};

/**
 * Gets the watch URL for a video (for "Open in new tab" functionality)
 */
export const getVideoWatchUrl = (url: string): string => {
  const platform = getVideoPlatform(url);

  switch (platform) {
    case "youtube": {
      const videoId = getYouTubeId(url);
      return videoId ? `https://www.youtube.com/watch?v=${videoId}` : url;
    }

    case "vimeo": {
      const videoId = getVimeoId(url);
      return videoId ? `https://vimeo.com/${videoId}` : url;
    }

    case "dailymotion": {
      const videoId = getDailymotionId(url);
      return videoId ? `https://www.dailymotion.com/video/${videoId}` : url;
    }

    case "loom": {
      const videoId = getLoomId(url);
      return videoId ? `https://www.loom.com/share/${videoId}` : url;
    }

    case "vidyard": {
      const videoId = getVidyardId(url);
      return videoId ? `https://share.vidyard.com/watch/${videoId}` : url;
    }

    case "twitchClip": {
      const clipId = getTwitchClipId(url);
      return clipId ? `https://clips.twitch.tv/${clipId}` : url;
    }

    case "twitch": {
      const videoId = getTwitchId(url);
      return videoId ? `https://www.twitch.tv/videos/${videoId}` : url;
    }

    default:
      return url;
  }
};

/**
 * Checks if a URL is a supported video platform
 */
export const isSupportedVideoPlatform = (url: string): boolean => {
  return getVideoPlatform(url) !== "unknown";
};

/**
 * Gets a video title for display purposes
 */
export const getVideoTitle = (url: string, customTitle?: string): string => {
  if (customTitle) return customTitle;

  const platform = getVideoPlatform(url);
  const platformName = getPlatformDisplayName(url);

  switch (platform) {
    case "youtube": {
      const videoId = getYouTubeId(url);
      return videoId ? `${platformName} Video (${videoId})` : `${platformName} Video`;
    }

    case "vimeo": {
      const videoId = getVimeoId(url);
      return videoId ? `${platformName} Video (${videoId})` : `${platformName} Video`;
    }

    case "wistia": {
      const videoId = getWistiaId(url);
      return videoId ? `${platformName} Video (${videoId})` : `${platformName} Video`;
    }

    case "dailymotion": {
      const videoId = getDailymotionId(url);
      return videoId ? `${platformName} Video (${videoId})` : `${platformName} Video`;
    }

    case "loom": {
      const videoId = getLoomId(url);
      return videoId ? `${platformName} Video (${videoId})` : `${platformName} Video`;
    }

    case "vidyard": {
      const videoId = getVidyardId(url);
      return videoId ? `${platformName} Video (${videoId})` : `${platformName} Video`;
    }

    case "twitchClip": {
      const clipId = getTwitchClipId(url);
      return clipId ? `${platformName} (${clipId})` : platformName;
    }

    case "twitch": {
      const videoId = getTwitchId(url);
      return videoId ? `${platformName} Video (${videoId})` : `${platformName} Video`;
    }

    default:
      return "Video";
  }
};
