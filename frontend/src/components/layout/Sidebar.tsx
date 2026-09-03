import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Icons } from '../../assets/icons';

export const Sidebar: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: Icons.Home },
    { path: '/exams', label: 'Exams & Syllabus', icon: Icons.BookOpen },
    { path: '/practice', label: 'Practice', icon: Icons.PenTool },
    { path: '/tests', label: 'Mock Tests', icon: Icons.Clock },
    { path: '/progress', label: 'Progress', icon: Icons.BarChart },
    { path: '/bookmarks', label: 'Bookmarks', icon: Icons.Bookmark },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-screen flex flex-col">
      <div className="p-6">
        <h1 className="text-xl font-bold text-blue-600">LearnMate AI</h1>
      </div>

      <nav className="flex-1 px-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-colors ${
                isActive
                  ? 'bg-blue-50 text-blue-600 font-medium'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};
