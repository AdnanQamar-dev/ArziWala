import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface AccordionProps {
  title: string;
  icon?: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  className?: string;
  defaultOpen?: boolean;
}

export const Accordion: React.FC<AccordionProps> = ({ 
  title, 
  icon, 
  isOpen, 
  onToggle, 
  children,
  className = '' 
}) => {
  return (
    <div className={`border border-slate-200 rounded-xl bg-white overflow-hidden shadow-sm transition-all duration-200 ${isOpen ? 'ring-2 ring-slate-100' : ''} ${className}`}>
      <button 
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 transition-colors focus:outline-none"
        type="button"
      >
        <div className="flex items-center space-x-3">
          {icon && <div className={`transition-colors ${isOpen ? 'text-blue-700' : 'text-slate-400'}`}>{icon}</div>}
          <span className={`font-bold text-sm uppercase tracking-wide transition-colors ${isOpen ? 'text-slate-800' : 'text-slate-600'}`}>
            {title}
          </span>
        </div>
        <div className={`bg-white p-1 rounded-full border border-slate-200 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180 text-blue-700 border-blue-100' : ''}`}>
           <ChevronDown className="w-4 h-4" />
        </div>
      </button>
      
      {isOpen && (
        <div className="p-5 border-t border-slate-100 bg-white">
          {children}
        </div>
      )}
    </div>
  );
};