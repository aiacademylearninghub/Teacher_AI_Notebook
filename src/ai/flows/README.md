# AI Flows Directory (`/ai/flows`)

This directory contains individual Genkit "flows". A flow is a server-side function that orchestrates one or more calls to an AI model to perform a specific, reusable task. This can range from content generation (like stories or lesson plans) to interactive tasks (like playing a game).

## Flow Structure:

Each file in this directory typically defines a single, self-contained AI capability. A standard flow file includes:

1.  **`'use server';` directive**: Marks the module for server-side execution.
2.  **Zod Schemas**: Defines the expected input and output data structures for the flow using `zod`. This ensures type safety and provides a clear contract for the AI model.
3.  **Prompt Definition**: An `ai.definePrompt` block that defines the instructions given to the LLM, often using Handlebars templating to include dynamic input.
4.  **Flow Definition**: An `ai.defineFlow` block that orchestrates the logic, takes the structured input, calls the prompt, and returns the structured output.
5.  **Exported Wrapper Function**: A simple async function that is exported for use in the application's server actions, making the flow easily callable from the frontend.
