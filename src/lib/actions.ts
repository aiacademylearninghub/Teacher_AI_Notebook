"use server";

import { generateLocalStory, GenerateLocalStoryInput } from "@/ai/flows/generate-local-story";
import { generateDifferentiatedWorksheets, GenerateDifferentiatedWorksheetsInput } from "@/ai/flows/generate-differentiated-worksheets";
import { generateSimpleExplanation, GenerateSimpleExplanationInput } from "@/ai/flows/generate-simple-explanations";
import { generateLessonPlan, GenerateLessonPlanInput } from "@/ai/flows/generate-lesson-plan";
import { generateGame, GenerateGameInput } from "@/ai/flows/generate-game";

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
