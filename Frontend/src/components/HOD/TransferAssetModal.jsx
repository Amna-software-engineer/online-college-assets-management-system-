import React, { useState } from 'react';
import { X, ArrowRightLeft, User, ShieldCheck, ChevronDown, CheckCircle2, Hash } from 'lucide-react';
import { useTransferAsset } from '../../api/asset.api';
import Loader from '../Loader';

const TransferAssetModal = ({ isOpen, onClose, asset, facultyList }) => {
  console.log("asset ",asset);
  
  const [formData, setFormData] = useState({
    assetId: asset?._id,
    quantity: 0,
    condition: "",
    assignedTo: ""

  });
  const { transferAsset, loading } = useTransferAsset();


  const handleSubmit = async (e, formData) => {

    e.preventDefault();
    formData.assetId = asset._id; // Ensure assetId is included in the formData
    console.log("form Data transfer asset", formData);
    const response = await transferAsset(formData);
    onClose()
    if (response?.data) {
      navigate("/hod/manage-assets")
    }
  }
  if (loading) { return <Loader /> }
  if (!isOpen || !asset) return null;


  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300 font-sans">
      <div className="w-full max-w-md bg-white rounded-[40px] shadow-2xl shadow-slate-200 overflow-hidden border border-slate-100 animate-in slide-in-from-bottom-8 duration-500">

        {/* Header */}
        <div className="bg-[#0088A8] p-10 text-white relative">
          <div className="text-center">
            <h2 className="text-2xl font-black italic tracking-tight uppercase leading-none">Transfer Asset</h2>
          </div>
          <button onClick={onClose} className="absolute top-6 right-6 p-2 hover:bg-white/10 rounded-full transition-colors"><X size={20} /></button>
        </div>

        <form onSubmit={(e) => handleSubmit(e, formData)} className="p-10 space-y-5">

          {/* Asset Info & Available Qty */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-[#0088A8] shadow-sm"><ShieldCheck size={18} /></div>
              <div>
                <h4 className="text-sm font-black text-slate-800 uppercase italic">{asset.name}</h4>
                <p className="text-[9px] font-bold text-slate-400 uppercase">In Stock: {asset.quantity}</p>
              </div>
            </div>
            <span className="bg-emerald-100 text-emerald-600 text-[10px] font-black px-3 py-1 rounded-lg uppercase">Active</span>
          </div>

          <div className="grid grid-cols-1 gap-5">
            {/* New Owner Selection */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Assign To</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#0088A8]" size={16} />
                <select
                  required
                  value={formData.assignedTo}
                  onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                  className="w-full pl-11 pr-10 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:border-[#0088A8] text-sm font-bold text-slate-700 appearance-none cursor-pointer"
                >
                  <option value="">Select Faculty Member</option>
                  {facultyList?.map((f) => (
                    <option key={f._id} value={f._id}>{f.name} ({f.department})</option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-300"><ChevronDown size={14} /></div>
              </div>
            </div>

            {/* Transfer Quantity - NEW FIELD */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Quantity to Transfer</label>
              <div className="relative group">
                <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#0088A8]" size={16} />
                <input
                  type="number"
                  min="1"
                  max={asset.quantity}
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
                  required
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:border-[#0088A8] text-sm font-bold"
                />
              </div>
            </div>
          </div>

          {/* Condition Update */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Asset Status</label>
            <div className="grid grid-cols-2 gap-2">
              {["New", "Maintenance", "Damaged", "Lost"].map((cond) => (
                <button
                  key={cond}
                  type="button"
                  onClick={() => setFormData({ ...formData, condition: cond })}
                  className={`py-3 rounded-xl text-[9px] font-black uppercase transition-all border ${formData.condition === cond ? 'bg-[#0088A8] border-[#0088A8] text-white italic' : 'bg-slate-50 border-slate-100 text-slate-400'
                    }`}
                >
                  {cond}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-[#1E2D44] hover:bg-[#162131] text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.25em] shadow-xl transition-all active:scale-95 flex items-center justify-center gap-3 mt-4"
          >
            Confirm Transfer <CheckCircle2 size={18} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default TransferAssetModal;