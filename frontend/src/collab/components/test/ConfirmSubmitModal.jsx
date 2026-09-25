import { AlertTriangle, X } from "lucide-react";

export default function ConfirmSubmitModal({
  isOpen,
  onClose,
  onSubmit,
  totalQuestions,
  answeredCount,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-theme-bg-secondary rounded-xl shadow-lg w-full max-w-md overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b border-[rgba(243,237,227,0.08)]">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <AlertTriangle className="text-yellow-500" size={20} />
            Submit Test
          </h3>
          <button onClick={onClose} className="text-theme-text-muted hover:text-theme-text-secondary">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6">
          <p className="text-theme-text-secondary mb-4">
            Are you sure you want to submit your test? You cannot change your answers after submission.
          </p>
          
          <div className="bg-theme-bg-surface p-4 rounded-lg flex justify-between mb-6">
            <div className="text-center">
              <span className="block text-2xl font-bold text-theme-text-primary">{answeredCount}</span>
              <span className="text-sm text-theme-text-muted">Answered</span>
            </div>
            <div className="text-center">
              <span className="block text-2xl font-bold text-theme-text-primary">{totalQuestions - answeredCount}</span>
              <span className="text-sm text-theme-text-muted">Unanswered</span>
            </div>
            <div className="text-center">
              <span className="block text-2xl font-bold text-theme-text-primary">{totalQuestions}</span>
              <span className="text-sm text-theme-text-muted">Total</span>
            </div>
          </div>
          
          <div className="flex gap-3 justify-end">
            <button className="secondary-button" onClick={onClose}>
              Cancel
            </button>
            <button className="primary-button" onClick={onSubmit}>
              Yes, Submit Test
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
