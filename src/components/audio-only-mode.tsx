
"use client";

import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Music, Sparkles, Loader2, ShieldAlert } from "lucide-react";
import type { Video } from "@/types";
import { runAudioOnlySuggestion } from "@/app/actions";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "./ui/badge";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";

interface AudioOnlyModeProps {
  video: Video;
  isAudioOnly: boolean;
  onToggle: (isAudioOnly: boolean) => void;
}

export default function AudioOnlyMode({
  video,
  isAudioOnly,
  onToggle,
}: AudioOnlyModeProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [suggestion, setSuggestion] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleToggle = async (toggled: boolean) => {
    onToggle(toggled);
    if (toggled) {
      setIsDialogOpen(true);
      setIsLoading(true);
      setError(null);
      try {
        const result = await runAudioOnlySuggestion({
          videoTitle: video.title,
          videoDescription: video.description,
        });
        setSuggestion(result.musicSuggestion);
      } catch (err) {
        setError("Failed to get a music suggestion. Please try again later.");
        setSuggestion(
          "Could not load a suggestion. Using audio-only mode will still reduce data and block video ads."
        );
      } finally {
        setIsLoading(false);
      }
    } else {
      setIsDialogOpen(false);
    }
  };

  return (
    <>
      <div className="flex items-center space-x-2 rounded-lg border p-4">
        <Music className="h-5 w-5 text-accent" />
        <Label htmlFor="audio-only-mode" className="flex-1">
          Audio-Only
        </Label>
        <Badge variant="secondary">Ad-Free</Badge>
        <Switch
          id="audio-only-mode"
          checked={isAudioOnly}
          onCheckedChange={handleToggle}
          aria-label="Toggle audio-only mode"
        />
      </div>
      <Dialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            setIsDialogOpen(false);
            if (isAudioOnly) {
              onToggle(false); // If dialog is closed, toggle audio off
            }
          }
        }}
      >
        <DialogContent hideCloseButton>
          <DialogHeader>
            <DialogTitle className="font-headline flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-accent" />
              Entering Audio-Only Mode
            </DialogTitle>
            <DialogDescription>
              The video player is now hidden to save data and provide an ad-free
              experience. Here is a copyright-free music suggestion based on the
              video.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            {isLoading && (
              <div className="flex flex-col items-center justify-center p-8 gap-4">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p className="font-headline text-lg text-muted-foreground">
                  Finding music...
                </p>
              </div>
            )}
            {error && (
              <Alert variant="destructive">
                <ShieldAlert className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {!isLoading && suggestion && (
              <div className="text-center bg-muted/50 p-6 rounded-lg">
                <p className="font-headline text-lg">Music Suggestion</p>
                <p className="text-muted-foreground">{suggestion}</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
