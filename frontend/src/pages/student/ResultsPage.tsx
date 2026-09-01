import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Topbar } from '../../components/layout/Topbar';
import { Button } from '../../components/ui/Button';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { mockTestsAPI, MockTestResult } from '../../api/mockTests';

export const ResultsPage: React.FC = () => {
  const navigate = useNavigate();
  const [result, setResult] = useState<MockTestResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Attempt to get attempt ID from location state (passed from MockTestPage on submit)
  // For demo purposes, we'll try to get the latest attempt
  useEffect(() => {
    const loadResult = async () => {
      try {
        setLoading(true);
        // In a real implementation, we would get the attempt ID from:
        // 1. URL parameter: /results/:attemptId
        // 2. Location state: location.state?.attemptId
        // 3. Or fetch latest attempt

        // For now, let's get the user's latest attempt
        const attempts = await mockTestsAPI.getUserAttempts();
        if (attempts.length > 0) {
          const latestAttempt = attempts[0];
          const detailedResult = await mockTestsAPI.getTestResult(latestAttempt.attempt_id);
          setResult(detailedResult);
        } else {
          // No attempts yet - show empty state
          setResult(null);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load test results');
      } finally {
        setLoading(false);
      }
    };

    loadResult();
  }, []);

  if (loading) {
    return (
      <>
        <Topbar title="Test Results" />
        <div className="flex-1 overflow-auto p-6">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full border-4 border-t-blue-600 h-16 w-16 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading results...</p>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Topbar title="Test Results" />
        <div className="flex-1 overflow-auto p-6">
          <div className="text-center py-12">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
              <p className="text-red-600 mb-4">Error loading results: {error}</p>
              <Button variant="primary" onClick={() => navigate('/dashboard')}>
                Back to Dashboard
              </Button>
            </div>
          </div>
        </div>
      </>
    );
  }

  // If no result/data available
  if (!result) {
    return (
      <>
        <Topbar title="Test Results" />
        <div className="flex-1 overflow-auto p-6">
          <div className="text-center py-12">
            <div className="bg-gray-50 p-8 rounded-lg">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">No Test Results Yet</h2>
              <p className="text-gray-600 mb-6">
                You haven't taken any mock tests yet. Take a mock test to see your results here.
              </p>
              <Button variant="primary" onClick={() => navigate('/mock-test')}>
                Take a Mock Test
              </Button>
            </div>
          </div>
        </div>
      </>
    );
  }

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  return (
    <>
      <Topbar title="Test Results" />
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-5xl mx-auto">
          {/* Results Header */}
          <div className="bg-gradient-to-br from-green-500 to-green-700 text-white p-12 rounded-xl text-center mb-6">
            <h2 className="text-4xl font-bold mb-2">
              {result.score >= result.total_marks * 0.7 ? '🎉 Excellent!' : result.score >= result.total_marks * 0.5 ? '👍 Good Job!' : '💪 Keep Practicing!'}
            </h2>
            <p className="text-lg opacity-95">
              {result.mock_test_name}
            </p>
          </div>

          {/* Score Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
            <Card>
              <CardBody className="text-center">
                <div className="text-sm text-gray-600 mb-1">Total Score</div>
                <div className="text-3xl font-bold">{result.score}/{result.total_marks}</div>
              </CardBody>
            </Card>

            <Card>
              <CardBody className="text-center">
                <div className="text-sm text-gray-600 mb-1">Correct</div>
                <div className="text-3xl font-bold text-green-600">{result.correct_answers}</div>
              </CardBody>
            </Card>

            <Card>
              <CardBody className="text-center">
                <div className="text-sm text-gray-600 mb-1">Incorrect</div>
                <div className="text-3xl font-bold text-red-600">{result.incorrect_answers}</div>
              </CardBody>
            </Card>

            <Card>
              <CardBody className="text-center">
                <div className="text-sm text-gray-600 mb-1">Unattempted</div>
                <div className="text-3xl font-bold text-gray-400">{result.unattempted}</div>
              </CardBody>
            </Card>

            <Card>
              <CardBody className="text-center">
                <div className="text-sm text-gray-600 mb-1">Accuracy</div>
                <div className="text-3xl font-bold">{result.accuracy}%</div>
              </CardBody>
            </Card>

            <Card>
              <CardBody className="text-center">
                <div className="text-sm text-gray-600 mb-1">Time Taken</div>
                <div className="text-3xl font-bold">{formatTime(result.total_time_seconds)}</div>
              </CardBody>
            </Card>
          </div>

          {/* Question Review */}
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold">Question-wise Analysis</h2>
              <div className="flex justify-between items-center">
                <Button variant="primary" size="sm">
                  Review All Questions
                </Button>
                <span className="text-sm text-gray-500">
                  {result.questions.length} questions
                </span>
              </div>
            </CardHeader>
            <CardBody>
              <div className="space-y-3">
                {result.questions.map((q, index) => {
                  const isCorrect = q.is_correct;
                  return (
                    <div
                      key={q.id}
                      className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors cursor-pointer"
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold flex-shrink-0 ${
                        isCorrect
                          ? 'bg-green-100 text-green-600'
                          : 'bg-red-100 text-red-600'
                      }`}>
                        {isCorrect ? '✓' : '✗'}
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900">
                          Question {index + 1}
                        </div>
                        <div className="text-sm text-gray-600">
                          Your answer: {q.user_answer || 'Not Attempted'}
                          {!isCorrect && q.correct_option && q.user_answer && (
                            ` • Correct answer: ${q.correct_option}`
                          )}
                          {isCorrect && q.user_answer && ' (Correct)'}
                          {' '}• Time: {q.time_taken_seconds || 0}s
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardBody>
          </Card>

          <div className="flex justify-center gap-4 mt-6">
            <Button variant="primary" onClick={() => navigate('/dashboard')}>
              Back to Dashboard
            </Button>
            <Button variant="secondary" onClick={() => navigate('/practice')}>
              Practice Similar Questions
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};