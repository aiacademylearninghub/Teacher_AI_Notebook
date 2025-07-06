# Application Directory (`/app`)

This directory implements the application's user interface and routing using the Next.js App Router. Each folder within this directory typically corresponds to a specific URL route.

## Structure:

-   `layout.tsx`: The root layout for the entire application. It sets up the basic HTML structure, includes global CSS, and wraps all pages.
-   `page.tsx`: The main entry point for the root URL (`/`). This is the home page of the AI Notebook.
-   `globals.css`: Contains global CSS styles and Tailwind CSS directives, including the application's color theme variables.
-   `/[tool-name]/page.tsx`: Each subdirectory (e.g., `/explainer`, `/game`, `/planner`, etc.) represents a distinct page for a specific "Studio Tool". The `page.tsx` file within it is the entry component for that route.
