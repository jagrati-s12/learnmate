// API exports
export { authAPI } from './auth';
export { subjectsAPI } from './subjects';
export { questionsAPI } from './questions';
export { practiceAPI } from './practice';
export { mockTestsAPI } from './mockTests';
export { default as apiClient } from './client';

export type { User, LoginCredentials, RegisterData, AuthResponse } from './auth';
export type { Subject, Topic } from './subjects';
export type { Question, QuestionDetail, AnswerSubmission, AnswerResult } from './questions';
export type { PracticeSession, Bookmark } from './practice';
export type {
  MockTest,
  MockTestStartResponse,
  MockTestSubmissionResult,
  MockTestAttempt,
  MockTestResult,
  QuestionReview,
} from './mockTests';
export { MockTestType } from './mockTests';
export { DifficultyLevel } from './questions';