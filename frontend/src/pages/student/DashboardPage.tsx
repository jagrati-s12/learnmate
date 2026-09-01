import React, { useState, useEffect } from 'react';
import { Topbar } from '../../components/layout/Topbar';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { useAuth } from '../../contexts/AuthContext';
import { mockTestsAPI } from '../../api/mockTests';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    questionsAttempted: 0,
    accuracy: 0,
    testsCompleted: 0,
    streak: 0
  });
  const [recentActivity, setRecentActivity] = useState<Array<any>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        if (!user) return;

        // Get mock test attempts
        const attempts = await mockTestsAPI.getUserAttempts();
        const completedAttempts = attempts.filter(a => a.completed_at !== null);

        // Calculate stats
        const questionsAttempted = completedAttempts.reduce(
          (sum, attempt) => sum + (attempt.correct_answers + attempt.incorrect_answers + attempt.unattempted),
          0
        );

        const totalCorrect = completedAttempts.reduce(
          (sum, attempt) => sum + attempt.correct_answers,
          0
        );

        const totalAttempted = completedAttempts.reduce(
          (sum, attempt) => sum + (attempt.correct_answers + attempt.incorrect_answers),
          0
        );

        const accuracy = totalAttempted > 0 ? Math.round((totalCorrect / totalAttempted) * 100) : 0;

        const testsCompleted = completedAttempts.length;

        // For streak, we'll calculate based on recent activity (simplified)
        // In a real app, this would track daily practice
        const streak = 0; // Placeholder

        setStats({
          questionsAttempted,
          accuracy,
          testsCompleted,
          streak
        });

        // Format recent activity
        const formattedActivity = attempts
          .filter(a => a.completed_at !== null)
          .sort((a, b) => new Date(b.completed_at!).getTime() - new Date(a.completed_at!).getTime())
          .slice(0, 5)
          .map((attempt, index) => ({
            id: attempt.attempt_id,
            name: attempt.mock_test_name || `Mock Test #${index + 1}`,
            accuracy: attempt.correct_answers + attempt.incorrect_answers > 0
              ? Math.round((attempt.correct_answers / (attempt.correct_answers + attempt.incorrect_answers)) * 100)
              : 0,
            time: attempt.completed_at
              ? new Date(attempt.completed_at).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })
              : 'Just now',
            questions: attempt.total_questions,
            duration: '0 min'
          }));

        setRecentActivity(formattedActivity);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
        // Keep default stats
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadDashboardData();
    } else {
      setLoading(false);
    }
  }, [user]);

  if (loading) {
    return (
      <>
        <Topbar title="Dashboard" />
        <div className="flex-1 overflow-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i}>
                <CardBody className="text-center py-8">
                  <div className="animate-spin rounded-full border-4 border-t-blue-600 h-12 w-12 mx-auto mb-4"></div>
                  <p className="text-sm text-gray-500">Loading...</p>
                </CardBody>
              </Card>
            ))}
          </div>

          <Card className="mb-6">
            <CardBody className="text-center py-8">
              <div className="animate-spin rounded-full border-4 border-t-blue-600 h-12 w-12 mx-auto mb-4"></div>
              <p className="text-sm text-gray-500">Loading...</p>
            </CardBody>
          </Card>
        </div>
      </>
    );
  }

  return (
    <>
      <Topbar title="Dashboard" />
      <div className="flex-1 overflow-auto p-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardBody>
              <div className="text-sm text-gray-600 mb-1">Questions Attempted</div>
              <div className="text-3xl font-bold mb-1">{stats.questionsAttempted.toLocaleString()}</div>
              <div className="text-sm text-green-600">+124 this week</div>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <div className="text-sm text-gray-600 mb-1">Overall Accuracy</div>
              <div className="text-3xl font-bold mb-1">{stats.accuracy}%</div>
              <div className="text-sm text-green-600">+3.2% from last month</div>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <div className="text-sm text-gray-600 mb-1">Mock Tests Taken</div>
              <div className="text-3xl font-bold mb-1">{stats.testsCompleted}</div>
              <div className="text-sm text-green-600">3 this week</div>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <div className="text-sm text-gray-600 mb-1">Study Streak</div>
              <div className="text-3xl font-bold mb-1">{stats.streak} days</div>
              <div className="text-sm text-orange-600">Keep it up!</div>
            </CardBody>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">Recent Activity</h2>
          </CardHeader>
          <CardBody>
            {recentActivity.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600">No recent activity yet.</p>
                <p className="text-sm text-gray-500">
                  Start practicing or take a mock test to see your activity here.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <div className="font-semibold text-gray-900">{activity.name}</div>
                      <div className="text-sm text-gray-600 mt-1">
                        {activity.time} • {activity.questions} questions • {activity.duration}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-lg font-semibold ${
                        activity.accuracy >= 75 ? 'text-green-600' : 'text-orange-600'
                      }`}>
                        {activity.accuracy}%
                      </div>
                      <div className="text-xs text-gray-500">Accuracy</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </>
  );
};