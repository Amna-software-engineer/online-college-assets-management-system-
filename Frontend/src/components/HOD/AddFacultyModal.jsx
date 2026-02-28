import React, { use, useState } from 'react';
import { X, UserPlus, Mail, Building2, ShieldCheck, User } from 'lucide-react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useAddFaculty } from '../../api/asset.api';
import Loader from '../Loader';
import { useRequestAsset } from '../../api/request.api';

const AddFacultyModal = ({ isOpen, onClose }) => {
  const user = useSelector(state => state.auth.currUser);
  // RequestorId, department, itemName, email
  const [formData, setFormData] = useState({
    RequestorId: user?._id || '',
    itemName: '', //for name of faculty
    email: '',
    department: user?.department || '',
  requestType: "Faculty Request"
  });


   const { requestAsset, loading } = useRequestAsset();
  const navigate = useNavigate();

  const HandleSubmit = async (formData) => {
    setFormData({...formData, requestType: "Faculty Request", department: user?.department, RequestorId: user?.userId})
    const response = await requestAsset(formData);
    onClose()
    if (response?.data) {
      navigate("/hod/manage-assets")
    }
  }
  if (loading) {
    return <Loader />
  }
  if (!isOpen) return null;


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100 transform transition-all scale-100">
        
        {/* Header */}
        <div className="bg-[#008BA9] p-8 text-white relative">
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
          <div className="flex items-center gap-4 mb-2">
            <div className="bg-white/20 p-3 rounded-2xl">
              <UserPlus size={24} />
            </div>
            <h3 className="text-xl font-black uppercase italic">Add New Faculty</h3>
          </div>
          <p className="text-white/70 text-[10px] font-bold uppercase tracking-widest">Register faculty for asset tracking</p>
        </div>

        {/* Form Body */}
        <div className="p-8 space-y-6">
          
          <form className="space-y-2" onSubmit={(e) => { e.preventDefault(); HandleSubmit(formData) }}>
          {/* Name Field */}
            <div className='space-y-2'>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
            <div className="relative">
              <User className="absolute left-4 top-3.5 text-slate-300" size={18} />
              <input
                type="text" 
                value={formData.itemName}
                onChange={(e) => setFormData({...formData, itemName: e.target.value})}
                placeholder="e.g. Prof. Ahmed"
                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-cyan-500 focus:bg-white transition-all text-sm font-bold text-slate-700 outline-none"
              />
            </div>
            </div>
         

          {/* Email Field */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-3.5 text-slate-300" size={18} />
              <input 
              value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                type="email" 
                placeholder="faculty@college.edu"
                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-cyan-500 focus:bg-white transition-all text-sm font-bold text-slate-700 outline-none"
              />
            </div>
          </div>

          {/* Department (Auto-filled by HOD's Dept) */}
          <div className="space-y-2 opacity-60">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Department</label>
            <div className="relative">
              <Building2 className="absolute left-4 top-3.5 text-slate-300" size={18} />
              <input 
                type="text" 
                value={user?.department || 'N/A'}
                disabled
                className="w-full pl-12 pr-4 py-3.5 bg-slate-100 border-2 border-slate-100 rounded-2xl text-sm font-bold text-slate-500 cursor-not-allowed"
              />
            </div>
          </div>

          {/* Info Note */}
          <div className="flex items-start gap-3 p-4 bg-cyan-50 rounded-2xl border border-cyan-100">
            <ShieldCheck size={20} className="text-cyan-600 mt-0.5" />
            <p className="text-[10px] font-bold text-cyan-700 leading-relaxed uppercase">
              Principal will approve this faculty member.
            </p>
          </div>

          {/* Submit Button */}
          <button type='submit' className="w-full py-4 bg-slate-800 text-white rounded-2xl font-black uppercase italic tracking-widest hover:bg-slate-900 shadow-xl shadow-slate-200 transition-all active:scale-95">
            Submit for Approval
          </button>
           </form>
        </div>
      </div>
    </div>
  );
};
export default AddFacultyModal;