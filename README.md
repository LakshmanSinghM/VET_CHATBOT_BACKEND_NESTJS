# VET_CHATBOT_BACKEND_NESTJS

Validation and Logic Layer for the Veterinary Chatbot System. Built with [NestJS](https://nestjs.com/).

## Description

This is the backend service that powers the Veterinary Chatbot. It handles:
- Chat sessions and context management.
- Integration with Google's Gemini AI model.
- Appointment booking logic and persistence.
- Data storage using MongoDB.

## Tech Stack

- **Framework**: NestJS
- **Database**: MongoDB (Mongoose)
- **AI**: Google Gemini Pro (via `@google/generative-ai`)
- **Language**: TypeScript

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- MongoDB Atlas account (or local MongoDB)
- Google AI Studio API Key

## Installation

1.  **Clone the repository** (if not already done):
    ```bash
    git clone <repository-url>
    cd VET_CHATBOT_BACKEND_NESTJS
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

## Configuration

1.  Create a `.env` file in the root directory.
2.  Copy the contents of `.env.example` and fill in your values:

    ```env
    MONGODB_URI=mongodb+srv://...
    GEMINI_API_KEY=AIzaSy...
    PORT=5000
    CORS_ORIGINS=http://localhost:5173,http://localhost:3000
    ```

## Running the App

```bash
# development
npm run start

# watch mode (recommended for dev)
npm run start:dev

# production mode
npm run start:prod
```

## API Endpoints

The API is prefixed with `/api`.

-   **POST /api/chat**: Send a message to the bot.
    -   Body: `{ "message": "Hello", "sessionId": "...", "context": {...} }`
    -   Response: `{ "reply": "..." }`

## Project Structure

-   `src/app.module.ts`: Main application module.
-   `src/chat/`: Chat module containing service, controller, and schemas.
-   `src/schemas/`: Mongoose schemas for Session and Appointment.
