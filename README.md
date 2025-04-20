# Promptoid AI - Where Ideas Evolve Into Clarity

Promptoid AI helps you transform rough ideas into precise, detailed prompts that get better results from AI tools like ChatGPT.

## Features

- Intelligent prompt refinement
- Guided conversation to improve prompts
- Save and organize your prompts
- Beautiful, futuristic UI
- Authentication with email/password or Google

## Setup Instructions

### Prerequisites

- Node.js 16+ and npm
- PostgreSQL database

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```
# Database
DATABASE_URL="postgresql://username@localhost:5432/promptoid?schema=public"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"

# Google OAuth (optional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# AI API
GEMINI_API_KEY="your-gemini-api-key"
```

### Getting API Key

#### Google Gemini API

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click on "Get API key" in the left sidebar
4. Create a new API key
5. Add it to your `.env` file as `GEMINI_API_KEY`

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up the database:
   ```bash
   npx prisma migrate dev --name init
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. Sign up for an account
2. Enter your initial prompt idea
3. Follow the guided refinement process
4. Copy your refined prompt to use with ChatGPT or other AI tools
5. Save prompts to your library for future use

## Technologies Used

- Next.js 13 with App Router
- Prisma ORM
- PostgreSQL
- NextAuth.js for authentication
- Tailwind CSS
- Google Gemini API
- Framer Motion for animations

## License

MIT
