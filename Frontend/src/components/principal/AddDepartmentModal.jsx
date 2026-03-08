import { Building2, Loader, Package, User, UserPlus, X } from 'lucide-react';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useCreatelDept } from '../../api/department.api';

const AddDepartmentModal = ({ isOpen, onClose, setShowAddHod, setNewDeptId }) => {
    const [name, setName] = useState("");
    const { createDept, loading } = useCreatelDept();
    const navigate = useNavigate();

    const HandleSubmit = async (name) => {
        console.log(name);
        const response = await createDept({ name });
        if (response.success) {
            onClose();
            setShowAddHod(true)
            setNewDeptId(response?.newDept?._id)
            toast.success("Department Added Successfully")
        }
        console.log(response);
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
                            <Building2 size={24} />
                        </div>
                        <h3 className="text-xl font-black uppercase italic">Add New Department</h3>
                    </div>

                </div>

                {/* Form Body */}
                <div className="p-8 space-y-6">

                    <form onSubmit={(e) => { e.preventDefault(); HandleSubmit(name) }}>
                        <div className='space-y-2'>
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                                Department Name
                            </label>
                            <div className="relative">
                                <Building2 className="absolute left-4 top-3.5 text-slate-300" size={18} />
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Enter Department Name"
                                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-cyan-500"
                                />

                            </div>
                        </div>

                        <button type="submit" className="w-full bg-[#1E2D44] hover:bg-[#162131] text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.25em] shadow-xl shadow-slate-200 transition-all active:scale-95 flex items-center justify-center gap-3 mt-4"
                        >
                            Add Department
                        </button>

                    </form>
                </div>
            </div>
        </div>
    )
}

export default AddDepartmentModal