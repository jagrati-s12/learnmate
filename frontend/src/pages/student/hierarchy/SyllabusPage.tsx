import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Topbar } from '../../../components/layout/Topbar';
import { Card, CardBody } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { hierarchyAPI } from '../../../api/hierarchy';
import type { SubjectWithChapters, ChapterWithTopics, TopicSimple } from '../../../types';

export const SyllabusPage: React.FC = () => {
  const { subjectId } = useParams();
  const navigate = useNavigate();
  const [subject, setSubject] = useState<SubjectWithChapters | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSubject = async () => {
      if (!subjectId) return;
      try {
        setLoading(true);
        const data = await hierarchyAPI.getSubjectById(Number(subjectId));
        setSubject(data);
      } catch (err: any) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadSubject();
  }, [subjectId]);

  if (loading) return <div>Loading syllabus...</div>;

  return (
    <>
      <Topbar title={`${subject?.name || 'Subject'} Syllabus`} />
      <div className="flex-1 overflow-auto p-6">
        <button className="mb-4 text-[#C9A66B]" onClick={() => navigate(`/branches/${subject?.branch_id}/subjects`)}>
          &larr; Back to Subjects
        </button>

        <h2 className="text-2xl font-bold mb-6">Chapters & Topics</h2>

        {subject?.chapters && subject.chapters.length > 0 ? (
          <div className="space-y-6">
            {subject.chapters.map((chapter: ChapterWithTopics) => (
              <div key={chapter.id} className="bg-[#211C18] p-6 rounded-lg shadow-sm border border-gray-100">
                <h3 className="text-xl font-semibold mb-4 text-[#F3EDE3]">{chapter.name}</h3>
                {chapter.description && <p className="text-[#C8BFB2] mb-4">{chapter.description}</p>}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {chapter.topics && chapter.topics.length > 0 ? (
                    chapter.topics.map((topic: TopicSimple) => (
                      <Card key={topic.id} className="hover:shadow-md transition-shadow">
                        <CardBody className="p-4">
                          <h4 className="font-medium text-[#F3EDE3] mb-2">{topic.name}</h4>
                          <Button
                            variant="primary"
                            size="sm"
                            fullWidth
                            onClick={() => navigate(`/practice?topic_id=${topic.id}`)}
                          >
                            Practice
                          </Button>
                        </CardBody>
                      </Card>
                    ))
                  ) : (
                    <p className="text-[#968C80] text-sm italic">No topics found in this chapter.</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-[#C8BFB2]">No chapters mapped for this subject yet.</p>
        )}
      </div>
    </>
  );
};
