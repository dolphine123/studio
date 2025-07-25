"use client";

import { useState } from "react";
import type { Video } from "@/types";
import { runAudioOnlySuggestion } from "@/app/actions";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Music, Sparkles, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface AudioOnlyModeProps {
  video: Video;
}

export default function AudioOnlyMode({ video }: AudioOnlyModeProps) {
  const [isAudioOnly, setIsAudioOnly] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [suggestion, setSuggestion] = useState<string | null>(null);

  const handleToggle = async (checked: boolean) => {
    setIsAudioOnly(checked);
    if (checked) {
      setIsLoading(true);
      setSuggestion(null);
      const result = await runAudioOnlySuggestion({
        videoTitle: video.title,
        videoDescription: video.description,
      });
      setSuggestion(result.musicSuggestion);
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="flex items-center space-x-2 rounded-lg border p-4">
        <Music className="h-5 w-5 text-accent" />
        <Label htmlFor="audio-only-mode" className="flex-1">
          Audio-Only Suggestion
        </Label>
        <Switch
          id="audio-only-mode"
          checked={isAudioOnly}
          onCheckedChange={handleToggle}
          aria-label="Toggle audio-only mode suggestion"
        />
      </div>

      <Dialog open={isAudioOnly && !isLoading} onOpenChange={setIsAudioOnly}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-headline flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-accent" />
              AI Music Suggestion
            </DialogTitle>
            <DialogDescription>
              Here is a copyright-free music suggestion based on "{video.title}
              ".
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {suggestion ? (
              <Alert>
                <Music className="h-4 w-4" />
                <AlertTitle>Suggestion</AlertTitle>
                <AlertDescription>{suggestion}</AlertDescription>
              </Alert>
            ) : (
                <div className="flex items-center justify-center text-muted-foreground">
                    <p>No suggestion available.</p>
                </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
      
      <Dialog open={isLoading}>
        <DialogContent hideCloseButton>
            <div className="flex flex-col items-center justify-center p-8 gap-4">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p className="font-headline text-lg text-muted-foreground">Generating suggestion...</p>
            </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
