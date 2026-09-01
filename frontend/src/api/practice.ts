import apiClient from './client';
import type { Question, AnswerSubmission, AnswerResult } from './questions';

export interface PracticeSession {
  session_id: string;
  topic_id: number;
  topic_name: string;
  total_questions: number;
  current_question_index: number;
  questions: Question[];
}

export interface Bookmark {
  bookmark_id: number;
  question_id: number;
  question_text: string;
  topic_name: string;
  subject_name: string;
  bookmarked_at: string;
}

export const practiceAPI = {
  // Start a new practice session
  async startSession(params: {
    topic_id: number;
    difficulty?: string;
    num_questions?: number;
  }): Promise<PracticeSession> {
    const response = await apiClient.post<PracticeSession>('/practice/start', null, {
      params,
    });
    return response.data;
  },

  // Submit an answer during practice
  async submitAnswer(answer: AnswerSubmission): Promise<AnswerResult> {
    const response = await apiClient.post<AnswerResult>('/practice/submit-answer', answer);
    return response.data;
  },

  // Bookmark a question
  async bookmarkQuestion(questionId: number): Promise<{ message: string; bookmark_id: number }> {
    const response = await apiClient.post(`/practice/bookmark`, null, {
      params: { question_id: questionId },
    });
    return response.data as { message: string; bookmark_id: number };
  },

  // Remove bookmark
  async removeBookmark(questionId: number): Promise<{ message: string }> {
    const response = await apiClient.delete(`/practice/bookmark/${questionId}`);
    return response.data as { message: string };
  },

  // Get user's bookmarks
  async getBookmarks(): Promise<Bookmark[]> {
    const response = await apiClient.get<Bookmark[]>('/practice/bookmarks');
    return response.data;
  },
};