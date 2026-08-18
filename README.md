# LearnMate — AI Learning Platform

LearnMate is a personalized AI-powered learning platform designed to bring a student's **textbook, practice, AI tutor, goals, resources, and progress tracking** into one application.

The current project focuses on the frontend and provides the UI and component architecture that will later connect to a FastAPI backend and AI/ML system.

## 🚀 Features

### 📊 Dashboard

* Overall learning progress
* Study time and question statistics
* Study streak
* Exam countdown
* Continue Learning section
* Daily goals
* Weekly activity
* AI-based learning recommendation

### 📚 Learning

* My Textbook with subject-wise progress
* Topic and chapter navigation
* Individual topic content pages
* Practice Questions with difficulty levels
* AI Tutor chat interface

### 📈 Tracking

* Progress overview
* Performance statistics
* Study calendar structure
* Personal learning goals

### 📝 Resources

* Notes
* Bookmarks
* Flashcards
* Doubt Solver

### ⚙️ Settings

* Profile settings
* Learning preferences
* Security and account settings

## 🛠️ Tech Stack

| Technology       | Purpose                    |
| ---------------- | -------------------------- |
| React            | Frontend UI                |
| JavaScript       | Application logic          |
| React Router DOM | Client-side routing        |
| CSS              | Styling and responsive UI  |
| Vite             | Development and build tool |
| Lucide React     | Icons                      |
| FastAPI          | Planned backend            |
| Python           | Planned AI/ML layer        |

## 📁 Project Structure

```text
src/
├── App.jsx
├── main.jsx
├── styles.css
│
├── data/
│   └── data.js
│
├── components/
│   ├── common/       # Reusable UI components
│   ├── layout/       # Sidebar, Topbar and Layout
│   ├── dashboard/    # Dashboard components
│   ├── learn/        # Textbook, Topics, Practice and AI Tutor
│   ├── track/        # Progress and tracking components
│   ├── resources/    # Resource components
│   └── settings/     # Settings components
│
└── pages/            # Route-level pages
```

The application is intentionally divided into reusable components instead of keeping the entire application inside `App.jsx`. This makes the project easier to maintain, test, and extend.

## 🔗 Main Routes

```text
/                          Dashboard
/learn/textbook            My Textbook
/learn/topics              Topics
/learn/topic/:id           Topic Content
/learn/practice            Practice Questions
/learn/ai-tutor            AI Tutor
/track/progress            Progress
/track/performance         Performance
/track/calendar            Calendar
/track/goals               Goals
/resources/notes           Notes
/resources/bookmarks       Bookmarks
/resources/flashcards      Flashcards
/resources/doubt-solver    Doubt Solver
/settings/profile          Profile
/settings/preferences      Preferences
/settings/security        Security
```

## 📦 Installation

Clone the repository and install the dependencies:

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd learnmate-frontend
npm install
```

Start the development server:

```bash
npm run dev
```

The application will usually be available at:

```text
http://localhost:5173
```

## 🤖 AI Architecture

The current AI Tutor is a frontend interface. It is designed to connect to the future backend through an API.

```text
┌─────────────────────┐
│    React Frontend   │
└──────────┬──────────┘
           ↓
┌─────────────────────┐
│   FastAPI Backend   │
└──────────┬──────────┘
           ↓
┌─────────────────────┐
│     AI / ML Layer   │
└──────────┬──────────┘
           ↓
┌─────────────────────┐
│ Personalized Answer │
└─────────────────────┘
```

The planned AI system can use information such as **student performance, weak topics, learning progress, previous questions, and study history** to provide personalized explanations, recommendations, and practice.

## 🔀 Git Workflow

For normal development:

```bash
git pull
git add .
git commit -m "Describe your changes"
git push
```

For a new feature, create a separate branch:

```bash
git checkout -b feature/ai-tutor
```

After completing the feature:

```bash
git add .
git commit -m "Add AI tutor UI"
git push -u origin feature/ai-tutor
```

Then create a Pull Request on GitHub.

### ⚠️ Important

* Do not run `git init` repeatedly on an existing repository.
* Do not commit `node_modules/`.
* Do not commit `.env` files, API keys, passwords, or other secrets.

## 🎯 Project Workflow

LearnMate is designed around a continuous learning cycle:

```text
Learn
  ↓
Practice
  ↓
Get Feedback
  ↓
Identify Weak Areas
  ↓
Personalized Recommendation
  ↓
Improve
  ↓
Track Progress
```

## 📌 Development Status

**Current Stage: Frontend Development**

### Completed

* React project structure
* React Router navigation
* Dashboard UI
* Textbook and topic pages
* Practice Questions UI
* AI Tutor interface
* Progress, Performance and Goals UI
* Notes, Bookmarks and Flashcards
* Settings pages
* Reusable component architecture

### In Progress

* FastAPI backend integration
* AI/ML integration
* Database integration
* Authentication
* Real-time progress tracking
* Personalized learning and recommendation system

## 🎓 Project Goal

LearnMate aims to become a complete **personalized AI learning environment** where students can learn concepts, practice questions, ask doubts, understand their weaknesses, receive personalized recommendations, and track their improvement from one platform.
