import React, { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { hierarchyAPI } from '../../api/hierarchy';
import apiClient from '../../api/client';
import { Exam } from '../../types';
import { Icons } from '../../assets/icons';

// Basic CRUD interface for Exam
export const AdminHierarchyPage: React.FC = () => {
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // State for creating new exam
  const [newExamName, setNewExamName] = useState('');
  const [newExamDesc, setNewExamDesc] = useState('');

  const fetchExams = async () => {
    try {
      setLoading(true);
      const data = await hierarchyAPI.getExams();
      setExams(data);
    } catch (err: any) {
      setError(err?.response?.data?.detail || 'Failed to load exams');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExams();
  }, []);

  const handleCreateExam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExamName.trim()) return;
    try {
      await apiClient.post('/exams/', { name: newExamName, description: newExamDesc, is_active: true });
      setNewExamName('');
      setNewExamDesc('');
      fetchExams();
    } catch (err: any) {
      alert(err?.response?.data?.detail || 'Error creating exam');
    }
  };

  const handleDeleteExam = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this exam?')) return;
    try {
      await apiClient.delete(`/exams/${id}`);
      fetchExams();
    } catch (err: any) {
      alert(err?.response?.data?.detail || 'Error deleting exam');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800">Content Hierarchy</h1>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Exams List */}
        <Card className="p-6 col-span-2">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Exams</h2>
          {loading ? (
            <p className="text-slate-500">Loading exams...</p>
          ) : exams.length === 0 ? (
            <p className="text-slate-500">No exams found. Create one to get started.</p>
          ) : (
            <div className="space-y-3">
              {exams.map(exam => (
                <div key={exam.id} className="flex justify-between items-center p-3 border border-slate-200 rounded-lg hover:bg-slate-50">
                  <div>
                    <h3 className="font-medium text-slate-800">{exam.name}</h3>
                    <p className="text-sm text-slate-500">{exam.description || 'No description'}</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors">
                      <Icons.Settings className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDeleteExam(exam.id)} className="p-2 text-slate-400 hover:text-red-600 transition-colors">
                      <Icons.X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Add Exam Form */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Add New Exam</h2>
          <form onSubmit={handleCreateExam} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Exam Name</label>
              <input
                type="text"
                value={newExamName}
                onChange={(e) => setNewExamName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                placeholder="e.g. JEE Advanced"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
              <textarea
                value={newExamDesc}
                onChange={(e) => setNewExamDesc(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                placeholder="Exam description..."
                rows={3}
              />
            </div>
            <Button type="submit" disabled={!newExamName.trim()} className="w-full">
              Create Exam
            </Button>
          </form>
        </Card>
      </div>

      <Card className="p-6">
        <p className="text-slate-600 mb-4">
          Note: In a full implementation, clicking an exam above would reveal Branches, then Subjects, Chapters, and Topics in a drill-down list.
        </p>
      </Card>
    </div>
  );
};
