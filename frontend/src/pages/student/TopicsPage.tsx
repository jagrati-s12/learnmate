import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Topbar } from '../../components/layout/Topbar';
import { Card, CardBody } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { subjectsAPI, Subject, Topic } from '../../api';

export const TopicsPage: React.FC = () => {
  const { subjectId } = useParams();
  const navigate = useNavigate();
  const [subject, setSubject] = useState<Subject | null>(null);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSubject = async () => {
      if (!subjectId) return;
      try {
        setLoading(true);
        const data = await subjectsAPI.getSubjectById(parseInt(subjectId));
        setSubject(data);
        setTopics(data.topics || []);
      } catch (err: any) {
        setError(err.message || 'Failed to load topics');
      } finally {
        setLoading(false);
      }
    };
    loadSubject();
  }, [subjectId]);

  const handleTopicClick = (topicId: number) => {
    navigate(`/practice/${topicId}`);
  };

  if (loading) {
    return (
      <>
        <Topbar title="Topics" />
        <div className="flex-1 overflow-auto p-6">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full border-4 border-t-blue-600 h-16 w-16 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading topics...</p>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Topbar title="Topics" />
        <div className="flex-1 overflow-auto p-6">
          <div className="text-center py-12">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <p className="text-red-600">Error loading topics: {error}</p>
              <button onClick={() => window.location.reload()} className="mt-4 btn btn-primary">
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
      <Topbar title={subject?.name || 'Topics'} />

      <div className="flex-1 overflow-auto p-6">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => navigate('/subjects')}
          className="mb-4"
        >
          ← Back to Subjects
        </Button>

        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Select a Topic</h2>

        {topics.length === 0 ? (
          <p className="text-gray-600">No topics available for this subject yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topics.map((topic) => (
              <Card
                key={topic.id}
                className="hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer"
                onClick={() => handleTopicClick(topic.id)}
              >
                <CardBody>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{topic.name}</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    {topic.question_count} question{topic.question_count !== 1 ? 's' : ''}
                  </p>

                  {topic.description && (
                    <p className="text-sm text-gray-500 mb-4 line-clamp-2">{topic.description}</p>
                  )}

                  <Button
                    variant="primary"
                    size="sm"
                    fullWidth
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTopicClick(topic.id);
                    }}
                  >
                    Start Practice
                  </Button>
                </CardBody>
              </Card>
            ))}
          </div>
        )}
      </div>
    </>
  );
};
