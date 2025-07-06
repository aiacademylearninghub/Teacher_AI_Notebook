import { config } from 'dotenv';
config();

import '@/ai/flows/generate-local-story.ts';
import '@/ai/flows/generate-differentiated-worksheets.ts';
import '@/ai/flows/generate-game.ts';
import '@/ai/flows/generate-lesson-plan.ts';
import '@/ai/flows/generate-simple-explanations.ts';
import '@/ai/flows/chat-with-sources.ts';
