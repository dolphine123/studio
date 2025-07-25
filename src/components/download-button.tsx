
"use client";

import type { Video } from "@/types";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DownloadButtonProps {
  video: Video;
}

export default function DownloadButton({ video }: DownloadButtonProps) {
  const { toast } = useToast();

  const handleDownload = async () => {
    let videoUrl = "";
    if (video.platform === "youtube") {
      videoUrl = `https://www.youtube.com/watch?v=${video.videoId}`;
    } else if (video.platform === "vimeo") {
      videoUrl = `https://vimeo.com/${video.videoId}`;
    } else {
        toast({
            variant: "destructive",
            title: "Download not supported",
            description: "This video platform is not supported for download.",
        });
        return;
    }
    
    const downloadServiceUrl = `https://ssyoutube.com/en803AM/`;

    try {
      await navigator.clipboard.writeText(videoUrl);
      toast({
        title: "URL Copied!",
        description: "The video URL has been copied to your clipboard.",
      });
    } catch (err) {
      console.error("Failed to copy: ", err);
      toast({
        variant: "destructive",
        title: "Copy Failed",
        description: "Could not copy the video URL. Please copy it manually.",
      });
    } finally {
        window.open(downloadServiceUrl, "_blank");
    }
  };

  return (
    <Button variant="outline" className="w-full" onClick={handleDownload} disabled={video.platform === 'unknown'}>
      <Download className="mr-2 h-4 w-4 text-accent" />
      <span>Download Video</span>
    </Button>
  );
}
