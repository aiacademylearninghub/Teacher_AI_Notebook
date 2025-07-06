import { z } from 'zod';

export const localStorySchema = z.object({
  topic: z.string().min(3, { message: 'Topic must be at least 3 characters long.' }),
  grade: z.coerce.number().min(1).max(12),
  language: z.string().min(2),
});

export const worksheetWizardSchema = z.object({
  lessonText: z.string().min(20, { message: 'Lesson text must be at least 20 characters long.' }),
  taskType: z.string().min(1, { message: 'Please select a task type.' }),
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

export const studentAnalyzerSchema = z.object({
  studentName: z.string().min(2, { message: 'Student name must be at least 2 characters long.' }),
  gradeLevel: z.string(),
  currentMonth: z.string(),
  previousMonths: z.array(z.string()),
  // Note: The actual data will be generated in the component for demo purposes
  visualizationPreference: z.enum(['detailed', 'simple', 'comprehensive']).optional(),
  chartColorTheme: z.enum(['default', 'monochrome', 'vibrant']).optional()
});
