# LearnMate Frontend

React + Vite frontend starter for the personalized AI learning platform.

## Run

```bash
npm install
npm run dev
```

Open the local Vite URL shown in the terminal.

## Current pages

- Dashboard
- My Textbook
- Topics
- Topic Content
- Practice Questions
- AI Tutor
- Progress
- Performance
- Calendar
- Goals
- Notes
- Bookmarks
- Flashcards
- Doubt Solver
- Profile
- Preferences
- Security

## Next integration

The AI Tutor currently uses mock responses. Replace the `send()` function in `src/App.jsx` with an Axios/fetch POST request to the FastAPI endpoint, for example:

POST `/api/ai/tutor`

The frontend should then send the current topic, student context, and message to FastAPI and render the returned response.
