# Lib Directory (`/lib`)

The `lib` directory serves as a central library for shared code, utilities, and configurations that are used across the application.

## Files:

-   `actions.ts`: This file defines all the **Next.js Server Actions**. Server Actions are asynchronous functions that run on the server and can be called directly from client components. This file contains wrapper functions that expose the Genkit AI flows (from `/ai/flows`) to the frontend, acting as the primary bridge between the client and the AI backend.

-   `schemas.ts`: This file contains all the `zod` schemas used for form validation on the client-side. Defining schemas here ensures consistent validation rules for user input across different forms (e.g., for the Studio Tools).

-   `utils.ts`: A utility file for common helper functions. It currently includes `cn`, a helper for conditionally joining Tailwind CSS class names, which is a standard utility in projects using ShadCN/UI.
