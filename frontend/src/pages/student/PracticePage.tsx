import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Topbar } from '../../components/layout/Topbar';
import { Button } from '../../components/ui/Button';
import { Icons } from '../../assets/icons';
import { practiceAPI, PracticeSession } from '../../api/practice';
import { AnswerResult } from '../../api/questions';
import { subjectsAPI, Topic } from '../../api/subjects';

export const PracticePage: React.FC = () => {
  const { topicId } = useParams();
  const navigate = useNavigate();
  const [session, setSession] = useState<PracticeSession | null>(null);
  const [topic, setTopic] = useState<Topic | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState<AnswerResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [startTime, setStartTime] = useState<number>(Date.now());

  useEffect(() => {
    const startPractice = async () => {
      if (!topicId) return;
      try {
        setLoading(true);
        const tid = parseInt(topicId);
        // Try to get topic info first
        try {
          const allSubjects = await subjectsAPI.getAllSubjects();
          for (const s of allSubjects) {
            const found = s.topics?.find(t => t.id === tid);
            if (found) {
              setTopic(found);
              break;
            }
          }
        } catch {
          // Continue even if topic info fails
        }

        const newSession = await practiceAPI.startSession({
          topic_id: tid,
          num_questions: 10,
        });
        setSession(newSession);
        setStartTime(Date.now());
      } catch (err: any) {
        setError(err.message || 'Failed to start practice session');
      } finally {
        setLoading(false);
      }
    };

    startPractice();
  }, [topicId]);

  if (loading) {
    return (
      <>
        <Topbar title="Practice Mode" />
        <div className="flex-1 overflow-auto p-6">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full border-4 border-t-blue-600 h-16 w-16 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading practice session...</p>
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

  if (!currentQuestion) {
    return (
      <>
        <Topbar title="Practice Mode" />
        <div className="flex-1 overflow-auto p-6">
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Session Complete!</h2>
            <p className="text-gray-600 mb-6">You've completed all questions in this practice session.</p>
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
      setResult(res);
      setShowResult(true);
    } catch (err: any) {
      setError(err.message || 'Failed to submit answer');
    }
  };

  const handleNext = () => {
    if (currentIndex < session.questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedOption(null);
      setShowResult(false);
      setResult(null);
      setIsBookmarked(false);
      setStartTime(Date.now());
    } else {
      // Session complete
      alert('Practice session complete! Great job!');
      navigate('/subjects');
    }
  };

  const handleBookmark = async () => {
    try {
      if (isBookmarked) {
        await practiceAPI.removeBookmark(currentQuestion.id);
        setIsBookmarked(false);
      } else {
        await practiceAPI.bookmarkQuestion(currentQuestion.id);
        setIsBookmarked(true);
      }
    } catch (err: any) {
      alert('Failed to update bookmark: ' + (err.message || 'Unknown error'));
    }
  };

  const correctLabel = result?.correct_option || '';

  return (
    <>
      <Topbar title={`Practice • ${topic?.name || session.topic_name || 'Topic'}`} />

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

          <div className="bg-white border border-gray-200 rounded-xl p-8 mb-6">
            <div className="flex justify-between items-center pb-4 mb-6 border-b border-gray-200">
              <span className="font-semibold text-gray-700">
                Question {currentIndex + 1} of {session.questions.length}
              </span>
              <div className="flex gap-2">
                <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-md text-sm font-medium capitalize">
                  {currentQuestion.difficulty}
                </span>
                <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-md text-sm font-medium">
                  {currentQuestion.marks} {currentQuestion.marks === 1 ? 'mark' : 'marks'}
                </span>
              </div>
            </div>

            <div className="text-lg leading-relaxed text-gray-900 mb-8 whitespace-pre-line">
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
                    onClick={() => !showResult && setSelectedOption(option.option_label)}
                    disabled={showResult}
                    className={`w-full flex items-start gap-4 p-4 border-2 rounded-lg text-left transition-colors ${
                      showCorrect
                        ? 'border-green-500 bg-green-50'
                        : showIncorrect
                        ? 'border-red-500 bg-red-50'
                        : isSelected
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-500 hover:bg-blue-50'
                    } ${showResult ? 'cursor-default' : 'cursor-pointer'}`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold flex-shrink-0 ${
                      showCorrect
                        ? 'bg-green-500 text-white'
                        : showIncorrect
                        ? 'bg-red-500 text-white'
                        : isSelected
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-700'
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

            <div className="flex gap-3 mt-8 pt-6 border-t border-gray-200">
              {!showResult ? (
                <>
                  <Button variant="primary" onClick={handleSubmit}>
                    Submit Answer
                  </Button>
                  <Button variant="secondary" onClick={handleBookmark}>
                    <Icons.Bookmark className="w-4 h-4" />
                    {isBookmarked ? 'Bookmarked' : 'Bookmark'}
                  </Button>
                </>
              ) : (
                <Button variant="primary" onClick={handleNext}>
                  {currentIndex < session.questions.length - 1 ? 'Next Question →' : 'Complete Session'}
                </Button>
              )}
            </div>

            {showResult && result && (
              <div className={`mt-6 p-6 border rounded-lg ${
                result.is_correct
                  ? 'bg-green-50 border-green-200'
                  : 'bg-blue-50 border-blue-200'
              }`}>
                <div className={`font-semibold mb-2 ${
                  result.is_correct ? 'text-green-900' : 'text-blue-900'
                }`}>
                  {result.is_correct ? '✓ Correct!' : '✗ Incorrect'}
                </div>
                <div className="text-gray-700 mb-2">
                  <strong>Correct Answer: {result.correct_option}</strong>
                </div>
                {result.explanation && (
                  <div className="text-gray-700 whitespace-pre-line">
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
