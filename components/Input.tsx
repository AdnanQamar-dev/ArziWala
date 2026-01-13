import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const Input: React.FC<InputProps> = ({ label, className = '', ...props }) => {
  return (
    <div className="group flex flex-col gap-1.5 w-full">
      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1 transition-colors group-focus-within:text-blue-600">
        {label}
      </label>
      <div className="relative">
        <input
          className={`
            w-full bg-white text-slate-900 border border-slate-200 rounded-xl px-4 py-3 
            placeholder:text-slate-400 text-sm font-medium shadow-sm
            transition-all duration-200 ease-in-out
            focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 
            hover:border-slate-300
            disabled:opacity-50 disabled:cursor-not-allowed
            ${className}
          `}
          {...props}
        />
      </div>
    </div>
  );
};

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
}

export const TextArea: React.FC<TextAreaProps> = ({ label, className = '', ...props }) => {
  return (
    <div className="group flex flex-col gap-1.5 w-full">
      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1 transition-colors group-focus-within:text-blue-600">
        {label}
      </label>
      <div className="relative">
        <textarea
          className={`
            w-full bg-white text-slate-900 border border-slate-200 rounded-xl px-4 py-3 
            placeholder:text-slate-400 text-sm font-medium shadow-sm min-h-[120px]
            transition-all duration-200 ease-in-out
            focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10
            hover:border-slate-300
            resize-y
            ${className}
          `}
          {...props}
        />
      </div>
    </div>
  );
};