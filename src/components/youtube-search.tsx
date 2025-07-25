
"use client";

import { useState, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { Video } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Search, Plus } from "lucide-react";
import Image from "next/image";
import { ScrollArea } from "./ui/scroll-area";

interface YoutubeSearchProps {
  children: ReactNode;
  onAddVideo: (video: Video) => void;
}

const formSchema = z.object({
  query: z.string().min(2, { message: "Search query must be at least 2 characters." }),
});

interface YoutubeSearchResult {
    id: { videoId: string };
    snippet: {
        title: string;
        description: string;
        thumbnails: {
            default: { url: string };
        };
        tags: string[];
    }
}

export default function YoutubeSearch({
  children,
  onAddVideo,
}: YoutubeSearchProps) {
  const [open, setOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<YoutubeSearchResult[]>([]);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      query: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSearching(true);
    setSearchResults([]);
    try {
      const apiKey = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${values.query}&key=${apiKey}&type=video&maxResults=10`
      );
      const data = await response.json();
      if (data.items) {
        setSearchResults(data.items);
      } else {
        toast({
          variant: "destructive",
          title: "Search failed",
          description: data.error?.message || "Could not fetch videos from YouTube.",
        });
      }
    } catch (error) {
      console.error("Failed to search videos", error);
      toast({
        variant: "destructive",
        title: "Error searching videos",
        description: "Could not fetch videos from YouTube.",
      });
    } finally {
      setIsSearching(false);
    }
  }

  function handleAddVideo(searchResult: YoutubeSearchResult) {
    const newVideo: Video = {
      id: crypto.randomUUID(),
      videoId: searchResult.id.videoId,
      platform: 'youtube',
      title: searchResult.snippet.title,
      description: searchResult.snippet.description || "",
      tags: (searchResult.snippet.tags || []).join(", "),
    };

    onAddVideo(newVideo);
    toast({
      title: "Video Added!",
      description: `${newVideo.title} has been added to your playlist.`,
    });
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen) {
            form.reset();
            setSearchResults([]);
        }
    }}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-headline flex items-center gap-2">
            <Search />
            Search YouTube
          </DialogTitle>
          <DialogDescription>
            Find videos on YouTube and add them to your playlist.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-center gap-2">
            <FormField
              control={form.control}
              name="query"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <Input placeholder="Search for a video..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isSearching}>
              {isSearching ? <Loader2 className="animate-spin" /> : <Search />}
            </Button>
          </form>
        </Form>
        <div className="mt-4">
            {isSearching && (
                 <div className="flex items-center justify-center p-8 gap-4">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-muted-foreground">Searching...</p>
                </div>
            )}
            {searchResults.length > 0 && (
                <ScrollArea className="h-80">
                    <div className="space-y-2 pr-4">
                    {searchResults.map((result) => (
                        <div key={result.id.videoId} className="flex items-center gap-4 p-2 rounded-lg hover:bg-muted">
                            <Image
                                src={result.snippet.thumbnails.default.url}
                                alt={result.snippet.title}
                                width={120}
                                height={90}
                                className="rounded-md object-cover w-24 h-16"
                            />
                            <div className="flex-1 overflow-hidden">
                                <p className="font-semibold text-sm truncate">{result.snippet.title}</p>
                                <p className="text-xs text-muted-foreground line-clamp-2">{result.snippet.description}</p>
                            </div>
                            <Button size="icon" variant="ghost" onClick={() => handleAddVideo(result)}>
                                <Plus className="h-5 w-5"/>
                            </Button>
                        </div>
                    ))}
                    </div>
                </ScrollArea>
            )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
