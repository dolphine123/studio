"use client";

import { useState } from "react";
import type { Video } from "@/types";
import { runVideoIntelligence } from "@/app/actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Sparkles, Timer } from "lucide-react";

interface VideoIntelligenceProps {
  video: Video;
}

interface KeyMoment {
    timestamp: string;
    description: string;
}

export default function VideoIntelligence({ video }: VideoIntelligenceProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  const [keyMoments, setKeyMoments] = useState<KeyMoment[]>([]);

  const handleSummarize = async () => {
    setIsLoading(true);
    setSummary(null);
    setKeyMoments([]);
    const result = await runVideoIntelligence({
      videoTitle: video.title,
      videoDescription: video.description,
    });
    setSummary(result.summary);
    setKeyMoments(result.keyMoments);
    setIsLoading(false);
  };

  return (
    <Dialog onOpenChange={(open) => {
        if (!open) {
            setSummary(null);
            setKeyMoments([]);
        }
    }}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full" onClick={handleSummarize}>
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="mr-2 h-4 w-4 text-accent" />
          )}
          <span>Summarize</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-headline flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-accent" />
            AI Video Analysis
          </DialogTitle>
          <DialogDescription>
            Here's a summary and key moments for "{video.title}".
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 max-h-[60vh] -mr-6 pr-4">
            {isLoading ? (
                <div className="flex flex-col items-center justify-center p-8 gap-4">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p className="font-headline text-lg text-muted-foreground">
                    Analyzing video...
                </p>
                </div>
            ) : (
            <ScrollArea className="h-full pr-2">
                {summary && (
                    <div className="mb-6">
                        <h3 className="font-headline text-lg mb-2">Summary</h3>
                        <p className="text-sm text-muted-foreground">{summary}</p>
                    </div>
                )}
                {keyMoments.length > 0 && (
                    <div>
                        <h3 className="font-headline text-lg mb-2">Key Moments</h3>
                        <div className="space-y-3">
                            {keyMoments.map((moment, index) => (
                                <div key={index} className="flex items-start gap-3">
                                    <Timer className="h-5 w-5 mt-0.5 text-primary/80 flex-shrink-0" />
                                    <div>
                                        <p className="font-semibold text-sm">{moment.timestamp}</p>
                                        <p className="text-sm text-muted-foreground">{moment.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </ScrollArea>
            )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
