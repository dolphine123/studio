import { ParsedVideoUrl } from "@/lib/utils";

export interface Video {
  id: string;
  videoId: string;
  platform: ParsedVideoUrl["platform"];
  title: string;
  description: string;
  tags: string;
}
