import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const Input: React.FC<InputProps> = ({ label, className = '', ...props }) => {
  return (
    <div className="flex flex-col space-y-2 group">
      <label className="text-xs font-medium text-zinc-500 uppercase tracking-widest transition-colors group-focus-within:text-zinc-900">
        {label}
      </label>
      <input
        className={`w-full bg-white border border-zinc-200 rounded-lg px-4 py-3 text-sm text-zinc-900 placeholder-zinc-300 transition-all duration-300 ease-out focus:outline-none focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 hover:border-zinc-300 shadow-[0_2px_8px_rgba(0,0,0,0.02)] ${className}`}
        {...props}
      />
    </div>
  );
};

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
}

export const TextArea: React.FC<TextAreaProps> = ({ label, className = '', ...props }) => {
  return (
    <div className="flex flex-col space-y-2 group">
      <label className="text-xs font-medium text-zinc-500 uppercase tracking-widest transition-colors group-focus-within:text-zinc-900">
        {label}
      </label>
      <textarea
        className={`w-full bg-white border border-zinc-200 rounded-lg px-4 py-3 text-sm text-zinc-900 placeholder-zinc-300 transition-all duration-300 ease-out focus:outline-none focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 hover:border-zinc-300 shadow-[0_2px_8px_rgba(0,0,0,0.02)] min-h-[120px] ${className}`}
        {...props}
      />
    </div>
  );
};