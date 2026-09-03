import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Topbar } from '../../components/layout/Topbar';
import { Card, CardBody } from '../../components/ui/Card';
import { hierarchyAPI } from '../../api/hierarchy';
import type { Branch, SubjectWithChapters } from '../../types';

export const SubjectsPage: React.FC = () => {
  const { branchId } = useParams();
  const navigate = useNavigate();
  const [branch, setBranch] = useState<Branch | null>(null);
  const [subjects, setSubjects] = useState<SubjectWithChapters[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (!branchId) return;
      try {
        setLoading(true);
        const [branchData, subjectsData] = await Promise.all([
          hierarchyAPI.getBranchById(Number(branchId)),
          hierarchyAPI.getSubjectsByBranch(Number(branchId))
        ]);
        setBranch(branchData);
        setSubjects(subjectsData);
      } catch (err: any) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [branchId]);

  if (loading) return <div>Loading...</div>;

  return (
    <>
      <Topbar title={`Subjects for ${branch?.name || 'Branch'}`} />
      <div className="flex-1 overflow-auto p-6">
        <button className="mb-4 text-blue-600" onClick={() => navigate(`/exams/${branch?.exam_id}/branches`)}>&larr; Back to Branches</button>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects.map((subject) => (
            <Card
              key={subject.id}
              className="hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer"
              onClick={() => navigate(`/subjects/${subject.id}/syllabus`)}
            >
              <CardBody>
                <h3 className="text-xl font-bold">{subject.name}</h3>
                <p className="text-sm text-gray-600 mt-2">{subject.chapters?.length || 0} chapters</p>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
};
