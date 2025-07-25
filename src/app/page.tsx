
"use client";

import { useState, useEffect } from "react";
import type { Video } from "@/types";
import useLocalStorage from "@/hooks/use-local-storage";
import VideoPlayer from "@/components/video-player";
import Playlist from "@/components/playlist";
import { Icons } from "@/components/icons";
import { Card, CardContent } from "@/components/ui/card";

export default function Home() {
  const [playlist, setPlaylist] = useLocalStorage<Video[]>("playlist", []);
  const [currentVideo, setCurrentVideo] = useState<Video | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [selectedVideos, setSelectedVideos] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!currentVideo && playlist.length > 0) {
      setCurrentVideo(playlist[0]);
    }
    if (currentVideo && !playlist.some((v) => v.id === currentVideo.id)) {
      setCurrentVideo(playlist.length > 0 ? playlist[0] : null);
    }
  }, [playlist, currentVideo]);

  const handleSelectVideo = (video: Video) => {
    if (editMode) {
      handleToggleSelection(video.id);
    } else {
      setCurrentVideo(video);
    }
  };

  const handleAddVideo = (video: Video) => {
    setPlaylist([...playlist, video]);
    if (!currentVideo) {
      setCurrentVideo(video);
    }
  };

  const handleRemoveVideo = (videoId: string) => {
    setPlaylist(playlist.filter((video) => video.id !== videoId));
  };
  
  const handleClearPlaylist = () => {
    setPlaylist([]);
    setCurrentVideo(null);
  };

  const handleToggleSelection = (videoId: string) => {
    const newSelection = new Set(selectedVideos);
    if (newSelection.has(videoId)) {
      newSelection.delete(videoId);
    } else {
      newSelection.add(videoId);
    }
    setSelectedVideos(newSelection);
  };

  const handleDeleteSelected = () => {
    setPlaylist(playlist.filter((video) => !selectedVideos.has(video.id)));
    setSelectedVideos(new Set());
    setEditMode(false);
  };

  return (
    <main className="min-h-screen bg-background text-foreground font-body">
      <div className="flex flex-col lg:flex-row">
        <div className="w-full lg:w-[calc(100%-24rem)] xl:w-[calc(100%-28rem)]">
          <div className="p-4 sm:p-6 md:p-8 space-y-8">
            <div className="flex items-center gap-4">
              <Icons.logo className="h-10 w-10 text-primary" />
              <h1 className="text-3xl lg:text-4xl font-headline font-bold text-foreground">
                StreamVerse
              </h1>
            </div>

            {currentVideo ? (
              <VideoPlayer video={currentVideo} />
            ) : (
              <Card className="aspect-video w-full flex items-center justify-center bg-card/50 border-dashed">
                <CardContent className="text-center p-6">
                  <Icons.logo className="h-24 w-24 mx-auto text-muted-foreground/50" />
                  <p className="mt-4 font-headline text-2xl text-muted-foreground">
                    Your personal streaming sanctuary
                  </p>
                  <p className="mt-2 text-muted-foreground">
                    Add a YouTube video to your playlist to get started.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
        <div className="w-full lg:w-96 xl:w-112 lg:min-h-screen lg:border-l lg:border-border">
          <Playlist
            playlist={playlist}
            onAddVideo={handleAddVideo}
            onRemoveVideo={handleRemoveVideo}
            onSelectVideo={handleSelectVideo}
            currentVideoId={currentVideo?.id}
            editMode={editMode}
            onEditModeChange={setEditMode}
            selectedVideos={selectedVideos}
            onDeleteSelected={handleDeleteSelected}
          />
        </div>
      </div>
    </main>
  );
}
