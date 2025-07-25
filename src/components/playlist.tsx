
"use client";

import type { Video } from "@/types";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, Trash2, Clapperboard, Music, Search, Pencil, X, Sparkles } from "lucide-react";
import AddVideoForm from "./add-video-form";
import { cn } from "@/lib/utils";
import Image from "next/image";
import YoutubeSearch from "./youtube-search";
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "./ui/checkbox";
import { suggestedVideos } from "@/lib/suggestions";
import { Separator } from "./ui/separator";
import AiPlaylistForm from "./ai-playlist-form";

interface PlaylistProps {
  playlist: Video[];
  currentVideoId?: string;
  onAddVideo: (video: Video) => void;
  onAddMultipleVideos: (videos: Video[]) => void;
  onRemoveVideo: (videoId: string) => void;
  onSelectVideo: (video: Video) => void;
  onClearPlaylist: () => void;
  editMode: boolean;
  onEditModeChange: (editing: boolean) => void;
  selectedVideos: Set<string>;
  onDeleteSelected: () => void;
}

export default function Playlist({
  playlist,
  currentVideoId,
  onAddVideo,
  onAddMultipleVideos,
  onRemoveVideo,
  onSelectVideo,
  onClearPlaylist,
  editMode,
  onEditModeChange,
  selectedVideos,
  onDeleteSelected,
}: PlaylistProps) {
  const { toast } = useToast();
  const getThumbnailUrl = (video: Video) => {
    if (video.platform === "youtube") {
      return `https://img.youtube.com/vi/${video.videoId}/mqdefault.jpg`;
    }
    if (video.platform === "dailymotion") {
        return `https://www.dailymotion.com/thumbnail/video/${video.videoId}`;
    }
    return `https://placehold.co/120x90.png`;
  };

  const handleDelete = () => {
    onDeleteSelected();
    toast({
      title: "Videos Removed",
      description: `${selectedVideos.size} videos have been removed from your playlist.`,
    });
  };

  const handleAddSuggested = (video: Video) => {
    onAddVideo(video);
    toast({
      title: "Video Added!",
      description: `${video.title} has been added to your playlist.`,
    })
  }

  return (
    <Card className="flex flex-col border-0 rounded-none h-full">
      <CardHeader className="flex flex-row items-center justify-between p-4 sm:p-6">
        <CardTitle className="font-headline text-2xl">Playlist</CardTitle>
        <div className="flex items-center gap-2 flex-wrap justify-end">
           {editMode ? (
            <>
              <Button size="sm" variant="destructive" onClick={handleDelete} disabled={selectedVideos.size === 0}>
                <Trash2 className="mr-2 h-4 w-4" /> Delete ({selectedVideos.size})
              </Button>
              <Button size="sm" variant="outline" onClick={() => onEditModeChange(false)}>
                <X className="mr-2 h-4 w-4" /> Done
              </Button>
            </>
          ) : (
            <>
               <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button size="icon" variant="outline" className="h-9 w-9" disabled={playlist.length === 0}>
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Clear Playlist</span>
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete your entire playlist. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={onClearPlaylist}>
                      Clear Playlist
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              <Button size="sm" variant="outline" onClick={() => onEditModeChange(true)} disabled={playlist.length === 0}>
                <Pencil className="mr-2 h-4 w-4" /> Edit
              </Button>
              <AiPlaylistForm onPlaylistGenerated={onAddMultipleVideos}>
                 <Button size="sm" variant="outline">
                  <Sparkles className="mr-2 h-4 w-4 text-accent" /> AI Playlist
                </Button>
              </AiPlaylistForm>
              <YoutubeSearch onAddVideo={onAddVideo} onSelectVideo={onSelectVideo}>
                <Button size="sm" variant="outline">
                  <Search className="mr-2 h-4 w-4" /> Search
                </Button>
              </YoutubeSearch>
              <AddVideoForm onAddVideo={onAddVideo}>
                <Button size="sm" variant="outline">
                  <Plus className="mr-2 h-4 w-4" /> Add
                </Button>
              </AddVideoForm>
            </>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-0 flex-1">
        <ScrollArea className="h-full">
          {playlist.length > 0 ? (
            <div className="space-y-2 p-4 sm:p-6 pt-0">
              {playlist.map((video) => (
                <div
                  key={video.id}
                  onClick={() => onSelectVideo(video)}
                  className={cn(
                    "group flex items-center gap-4 p-2 rounded-lg cursor-pointer transition-colors",
                    currentVideoId === video.id && !editMode
                      ? "bg-primary/10"
                      : "hover:bg-muted",
                     selectedVideos.has(video.id) && "bg-primary/20"
                  )}
                >
                  {editMode && (
                     <Checkbox
                        checked={selectedVideos.has(video.id)}
                        onCheckedChange={() => onSelectVideo(video)}
                        aria-label={`Select video ${video.title}`}
                        className="ml-2"
                      />
                  )}
                  <div className="relative flex-shrink-0 w-24 h-14 rounded-md overflow-hidden">
                    <Image
                      src={getThumbnailUrl(video)}
                      alt={video.title}
                      fill
                      sizes="6rem"
                      className="object-cover"
                      data-ai-hint={video.platform === 'vimeo' ? 'abstract video' : undefined}
                    />
                     {!editMode && (
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                            <Clapperboard className="h-6 w-6 text-white/80" />
                        </div>
                     )}
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className="font-semibold text-sm truncate text-foreground">
                      {video.title}
                    </p>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {video.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-full text-center p-4 sm:p-6">
              <div className="flex flex-col items-center justify-center rounded-lg bg-muted/50 p-8 h-full">
                <Music className="h-16 w-16 text-muted-foreground/30" />
                <p className="mt-4 font-headline text-lg text-muted-foreground">
                  Your playlist is empty
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Add a video or start with one of our suggestions below.
                </p>
              </div>

              <Separator className="my-4" />

              <h3 className="font-headline text-xl text-left mb-2">Suggestions</h3>
               <div className="space-y-2 text-left">
                {suggestedVideos.map((video) => (
                  <div
                    key={video.id}
                    className={cn("group flex items-center gap-4 p-2 rounded-lg hover:bg-muted")}
                  >
                    <div className="relative flex-shrink-0 w-24 h-14 rounded-md overflow-hidden">
                      <Image
                        src={getThumbnailUrl(video)}
                        alt={video.title}
                        fill
                        sizes="6rem"
                        className="object-cover"
                        data-ai-hint={video.platform === 'vimeo' ? 'abstract creative' : 'music video'}
                      />
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
                      variant="outline"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => handleAddSuggested(video)}
                      aria-label="Add suggested video to playlist"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
