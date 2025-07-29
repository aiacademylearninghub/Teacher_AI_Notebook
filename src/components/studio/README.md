# Studio Components (`/components/studio`)

This directory contains components related to the "Studio Tools," which are individual, self-contained AI features.

## Structure:

-   `/tools`: This subdirectory holds the main component for each tool (e.g., `local-story-tool.tsx`). These components manage the form, state, and result display for their respective features.
-   `tool-view.tsx`: A generic layout component that provides a consistent structure for all tool pages. It includes a title, description, and designated areas for the input form and the generated result, ensuring a uniform user experience across all tools.
