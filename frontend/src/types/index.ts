export interface Exam {
  id: number;
  name: string;
  description?: string;
  is_active: boolean;
  display_order: number;
}

export interface Branch {
  id: number;
  exam_id: number;
  name: string;
  description?: string;
  is_active: boolean;
  display_order: number;
}

export interface TopicSimple {
  id: number;
  chapter_id: number;
  name: string;
  description?: string;
  display_order: number;
}

export interface Chapter {
  id: number;
  subject_id: number;
  name: string;
  description?: string;
  display_order: number;
}

export interface ChapterWithTopics extends Chapter {
  topics: TopicSimple[];
}

export interface Subject {
  id: number;
  branch_id: number;
  name: string;
  description?: string;
  icon?: string;
  display_order: number;
}

export interface SubjectWithChapters extends Subject {
  chapters: ChapterWithTopics[];
}

export interface QuestionOption {
  id: number;
  option_text: string;
  option_label: string;
}

export interface QuestionWithOptions {
  id: number;
  topic_id: number;
  question_text: string;
  difficulty: 'easy' | 'medium' | 'hard';
  marks: number;
  is_pyq: boolean;
  year?: number;
  shift?: string;
  source?: string;
  options: QuestionOption[];
}