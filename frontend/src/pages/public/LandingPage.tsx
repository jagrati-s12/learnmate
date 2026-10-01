import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-theme-bg-primary text-theme-text-primary transition-colors duration-300">
      {/* Top Navbar */}
      <div className="w-full h-16 border-b border-theme-border flex items-center justify-between px-8 bg-theme-bg-secondary sticky top-0 z-50">
        <div className="font-bold text-xl text-theme-accent-primary">LearnMate</div>
        <div className="flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-theme-bg-elevated transition-colors text-theme-text-secondary hover:text-theme-text-primary"
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <Button variant="outline" size="sm" onClick={() => navigate('/login')}>Sign In</Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-theme-accent-primary to-theme-accent-secondary bg-clip-text text-transparent">
            LearnMate AI
          </h1>
          <p className="text-xl md:text-2xl mb-12 text-theme-text-secondary max-w-2xl mx-auto">
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
          <div className="bg-theme-bg-secondary backdrop-blur-sm rounded-xl p-6 border border-theme-border hover:border-theme-accent-primary/30 transition-all">
            <div className="text-4xl mb-4">📚</div>
            <h3 className="text-xl font-semibold mb-2 text-theme-text-primary">Comprehensive Question Bank</h3>
            <p className="text-theme-text-secondary">1000+ PYQs from SSC JE Civil Engineering covering all topics</p>
          </div>
          <div className="bg-theme-bg-secondary backdrop-blur-sm rounded-xl p-6 border border-theme-border hover:border-theme-accent-primary/30 transition-all">
            <div className="text-4xl mb-4">⏱️</div>
            <h3 className="text-xl font-semibold mb-2 text-theme-text-primary">Mock Test Engine</h3>
            <p className="text-theme-text-secondary">Realistic exam simulation with timer and question palette</p>
          </div>
          <div className="bg-theme-bg-secondary backdrop-blur-sm rounded-xl p-6 border border-theme-border hover:border-theme-accent-primary/30 transition-all">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-semibold mb-2 text-theme-text-primary">Performance Analytics</h3>
            <p className="text-theme-text-secondary">Track your progress with detailed subject-wise analysis</p>
          </div>
        </div>
      </div>
    </div>
  );
};
