import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ExitConfirmModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ExitConfirmModal: React.FC<ExitConfirmModalProps> = ({
  isOpen,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="exit-modal-title"
    >
      <div className="relative w-full max-w-md bg-[#25262a] border border-[#383a40] rounded-xl p-6 shadow-2xl space-y-4">
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-200 transition-colors"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-500">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h3 id="exit-modal-title" className="text-lg font-semibold text-zinc-100">
              Exit Mock Interview?
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Your practice session will not be saved.
            </p>
          </div>
        </div>

        <p className="text-sm text-zinc-300 leading-relaxed">
          Exiting now will terminate your ongoing interview session. Any submitted answers and pending evaluations will be discarded.
        </p>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-zinc-300 hover:text-zinc-100 bg-[#2d2f34] hover:bg-[#34373d] border border-[#3e4148] rounded-lg transition-colors"
          >
            Stay in Interview
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-500 rounded-lg shadow-sm transition-colors"
          >
            Discard & Exit
          </button>
        </div>
      </div>
    </div>
  );
};

