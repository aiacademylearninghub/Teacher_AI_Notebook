# Studio Tools Components (`/components/studio/tools`)

This directory contains the specific React components that power each of the AI "Studio Tools". Each component in this folder represents a complete, self-contained feature that can be accessed from the main application navigation.

## Structure:

Each tool component (e.g., `local-story-tool.tsx`, `worksheet-wizard-tool.tsx`) is responsible for:
1.  Rendering the user input form using `react-hook-form` and `zod` for validation.
2.  Managing its own state (e.g., `isLoading`, `result`).
3.  Calling the appropriate server action (from `/lib/actions.ts`) to execute the corresponding Genkit AI flow.
4.  Displaying the generated results (which can be text, images, or audio) or any loading/error states to the user. Some tools may offer follow-up actions to generate supplementary content, creating a multi-modal experience.
5.  Using the shared `ToolView` component to maintain a consistent look and feel across all tools.
