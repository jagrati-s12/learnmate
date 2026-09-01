import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            LearnMate AI
          </h1>
          <p className="text-xl md:text-2xl mb-12 opacity-95 max-w-2xl mx-auto">
            Master SSC JE Civil Engineering with India's most comprehensive exam preparation platform
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button
              variant="primary"
              size="lg"
              onClick={() => navigate('/register')}
              className="bg-white text-blue-600 hover:bg-gray-100"
            >
              Get Started
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate('/login')}
              className="border-2 border-white text-white bg-transparent hover:bg-white/10"
            >
              Sign In
            </Button>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="text-4xl mb-4">📚</div>
            <h3 className="text-xl font-semibold mb-2">Comprehensive Question Bank</h3>
            <p className="opacity-90">1000+ PYQs from SSC JE Civil Engineering covering all topics</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="text-4xl mb-4">⏱️</div>
            <h3 className="text-xl font-semibold mb-2">Mock Test Engine</h3>
            <p className="opacity-90">Realistic exam simulation with timer and question palette</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-semibold mb-2">Performance Analytics</h3>
            <p className="opacity-90">Track your progress with detailed subject-wise analysis</p>
          </div>
        </div>
      </div>
    </div>
  );
};
