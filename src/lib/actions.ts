"use server";

import { generateLocalStory, GenerateLocalStoryInput } from "@/ai/flows/generate-local-story";
import { generateDifferentiatedWorksheets, GenerateDifferentiatedWorksheetsInput } from "@/ai/flows/generate-differentiated-worksheets";
import { generateSimpleExplanation, GenerateSimpleExplanationInput } from "@/ai/flows/generate-simple-explanations";
import { generateLessonPlan, GenerateLessonPlanInput } from "@/ai/flows/generate-lesson-plan";
import { generateGame, GenerateGameInput } from "@/ai/flows/generate-game";
import { chatWithSources, ChatWithSourcesInput } from "@/ai/flows/chat-with-sources";
import { generateImage, GenerateImageInput } from "@/ai/flows/generate-image";
import { generateAudio, GenerateAudioInput } from "@/ai/flows/generate-audio";
import { extractTextFromImage, ExtractTextFromImageInput } from "@/ai/flows/extract-text-from-image";

export async function runGenerateStory(input: GenerateLocalStoryInput) {
    return await generateLocalStory(input);
}

export async function runGenerateWorksheets(input: GenerateDifferentiatedWorksheetsInput) {
    return await generateDifferentiatedWorksheets(input);
}

export async function runGenerateExplanation(input: GenerateSimpleExplanationInput) {
    return await generateSimpleExplanation(input);
}

export async function runGenerateLessonPlan(input: GenerateLessonPlanInput) {
    return await generateLessonPlan(input);
}

export async function runGenerateGame(input: GenerateGameInput) {
    return await generateGame(input);
}

export async function runChatWithSources(input: ChatWithSourcesInput) {
    return await chatWithSources(input);
}

export async function runGenerateImage(input: GenerateImageInput) {
    return await generateImage(input);
}

export async function runGenerateAudio(input: GenerateAudioInput) {
    return await generateAudio(input);
}

export async function runExtractTextFromImage(input: ExtractTextFromImageInput) {
    return await extractTextFromImage(input);
}
