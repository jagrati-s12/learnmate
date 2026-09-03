import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Topbar } from '../../../components/layout/Topbar';
import { Card, CardBody } from '../../../components/ui/Card';
import { hierarchyAPI } from '../../../api/hierarchy';
import type { Exam } from '../../../types';

export const ExamsPage: React.FC = () => {
  const navigate = useNavigate();
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadExams = async () => {
      try {
        setLoading(true);
        const data = await hierarchyAPI.getExams();
        setExams(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load exams');
      } finally {
        setLoading(false);
      }
    };
    loadExams();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <Topbar title="Select Exam" />
      <div className="flex-1 overflow-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exams.map((exam) => (
            <Card
              key={exam.id}
              className="hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer"
              onClick={() => navigate(`/exams/${exam.id}/branches`)}
            >
              <CardBody>
                <h3 className="text-xl font-bold">{exam.name}</h3>
                {exam.description && <p className="text-gray-600 mt-2">{exam.description}</p>}
              </CardBody>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
};
