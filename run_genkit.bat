@echo off
cd /d "d:\AI\AI-startup\studio"
set GEMINI_API_KEY=AIzaSyClWMsovFyqv1_nrFFRm6TjnkBABHceIT8
echo Starting Genkit server with Gemini API key...
npm run genkit:dev
