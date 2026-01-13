import React, { useState, useEffect } from 'react';
import { X, Download, Share2, Copy, Printer, Check, Loader2, Edit3 } from 'lucide-react';
import { PlatformDetect } from '../utils/platform';

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  letterContent: string;
}

declare global {
  interface Window {
    html2pdf: any;
  }
}

export const PreviewModal: React.FC<PreviewModalProps> = ({ isOpen, onClose, letterContent }) => {
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [editableContent, setEditableContent] = useState(letterContent);

  useEffect(() => {
    setEditableContent(letterContent);
  }, [letterContent, isOpen]);

  if (!isOpen) return null;

  const handleDownloadPDF = async () => {
    setLoading(true);
    try {
      const element = document.createElement('div');
      element.innerText = editableContent;
      
      element.style.width = '210mm';
      element.style.padding = '20mm';
      element.style.fontSize = '12pt';
      element.style.lineHeight = '1.6';
      element.style.fontFamily = '"Times New Roman", serif';
      element.style.color = '#000';
      element.style.background = '#fff';
      element.style.whiteSpace = 'pre-wrap';

      const opt = {
        margin: [0, 0, 0, 0],
        filename: `ArziWala_Letter_${Date.now()}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };

      if (window.html2pdf) {
        await window.html2pdf().set(opt).from(element).save();
      } else {
        alert("PDF generator is loading. Please try again in a few seconds.");
      }
    } catch (error) {
      console.error(error);
      alert("Could not generate PDF. Please try copying the text instead.");
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'ArziWala Application',
          text: editableContent,
        });
      } catch (err) {
        console.log('Share canceled');
      }
    } else {
      handleCopy();
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(editableContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      alert("Failed to copy text.");
    }
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Print Letter</title>
            <style>
              body { font-family: "Times New Roman", serif; padding: 40px; white-space: pre-wrap; }
            </style>
          </head>
          <body>${editableContent}</body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-zinc-900/40 backdrop-blur-md p-4 sm:p-6 animate-in fade-in duration-300">
      <div 
        className="bg-zinc-50 w-full max-w-3xl max-h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-300 border border-white/20"
        role="dialog"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 bg-white">
          <h2 className="font-serif font-bold text-zinc-900 flex items-center gap-2">
            Preview
          </h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-zinc-100 rounded-full transition-colors duration-200"
          >
            <X className="w-5 h-5 text-zinc-500" strokeWidth={1.5} />
          </button>
        </div>

        {/* Content Scroll Area */}
        <div className="flex-1 bg-zinc-100/50 overflow-hidden relative">
          <div className="absolute inset-0 p-4 sm:p-8 overflow-y-auto custom-scrollbar">
             <div className="bg-white shadow-[0_4px_20px_rgba(0,0,0,0.08)] mx-auto max-w-[210mm] min-h-full rounded-sm">
               <textarea 
                  className="w-full h-full min-h-[500px] p-8 sm:p-12 font-serif text-zinc-900 text-[11pt] sm:text-[12pt] leading-relaxed resize-none focus:outline-none"
                  value={editableContent}
                  onChange={(e) => setEditableContent(e.target.value)}
                  spellCheck={false}
               />
             </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-6 border-t border-zinc-200 bg-white grid grid-cols-2 sm:flex sm:justify-end gap-3">
          
          <button 
            onClick={handleCopy}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg border border-zinc-200 text-sm font-medium text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 transition-all duration-200"
          >
            {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" strokeWidth={1.5} />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>

          {PlatformDetect.canShare() && (
            <button 
              onClick={handleShare}
              className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg border border-zinc-200 text-sm font-medium text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 transition-all duration-200"
            >
              <Share2 className="w-4 h-4" strokeWidth={1.5} />
              <span>Share</span>
            </button>
          )}

          {PlatformDetect.canPrint() && (
             <button 
               onClick={handlePrint}
               className="hidden sm:flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg border border-zinc-200 text-sm font-medium text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 transition-all duration-200"
             >
               <Printer className="w-4 h-4" strokeWidth={1.5} />
               <span>Print</span>
             </button>
          )}

          <button 
            onClick={handleDownloadPDF}
            disabled={loading}
            className="col-span-2 sm:col-span-1 flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-zinc-900 text-white text-sm font-medium hover:bg-zinc-800 transition-all duration-200 shadow-lg shadow-zinc-200"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" strokeWidth={1.5} />}
            <span>Download PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
};