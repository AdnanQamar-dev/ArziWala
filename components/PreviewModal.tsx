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
  // Local state for editing inside modal
  const [editableContent, setEditableContent] = useState(letterContent);

  useEffect(() => {
    setEditableContent(letterContent);
  }, [letterContent, isOpen]);

  if (!isOpen) return null;

  const handleDownloadPDF = async () => {
    setLoading(true);
    try {
      // Create a temporary element for PDF generation to ensure clean styling
      const element = document.createElement('div');
      // Use the edited content
      element.innerText = editableContent; // Use innerText to preserve line breaks from textarea
      
      // Apply PDF-specific styles to the temp element
      element.style.width = '210mm';
      element.style.padding = '20mm';
      element.style.fontSize = '12pt';
      element.style.lineHeight = '1.6';
      element.style.fontFamily = '"Times New Roman", serif';
      element.style.color = '#000';
      element.style.background = '#fff';
      element.style.whiteSpace = 'pre-wrap'; // Important for text preservation

      const opt = {
        margin: [0, 0, 0, 0], // We handle margin in padding
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
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/90 backdrop-blur-sm p-4 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-2xl max-h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
        role="dialog"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50">
          <h2 className="font-bold text-slate-800 flex items-center gap-2">
            <span className="bg-blue-100 text-blue-700 p-1.5 rounded-md">
              <Edit3 className="w-4 h-4" />
            </span>
            Preview & Edit
          </h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-200 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* Content Scroll Area - Editable Textarea */}
        <div className="flex-1 bg-slate-200 overflow-hidden relative">
          <div className="absolute inset-0 p-4 sm:p-6 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
             <div className="bg-white shadow-lg mx-auto max-w-[210mm] min-h-full">
               <textarea 
                  className="w-full h-full min-h-[500px] p-6 sm:p-10 font-serif text-slate-900 text-[11pt] sm:text-[12pt] leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  value={editableContent}
                  onChange={(e) => setEditableContent(e.target.value)}
               />
             </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-100 bg-white grid grid-cols-2 sm:flex sm:justify-end gap-3">
          
          <button 
            onClick={handleCopy}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-slate-200 font-semibold text-slate-600 hover:bg-slate-50 active:scale-95 transition-all"
          >
            {copied ? <Check className="w-5 h-5 text-green-600" /> : <Copy className="w-5 h-5" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>

          {PlatformDetect.canShare() && (
            <button 
              onClick={handleShare}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-slate-200 font-semibold text-slate-600 hover:bg-slate-50 active:scale-95 transition-all"
            >
              <Share2 className="w-5 h-5" />
              <span>Share</span>
            </button>
          )}

          {PlatformDetect.canPrint() && (
             <button 
               onClick={handlePrint}
               className="hidden sm:flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-slate-200 font-semibold text-slate-600 hover:bg-slate-50 active:scale-95 transition-all"
             >
               <Printer className="w-5 h-5" />
               <span>Print</span>
             </button>
          )}

          <button 
            onClick={handleDownloadPDF}
            disabled={loading}
            className="col-span-2 sm:col-span-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 active:scale-95 transition-all shadow-lg shadow-blue-200"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
            <span>Download PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
};