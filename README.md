# Project Title: AI-Powered Time Management Assistant

## Description

This is a Next.js application designed to be an intelligent time management assistant. It features an AI-powered chat sidebar for scheduling and managing activities, and a comprehensive calendar display.

## Features

*   **AI Chat Assistant:** Interact with an AI (powered by Groq and Llama models) to schedule, modify, and get suggestions for your activities.
*   **Interactive Calendar:** View your schedule in day, week, and month formats. Click on activities for more details.
*   **Activity Management:** (Placeholder for future features like creating/editing activities directly through a UI)
*   **Category Management:** (Placeholder for future features like customizing activity categories)
*   **Theme Toggle:** Light and dark mode support.

## Tech Stack

*   **Framework:** Next.js (App Router)
*   **Language:** TypeScript
*   **Styling:** Tailwind CSS, Shadcn UI
*   **Calendar:** React Big Calendar
*   **AI:** Groq SDK (Llama 3 8B model)
*   **State Management:** React State/Context (implicitly)

## Getting Started

### Prerequisites

*   Node.js (version 18.x or later recommended)
*   pnpm (or npm/yarn)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <your-repo-url>
    cd <your-repo-directory>
    ```

2.  **Install dependencies:**
    ```bash
    pnpm install
    ```
    (or `npm install` / `yarn install`)

3.  **Set up Environment Variables:**
    *   Create a file named `.env.local` in the root of the project by copying the example file:
        ```bash
        cp .env.local.example .env.local
        ```
    *   Open `.env.local` and add your Groq API key:
        ```
        GROQ_API_KEY="your_actual_groq_api_key_here"
        ```
        You can obtain a Groq API key from [console.groq.com](https://console.groq.com/).

4.  **Run the development server:**
    ```bash
    pnpm dev
    ```
    (or `npm run dev` / `yarn dev`)

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Model Context Protocol (Future)

We are currently designing a Model Context Protocol to allow the AI to have a better understanding of your calendar, tasks, and preferences. This will enable more personalized and effective assistance. The initial specification will focus on an API endpoint to provide this contextual data to the AI.
