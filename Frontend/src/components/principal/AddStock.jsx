import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useRequestAsset } from '../../api/request.api';
import { useSelector } from 'react-redux';
import { Package, DollarSign, Hash,X,UserPlus, Loader  } from 'lucide-react';
import { useAddAsset } from '../../api/asset.api';

const AddStock = ({ isOpen, onClose }) => {
    const user = useSelector(state => state.auth.currUser);
    const [formData, setFormData] = useState({
        name: "",
        category: "",
        price: "",
        quantity: "",
        condition: "New",
    })

  const categories = ['IT & Electronics', 'Furniture', 'Networking', 'Lab Equipment', 'Others'];

    const { addAsset, loading } = useAddAsset();
    const navigate = useNavigate();

    const HandleSubmit = async (formData) => {
        const response = await addAsset(formData);
        onClose()
        if (response?.data) {
            navigate("/principal/college-assets")
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
                        <h3 className="text-xl font-black uppercase italic">Add New Stock</h3>
                    </div>
                   
                </div>

                {/* Form Body */}
                <div className="p-8 space-y-6">

                    <form className="space-y-2" onSubmit={(e) => { e.preventDefault(); HandleSubmit(formData) }}>

                        {/* Asset Name */}
                        <div className='space-y-2'>
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Asset Name</label>
                            <div className="relative">
                                <Package className="absolute left-4 top-3.5 text-slate-300" size={18} />
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="e.g. Dell Laptop"
                                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-cyan-500 focus:bg-white transition-all text-sm font-bold text-slate-700 outline-none"
                                />
                            </div>
                        </div>

                        {/* Category */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Category</label>
                            <select
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                className="w-full px-4 py-3.5 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-cyan-500 focus:bg-white transition-all text-sm font-bold text-slate-700 outline-none"
                            >
                                <option value="">Select Category</option>
                                {categories.map((cat,i)=><option key={i} value={cat}>{cat}</option> )}
                            </select>
                        </div>

                        {/* Price */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Price Per Unit</label>
                            <div className="relative">
                                <DollarSign className="absolute left-4 top-3.5 text-slate-300" size={18} />
                                <input
                                    type="number"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    placeholder="e.g. 50000"
                                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-cyan-500 focus:bg-white transition-all text-sm font-bold text-slate-700 outline-none"
                                />
                            </div>
                        </div>

                        {/* Quantity */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Quantity</label>
                            <div className="relative">
                                <Hash className="absolute left-4 top-3.5 text-slate-300" size={18} />
                                <input
                                    type="number"
                                    value={formData.quantity}
                                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                                    placeholder="e.g. 10"
                                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-cyan-500 focus:bg-white transition-all text-sm font-bold text-slate-700 outline-none"
                                />
                            </div>
                        </div>

                        {/* Condition */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Condition</label>
                            <select
                                value={formData.condition}
                                onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                                className="w-full px-4 py-3.5 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-cyan-500 focus:bg-white transition-all text-sm font-bold text-slate-700 outline-none"
                            >
                                <option value="New">New</option>
                                <option value="Maintenance">Maintenance</option>
                                <option value="Damaged">Damaged</option>
                                <option value="Lost">Lost</option>
                            </select>
                        </div>

                        {/* Submit */}
                        <button
                            type='submit'
                            className="w-full py-4 bg-slate-800 text-white rounded-2xl font-black uppercase italic tracking-widest hover:bg-slate-900 shadow-xl shadow-slate-200 transition-all active:scale-95"
                        >
                            Add Stock
                        </button>

                    </form>
                </div>
            </div>
        </div>
    )
}

export default AddStock