# AI Directory (`/ai`)

This directory contains all the code related to Generative AI functionality, powered by the Genkit framework.

## Files & Folders:

-   `genkit.ts`: This is the central configuration file for Genkit. It initializes the Genkit instance, configures plugins (like Google AI), and sets the default AI model for the application.
-   `dev.ts`: A development script used by the `genkit` CLI to load all the defined flows during development. This allows for testing and introspection of the AI flows.
-   `/flows`: This subdirectory contains all the individual AI "flows". Each flow encapsulates a specific AI task, such as generating a story, creating a worksheet, or chatting with a document.
