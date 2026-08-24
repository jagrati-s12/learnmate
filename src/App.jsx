import { Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Dashboard from "./components/dashboard/Dashboard";
import MyTextbook from "./components/learn/MyTextbook";
import Topics from "./components/learn/Topics";
import TopicContent from "./components/learn/TopicContent";
import PracticeQuestions from "./components/learn/PracticeQuestions";
import AITutor from "./components/learn/AITutor";
import Progress from "./pages/Progress";
import Performance from "./pages/Performance";
import Calendar from "./pages/Calendar";
import Goals from "./pages/Goals";
import Notes from "./pages/Notes";
import Bookmarks from "./pages/Bookmarks";
import Flashcards from "./pages/Flashcards";
import DoubtSolver from "./pages/DoubtSolver";
import SettingsPage from "./components/settings/SettingsPage";

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />

        <Route path="/learn/textbook" element={<MyTextbook />} />
        <Route path="/learn/topics" element={<Topics />} />
        <Route path="/learn/topic/:id" element={<TopicContent />} />
        <Route path="/learn/practice" element={<PracticeQuestions />} />
        <Route path="/learn/ai-tutor" element={<AITutor />} />

        <Route path="/track/progress" element={<Progress />} />
        <Route path="/track/performance" element={<Performance />} />
        <Route path="/track/calendar" element={<Calendar />} />
        <Route path="/track/goals" element={<Goals />} />

        <Route path="/resources/notes" element={<Notes />} />
        <Route path="/resources/bookmarks" element={<Bookmarks />} />
        <Route path="/resources/flashcards" element={<Flashcards />} />
        <Route path="/resources/doubt-solver" element={<DoubtSolver />} />

        <Route path="/settings/profile" element={<SettingsPage section="profile" />} />
        <Route path="/settings/preferences" element={<SettingsPage section="preferences" />} />
        <Route path="/settings/security" element={<SettingsPage section="security" />} />
      </Routes>
    </Layout>
  );
}
