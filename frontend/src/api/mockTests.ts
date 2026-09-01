import apiClient from './client';
import type { Question, AnswerSubmission } from './questions';

export enum MockTestType {
  FULL_SYLLABUS = 'full_syllabus',
  SUBJECT_WISE = 'subject_wise',
  TOPIC_WISE = 'topic_wise',
  CUSTOM = 'custom',
}

export interface MockTest {
  id: number;
  name: string;
  description?: string;
  test_type: MockTestType;
  duration_minutes: number;
  total_marks: number;
}

export interface MockTestStartResponse {
  attempt_id: number;
  mock_test: MockTest;
  started_at: string;
  total_questions: number;
  questions: Question[];
}

export interface MockTestSubmissionResult {
  attempt_id: number;
  score: number;
  total_marks: number;
  total_questions: number;
  correct_answers: number;
  incorrect_answers: number;
  unattempted: number;
  accuracy: number;
  total_time_seconds: number;
}

export interface QuestionReview {
  id: number;
  topic_id: number;
  question_text: string;
  difficulty: string;
  marks: number;
  options: Array<{ id: number; option_text: string; option_label: string }>;
  explanation?: string;
  correct_option: string;
  user_answer?: string;
  is_correct?: boolean;
  time_taken_seconds?: number;
}

export interface MockTestAttempt {
  attempt_id: number;
  mock_test_id: number;
  mock_test_name: string;
  started_at: string;
  completed_at?: string;
  score: number;
  total_questions: number;
  correct_answers: number;
  incorrect_answers: number;
  unattempted: number;
}

export interface MockTestResult {
  attempt_id: number;
  mock_test_id: number;
  mock_test_name: string;
  score: number;
  total_marks: number;
  total_questions: number;
  correct_answers: number;
  incorrect_answers: number;
  unattempted: number;
  accuracy: number;
  total_time_seconds: number;
  questions: QuestionReview[];
}

export const mockTestsAPI = {
  // Get all available mock tests
  async getAllTests(): Promise<MockTest[]> {
    const response = await apiClient.get<MockTest[]>('/mock-tests/');
    return response.data;
  },

  // Start a mock test
  async startTest(testId: number): Promise<MockTestStartResponse> {
    const response = await apiClient.get<MockTestStartResponse>(`/mock-tests/${testId}/start`);
    return response.data;
  },

  // Submit complete mock test
  async submitTest(attemptId: number, answers: AnswerSubmission[]): Promise<MockTestSubmissionResult> {
    const response = await apiClient.post<MockTestSubmissionResult>(
      `/mock-tests/attempt/${attemptId}/submit`,
      answers
    );
    return response.data;
  },

  // Get user's test attempts history
  async getUserAttempts(): Promise<MockTestAttempt[]> {
    const response = await apiClient.get<MockTestAttempt[]>('/mock-tests/attempts');
    return response.data;
  },

  // Get detailed result for a specific attempt
  async getTestResult(attemptId: number): Promise<MockTestResult> {
    const response = await apiClient.get<MockTestResult>(`/mock-tests/result/${attemptId}`);
    return response.data;
  },
};