'use server';

/**
 * @fileOverview An AI agent that generates a YouTube playlist from a text prompt.
 *
 * - generatePlaylist - A function that generates a playlist.
 * - GeneratePlaylistInput - The input type for the generatePlaylist function.
 * - GeneratePlaylistOutput - The return type for the generatePlaylist function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {Video} from '@/types';

const GeneratePlaylistInputSchema = z.object({
  prompt: z.string().describe('The user prompt for the playlist to generate.'),
});
export type GeneratePlaylistInput = z.infer<typeof GeneratePlaylistInputSchema>;

const GeneratePlaylistOutputSchema = z.object({
  videos: z.array(
    z.object({
      id: z.string(),
      videoId: z.string(),
      platform: z.literal('youtube'),
      title: z.string(),
      description: z.string(),
      tags: z.string(),
    })
  ),
});
export type GeneratePlaylistOutput = z.infer<
  typeof GeneratePlaylistOutputSchema
>;

export async function generatePlaylist(
  input: GeneratePlaylistInput
): Promise<GeneratePlaylistOutput> {
  return generatePlaylistFlow(input);
}

const youtubeSearchTool = ai.defineTool(
  {
    name: 'youtubeSearch',
    description: 'Search for YouTube videos.',
    inputSchema: z.object({
      query: z
        .string()
        .describe('The search query for YouTube videos.'),
      maxResults: z.number().optional().default(10).describe('The maximum number of results to return.'),
    }),
    outputSchema: z.object({
      results: z.array(
        z.object({
          videoId: z.string(),
          title: z.string(),
          description: z.string(),
        })
      ),
    }),
  },
  async input => {
    const apiKey = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
    if (!apiKey) {
      throw new Error('YouTube API key is not configured.');
    }
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${input.query}&key=${apiKey}&type=video&maxResults=${input.maxResults}`
    );
    const data = await response.json();
    if (data.error) {
      throw new Error(data.error.message);
    }
    return {
      results: data.items.map((item: any) => ({
        videoId: item.id.videoId,
        title: item.snippet.title,
        description: item.snippet.description,
      })),
    };
  }
);

const prompt = ai.definePrompt({
  name: 'generatePlaylistPrompt',
  input: {schema: GeneratePlaylistInputSchema},
  output: {schema: z.any()},
  tools: [youtubeSearchTool],
  prompt: `You are a playlist generation assistant. Based on the user's prompt, generate a playlist of 10 videos by searching YouTube.

If the user is asking for a series, try to find all the episodes in order. You can do this by searching for the series name and then looking for titles that include "Episode 1", "Ep 1", or similar patterns. Be sure to check for official channels.

Prompt: {{{prompt}}}
  
First, think of a good search query for the given prompt.
Then, use the youtubeSearch tool to find videos.
Finally, respond with the list of videos you found.`,
});

const generatePlaylistFlow = ai.defineFlow(
  {
    name: 'generatePlaylistFlow',
    inputSchema: GeneratePlaylistInputSchema,
    outputSchema: GeneratePlaylistOutputSchema,
  },
  async input => {
    const llmResponse = await prompt(input);
    const videos: Video[] = [];

    for (const part of llmResponse.output()?.content || []) {
      if (part.toolRequest) {
        const toolResponse = await part.toolRequest.tool.fn(
          part.toolRequest.input
        );
        for (const video of toolResponse.results) {
          videos.push({
            id: crypto.randomUUID(),
            videoId: video.videoId,
            platform: 'youtube',
            title: video.title,
            description: video.description || '',
            tags: '',
          });
        }
      }
    }
    return {videos};
  }
);
