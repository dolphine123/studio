'use server';

/**
 * @fileOverview Provides AI-powered video intelligence features like summarization and identifying key moments.
 *
 * - getVideoIntelligence - A function that returns a summary and key moments for a video.
 * - VideoIntelligenceInput - The input type for the getVideoIntelligence function.
 * - VideoIntelligenceOutput - The return type for the getVideoIntelligence function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const VideoIntelligenceInputSchema = z.object({
  videoTitle: z.string().describe('The title of the YouTube video.'),
  videoDescription: z.string().describe('The description of the YouTube video.'),
});
export type VideoIntelligenceInput = z.infer<typeof VideoIntelligenceInputSchema>;

const KeyMomentSchema = z.object({
    timestamp: z.string().describe('The timestamp of the key moment in HH:MM:SS format.'),
    description: z.string().describe('A brief description of what happens at this key moment.'),
});

const VideoIntelligenceOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the video content.'),
  keyMoments: z.array(KeyMomentSchema).describe('A list of key moments from the video.'),
});
export type VideoIntelligenceOutput = z.infer<typeof VideoIntelligenceOutputSchema>;

export async function getVideoIntelligence(input: VideoIntelligenceInput): Promise<VideoIntelligenceOutput> {
  return videoIntelligenceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'videoIntelligencePrompt',
  input: {schema: VideoIntelligenceInputSchema},
  output: {schema: VideoIntelligenceOutputSchema},
  prompt: `You are a YouTube content analyst. Based on the video title and description, please provide a concise summary and identify key moments with timestamps.

Video Title: {{{videoTitle}}}
Video Description: {{{videoDescription}}}

Analyze the provided information and generate a summary and a list of key moments. If the description is detailed, use it to infer timestamps. If not, provide general key moments without specific timestamps.`,
});

const videoIntelligenceFlow = ai.defineFlow(
  {
    name: 'videoIntelligenceFlow',
    inputSchema: VideoIntelligenceInputSchema,
    outputSchema: VideoIntelligenceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
