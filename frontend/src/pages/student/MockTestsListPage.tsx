import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Topbar } from '../../components/layout/Topbar';
import { Card, CardBody } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { mockTestsAPI, MockTest } from '../../api/mockTests';
import { Icons } from '../../assets/icons';
import { Brain } from 'lucide-react';

export const MockTestsListPage: React.FC = () => {
  const navigate = useNavigate();
  const [tests, setTests] = useState<MockTest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);


  
  const handleGenerateAI = async () => {
    try {
      setGenerating(true);
      setError(null);
      // HARDCODE BRANCH 2 for now based on ProgressPage logic
      const newTest = await mockTestsAPI.generateAITest({ branch_id: 2, total_questions: 100 });
      setTests([newTest, ...tests]);
      navigate(`/tests/${newTest.id}`);
    } catch (err) {
      setError('Failed to generate AI Test');
      console.error(err);
    } finally {
      setGenerating(false);
    }
  };

  useEffect(() => {
    const fetchTests = async () => {
      try {
        setLoading(true);
        const data = await mockTestsAPI.getAllTests();
        setTests(data);
      } catch (err: any) {
        setError('Failed to load mock tests. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTests();
  }, []);

  return (
    <>
      <Topbar title="Mock Tests" />
      <div className="flex-1 overflow-auto p-6 text-[#F3EDE3]">
        
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-[#F3EDE3]">Available Mock Tests</h1>
          <Button 
            variant="primary" 
            onClick={handleGenerateAI} 
            disabled={generating}
            className="flex items-center gap-2"
          >
            <Brain className="w-4 h-4" />
            {generating ? 'Analyzing profile...' : 'Generate AI Test'}
          </Button>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full border-4 border-t-blue-600 h-10 w-10"></div>
          </div>
        ) : error ? (
           <div className="bg-red-50 text-red-600 p-4 rounded-lg">
             {error}
           </div>
        ) : tests.length === 0 ? (
           <div className="text-center py-12 bg-[#211C18] rounded-xl border border-[rgba(243,237,227,0.08)]">
             <Icons.BookOpen className="w-12 h-12 text-[#968C80] mx-auto mb-4" />
             <h3 className="text-lg font-medium text-[#F3EDE3] mb-1">No Tests Available</h3>
             <p className="text-[#968C80]">Check back later for new mock tests.</p>
           </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tests.map(test => (
              <Card key={test.id} className="flex flex-col hover:shadow-md transition-shadow">
                <CardBody className="flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold text-[#F3EDE3]">{test.name}</h3>
                    <span className="bg-[#302821] text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                      {test.test_type.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                  
                  <p className="text-[#C8BFB2] text-sm mb-6 flex-1">
                    {test.description || 'Practice your skills with this mock test.'}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm text-[#968C80] mb-6">
                    <div className="flex items-center gap-1">
                      <Icons.Clock className="w-4 h-4" />
                      <span>{test.duration_minutes} mins</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Icons.CheckCircle className="w-4 h-4" />
                      <span>{test.total_marks} marks</span>
                    </div>
                  </div>
                  
                  <Button 
                    variant="primary" 
                    className="w-full"
                    onClick={() => navigate(`/tests/${test.id}`)}
                  >
                    Start Test
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
