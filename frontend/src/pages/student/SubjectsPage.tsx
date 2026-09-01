import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Topbar } from '../../components/layout/Topbar';
import { Card, CardBody } from '../../components/ui/Card';
import { subjectsAPI, Topic } from '../../api';

interface SubjectData {
  id: string;
  name: string;
  totalQuestions: number;
  chapters: number;
  progress: number;
  accuracy: number;
}

export const SubjectsPage: React.FC = () => {
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState<SubjectData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch subjects from API
  useEffect(() => {
    const loadSubjects = async () => {
      try {
        setLoading(true);
        const subjectData = await subjectsAPI.getAllSubjects();

        // Transform API data to match our UI expectations
        const formattedSubjects: SubjectData[] = subjectData.map((subject) => {
          const totalQuestions = subject.topics?.reduce((sum: number, topic: Topic) => {
            return sum + (topic.question_count || 0);
          }, 0) || 0;

          // For now, use mock progress and accuracy - these would come from user-specific API
          // In a real app, we'd fetch user progress per subject
          const progress = Math.min(100, Math.floor(Math.random() * 100));
          const accuracy = Math.min(100, Math.floor(Math.random() * 100));

          return {
            id: subject.id.toString(),
            name: subject.name,
            totalQuestions: totalQuestions,
            chapters: subject.topics?.length || 0,
            progress,
            accuracy,
          };
        });

        setSubjects(formattedSubjects);
      } catch (err: any) {
        setError(err.message || 'Failed to load subjects');
      } finally {
        setLoading(false);
      }
    };

    loadSubjects();
  }, []);

  const handleSubjectClick = (subjectId: string) => {
    navigate(`/subjects/${subjectId}/topics`);
  };

  if (loading) {
    return (
      <>
        <Topbar title="Subjects" />
        <div className="flex-1 overflow-auto p-6">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full border-4 border-t-blue-600 h-16 w-16 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading subjects...</p>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Topbar title="Subjects" />
        <div className="flex-1 overflow-auto p-6">
          <div className="text-center py-12">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <p className="text-red-600">Error loading subjects: {error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 btn btn-primary"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Topbar title="Subjects" />
      <div className="flex-1 overflow-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects.map((subject) => (
            <Card
              key={subject.id}
              className="hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer"
              onClick={() => handleSubjectClick(subject.id)}
            >
              <CardBody>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{subject.name}</h3>
                <p className="text-sm text-gray-600 mb-4">
                  {subject.totalQuestions} questions • {subject.chapters} chapters
                </p>

                <div className="mb-2 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 transition-all"
                    style={{ width: `${subject.progress}%` }}
                  />
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">{subject.progress}% Complete</span>
                  <span className={`font-semibold ${
                    subject.accuracy >= 75 ? 'text-green-600' : 'text-orange-600'
                  }`}>
                    {subject.accuracy}% Accuracy
                  </span>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
};