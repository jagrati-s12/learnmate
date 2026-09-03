import React, { useState, useEffect } from 'react';
import { Topbar } from '../../components/layout/Topbar';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { hierarchyAPI } from '../../api/hierarchy';

interface SubjectProgress {
  name: string;
  accuracy: number;
  attempted: number;
  total: number;
  level: string;
}

export const ProgressPage: React.FC = () => {
  const [subjects, setSubjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProgressData = async () => {
      try {
        setLoading(true);
        // Get all subjects with topics to calculate progress
        const subjectsData = await hierarchyAPI.getSubjects();
        setSubjects(subjectsData);
      } catch (err: any) {
        setError(err.message || 'Failed to load progress data');
      } finally {
        setLoading(false);
      }
    };

    loadProgressData();
  }, []);

  if (loading) {
    return (
      <>
        <Topbar title="Progress" />
        <div className="flex-1 overflow-auto p-6">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full border-4 border-t-blue-600 h-16 w-16 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading progress...</p>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Topbar title="Progress" />
        <div className="flex-1 overflow-auto p-6">
          <div className="text-center py-12">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
              <p className="text-red-600 mb-4">Error: {error}</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Calculate subject-wise performance
  const subjectPerformance: SubjectProgress[] = subjects.map((subject) => {
    let totalQuestions = 0;
    if (subject.chapters) {
      subject.chapters.forEach((chapter: any) => {
        if (chapter.topics) {
          chapter.topics.forEach((topic: any) => {
            totalQuestions += (topic.question_count || 0);
          });
        }
      });
    }

    // For now, attempted is 0 (would need user progress API in future)
    const attempted = 0;
    const accuracy = 0;

    let level = 'Not Started';
    if (accuracy >= 75) level = 'Strong';
    else if (accuracy >= 50) level = 'Good';
    else if (attempted > 0) level = 'Needs improvement';

    return {
      name: subject.name,
      accuracy,
      attempted,
      total: totalQuestions,
      level,
    };
  });

  return (
    <>
      <Topbar title="Progress" />
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-5xl mx-auto">
          {/* Performance Trend Chart */}
          <Card className="mb-6">
            <CardHeader>
              <h2 className="text-lg font-semibold">Performance Trend</h2>
            </CardHeader>
            <CardBody>
              <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400">
                📈 Performance chart will appear here
              </div>
            </CardBody>
          </Card>

          {/* Subject-wise Performance */}
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold">Subject-wise Performance</h2>
            </CardHeader>
            <CardBody>
              {subjectPerformance.length > 0 ? (
                <div className="space-y-4">
                  {subjectPerformance.map((subject) => (
                    <div key={subject.name} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-gray-900">{subject.name}</h3>
                        <div className={`text-lg font-semibold ${
                          subject.accuracy >= 75 ? 'text-green-600' :
                          subject.accuracy >= 50 ? 'text-blue-600' :
                          subject.attempted === 0 ? 'text-gray-400' : 'text-orange-600'
                        }`}>
                          {subject.accuracy > 0 ? `${subject.accuracy}%` : '—'}
                        </div>
                      </div>

                      <div className="mb-2 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all ${
                            subject.accuracy >= 75 ? 'bg-green-500' :
                            subject.accuracy >= 50 ? 'bg-blue-500' :
                            subject.attempted === 0 ? 'bg-gray-300' : 'bg-orange-500'
                          }`}
                          style={{ width: `${subject.accuracy}%` }}
                        />
                      </div>

                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>{subject.total} questions available</span>
                        <span>•</span>
                        <span className={`font-medium ${
                          subject.accuracy >= 75 ? 'text-green-600' :
                          subject.accuracy >= 50 ? 'text-blue-600' :
                          subject.attempted === 0 ? 'text-gray-500' : 'text-orange-600'
                        }`}>
                          {subject.level}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 text-center py-8">
                  No subjects available yet. Start practicing to see your progress!
                </p>
              )}
            </CardBody>
          </Card>
        </div>
      </div>
    </>
  );
};