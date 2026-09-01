import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Topbar } from '../../components/layout/Topbar';
import { Button } from '../../components/ui/Button';
import { mockTestsAPI, MockTest } from '../../api/mockTests';

export const MockTestPage: React.FC = () => {
  const navigate = useNavigate();
  const timerRef = useRef<any | null>(null);
  const [test, setTest] = useState<MockTest | null>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [attemptId, setAttemptId] = useState<number | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string | null>>({});
  const [markedQuestions, setMarkedQuestions] = useState<Set<number>>(new Set());
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isTestStarted, setIsTestStarted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTest = async () => {
      try {
        setLoading(true);
        const testData = await mockTestsAPI.getAllTests();
        if (testData.length > 0) {
          setTest(testData[0]); // Use first test for now
        } else {
          // Create a mock test object for development
          setTest({
            id: 1,
            name: 'SSC JE Civil Engineering Mock Test',
            description: 'Full syllabus practice test',
            test_type: 'full_syllabus' as any,
            duration_minutes: 120, // 2 hours
            total_marks: 200
          });
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load mock tests');
        // Fallback to mock data
        setTest({
          id: 1,
          name: 'SSC JE Civil Engineering Mock Test',
          description: 'Full syllabus practice test',
          test_type: 'full_syllabus' as any,
          duration_minutes: 120,
          total_marks: 200
        });
      } finally {
        setLoading(false);
      }
    };

    loadTest();
  }, []);

  useEffect(() => {
    if (test && !isTestStarted) {
      const startTest = async () => {
        try {
          setLoading(true);
          const testData = await mockTestsAPI.startTest(test.id);
          setAttemptId(testData.attempt_id);
          setQuestions(testData.questions);
          setTimeRemaining(testData.mock_test.duration_minutes * 60);
          setIsTestStarted(true);
          startTimer();
        } catch (err: any) {
          setError(err.message || 'Failed to start mock test');
        } finally {
          setLoading(false);
        }
      };

      startTest();
    }
  }, [test, isTestStarted]);

  const startTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    timerRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 0) {
          clearInterval(timerRef.current!);
          autoSubmitTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const autoSubmitTest = () => {
    alert('Time is up! Submitting your test automatically.');
    submitTest();
  };

  const handleAnswerChange = (questionId: number, optionLabel: string | null) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionLabel }));
  };

  const toggleMarkQuestion = (questionId: number) => {
    setMarkedQuestions((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(questionId)) {
        newSet.delete(questionId);
      } else {
        newSet.add(questionId);
      }
      return newSet;
    });
  };

  const submitTest = async () => {
    if (!isTestStarted || isSubmitting) return;

    if (
      window.confirm(
        'Are you sure you want to submit the test? You will not be able to change any answers.'
      )
    ) {
      setIsSubmitting(true);
      stopTimer();
      try {
        const answerSubmissions = Object.entries(answers)
          .filter(([_, option]) => option !== null)
          .map(([questionId, optionLabel]) => ({
            question_id: parseInt(questionId),
            selected_option: optionLabel,
          }));

        const resultData = await mockTestsAPI.submitTest(
          attemptId as number,
          answerSubmissions
        );
        setResult(resultData);
        setShowResults(true);
      } catch (err: any) {
        setError(err.message || 'Failed to submit test');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const answeredCount = Object.values(answers).filter((ans) => ans !== null).length;
  const markedCount = markedQuestions.size;

  if (loading || !test) {
    return (
      <>
        <Topbar title="Mock Test" />
        <div className="flex-1 overflow-auto p-6">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full border-4 border-t-blue-600 h-16 w-16 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading mock test...</p>
          </div>
        </div>
      </>
    );
  }

  if (error && !isTestStarted) {
    return (
      <>
        <Topbar title="Mock Test" />
        <div className="flex-1 overflow-auto p-6">
          <div className="text-center py-12">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
              <p className="text-red-600 mb-4">Error: {error}</p>
              <Button variant="primary" onClick={() => navigate('/subjects')}>
                Back to Subjects
              </Button>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (showResults && result) {
    stopTimer();
    return (
      <>
        <Topbar title="Test Results" />
        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white border border-gray-200 rounded-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Test Completed!
              </h2>

              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="space-y-4">
                  <p className="text-lg text-gray-700">
                    <span className="font-semibold">Score:</span> {result.score} / {result.total_marks}
                  </p>
                  <p className="text-lg text-gray-700">
                    <span className="font-semibold">Accuracy:</span> {result.accuracy}%
                  </p>
                  <p className="text-lg text-gray-700">
                    <span className="font-semibold">Correct Answers:</span> {result.correct_answers}
                  </p>
                  <p className="text-lg text-gray-700">
                    <span className="font-semibold">Incorrect Answers:</span> {result.incorrect_answers}
                  </p>
                  <p className="text-lg text-gray-700">
                    <span className="font-semibold">Unattempted:</span> {result.unattempted}
                  </p>
                </div>
                <div className="space-y-4">
                  <p className="text-lg text-gray-700">
                    <span className="font-semibold">Total Questions:</span> {result.total_questions}
                  </p>
                  <p className="text-lg text-gray-700">
                    <span className="font-semibold">Time Taken:</span>{' '}
                    {formatTime(result.total_time_seconds)}
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Performance Summary
                </h3>
                <p className="text-gray-600">
                  You scored {result.score} out of {result.total_marks} marks
                  ({result.accuracy}% accuracy) in this mock test.
                </p>
              </div>

              <Button
                variant="primary"
                onClick={() => navigate('/dashboard')}
                className="w-full"
              >
                Go to Dashboard
              </Button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Topbar title={`Mock Test • ${test.name}`} />
      <div className="flex-1 overflow-hidden p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
          {/* Question Area */}
          <div className="lg:col-span-2 overflow-auto">
            {questions.length > 0 ? (
              <div className="bg-white border border-gray-200 rounded-xl p-8">
                <div className="flex justify-between items-center pb-4 mb-6 border-b border-gray-200">
                  <span className="font-semibold text-gray-700">
                    Question {currentQuestionIndex + 1} of {questions.length}
                  </span>
                  <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-md text-sm font-medium">
                    1 mark
                  </span>
                </div>

                <div className="text-lg leading-relaxed text-gray-900 mb-8 whitespace-pre-line">
                  {questions[currentQuestionIndex].question_text}
                </div>

                <div className="space-y-3">
                  {questions[currentQuestionIndex].options.map((option: any) => {
                    const isSelected = answers[questions[currentQuestionIndex].id] === option.option_label;
                    return (
                      <button
                        key={option.id}
                        onClick={() => handleAnswerChange(questions[currentQuestionIndex].id, option.option_label)}
                        disabled={isSubmitting}
                        className={`w-full flex items-start gap-4 p-4 border-2 rounded-lg text-left transition-colors ${
                          isSelected
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-blue-500 hover:bg-blue-50'
                        } ${isSubmitting ? 'cursor-default' : 'cursor-pointer'}`}
                      >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold flex-shrink-0 ${
                          isSelected
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

                <div className="flex gap-3 mt-8 pt-6 border-t border-gray-200 flex-wrap">
                  <Button
                    variant="secondary"
                    onClick={() =>
                      setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))
                    }
                    disabled={isSubmitting}
                  >
                    ← Previous
                  </Button>
                  <Button
                    variant="primary"
                    onClick={() =>
                      setCurrentQuestionIndex((prev) =>
                        Math.min(questions.length - 1, prev + 1)
                      )
                    }
                    disabled={isSubmitting}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Save & Next →
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => toggleMarkQuestion(questions[currentQuestionIndex].id)}
                    disabled={isSubmitting}
                    className={`${
                      markedQuestions.has(questions[currentQuestionIndex].id)
                        ? 'bg-orange-50 text-orange-600 border-orange-200'
                        : ''
                    }`}
                  >
                    Mark for Review
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => handleAnswerChange(questions[currentQuestionIndex].id, null)}
                    disabled={isSubmitting}
                  >
                    Clear Response
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600">Loading questions...</p>
              </div>
            )}
          </div>

          {/* Question Palette */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 overflow-auto">
            {/* Timer */}
            <div className="bg-red-50 text-red-600 p-4 rounded-lg text-center mb-6 font-semibold text-lg">
              ⏱ {formatTime(timeRemaining)}
            </div>

            {/* Legend */}
            <div className="mb-4 space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-green-500 rounded"></div>
                <span>Answered ({answeredCount})</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-white border border-gray-300 rounded"></div>
                <span>Not Visited ({questions.length - answeredCount})</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-orange-500 rounded"></div>
                <span>Marked ({markedCount})</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 border-2 border-blue-500 bg-blue-50 rounded"></div>
                <span>Current (1)</span>
              </div>
            </div>

            {/* Palette Grid */}
            <div className="font-semibold text-sm mb-3">Question Palette</div>
            <div className="grid grid-cols-5 gap-2">
              {questions.map((_, index) => {
                const questionId = questions[index].id;
                const isAnswered = answers[questionId] !== null;
                const isMarked = markedQuestions.has(questionId);
                const isCurrent = index === currentQuestionIndex;

                return (
                  <button
                    key={index}
                    onClick={() => setCurrentQuestionIndex(index)}
                    className={`aspect-square border rounded text-sm font-medium ${
                      isCurrent
                        ? 'border-2 border-blue-500 bg-blue-50 text-blue-600'
                        : isAnswered
                        ? 'bg-green-500 text-white border-green-500'
                        : isMarked
                        ? 'bg-orange-500 text-white border-orange-500'
                        : 'bg-white border-gray-300 text-gray-700'
                    }`}
                  >
                    {index + 1}
                  </button>
                );
              })}
            </div>

            {!isSubmitting && (
              <Button
                variant="primary"
                fullWidth
                className="mt-6 bg-green-600 hover:bg-green-700"
                onClick={submitTest}
              >
                Submit Test
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};