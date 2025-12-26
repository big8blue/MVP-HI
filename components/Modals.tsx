import React from 'react';
import { X, CheckCircle, AlertTriangle, Info } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children?: React.ReactNode;
}

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'primary' | 'danger' | 'warning';
  icon?: React.ElementType;
}

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  actionLabel?: string;
}

const BaseModal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {children}
      </div>
    </div>
  );
};

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'primary',
  icon: Icon = Info,
}) => {
  const getColors = () => {
    switch (variant) {
      case 'danger': return { bg: 'bg-red-500/10', text: 'text-red-400', button: 'bg-red-600 hover:bg-red-500 shadow-red-500/20' };
      case 'warning': return { bg: 'bg-amber-500/10', text: 'text-amber-400', button: 'bg-amber-600 hover:bg-amber-500 shadow-amber-500/20' };
      default: return { bg: 'bg-indigo-500/10', text: 'text-indigo-400', button: 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-500/20' };
    }
  };

  const colors = getColors();

  return (
    <BaseModal isOpen={isOpen} onClose={onClose}>
      <div className="p-6">
        <div className={`flex items-center justify-center w-12 h-12 rounded-full ${colors.bg} mb-4 mx-auto`}>
          <Icon className={`w-6 h-6 ${colors.text}`} />
        </div>
        <h3 className="text-xl font-bold text-white text-center mb-2">{title}</h3>
        <p className="text-center text-slate-400 text-sm mb-6 leading-relaxed">
          {description}
        </p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition-colors border border-slate-700 hover:border-slate-600"
          >
            {cancelLabel}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`flex-1 py-2.5 rounded-lg text-white font-medium shadow-lg transition-all transform active:scale-95 ${colors.button}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </BaseModal>
  );
};

export const SuccessModal: React.FC<SuccessModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  actionLabel = 'Acknowledge'
}) => {
  return (
    <BaseModal isOpen={isOpen} onClose={onClose}>
      <div className="p-6 text-center">
        <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-500/20">
          <CheckCircle className="w-8 h-8 text-emerald-500 animate-in zoom-in duration-300" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
        <p className="text-slate-400 text-sm leading-relaxed">{description}</p>
      </div>
      <div className="p-4 bg-slate-800/50 border-t border-slate-800 flex justify-center">
        <button
          onClick={onClose}
          className="px-6 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium transition-colors w-full shadow-lg shadow-emerald-500/20"
        >
          {actionLabel}
        </button>
      </div>
    </BaseModal>
  );
};