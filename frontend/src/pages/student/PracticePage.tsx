import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Topbar } from '../../components/layout/Topbar';
import { Button } from '../../components/ui/Button';
import { Icons } from '../../assets/icons';
import { Flag } from 'lucide-react';
import { practiceAPI, PracticeSession } from '../../api/practice';

export const PracticePage: React.FC = () => {
  const { topicId: paramTopicId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [session, setSession] = useState<PracticeSession | null>(null);
  const [topicName, setTopicName] = useState<string>('Topic');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [attempts, setAttempts] = useState<Record<number, any>>({});

  useEffect(() => {
    const startPractice = async () => {
      const activeTopicId = paramTopicId || searchParams.get('topic_id');
      if (!activeTopicId) return;
      try {
        setLoading(true);
        const tid = parseInt(activeTopicId);

        const newSession = await practiceAPI.startSession({
          topic_id: tid,
          num_questions: 10,
        });
        setSession(newSession);
        setTopicName(newSession.topic_name || 'Topic');
        setStartTime(Date.now());
      } catch (err: any) {
        setError(err.message || 'Failed to start practice session');
      } finally {
        setLoading(false);
      }
    };

    startPractice();
  }, [paramTopicId, searchParams]);

  if (loading) {
    return (
      <>
        <Topbar title="Practice Mode" />
        <div className="flex-1 overflow-auto p-6">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full border-4 border-t-blue-600 h-16 w-16 mx-auto mb-4"></div>
            <p className="text-theme-text-secondary">Loading practice session...</p>
          </div>
        </div>
      </>
    );
  }

  if (error || !session) {
    return (
      <>
        <Topbar title="Practice Mode" />
        <div className="flex-1 overflow-auto p-6">
          <div className="text-center py-12">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
              <p className="text-red-600 mb-4">Error: {error || 'No questions available'}</p>
              <Button variant="primary" onClick={() => navigate('/subjects')}>
                Back to Subjects
              </Button>
            </div>
          </div>
        </div>
      </>
    );
  }

  const currentQuestion = session.questions[currentIndex];
  
  const currentAttempt = currentQuestion ? attempts[currentQuestion.id] || {
    selectedOption: null,
    showResult: false,
    result: null,
    isBookmarked: false,
    isMarkedForReview: false
  } : null;
  
  const selectedOption = currentAttempt?.selectedOption;
  const showResult = currentAttempt?.showResult || false;
  const result = currentAttempt?.result;
  const isBookmarked = currentAttempt?.isBookmarked || false;
  const isMarkedForReview = currentAttempt?.isMarkedForReview || false;

  const updateAttempt = (updates: any) => {
    if (!currentQuestion) return;
    setAttempts(prev => ({
      ...prev,
      [currentQuestion.id]: {
        ...(prev[currentQuestion.id] || {
          selectedOption: null,
          showResult: false,
          result: null,
          isBookmarked: false,
          isMarkedForReview: false
        }),
        ...updates
      }
    }));
  };

  if (!currentQuestion) {
    return (
      <>
        <Topbar title="Practice Mode" />
        <div className="flex-1 overflow-auto p-6">
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold text-theme-text-primary mb-4">Session Complete!</h2>
            <p className="text-theme-text-secondary mb-6">You've completed all questions in this practice session.</p>
            <Button variant="primary" onClick={() => navigate('/subjects')}>
              Back to Subjects
            </Button>
          </div>
        </div>
      </>
    );
  }

  const handleSubmit = async () => {
    if (!selectedOption) {
      alert('Please select an answer first');
      return;
    }
    try {
      const timeTaken = Math.floor((Date.now() - startTime) / 1000);
      const res = await practiceAPI.submitAnswer({
        question_id: currentQuestion.id,
        selected_option: selectedOption,
        time_taken_seconds: timeTaken,
      });
      updateAttempt({ result: res });
      updateAttempt({ showResult: true });
    } catch (err: any) {
      setError(err.message || 'Failed to submit answer');
    }
  };

  const handleNext = () => {
    if (currentIndex < session.questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setStartTime(Date.now());
    } else {
      // Session complete
      alert('Practice session complete! Great job!');
      navigate('/subjects');
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setStartTime(Date.now());
    }
  };

  const handleToggleReview = () => {
    updateAttempt({ isMarkedForReview: !isMarkedForReview });
  };

  const handleBookmark = async () => {
    try {
      if (isBookmarked) {
        await practiceAPI.removeBookmark(currentQuestion.id);
        updateAttempt({ isBookmarked: false });
      } else {
        await practiceAPI.bookmarkQuestion(currentQuestion.id);
        updateAttempt({ isBookmarked: true });
      }
    } catch (err: any) {
      alert('Failed to update bookmark: ' + (err.message || 'Unknown error'));
    }
  };

  const correctLabel = result?.correct_option || '';

  return (
    <>
      <Topbar title={`Practice • ${topicName || session.topic_name || 'Topic'}`} />

      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-4xl mx-auto">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate('/subjects')}
            className="mb-4"
          >
            ← Exit Practice
          </Button>

          <div className="bg-theme-bg-secondary border border-[rgba(243,237,227,0.08)] rounded-xl p-8 mb-6">
            <div className="flex justify-between items-center pb-4 mb-6 border-b border-[rgba(243,237,227,0.08)]">
              <span className="font-semibold text-theme-text-secondary">
                Question {currentIndex + 1} of {session.questions.length}
              </span>
              <div className="flex gap-2">
                <span className="bg-theme-bg-elevated text-theme-accent-primary px-3 py-1 rounded-md text-sm font-medium capitalize">
                  {currentQuestion.difficulty}
                </span>
                <span className="bg-theme-bg-elevated text-theme-text-secondary px-3 py-1 rounded-md text-sm font-medium">
                  {currentQuestion.marks} {currentQuestion.marks === 1 ? 'mark' : 'marks'}
                </span>
              </div>
            </div>

            <div className="text-lg leading-relaxed text-theme-text-primary mb-8 whitespace-pre-line">
              {currentQuestion.question_text}
            </div>

            <div className="space-y-3">
              {currentQuestion.options.map((option) => {
                const isSelected = selectedOption === option.option_label;
                const isCorrect = option.option_label === correctLabel;
                const showCorrect = showResult && isCorrect;
                const showIncorrect = showResult && isSelected && !isCorrect;

                return (
                  <button
                    key={option.id}
                    onClick={() => !showResult && updateAttempt({ selectedOption: option.option_label })}
                    disabled={showResult}
                    className={`w-full flex items-start gap-4 p-4 border-2 rounded-lg text-left transition-colors text-theme-text-primary ${
                      showCorrect
                        ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                        : showIncorrect
                        ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                        : isSelected
                        ? 'border-blue-500 bg-theme-bg-elevated'
                        : 'border-[rgba(243,237,227,0.08)] hover:border-blue-500 hover:bg-theme-bg-elevated'
                    } ${showResult ? 'cursor-default' : 'cursor-pointer'}`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold flex-shrink-0 ${
                      showCorrect
                        ? 'bg-green-500 text-white'
                        : showIncorrect
                        ? 'bg-red-500 text-white'
                        : isSelected
                        ? 'bg-blue-600 text-white'
                        : 'bg-theme-bg-elevated text-theme-text-secondary'
                    }`}>
                      {option.option_label}
                    </div>
                    <div className="flex-1 pt-1">
                      {option.option_text}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="flex gap-3 mt-8 pt-6 border-t border-[rgba(243,237,227,0.08)]">
              {!showResult ? (
                <>
                  <Button variant="secondary" onClick={handleToggleReview} className={isMarkedForReview ? "!text-orange-500 !bg-orange-50 !border-orange-300 dark:!bg-orange-900/30" : ""}>
                    <Flag className={isMarkedForReview ? "w-4 h-4 fill-orange-500 text-orange-500" : "w-4 h-4"} />
                    {isMarkedForReview ? 'Marked for Review' : 'Mark for Review'}
                  </Button>
                  <Button variant="primary" onClick={handleSubmit}>
                    Submit Answer
                  </Button>
                  <Button variant="secondary" onClick={handleBookmark} className={isBookmarked ? "text-blue-600 font-medium" : ""}>
                    <Icons.Bookmark className="w-4 h-4" />
                    {isBookmarked ? 'Bookmarked' : 'Bookmark'}
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="secondary" onClick={handlePrevious} disabled={currentIndex === 0}>
                    ← Previous
                  </Button>
                  <Button variant="primary" onClick={handleNext}>
                  {currentIndex < session.questions.length - 1 ? 'Next Question →' : 'Complete Session'}
                  </Button>
                </>
              )}
            </div>

            {showResult && result && (
              <div className={`mt-6 p-6 border rounded-lg ${
                result.is_correct
                  ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800'
                  : 'bg-theme-bg-elevated border-[rgba(201,166,107,0.16)]'
              }`}>
                <div className={`font-semibold mb-2 ${
                  result.is_correct ? 'text-green-900 dark:text-green-400' : 'text-blue-900 dark:text-blue-400'
                }`}>
                  {result.is_correct ? '✓ Correct!' : '✗ Incorrect'}
                </div>
                <div className="text-theme-text-secondary mb-2">
                  <strong>Correct Answer: {result.correct_option}</strong>
                </div>
                {result.explanation && (
                  <div className="text-theme-text-secondary whitespace-pre-line">
                    {result.explanation}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
