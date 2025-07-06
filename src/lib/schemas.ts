import { z } from 'zod';

export const localStorySchema = z.object({
  topic: z.string().min(3, { message: 'Topic must be at least 3 characters long.' }),
  grade: z.coerce.number().min(1).max(12),
  language: z.string().min(2),
});

export const worksheetWizardSchema = z.object({
  lessonText: z.string().min(20, { message: 'Lesson text must be at least 20 characters long.' }),
  gradeLevel: z.string(),
  language: z.string().min(2),
});

export const simpleExplainerSchema = z.object({
  question: z.string().min(10, { message: 'Question must be at least 10 characters long.' }),
  gradeLevel: z.string(),
  language: z.string().min(2),
});

export const lessonPlannerSchema = z.object({
  topic: z.string().min(3, { message: 'Topic must be at least 3 characters long.' }),
  gradeLevel: z.string(),
  language: z.string().min(2),
});

export const gameTimeSchema = z.object({
  topic: z.string().min(3, { message: 'Topic must be at least 3 characters long.' }),
  gradeLevel: z.string(),
  language: z.string().min(2),
});
