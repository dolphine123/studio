
"use client";

import { useState, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { parseVideoUrl } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { Video } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface AddVideoFormProps {
  children: ReactNode;
  onAddVideo: (video: Video) => void;
}

const formSchema = z.object({
  url: z.string().url({ message: "Please enter a valid URL." }).refine(
    (url) => parseVideoUrl(url).id !== null,
    { message: "Please enter a valid YouTube, Vimeo, or Dailymotion video URL." }
  ),
  title: z.string().min(3, { message: "Title must be at least 3 characters." }),
  description: z.string().optional(),
  tags: z.string().optional(),
});

export default function AddVideoForm({
  children,
  onAddVideo,
}: AddVideoFormProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: "",
      title: "",
      description: "",
      tags: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const parsedUrl = parseVideoUrl(values.url);
    if (!parsedUrl.id) {
      // This should be caught by validation, but as a fallback
      form.setError("url", { message: "Invalid video URL provided." });
      return;
    }

    const newVideo: Video = {
      id: crypto.randomUUID(),
      videoId: parsedUrl.id,
      platform: parsedUrl.platform,
      title: values.title,
      description: values.description || "",
      tags: values.tags || "",
    };

    onAddVideo(newVideo);
    toast({
        title: "Video Added!",
        description: `${values.title} has been added to your playlist.`,
    })
    setOpen(false);
    form.reset();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="font-headline">Add a New Video</DialogTitle>
          <DialogDescription>
            Paste a YouTube, Vimeo, or Dailymotion URL.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Video URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://www.youtube.com/watch?v=..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="My awesome video" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="A short description of the video"
                      className="resize-none h-24"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags (comma-separated)</FormLabel>
                  <FormControl>
                    <Input placeholder="music, tutorial, gaming" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Adding..." : "Add Video"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
