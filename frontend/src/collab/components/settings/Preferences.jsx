import { Bell, BookOpen } from "lucide-react";
import PageIntro from "../common/PageIntro";

export default function Preferences() {
  return (
    <div className="page">
      <PageIntro 
        title="Study Preferences" 
        subtitle="Configure your learning environment and notifications."
      />

      <div className="max-w-3xl">
        <div className="card mb-8">
          <h3 className="font-semibold text-lg border-b border-theme-border pb-4 mb-4 flex items-center gap-2 text-theme-text-primary">
            <Bell size={18} className="text-theme-accent-primary" /> Notifications
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <div className="font-medium text-theme-text-primary">Daily Reminders</div>
                <div className="text-sm text-theme-text-secondary">Get a reminder to maintain your study streak</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-theme-bg-elevated peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-theme-bg-secondary after:border-[rgba(243,237,227,0.12)] after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-theme-accent-primary"></div>
              </label>
            </div>
          </div>
        </div>
        
        <div className="card mb-8">
          <h3 className="font-semibold text-lg border-b border-theme-border pb-4 mb-4 flex items-center gap-2 text-theme-text-primary">
            <BookOpen size={18} className="text-theme-accent-primary" /> Study Defaults
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <div className="font-medium text-theme-text-primary">Default Difficulty</div>
                <div className="text-sm text-theme-text-secondary">What difficulty of questions should we prioritize?</div>
              </div>
              <select className="bg-theme-bg-secondary border border-theme-border text-theme-text-primary rounded-lg px-3 py-1">
                <option>Adaptive (AI)</option>
                <option>Beginner</option>
                <option>Advanced</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
