"use client";

import { useState } from "react";
import type { Video } from "@/types";
import { runCopyrightCompliance } from "@/app/actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ShieldCheck, Sparkles, Loader2 } from "lucide-react";

interface CopyrightHelperProps {
  video: Video;
}

export default function CopyrightHelper({ video }: CopyrightHelperProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[] | null>(null);

  const handleCheckCompliance = async () => {
    setIsLoading(true);
    setSuggestions(null);
    const result = await runCopyrightCompliance({
      videoTitle: video.title,
      videoDescription: video.description,
      videoTags: video.tags,
    });
    setSuggestions(result.suggestions);
    setIsLoading(false);
  };

  return (
    <Dialog onOpenChange={(open) => !open && setSuggestions(null)}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full" onClick={handleCheckCompliance}>
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <ShieldCheck className="mr-2 h-4 w-4 text-accent" />
          )}
          <span>Compliance Check</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-headline flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-accent" />
            AI Compliance Suggestions
          </DialogTitle>
          <DialogDescription>
            Suggestions to improve UX and avoid copyright issues for "
            {video.title}".
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 max-h-[60vh] overflow-y-auto">
          {isLoading && (
            <div className="flex flex-col items-center justify-center p-8 gap-4">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <p className="font-headline text-lg text-muted-foreground">
                Analyzing video...
              </p>
            </div>
          )}
          {suggestions && (
            <Accordion type="single" collapsible className="w-full">
              {suggestions.map((suggestion, index) => (
                <AccordionItem value={`item-${index}`} key={index}>
                  <AccordionTrigger>Suggestion #{index + 1}</AccordionTrigger>
                  <AccordionContent>{suggestion}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
