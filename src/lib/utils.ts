import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export type VideoPlatform = "youtube" | "vimeo" | "dailymotion" | "unknown";

export interface ParsedVideoUrl {
  id: string | null;
  platform: VideoPlatform;
}

export function parseVideoUrl(url: string): ParsedVideoUrl {
  if (!url) return { id: null, platform: "unknown" };

  // YouTube
  let regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  let match = url.match(regExp);
  if (match && match[2].length === 11) {
    return { id: match[2], platform: "youtube" };
  }

  // Vimeo
  regExp = /vimeo\.com\/(?:video\/)?(\d+)/;
  match = url.match(regExp);
  if (match && match[1]) {
    return { id: match[1], platform: "vimeo" };
  }

  // Dailymotion
  regExp = /^.+dailymotion.com\/(video|hub)\/([^_]+)[^#]*(#video=([^_&]+))?/;
  match = url.match(regExp);
  if (match && (match[2] || match[4])) {
    return { id: match[4] || match[2], platform: "dailymotion" };
  }

  return { id: null, platform: "unknown" };
}

export function getYoutubeVideoId(url: string): string | null {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}
