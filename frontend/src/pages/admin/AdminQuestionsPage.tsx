import React, { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import apiClient from '../../api/client';
import { Icons } from '../../assets/icons';
import { QuestionWithOptions } from '../../types';

export const AdminQuestionsPage: React.FC = () => {
  const [questions, setQuestions] = useState<QuestionWithOptions[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const limit = 50;
      const response = await apiClient.get<QuestionWithOptions[]>(`/questions/?limit=${limit}`);
      setQuestions(response.data);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this question?')) return;
    try {
      await apiClient.delete(`/questions/${id}`);
      fetchQuestions();
    } catch (error) {
      alert('Failed to delete question');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800">Question Bank</h1>
        <Button className="flex items-center gap-2">
          <Icons.PenTool className="w-4 h-4" />
          <span>Add Question</span>
        </Button>
      </div>

      <Card className="p-0 overflow-hidden">
        {loading ? (
          <div className="p-6 text-center text-slate-500">Loading questions...</div>
        ) : questions.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            No questions found. Add some to build the question bank!
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {questions.map((q) => (
              <div key={q.id} className="p-4 hover:bg-slate-50 flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-700">
                      ID: {q.id}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                      q.difficulty === 'hard' ? 'bg-red-100 text-red-700' :
                      q.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {q.difficulty}
                    </span>
                    {q.is_pyq && (
                      <span className="px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-700">
                        PYQ {q.year}
                      </span>
                    )}
                  </div>
                  <p className="text-slate-800 font-medium line-clamp-2">{q.question_text}</p>
                  <p className="text-sm text-slate-500 mt-1">{q.options.length} options configured</p>
                </div>
                <div className="flex gap-2 shrink-0 ml-4">
                  <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors">
                    <Icons.Settings className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(q.id)} className="p-2 text-slate-400 hover:text-red-600 transition-colors">
                    <Icons.X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};
