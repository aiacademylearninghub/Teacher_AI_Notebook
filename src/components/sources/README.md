# Sources Components (`/components/sources`)

This directory contains all React components related to managing data sources for the AI Notebook. Sources are the documents, text, and other media that the AI uses as its knowledge base.

## Components:

-   `source-panel.tsx`: The main panel (typically on the left side) that displays a list of all currently added sources. It also provides the entry point for adding new sources.
-   `source-card.tsx`: A small, reusable component that displays information about a single source in the `SourcePanel`.
-   `upload-source-dialog.tsx`: A dialog window that presents the user with different options for adding a new source (e.g., from computer, text, website).
-   `text-source-form.tsx`: A form used within the upload dialog for pasting or typing text directly as a new source.
