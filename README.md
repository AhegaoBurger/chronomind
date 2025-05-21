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

## Model Context Protocol (MCP) Server

This project includes a basic implementation of a Model Context Protocol (MCP) server, located in the `mcp-server/` directory. This server uses the official `@modelcontextprotocol/sdk` to expose user calendar data and scheduling tools according to the MCP standard.

This allows AI models and clients that support MCP (like certain configurations of Claude Desktop or local LLM clients) to interact with this application's data in a standardized way.

### Building and Running the MCP Server

1.  **Navigate to the server directory:**
    ```bash
    cd mcp-server
    ```
2.  **Install dependencies** (if you haven't already):
    ```bash
    pnpm install
    ```
3.  **Build the server** (compile TypeScript to JavaScript):
    ```bash
    pnpm run build
    ```
    This will create a `build/` directory with the compiled code.
4.  **Run the server:**
    ```bash
    node build/index.js
    ```
    The server will then be active and waiting for an MCP client to connect via stdio.

For more detailed information on the server's capabilities, exposed resources, and tools, please refer to the [MCP Server Details documentation](./docs/MCP_SERVER_DETAILS.md).

### Integration with MCP Clients

To integrate this server with an MCP client (e.g., Claude Desktop), you would typically configure the client's "Model Context" settings to use a custom command. The command should be the one used to run the server, for example:
`node /path/to/your/project/mcp-server/build/index.js`
(Ensure you replace `/path/to/your/project/` with the actual absolute path to where you've cloned this repository).
The client will then communicate with the server over standard input/output.
