import { useCallback, useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Flag,
  Pause,
  Play,
  Send,
} from "lucide-react";
import PageIntro from "../common/PageIntro.jsx";
import TestTimer from "./TestTimer.jsx";
import QuestionTimer from "./QuestionTimer.jsx";
import TestAnalytics from "./TestAnalytics.jsx";
import { mockTestQuestions, testConfig } from "../../data/data.js";
import { buildTopicAnalytics } from "./testAnalytics.js";


export default function MockTest() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [running, setRunning] = useState(true);
  const [submitted, setSubmitted] = useState(false);

  const [questionStats, setQuestionStats] = useState(
    mockTestQuestions.map((question) => ({
      ...question,
      selectedAnswer: null,
      timeSpent: 0,
      startedAt: Date.now(),
    }))
  );

  const currentQuestion = mockTestQuestions[currentIndex];
  const currentStat = questionStats[currentIndex];

  const recordCurrentSecond = useCallback(() => {
    setQuestionStats((current) =>
      current.map((item, index) =>
        index === currentIndex
          ? { ...item, timeSpent: item.timeSpent + 1 }
          : item
      )
    );
  }, [currentIndex]);

  const selectAnswer = (answerIndex) => {
    setQuestionStats((current) =>
      current.map((item, index) =>
        index === currentIndex
          ? { ...item, selectedAnswer: answerIndex }
          : item
      )
    );
  };

  const goToQuestion = (index) => {
    if (index < 0 || index >= mockTestQuestions.length) return;

    setQuestionStats((current) =>
      current.map((item, i) =>
        i === index ? { ...item, startedAt: Date.now() } : item
      )
    );

    setCurrentIndex(index);
  };

  const submitTest = useCallback(() => {
    setRunning(false);
    setSubmitted(true);
  }, []);

  useEffect(() => {
    if (submitted) return;

    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [submitted]);

  const topicAnalytics = useMemo(
    () => buildTopicAnalytics(questionStats),
    [questionStats]
  );

  if (submitted) {
    return (
      <div className="page">
        <PageIntro
          title="Test Analysis"
          subtitle="Your performance, timing and topic-level strengths."
        />

        <TestAnalytics topicAnalytics={topicAnalytics} />

        <button
          className="primary-button"
          onClick={() => window.location.reload()}
        >
          <Play size={17} /> Start Another Test
        </button>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="test-header">
        <div>
          <span className="eyebrow">SSC JE CIVIL</span>
          <h2>{testConfig.title}</h2>
          <p>
            Question {currentIndex + 1} of {mockTestQuestions.length} ·{" "}
            {currentQuestion.topic}
          </p>
        </div>

        <div className="test-controls">
          <TestTimer
            initialSeconds={testConfig.durationSeconds}
            running={running}
            onExpire={submitTest}
          />

          <button
            className="secondary-button"
            onClick={() => setRunning((value) => !value)}
          >
            {running ? <Pause size={16} /> : <Play size={16} />}
            {running ? "Pause" : "Resume"}
          </button>
        </div>
      </div>

      <div className="test-layout">
        <section className="card question-card">
          <div className="question-card-header">
            <div>
              <span className="question-label">
                Question {currentIndex + 1}
              </span>
              <span className="question-topic">
                {currentQuestion.topic} · {currentQuestion.subtopic}
              </span>
            </div>

            <QuestionTimer
              elapsedSeconds={currentStat.timeSpent}
              running={running}
              onTick={recordCurrentSecond}
            />
          </div>

          <h2>{currentQuestion.question}</h2>

          <div className="options-list">
            {currentQuestion.options.map((option, index) => (
              <button
                key={option}
                className={`answer-option ${
                  currentStat.selectedAnswer === index ? "selected" : ""
                }`}
                onClick={() => selectAnswer(index)}
              >
                <span className="option-letter">
                  {String.fromCharCode(65 + index)}
                </span>
                <span>{option}</span>

                {currentStat.selectedAnswer === index && (
                  <CheckCircle2 size={18} />
                )}
              </button>
            ))}
          </div>

          <div className="question-actions">
            <button
              className="secondary-button"
              disabled={currentIndex === 0}
              onClick={() => goToQuestion(currentIndex - 1)}
            >
              <ChevronLeft size={17} /> Previous
            </button>

            <button className="secondary-button">
              <Flag size={16} /> Mark for review
            </button>

            {currentIndex === mockTestQuestions.length - 1 ? (
              <button className="primary-button" onClick={submitTest}>
                <Send size={16} /> Submit Test
              </button>
            ) : (
              <button
                className="primary-button"
                onClick={() => goToQuestion(currentIndex + 1)}
              >
                Next <ChevronRight size={17} />
              </button>
            )}
          </div>
        </section>

        <aside className="card question-palette">
          <h3>Question Palette</h3>

          <div className="palette-grid">
            {mockTestQuestions.map((question, index) => {
              const answered =
                questionStats[index].selectedAnswer !== null;

              return (
                <button
                  key={question.id}
                  className={`palette-number ${
                    index === currentIndex ? "current" : ""
                  } ${answered ? "answered" : ""}`}
                  onClick={() => goToQuestion(index)}
                >
                  {index + 1}
                </button>
              );
            })}
          </div>

          <div className="palette-legend">
            <span><i className="current-dot" /> Current</span>
            <span><i className="answered-dot" /> Answered</span>
            <span><i className="unanswered-dot" /> Unanswered</span>
          </div>
        </aside>
      </div>
    </div>
  );
}
