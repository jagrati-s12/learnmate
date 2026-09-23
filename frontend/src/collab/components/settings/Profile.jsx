import { useAuth } from "../../../contexts/AuthContext";
import { User, Mail } from "lucide-react";
import PageIntro from "../common/PageIntro";

export default function Profile() {
  const auth = useAuth();
  const user = auth?.user;
  
  return (
    <div className="page">
      <PageIntro 
        title="My Profile" 
        subtitle="Manage your personal information."
      />

      <div className="max-w-3xl">
        <div className="card mb-6">
          <h3 className="font-semibold text-lg border-b border-theme-border pb-4 mb-4 text-theme-text-primary">Profile Information</h3>
          
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-theme-bg-elevated rounded-full flex items-center justify-center text-theme-accent-primary font-bold text-2xl">
                {user?.full_name?.charAt(0) || user?.email?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <div>
                <div className="font-medium text-lg text-theme-text-primary">{user?.full_name || 'SSC JE Aspirant'}</div>
                <div className="text-theme-text-secondary">{user?.email}</div>
              </div>
            </div>
            
            <div className="grid gap-4 mt-6">
              <div>
                <label className="block text-sm font-medium text-theme-text-secondary mb-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-theme-text-muted" size={18} />
                  <input type="text" disabled value={user?.full_name || ''} className="w-full pl-10 pr-4 py-2 border border-theme-border rounded-lg bg-theme-bg-elevated text-theme-text-secondary" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-theme-text-secondary mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-theme-text-muted" size={18} />
                  <input type="email" disabled value={user?.email || ''} className="w-full pl-10 pr-4 py-2 border border-theme-border rounded-lg bg-theme-bg-elevated text-theme-text-secondary" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-end mt-8">
          <button onClick={() => { auth?.logout?.(); window.location.href="/login"; }} className="px-6 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg font-medium transition-colors">
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
