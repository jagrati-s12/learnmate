import apiClient from './client';

export interface Subject {
  id: number;
  name: string;
  description?: string;
  icon?: string;
  display_order: number;
  topics?: Topic[];
}

export interface Topic {
  id: number;
  subject_id: number;
  name: string;
  description?: string;
  display_order: number;
  question_count: number;
}

export const subjectsAPI = {
  // Get all subjects with their topics
  async getAllSubjects(): Promise<Subject[]> {
    const response = await apiClient.get<Subject[]>('/subjects/');
    return response.data;
  },

  // Get a specific subject by ID
  async getSubjectById(subjectId: number): Promise<Subject> {
    const response = await apiClient.get<Subject>(`/subjects/${subjectId}`);
    return response.data;
  },
};