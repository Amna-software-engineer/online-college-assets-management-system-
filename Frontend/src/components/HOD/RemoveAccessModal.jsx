import { AlertTriangle } from 'lucide-react';
import React from 'react'

const RemoveAccessModal = ({ isOpen, onClose, faculty, onConfirm }) => {
  if (!isOpen || !faculty) return null;
  return (
    <div className="fixed inset-0 z-110 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
      <div className="bg-white w-full max-w-sm rounded-[2.5rem] p-8 text-center shadow-2xl border border-red-50">
        <div className="w-20 h-20 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-6"><AlertTriangle size={40} /></div>
        <h3 className="text-xl font-black text-slate-800 uppercase italic mb-2">Revoke Access?</h3>
        <p className="text-[10px] font-bold text-slate-400 leading-relaxed mb-8 uppercase">Are you sure you want to remove <span className="text-red-500">{faculty.name}</span>? All assets will be unassigned.</p>
        <div className="flex flex-col gap-3">
          <button onClick={onConfirm} className="w-full py-4 bg-red-500 text-white rounded-2xl font-black uppercase italic tracking-widest shadow-lg shadow-red-100">Yes, Remove Access</button>
          <button onClick={onClose} className="w-full py-4 bg-slate-100 text-slate-500 rounded-2xl font-black uppercase italic tracking-widest">Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default RemoveAccessModal