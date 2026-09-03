import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Topbar } from '../../../components/layout/Topbar';
import { Card, CardBody } from '../../../components/ui/Card';
import { hierarchyAPI } from '../../../api/hierarchy';
import type { Branch, Exam } from '../../../types';

export const BranchesPage: React.FC = () => {
  const { examId } = useParams();
  const navigate = useNavigate();
  const [exam, setExam] = useState<Exam | null>(null);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (!examId) return;
      try {
        setLoading(true);
        const [examData, branchesData] = await Promise.all([
          hierarchyAPI.getExamById(Number(examId)),
          hierarchyAPI.getBranchesByExam(Number(examId))
        ]);
        setExam(examData);
        setBranches(branchesData);
      } catch (err: any) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [examId]);

  if (loading) return <div>Loading...</div>;

  return (
    <>
      <Topbar title={`Branches for ${exam?.name || 'Exam'}`} />
      <div className="flex-1 overflow-auto p-6">
        <button className="mb-4 text-blue-600" onClick={() => navigate('/exams')}>&larr; Back to Exams</button>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {branches.map((branch) => (
            <Card
              key={branch.id}
              className="hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer"
              onClick={() => navigate(`/branches/${branch.id}/subjects`)}
            >
              <CardBody>
                <h3 className="text-xl font-bold">{branch.name}</h3>
                {branch.description && <p className="text-gray-600 mt-2">{branch.description}</p>}
              </CardBody>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
};
