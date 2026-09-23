import { Shield } from "lucide-react";
import PageIntro from "../common/PageIntro";

export default function Security() {
  return (
    <div className="page">
      <PageIntro 
        title="Security" 
        subtitle="Manage your password and account security."
      />

      <div className="max-w-3xl">
        <div className="card mb-6">
          <h3 className="font-semibold text-lg border-b border-theme-border pb-4 mb-4 flex items-center gap-2 text-theme-text-primary">
            <Shield size={18} className="text-theme-accent-primary" /> Account Security
          </h3>
          <div className="flex justify-between items-center py-2">
            <div>
              <div className="font-medium text-theme-text-primary">Password</div>
              <div className="text-sm text-theme-text-secondary">Change your password to keep your account secure</div>
            </div>
            <button className="px-4 py-2 border border-theme-border rounded-lg hover:bg-theme-bg-elevated text-sm font-medium text-theme-text-primary">Update</button>
          </div>
        </div>
      </div>
    </div>
  );
}
