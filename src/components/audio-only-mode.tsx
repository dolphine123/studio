
"use client";

import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Music } from "lucide-react";
import type { Video } from "@/types";

interface AudioOnlyModeProps {
  video: Video;
  isAudioOnly: boolean;
  onToggle: (isAudioOnly: boolean) => void;
}

export default function AudioOnlyMode({ video, isAudioOnly, onToggle }: AudioOnlyModeProps) {
  return (
    <div className="flex items-center space-x-2 rounded-lg border p-4">
      <Music className="h-5 w-5 text-accent" />
      <Label htmlFor="audio-only-mode" className="flex-1">
        Audio-Only
      </Label>
      <Switch
        id="audio-only-mode"
        checked={isAudioOnly}
        onCheckedChange={onToggle}
        aria-label="Toggle audio-only mode"
      />
    </div>
  );
}
