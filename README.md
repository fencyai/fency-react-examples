# Fency React Examples

React examples demonstrating Fency AI chat completion patterns.

## Examples

- **Basic Chat Completion** - Synchronous response
- **Streaming Chat Completion** - Real-time response with streaming  
- **Structured Chat Completion** - JSON response using a Zod schema
- **Summarizing Website Content** - Summarizing the content of a website
- **Summarizing File Content** - Summarizing the content of a file
- **File Form Filler** - Filling out a form from a file
- **Website Form Filler** - Filling out a form from a website
- **Chat GPT Clone** - A clone of Chat GPT

## Running the Application Locally

### 1. Get Your Fency API Key

1. Go to [app.fency.ai/signup](https://app.fency.ai/signup) to create a free account
2. Get your publishable key from the dashboard
3. Replace the `VITE_FENCY_PUBLISHABLE_KEY` inside the `.env` file in the project root:

```bash
VITE_FENCY_PUBLISHABLE_KEY=your_publishable_key_here
```

### 2. Install and Run

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`