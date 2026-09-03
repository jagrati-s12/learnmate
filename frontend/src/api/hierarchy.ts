import apiClient from './client';
import type { Exam, Branch, SubjectWithChapters } from '../types';

export const hierarchyAPI = {
  // Exams
  async getExams(): Promise<Exam[]> {
    const response = await apiClient.get<Exam[]>('/exams/');
    return response.data;
  },
  async getExamById(examId: number): Promise<Exam> {
    const response = await apiClient.get<Exam>(`/exams/${examId}`);
    return response.data;
  },
  async getBranchesByExam(examId: number): Promise<Branch[]> {
    const response = await apiClient.get<Branch[]>(`/exams/${examId}/branches`);
    return response.data;
  },

  // Branches
  async getBranches(): Promise<Branch[]> {
    const response = await apiClient.get<Branch[]>('/branches/');
    return response.data;
  },
  async getBranchById(branchId: number): Promise<Branch> {
    const response = await apiClient.get<Branch>(`/branches/${branchId}`);
    return response.data;
  },
  async getSubjectsByBranch(branchId: number): Promise<SubjectWithChapters[]> {
    const response = await apiClient.get<SubjectWithChapters[]>(`/branches/${branchId}/subjects`);
    return response.data;
  },

  // Subjects
  async getSubjects(): Promise<SubjectWithChapters[]> {
    const response = await apiClient.get<SubjectWithChapters[]>('/subjects/');
    return response.data;
  },
  async getSubjectById(subjectId: number): Promise<SubjectWithChapters> {
    const response = await apiClient.get<SubjectWithChapters>(`/subjects/${subjectId}`);
    return response.data;
  },
};
