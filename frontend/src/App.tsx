import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { LandingPage } from './pages/public/LandingPage';
import { LoginPage } from './pages/public/LoginPage';
import { RegisterPage } from './pages/public/RegisterPage';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { DashboardPage } from './pages/student/DashboardPage';
import { SubjectsPage } from './pages/student/SubjectsPage';
import { TopicsPage } from './pages/student/TopicsPage';
import { PracticePage } from './pages/student/PracticePage';
import { MockTestPage } from './pages/student/MockTestPage';
import { ResultsPage } from './pages/student/ResultsPage';
import { ProgressPage } from './pages/student/ProgressPage';
import { BookmarksPage } from './pages/student/BookmarksPage';
import { ProfilePage } from './pages/student/ProfilePage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Protected Routes (Student Dashboard) */}
            <Route
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/subjects" element={<SubjectsPage />} />
              <Route path="/subjects/:subjectId/topics" element={<TopicsPage />} />
              <Route path="/practice" element={<PracticePage />} />
              <Route path="/practice/:topicId" element={<PracticePage />} />
              <Route path="/tests" element={<MockTestPage />} />
              <Route path="/mock-test" element={<MockTestPage />} />
              <Route path="/tests/:testId" element={<MockTestPage />} />
              <Route path="/results" element={<ResultsPage />} />
              <Route path="/results/:attemptId" element={<ResultsPage />} />
              <Route path="/progress" element={<ProgressPage />} />
              <Route path="/bookmarks" element={<BookmarksPage />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Route>
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;