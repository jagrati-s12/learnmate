import apiClient from './client';

export enum DifficultyLevel {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard',
}

export interface QuestionOption {
  id: number;
  option_text: string;
  option_label: string;
}

export interface Question {
  id: number;
  topic_id: number;
  question_text: string;
  difficulty: DifficultyLevel;
  marks: number;
  is_pyq?: boolean;
  year?: number;
  shift?: string;
  source?: string;
  options: QuestionOption[];
}

export interface QuestionDetail extends Question {
  explanation?: string;
  correct_option?: string;
}

export interface AnswerSubmission {
  question_id: number;
  selected_option?: string | null;
  time_taken_seconds?: number;
}

export interface AnswerResult {
  question_id: number;
  is_correct: boolean;
  correct_option: string;
  explanation?: string;
  selected_option?: string;
  time_taken_seconds?: number;
}

export const questionsAPI = {
  // Get questions with filtering
  async getQuestions(params: {
    topic_id?: number;
    chapter_id?: number;
    subject_id?: number;
    branch_id?: number;
    difficulty?: DifficultyLevel;
    is_pyq?: boolean;
    limit?: number;
    shuffle?: boolean;
  } = {}): Promise<Question[]> {
    const response = await apiClient.get<Question[]>('/questions/', { params });
    return response.data;
  },

  // Get single question with details (includes correct answer)
  async getQuestionDetail(questionId: number): Promise<QuestionDetail> {
    const response = await apiClient.get<QuestionDetail>(`/questions/${questionId}`);
    return response.data;
  },

  // Submit answer
  async submitAnswer(answer: AnswerSubmission): Promise<AnswerResult> {
    const response = await apiClient.post<AnswerResult>('/questions/submit', answer);
    return response.data;
  },
};