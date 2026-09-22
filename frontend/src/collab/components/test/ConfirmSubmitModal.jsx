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
      <div className="bg-[#211C18] rounded-xl shadow-lg w-full max-w-md overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <AlertTriangle className="text-yellow-500" size={20} />
            Submit Test
          </h3>
          <button onClick={onClose} className="text-[#968C80] hover:text-[#C8BFB2]">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6">
          <p className="text-[#C8BFB2] mb-4">
            Are you sure you want to submit your test? You cannot change your answers after submission.
          </p>
          
          <div className="bg-[#28211C] p-4 rounded-lg flex justify-between mb-6">
            <div className="text-center">
              <span className="block text-2xl font-bold text-[#F3EDE3]">{answeredCount}</span>
              <span className="text-sm text-[#968C80]">Answered</span>
            </div>
            <div className="text-center">
              <span className="block text-2xl font-bold text-[#F3EDE3]">{totalQuestions - answeredCount}</span>
              <span className="text-sm text-[#968C80]">Unanswered</span>
            </div>
            <div className="text-center">
              <span className="block text-2xl font-bold text-[#F3EDE3]">{totalQuestions}</span>
              <span className="text-sm text-[#968C80]">Total</span>
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
