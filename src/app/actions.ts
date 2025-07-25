"use server";

import { generateCopyrightFreeMusic, CopyrightFreeMusicInput } from '@/ai/flows/audio-only-mode';
import { getCopyrightComplianceSuggestions, CopyrightComplianceInput } from '@/ai/flows/copyright-compliance-suggestions';
import { z } from 'zod';

const audioSchema = z.object({
  videoTitle: z.string(),
  videoDescription: z.string(),
});

export async function runAudioOnlySuggestion(input: CopyrightFreeMusicInput) {
  const validatedInput = audioSchema.safeParse(input);
  if (!validatedInput.success) {
    throw new Error('Invalid input for audio suggestion.');
  }
  try {
    return await generateCopyrightFreeMusic(validatedInput.data);
  } catch (error) {
    console.error(error);
    return { musicSuggestion: "Sorry, I couldn't generate a suggestion at this time." };
  }
}

const complianceSchema = z.object({
  videoTitle: z.string(),
  videoDescription: z.string(),
  videoTags: z.string(),
});

export async function runCopyrightCompliance(input: CopyrightComplianceInput) {
    const validatedInput = complianceSchema.safeParse(input);
    if (!validatedInput.success) {
        throw new Error('Invalid input for copyright compliance.');
    }
  try {
    return await getCopyrightComplianceSuggestions(validatedInput.data);
  } catch (error) {
    console.error(error);
    return { suggestions: ["Sorry, I couldn't generate suggestions at this time."] };
  }
}
