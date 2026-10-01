import React from 'react';
import { Card } from '../../components/ui/Card';

export const AdminMockTestsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800">Mock Tests Management</h1>
      </div>
      <Card className="p-6">
        <p className="text-slate-600 mb-4">
          Create, edit, and publish mock tests for students.
        </p>
        <div className="text-center p-12 border-2 border-dashed border-slate-200 rounded-lg">
          <p className="text-slate-500 font-medium">Mock test management interface coming soon.</p>
        </div>
      </Card>
    </div>
  );
};
