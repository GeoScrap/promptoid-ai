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
- Supabase account for authentication and database

### Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```
# Supabase
NEXT_PUBLIC_SUPABASE_URL="your-supabase-url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"

# AI API
GEMINI_API_KEY="your-gemini-api-key"
```

### Getting API Keys

#### Supabase

1. Create a project at [Supabase](https://supabase.com/)
2. Get your project URL and anon key from the API settings
3. Add them to your `.env.local` file

#### Google Gemini API

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click on "Get API key" in the left sidebar
4. Create a new API key
5. Add it to your `.env.local` file as `GEMINI_API_KEY`

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. Sign up for an account
2. Enter your initial prompt idea
3. Follow the guided refinement process
4. Copy your refined prompt to use with ChatGPT or other AI tools
5. Save prompts to your library for future use

## Technologies Used

- Next.js 13 with App Router
- Supabase for authentication and database
- PostgreSQL (via Supabase)
- Tailwind CSS
- Google Gemini API
- Framer Motion for animations

## License

MIT
