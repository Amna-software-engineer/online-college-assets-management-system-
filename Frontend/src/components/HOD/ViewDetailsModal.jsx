
import { Package, X } from 'lucide-react';
import React, { useState } from 'react'

const ViewDetailsModal = ({ isOpen, onClose, title, subTitle, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden">
        
        {/* Header  */}
        <div className="bg-[#008BA9] p-8 text-white relative">
          <button onClick={onClose} className="absolute top-6 right-6 p-2 hover:bg-white/10 rounded-full transition-colors">
            <X size={20} />
          </button>
          <h3 className="text-2xl font-bold mt-2 leading-tight">{title}</h3>
          <p className="text-[10px] font-semibold uppercase tracking-[0.25em] opacity-70">{subTitle}</p>
        </div>

        {/* Dynamic Body  */}
        <div className="p-8 space-y-8 max-h-[60vh] overflow-y-auto no-scrollbar">
          {children}
        </div>

        {/* Footer */}
        <div className="p-6 bg-slate-50 flex justify-end">
          <button onClick={onClose} className="px-8 py-3 bg-slate-800 text-white text-xs font-semibold uppercase rounded-xl hover:bg-slate-900">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewDetailsModal