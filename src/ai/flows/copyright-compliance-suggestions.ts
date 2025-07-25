'use server';

/**
 * @fileOverview Provides AI-powered suggestions based on YouTube's data policy to improve UX and avoid copyright infringement issues.
 *
 * - getCopyrightComplianceSuggestions - A function that provides suggestions for copyright compliance.
 * - CopyrightComplianceInput - The input type for the getCopyrightComplianceSuggestions function.
 * - CopyrightComplianceOutput - The return type for the getCopyrightComplianceSuggestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CopyrightComplianceInputSchema = z.object({
  videoTitle: z.string().describe('The title of the YouTube video.'),
  videoDescription: z.string().describe('The description of the YouTube video.'),
  videoTags: z.string().describe('The tags associated with the YouTube video.'),
  youtubeDataPolicyUrl: z.string().url().default('https://developers.google.com/youtube/terms/developer-policies')
    .describe('The URL of YouTube data policy.'),
});
export type CopyrightComplianceInput = z.infer<typeof CopyrightComplianceInputSchema>;

const CopyrightComplianceOutputSchema = z.object({
  suggestions: z.array(
    z.string().describe('Suggestions to improve UX and avoid copyright infringement.')
  ).describe('A list of suggestions based on YouTube data policy.'),
});
export type CopyrightComplianceOutput = z.infer<typeof CopyrightComplianceOutputSchema>;

export async function getCopyrightComplianceSuggestions(input: CopyrightComplianceInput): Promise<CopyrightComplianceOutput> {
  return copyrightComplianceSuggestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'copyrightComplianceSuggestionsPrompt',
  input: {schema: CopyrightComplianceInputSchema},
  output: {schema: CopyrightComplianceOutputSchema},
  prompt: `You are an AI assistant that provides suggestions to improve the UX of a YouTube video application and avoid copyright infringement issues based on YouTube's data policy.
  The current YouTube data policy is available here: {{{youtubeDataPolicyUrl}}}

  Provide a list of actionable suggestions based on the following video information:

  Video Title: {{{videoTitle}}}
  Video Description: {{{videoDescription}}}
  Video Tags: {{{videoTags}}}

  Suggestions:`,
});

const copyrightComplianceSuggestionsFlow = ai.defineFlow(
  {
    name: 'copyrightComplianceSuggestionsFlow',
    inputSchema: CopyrightComplianceInputSchema,
    outputSchema: CopyrightComplianceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
