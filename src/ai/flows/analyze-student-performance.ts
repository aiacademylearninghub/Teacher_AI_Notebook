'use server';

/**
 * @fileOverview Analyzes student performance data and provides insights and recommendations.
 *
 * - analyzeStudentPerformance - A function that analyzes student performance data.
 * - AnalyzeStudentPerformanceInput - The input type for the analyzeStudentPerformance function.
 * - AnalyzeStudentPerformanceOutput - The return type for the analyzeStudentPerformance function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Define the subject score type
const SubjectScoreSchema = z.object({
  subject: z.string().describe('The name of the subject'),
  score: z.number().describe('The score obtained in the subject (0-100)'),
});

// Define the month data type that contains scores for all subjects in a month
const MonthDataSchema = z.object({
  month: z.string().describe('The month of the academic year'),
  scores: z.array(SubjectScoreSchema).describe('Array of subject scores for this month'),
  average: z.number().describe('Average score across all subjects for this month'),
});

const AnalyzeStudentPerformanceInputSchema = z.object({
  studentName: z.string().describe('The name of the student'),
  gradeLevel: z.string().describe('The grade level of the student'),
  currentMonth: z.string().describe('The current month for which analysis is needed'),
  previousMonths: z.array(z.string()).describe('Previous months to compare with'),
  monthlyData: z.array(MonthDataSchema).describe('Performance data for current and previous months'),
});
export type AnalyzeStudentPerformanceInput = z.infer<
  typeof AnalyzeStudentPerformanceInputSchema
>;

const AnalyzeStudentPerformanceOutputSchema = z.object({
  overallAnalysis: z.string().describe('Overall analysis of the student performance'),
  strengths: z.array(z.string()).describe('List of subjects where the student is performing well'),
  weaknesses: z.array(z.string()).describe('List of subjects that need improvement'),
  improvementAreas: z.array(z.object({
    subject: z.string().describe('Subject name'),
    recommendation: z.string().describe('Specific recommendation for improvement'),
  })).describe('Detailed recommendations for areas needing improvement'),
  trends: z.array(z.object({
    subject: z.string().describe('Subject name'),
    trend: z.string().describe('Performance trend (improving, declining, stable)'),
    description: z.string().describe('Description of the trend'),
  })).describe('Performance trends across months'),
  visualizationData: z.object({
    compareData: z.array(z.object({
      subject: z.string().describe('Subject name'),
      currentScore: z.number().describe('Current month score'),
      previousScore: z.number().describe('Previous month score'),
      change: z.number().describe('Change in score'),
    })).describe('Data for comparing current vs previous month performance'),
    trendData: z.array(z.object({
      month: z.string().describe('Month name'),
      average: z.number().describe('Average score for the month'),
      subjects: z.record(z.number()).describe('Subject scores for the month'),
    })).describe('Data for visualizing trends across months'),
  }).describe('Data structured for visualization in charts and graphs'),
});
export type AnalyzeStudentPerformanceOutput = z.infer<
  typeof AnalyzeStudentPerformanceOutputSchema
>;

export async function analyzeStudentPerformance(
  input: AnalyzeStudentPerformanceInput
): Promise<AnalyzeStudentPerformanceOutput> {
  return analyzeStudentPerformanceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeStudentPerformancePrompt',
  input: {schema: AnalyzeStudentPerformanceInputSchema},
  output: {schema: AnalyzeStudentPerformanceOutputSchema},
  prompt: `You are an AI tool that analyzes student performance data and provides detailed insights and recommendations.

  Student Name: {{{studentName}}}
  Grade Level: {{{gradeLevel}}}
  Current Month: {{{currentMonth}}}
  Previous Months: {{{previousMonths}}}
  
  Monthly Performance Data:
  {{{monthlyData}}}
  
  Analyze the student's performance with the following:
  1. Provide an overall analysis of the student's performance
  2. Identify strengths (subjects with consistently high scores)
  3. Identify weaknesses (subjects with consistently low scores)
  4. Provide specific recommendations for improving in weak areas
  5. Analyze trends in performance across months
  6. Structure visualization data to be used in charts and graphs
  
  Be specific, insightful, and provide actionable recommendations.
  `,
});

const analyzeStudentPerformanceFlow = ai.defineFlow(
  {
    name: 'analyzeStudentPerformanceFlow',
    inputSchema: AnalyzeStudentPerformanceInputSchema,
    outputSchema: AnalyzeStudentPerformanceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
