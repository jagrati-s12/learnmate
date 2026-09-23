import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#171411] via-[#211C18] to-[#28211C] text-[#F3EDE3]">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-[#C9A66B] to-[#D8B87C] bg-clip-text text-transparent">
            LearnMate AI
          </h1>
          <p className="text-xl md:text-2xl mb-12 text-[#C8BFB2] max-w-2xl mx-auto">
            Master SSC JE Civil Engineering with India's most comprehensive exam preparation platform
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button
              variant="primary"
              size="lg"
              onClick={() => navigate('/register')}
            >
              Get Started
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate('/login')}
            >
              Sign In
            </Button>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="bg-[#211C18] backdrop-blur-sm rounded-xl p-6 border border-[rgba(243,237,227,0.10)] hover:border-[#C9A66B]/30 transition-all">
            <div className="text-4xl mb-4">📚</div>
            <h3 className="text-xl font-semibold mb-2 text-[#F3EDE3]">Comprehensive Question Bank</h3>
            <p className="text-[#C8BFB2]">1000+ PYQs from SSC JE Civil Engineering covering all topics</p>
          </div>
          <div className="bg-[#211C18] backdrop-blur-sm rounded-xl p-6 border border-[rgba(243,237,227,0.10)] hover:border-[#C9A66B]/30 transition-all">
            <div className="text-4xl mb-4">⏱️</div>
            <h3 className="text-xl font-semibold mb-2 text-[#F3EDE3]">Mock Test Engine</h3>
            <p className="text-[#C8BFB2]">Realistic exam simulation with timer and question palette</p>
          </div>
          <div className="bg-[#211C18] backdrop-blur-sm rounded-xl p-6 border border-[rgba(243,237,227,0.10)] hover:border-[#C9A66B]/30 transition-all">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-semibold mb-2 text-[#F3EDE3]">Performance Analytics</h3>
            <p className="text-[#C8BFB2]">Track your progress with detailed subject-wise analysis</p>
          </div>
        </div>
      </div>
    </div>
  );
};
