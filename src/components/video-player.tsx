
"use client";

import { useState } from "react";
import type { Video } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import AudioOnlyMode from "@/components/audio-only-mode";
import CopyrightHelper from "@/components/copyright-helper";
import { Separator } from "@/components/ui/separator";
import DownloadButton from "./download-button";
import VideoIntelligence from "./video-intelligence";

interface VideoPlayerProps {
  video: Video;
}

export default function VideoPlayer({ video }: VideoPlayerProps) {
  const [isAudioOnly, setIsAudioOnly] = useState(false);

  return (
    <Card className="w-full shadow-lg">
      {!isAudioOnly && (
        <div className="aspect-video w-full overflow-hidden rounded-t-lg">
          <iframe
            key={video.id}
            width="100%"
            height="100%"
            src={`https://www.youtube.com/embed/${video.youtubeId}?autoplay=1`}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      )}
      <CardHeader>
        <CardTitle className="font-headline text-2xl">{video.title}</CardTitle>
        <CardDescription className="line-clamp-3 pt-2">
          {video.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Separator className="my-4" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AudioOnlyMode video={video} isAudioOnly={isAudioOnly} onToggle={setIsAudioOnly} />
            <VideoIntelligence video={video} />
            <CopyrightHelper video={video} />
            <DownloadButton video={video} />
        </div>
      </CardContent>
    </Card>
  );
}
