'use server';

/**
 * @fileOverview An AI agent that provides copyright-free music suggestions for audio-only mode.
 *
 * - generateCopyrightFreeMusic - A function that suggests copyright-free music based on the YouTube video.
 * - CopyrightFreeMusicInput - The input type for the generateCopyrightFreeMusic function.
 * - CopyrightFreeMusicOutput - The return type for the generateCopyrightFreeMusic function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CopyrightFreeMusicInputSchema = z.object({
  videoTitle: z.string().describe('The title of the YouTube video.'),
  videoDescription: z.string().describe('The description of the YouTube video.'),
});
export type CopyrightFreeMusicInput = z.infer<typeof CopyrightFreeMusicInputSchema>;

const CopyrightFreeMusicOutputSchema = z.object({
  musicSuggestion: z.string().describe('A suggestion for copyright-free music similar to the YouTube video.'),
});
export type CopyrightFreeMusicOutput = z.infer<typeof CopyrightFreeMusicOutputSchema>;

export async function generateCopyrightFreeMusic(input: CopyrightFreeMusicInput): Promise<CopyrightFreeMusicOutput> {
  return generateCopyrightFreeMusicFlow(input);
}

const prompt = ai.definePrompt({
  name: 'copyrightFreeMusicPrompt',
  input: {schema: CopyrightFreeMusicInputSchema},
  output: {schema: CopyrightFreeMusicOutputSchema},
  prompt: `You are a music expert specializing in copyright-free music.

You will use the title and description of a YouTube video to suggest copyright-free music that is similar in genre and style.

Title: {{{videoTitle}}}
Description: {{{videoDescription}}}

Suggest copyright-free music:`,
});

const generateCopyrightFreeMusicFlow = ai.defineFlow(
  {
    name: 'generateCopyrightFreeMusicFlow',
    inputSchema: CopyrightFreeMusicInputSchema,
    outputSchema: CopyrightFreeMusicOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
