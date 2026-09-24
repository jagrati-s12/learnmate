import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Topbar } from '../../components/layout/Topbar';
import { Button } from '../../components/ui/Button';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Icons } from '../../assets/icons';
import { Brain } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { analyticsAPI } from '../../api/analytics';
import { mockTestsAPI, MockTestAttempt } from '../../api/mockTests';

export const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [attempts, setAttempts] = useState<MockTestAttempt[]>([]);
  const [aiProfile, setAiProfile] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);


  useEffect(() => {
    
    const loadStats = async () => {
      try {
        const userAttempts = await mockTestsAPI.getUserAttempts();
        setAttempts(userAttempts);
      } catch (err) {}
      
      try {
        setLoadingAi(true);
        const aiData = await analyticsAPI.getAIProfile();
        if (aiData && aiData.profile) {
          setAiProfile(aiData.profile);
        }
      } catch (e) {
        console.error('Failed to load AI profile', e);
      } finally {
        setLoadingAi(false);
      }
    };


    if (user) {
      loadStats();
    }
  }, [user]);

  if (!user) {
    return (
      <>
        <Topbar title="My Profile" />
        <div className="flex-1 overflow-auto p-6">
          <div className="text-center py-12">
            <p className="text-theme-text-secondary">Loading user data...</p>
          </div>
        </div>
      </>
    );
  }

  // Calculate user stats from attempts
  const testsTaken = attempts.length;
  const completedAttempts = attempts.filter(a => a.completed_at);
  const totalScore = completedAttempts.reduce((sum, a) => sum + a.score, 0);
  const totalQuestions = completedAttempts.reduce((sum, a) => sum + a.total_questions, 0);
  const totalCorrect = completedAttempts.reduce((sum, a) => sum + a.correct_answers, 0);
  const accuracy = totalCorrect + completedAttempts.reduce((sum, a) => sum + a.incorrect_answers, 0) > 0
    ? Math.round((totalCorrect / (totalCorrect + completedAttempts.reduce((sum, a) => sum + a.incorrect_answers, 0))) * 100)
    : 0;

  const memberSince = user.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : '—';

  // Get initials
  const initials = user.full_name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <>
      <Topbar title="My Profile" />
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-3xl mx-auto">
          {/* Profile Header */}
          <Card className="mb-6">
            <CardBody className="flex items-center gap-6">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                {initials}
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold">{user.full_name}</h2>
                <div className="flex items-center gap-3 text-theme-text-muted">
                  <Icons.User className="w-4 h-4" />
                  <span>{user.email}</span>
                </div>
                {user.is_admin && (
                  <div className="flex items-center gap-2 text-sm text-theme-accent-primary">
                    <span className="bg-theme-bg-elevated px-2 py-0.5 rounded-full text-xs font-medium">Admin</span>
                  </div>
                )}
              </div>
            </CardBody>
          </Card>


          {/* AI Personality */}
          <Card className="mb-6 border-[rgba(201,166,107,0.16)]">
            <CardHeader className="bg-theme-bg-elevated flex flex-row items-center gap-2 border-b-0 pb-0">
              <Brain className="w-5 h-5 text-theme-accent-primary" />
              <h2 className="text-lg font-semibold text-blue-900 border-none m-0">AI Test Personality Profile</h2>
            </CardHeader>
            <CardBody>
              {loadingAi ? (
                <div className="flex justify-center py-4">
                  <div className="animate-pulse flex space-x-2 items-center">
                    <Brain className="text-blue-300 w-5 h-5" />
                    <span className="text-blue-400">Analyzing past tests...</span>
                  </div>
                </div>
              ) : aiProfile ? (
                <div className="whitespace-pre-line text-theme-text-secondary leading-relaxed">
                  {aiProfile}
                </div>
              ) : (
                <div className="text-theme-text-muted italic">
                  Take more mock tests to enable your AI Personality Profile!
                </div>
              )}
            </CardBody>
          </Card>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardBody className="text-center">
                <div className="text-sm text-theme-text-secondary mb-1">Tests Taken</div>
                <div className="text-2xl font-bold text-theme-accent-primary">{testsTaken}</div>
              </CardBody>
            </Card>

            <Card>
              <CardBody className="text-center">
                <div className="text-sm text-theme-text-secondary mb-1">Total Score</div>
                <div className="text-2xl font-bold text-green-600">{totalScore}</div>
              </CardBody>
            </Card>

            <Card>
              <CardBody className="text-center">
                <div className="text-sm text-theme-text-secondary mb-1">Questions</div>
                <div className="text-2xl font-bold text-indigo-600">{totalQuestions}</div>
              </CardBody>
            </Card>

            <Card>
              <CardBody className="text-center">
                <div className="text-sm text-theme-text-secondary mb-1">Accuracy</div>
                <div className="text-2xl font-bold text-orange-600">
                  {accuracy > 0 ? `${accuracy}%` : '—'}
                </div>
              </CardBody>
            </Card>
          </div>

          {/* Account Info */}
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold">Account Information</h2>
            </CardHeader>
            <CardBody>
              <div className="space-y-3">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-theme-bg-elevated rounded-full flex items-center justify-center text-theme-text-secondary">
                    <Icons.User className="w-4 h-4" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-medium text-theme-text-primary">Full Name</p>
                    <p className="text-theme-text-secondary">{user.full_name}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-theme-bg-elevated rounded-full flex items-center justify-center text-theme-text-secondary">
                    <Icons.User className="w-4 h-4" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-medium text-theme-text-primary">Email</p>
                    <p className="text-theme-text-secondary">{user.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-theme-bg-elevated rounded-full flex items-center justify-center text-theme-text-secondary">
                    <Icons.Clock className="w-4 h-4" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-medium text-theme-text-primary">Member Since</p>
                    <p className="text-theme-text-secondary">{memberSince}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-theme-bg-elevated rounded-full flex items-center justify-center text-theme-text-secondary">
                    <Icons.CheckCircle className="w-4 h-4" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-medium text-theme-text-primary">Account Status</p>
                    <p className="text-theme-text-secondary">
                      {user.is_active ? 'Active' : 'Inactive'}
                    </p>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>

          <div className="flex gap-3 mt-6">
            <Button
              variant="secondary"
              fullWidth
              onClick={() => alert('Edit profile functionality coming soon!')}
            >
              Edit Profile
            </Button>
            <Button
              variant="primary"
              fullWidth
              onClick={() => {
                logout();
                navigate('/');
              }}
            >
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};