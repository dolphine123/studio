
"use client";

import type { Video } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, Trash2, Clapperboard, Music, Search } from "lucide-react";
import AddVideoForm from "./add-video-form";
import { cn } from "@/lib/utils";
import Image from "next/image";
import YoutubeSearch from "./youtube-search";

interface PlaylistProps {
  playlist: Video[];
  currentVideoId?: string;
  onAddVideo: (video: Video) => void;
  onRemoveVideo: (videoId: string) => void;
  onSelectVideo: (video: Video) => void;
}

export default function Playlist({
  playlist,
  currentVideoId,
  onAddVideo,
  onRemoveVideo,
  onSelectVideo,
}: PlaylistProps) {
  const getThumbnailUrl = (video: Video) => {
    if (video.platform === "youtube") {
      return `https://img.youtube.com/vi/${video.videoId}/mqdefault.jpg`;
    }
    if (video.platform === "dailymotion") {
        return `https://www.dailymotion.com/thumbnail/video/${video.videoId}`;
    }
    // Note: Vimeo thumbnails are not directly accessible without API calls.
    // Using a placeholder for now.
    return `https://placehold.co/120x90.png`;
  };

  return (
    <Card className="lg:h-screen lg:flex lg:flex-col border-0 lg:border-none lg:rounded-none">
      <CardHeader className="flex flex-row items-center justify-between p-4 sm:p-6">
        <CardTitle className="font-headline text-2xl">Playlist</CardTitle>
        <div className="flex items-center gap-2">
          <YoutubeSearch onAddVideo={onAddVideo}>
            <Button size="sm" variant="outline">
              <Search className="mr-2 h-4 w-4" /> Search
            </Button>
          </YoutubeSearch>
          <AddVideoForm onAddVideo={onAddVideo}>
            <Button size="sm" variant="outline">
              <Plus className="mr-2 h-4 w-4" /> Add Video
            </Button>
          </AddVideoForm>
        </div>
      </CardHeader>
      <CardContent className="p-0 flex-1">
        <ScrollArea className="h-[calc(100vh-10rem)] lg:h-[calc(100vh-5.5rem)]">
          {playlist.length > 0 ? (
            <div className="space-y-2 p-4 sm:p-6 pt-0">
              {playlist.map((video) => (
                <div
                  key={video.id}
                  onClick={() => onSelectVideo(video)}
                  className={cn(
                    "group flex items-center gap-4 p-2 rounded-lg cursor-pointer transition-colors",
                    currentVideoId === video.id
                      ? "bg-primary/10"
                      : "hover:bg-muted"
                  )}
                >
                  <div className="relative flex-shrink-0 w-24 h-14 rounded-md overflow-hidden">
                    <Image
                      src={getThumbnailUrl(video)}
                      alt={video.title}
                      fill
                      sizes="6rem"
                      className="object-cover"
                      data-ai-hint={video.platform === 'vimeo' ? 'abstract video' : undefined}
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                        <Clapperboard className="h-6 w-6 text-white/80" />
                    </div>
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className="font-semibold text-sm truncate text-foreground">
                      {video.title}
                    </p>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {video.description}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 transition-opacity text-muted-foreground hover:text-destructive"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveVideo(video.id);
                    }}
                    aria-label="Remove video"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
              <Music className="h-16 w-16 text-muted-foreground/30" />
              <p className="mt-4 font-headline text-lg text-muted-foreground">
                Your playlist is empty
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Click Add Video to start building your collection.
              </p>
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
