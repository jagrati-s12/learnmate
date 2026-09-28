import api from './client';

export interface HeartbeatRequest {
  topic_id: number;
  duration_seconds: number;
  activity_type?: string;
}

export interface PerformanceOverview {
  user_id: number;
  overall_summary: {
    total_tests_completed: number;
    average_score: number;
    running_std_dev: number;
    predicted_next_score: number;
    velocity_trend: string;
    score_velocity: number;
    burnout_risk: string;
    student_archetype: string;
  };
  cognitive_load_summary: {
    mastered_fast_pct: number;
    methodical_slow_pct: number;
    rushed_errors_pct: number;
    conceptual_struggles_pct: number;
  };
  priority_revision_topics: Array<{
    topic_id: number;
    topic_name: string;
    subject_name: string;
    tmi_score: number;
    bkt_mastery_prob: number;
    study_hours: number;
    root_cause: string;
    diagnostic_note: string;
    action_plan: string;
  }>;
}

export interface TopicBreakdownItem {
  topic_id: number;
  topic_name: string;
  bkt_mastery_prob: number;
  tmi_score: number;
  total_attempts: number;
  correct_count: number;
  incorrect_count: number;
  quadrants: {
    fast_correct: number;
    slow_correct: number;
    fast_incorrect: number;
    slow_incorrect: number;
  };
  last_practiced_at?: string;
}

export const analyticsAPI = {
  getDashboardStats: async () => {
    const response = await api.get('/analytics/dashboard-stats');
    return response.data;
  },

  getWeeklyActivity: async () => {
    const response = await api.get('/analytics/weekly-activity');
    return response.data;
  },

  getPerformance: async () => {
    const response = await api.get('/analytics/performance');
    return response.data;
  },

  getProgress: async () => {
    const response = await api.get('/analytics/progress');
    return response.data;
  },

  getTopicProgress: async () => {
    const response = await api.get('/analytics/topic-progress');
    return response.data;
  },

  getAIProfile: async (): Promise<{ profile: string }> => {
    const response = await api.get<{profile: string}>('/analytics/ai-profile');
    return response.data;
  },

  postHeartbeat: async (data: HeartbeatRequest) => {
    const response = await api.post('/analytics/study-session/heartbeat', data);
    return response.data;
  },

  getPerformanceOverview: async (): Promise<PerformanceOverview> => {
    const response = await api.get<PerformanceOverview>('/analytics/performance-overview');
    return response.data;
  },

  getTopicBreakdown: async (): Promise<{ topics: TopicBreakdownItem[] }> => {
    const response = await api.get<{ topics: TopicBreakdownItem[] }>('/analytics/topic-breakdown');
    return response.data;
  },

  getWeaknessProfile: async () => {
    const response = await api.get('/analytics/weakness-profile');
    return response.data;
  },

  generateStudyPlan: async (data?: { available_hours?: number; upcoming_tests?: any[] }) => {
    const response = await api.post('/analytics/generate-study-plan', data || {});
    return response.data;
  },

  getMistakeExplanation: async (data: { topic: string; incorrect_answer: string; correct_answer: string }) => {
    const response = await api.post('/analytics/mistake-explanation', data);
    return response.data;
  },
};

