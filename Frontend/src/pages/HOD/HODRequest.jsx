import React, { useState } from 'react';
import { PlusCircle, Send, Info } from 'lucide-react';

const HODRequest = () => {
  // Hardcoded current user info (Aapke schema ke mutabiq)
  const [formData, setFormData] = useState({
    RequestorId: "HOD-CS-001", 
    department: "CS Department",
    status: "Pending",
    itemName: "",
    priority: "Medium",
    quantity: 1
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Section */}
      <div className="mb-8">
        <h2 className="text-3xl font-black text-[#1E2D44] italic uppercase tracking-tight">
          Request
        </h2>
      </div>

      {/* Main Request Form Card */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-50 overflow-hidden">
        <div className="p-8 md:p-12">
          
          <div className="flex items-center gap-3 mb-10 text-[#008BA9]">
            <PlusCircle size={28} strokeWidth={2.5} />
            <h3 className="text-xl font-black italic uppercase">New Asset Requisition</h3>
          </div>

          <form className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Item Name Input */}
            <div className="flex flex-col gap-2 md:col-span-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                Asset Description / Model Name
              </label>
              <input 
                type="text"
                placeholder="Specify model, quantity, and purpose..."
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold text-slate-700 focus:border-[#008BA9] focus:outline-none transition-all"
                value={formData.itemName}
                onChange={(e) => setFormData({...formData, itemName: e.target.value})}
              />
            </div>

            {/* Quantity Input */}
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                Required Quantity
              </label>
              <input 
                type="number"
                min="1"
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold text-slate-700 focus:border-[#008BA9] focus:outline-none transition-all"
                value={formData.quantity}
                onChange={(e) => setFormData({...formData, quantity: e.target.value})}
              />
            </div>

            {/* Priority Selection (Matching your Screenshot Dropdown) */}
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                Urgency Level
              </label>
              <select 
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold text-slate-700 focus:border-[#008BA9] focus:outline-none appearance-none transition-all"
                value={formData.priority}
                onChange={(e) => setFormData({...formData, priority: e.target.value})}
              >
                <option value="Low">Normal (Low)</option>
                <option value="Medium">High (Medium)</option>
                <option value="High">Critical (High)</option>
              </select>
            </div>

            {/* Read-only Department Info */}
            <div className="md:col-span-2 bg-cyan-50/50 p-4 rounded-2xl flex items-start gap-4 border border-cyan-100">
              <Info className="text-[#008BA9] shrink-0" size={20} />
              <p className="text-[10px] font-bold text-cyan-700 leading-relaxed uppercase">
                This request will be submitted from the <span className="font-black italic underline">{formData.department}</span> unit. 
                Final approval is required from the Principal Administration.
              </p>
            </div>

            {/* Submit Button (Matching your screenshot button) */}
            <div className="md:col-span-2 pt-4">
              <button 
                type="submit"
                className="w-full bg-[#008BA9] text-white py-5 rounded-2xl shadow-xl shadow-cyan-100 flex items-center justify-center gap-3 hover:bg-[#007894] transition-all transform active:scale-[0.98]"
              >
                <span className="text-sm font-black uppercase tracking-[0.2em] italic">Submit Requisition</span>
                <Send size={18} />
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default HODRequest;