import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { TriangleAlert, Download, Users, Trash2, ClipboardList, ArrowLeft, Search, Package } from 'lucide-react';
import { useRequestAsset } from '../../api/request.api';
import { CSVLink } from "react-csv";

import { useNavigate } from "react-router-dom"
import DataTable from '../../components/DataTable';
const HODReports = () => {
    const { assetsList } = useSelector(state => state?.assets);
    const user = useSelector(state => state?.auth?.currUser);
    const [view, setView] = useState('main');
    const [formData, setFormData] = useState({
        requestType: "Maintenance",
        RequestorId: user?.userId,
        department: user?.department._id,
        status: "Pending",
        assetId: "",
        category: "",
        itemName: "",
        specifications: "Damage Report",
        priority: "Medium",
        quantity: 1,
        reason: "" //  "Nature of Damage" 
    });
    const { requestAsset } = useRequestAsset()
    const navigate = useNavigate();
    const assignedAssets = assetsList?.filter(a => a?.status === "Assigned");
    const damagedAssets = assetsList?.filter(a => a?.condition === "Damaged");
    const lostAssets = assetsList?.filter(a => a?.condition === "Lost");
    // const assets = assetsList?.filter(a =>  a?.status === "Assigned" || a?.status === "Damaged" || a?.status === "Lost");
    const assets = view === 'assigned' ? assignedAssets : view === 'damaged' ? damagedAssets : view === 'lost' ? lostAssets : assetsList;
    // handlers
    const handleSubmit = async (formData) => {
        setFormData({ ...formData, RequestorId: user?.userId, department: user?.department._id, specifications: "Damage Report", priority: "Medium", requestType: "Maintenance" });
        console.log("formData ", formData);
        const response = await requestAsset(formData);
        if (response?.success) {
            navigate('/hod/request');
        }
    }
    const handleSelectChange = (e) => {
        const asset = assetsList?.find(a => a._id === e.target.value);
        setFormData({ ...formData, assetId: asset?._id, category: asset?.category, itemName: asset?.name })
    }
    const csvData = assets?.map(a => ({
        "Asset Id": a?._id,
        "Category": a?.category,
        "Quantity": a?.quantity,
        "Status": a?.status,
        "Assigned To": a?.assignedTo?.name,
        "Price": a?.price,
        "Condition": a?.condition
    }))
    console.log("csvData ", csvData);

    // table
    if (view === 'assigned' || view === 'damaged' || view === 'lost' || view === 'summary') {
        return (
            <div className="p-4 md:p-8 space-y-6 animate-in fade-in duration-500">
                <button onClick={() => setView('main')} className="flex items-center gap-2 text-[#008BA9] font-black text-[10px] uppercase tracking-widest hover:gap-3 transition-all">
                    <ArrowLeft size={14} /> RETURN TO DEPARTMENTAL CONSOLE
                </button>
                <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
                    <div className="p-8 flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="flex gap-4 items-center">
                            <div className="p-3 bg-cyan-50 text-[#008BA9] rounded-2xl">
                                <Users size={24} />
                            </div>
                            <div>
                                <h3 className="text-xl font-black italic uppercase text-[#1E2D44]">{view === 'assigned' ? 'Assigned' : view === 'damaged' ? 'Damaged' : view === 'lost' ? 'Lost' : 'Summary'} Assets</h3>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Monthly Audit Cycle • CS Department</p>
                            </div>
                        </div>
                        <CSVLink data={csvData} filename={`${view}-assets-report.csv`}>
                            <button className="bg-[#008BA9] text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 cursor-pointer hover:bg-[#008BA9]/90 transition-all">
                                <Download size={16} /> Export CSV
                            </button>
                        </CSVLink>
                    </div>
                    {/* Asset Table */}
                    <DataTable
                        data={assets}
                        tableHeader={["Asset Identification", "Category", "Qty", "Status", "Assigend To", "Price", "Condition"]}
                        renderRow={(asset, i) => (
                            <tr key={i} className={`transition-colors group ${i % 2 === 0 ? "bg-white" : "bg-slate-50/40"} hover:bg-cyan-50/40`}
                            >
                                {/* 1. Identification */}
                                <td className="py-5 px-6">
                                    <p className="text-sm font-black text-slate-800 uppercase italic leading-tight tracking-tight"> {asset?.name} </p>
                                    <p className="text-[9px] font-bold text-slate-400 mt-1 tracking-widest"> ID: {asset?._id.slice(-6).toUpperCase()}# </p>
                                </td>

                                {/* 2. Category */}
                                <td className="py-5 px-4">
                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight"> {asset?.category} </span>
                                </td>

                                {/* 3. Quantity */}
                                <td className="py-5 px-4">
                                    <span className="text-sm font-black text-slate-800 italic"> {asset.quantity} </span>
                                </td>

                                {/* 4. Status Pill */}
                                <td className="py-5 px-4">
                                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold
                       ${asset?.status === "Available"
                                            ? "bg-emerald-100 text-emerald-700"
                                            : asset?.status === "Assigned"
                                                ? "bg-blue-100 text-blue-700"
                                                : "bg-amber-100 text-amber-700"
                                        }`}>
                                        <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${asset?.status === "Available" ? "bg-emerald-500" :
                                            asset?.status === "Assigned" ? "bg-blue-500" : "bg-amber-500"
                                            }`} />
                                        <span className="text-[10px] font-black uppercase italic">{asset?.status}</span>
                                    </div>
                                </td>

                                {/* 5. Assigned To (Holder) */}
                                <td className="py-5 px-4">
                                    <p className="text-[10px] font-black text-slate-700  italic"> {asset?.assignedTo?.name ? `Prof. ${asset?.assignedTo?.name}` : <span className="text-slate-300">Unassigned</span>} </p>
                                </td>

                                {/* 6. Price/Value */}
                                <td className="py-5 px-4">
                                    <span className="text-sm font-black text-slate-800"> RS. {asset?.price?.toLocaleString()} </span>
                                </td>

                                {/* 7. Health (Fixed Condition) */}
                                <td className="py-5 px-4">
                                    <span className={`flex items-center justify-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase ${asset?.condition === "New" ? "text-emerald-600 bg-emerald-50" : asset?.condition === "Maintenance" ? "text-blue-600 bg-blue-50" : asset?.condition === "Damaged" ? "text-orange-600 bg-orange-50" : "text-red-600 bg-red-50"}`}> {asset?.condition} </span>
                                </td>
                            </tr>
                        )}
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-8 space-y-8">
            <h2 className="text-3xl font-black text-[#1E2D44] italic uppercase tracking-tighter">Reports</h2>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

                {/* Left: Log Issue Form */}
                <div className="lg:col-span-2 bg-white rounded-[3rem] p-8 md:p-12 shadow-sm border border-slate-50">
                    <div className="flex items-center gap-3 mb-8">
                        <TriangleAlert className="text-rose-500" size={28} /> {/* Danger Icon used here */}
                        <h3 className="text-xl font-black italic uppercase text-[#1E2D44]">Log Issue / Damage</h3>
                    </div>

                    <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); handleSubmit(formData) }}>
                        {/* Select Asset Dropdown */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                                Select Asset from Department
                            </label>
                            <select
                                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold text-slate-700 focus:border-rose-400 outline-none appearance-none cursor-pointer"
                                name='assetId'
                                onChange={handleSelectChange}
                            >
                                <option value="">Choose Asset Tag...</option>
                                {assetsList?.filter(a => a.condition !== "Maintenance")?.map((asset, index) => (
                                    <option key={index} value={asset?._id}>{asset?.name} ({asset?.assignedTo?.name ? asset?.assignedTo?.name : asset?._id.slice(-8)})</option>
                                ))}

                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Quantity</label>
                            <input type="number" value={formData.quantity}
                                placeholder="Enter quantity..." name='quantity'
                                onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
                                className="w-full bg-slate-50 border-2 border-slate-100 rounded-3xl px-6 py-4 text-sm font-bold text-slate-700 focus:border-rose-400 outline-none transition-all" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nature of Damage</label>
                            <textarea value={formData.reason} name='reason'
                                onChange={(e) => setFormData({ ...formData, reason: e.target.value })} placeholder="Describe what went wrong..." rows="4" className="w-full bg-slate-50 border-2 border-slate-100 rounded-3xl px-6 py-4 text-sm font-bold text-slate-700 focus:border-rose-400 outline-none transition-all resize-none"></textarea>
                        </div>

                        <button type='submit' className="w-full bg-[#F43F5E] hover:bg-rose-600 text-white py-5 rounded-4xl text-xs font-black uppercase tracking-widest shadow-xl shadow-rose-100 transition-all">
                            Submit Incident Report
                        </button>
                    </form>
                </div>

                {/* Right: Generation Center */}
                <div className="bg-[#1E2D44] rounded-[3rem] p-8 shadow-2xl min-h-125">
                    <div className="flex items-center gap-3 mb-2">
                        {/* Chart/Generation Icon */}
                        <h3 className="text-lg font-black italic uppercase text-white tracking-widest">Generation Center</h3>
                    </div>
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mb-8">Select report types to generate analytical summaries.</p>

                    <div className="space-y-4">
                        <button onClick={() => setView('assigned')} className="w-full bg-white/5 hover:bg-white/10 rounded-2xl p-5 flex items-center justify-between group transition-all">
                            <div className="flex items-center gap-4">
                                <Users size={18} className="text-cyan-400" />
                                <span className="text-[10px] font-black uppercase text-white tracking-widest">Assigned Assets</span>
                            </div>
                            <Download size={14} className="text-slate-500" />
                        </button>

                        <button onClick={() => setView('damaged')} className="w-full bg-white/5 hover:bg-white/10 rounded-2xl p-5 flex items-center justify-between group">
                            <div className="flex items-center gap-4">
                                <TriangleAlert size={18} className="text-amber-400" />
                                <span className="text-[10px] font-black uppercase text-white tracking-widest">Repair / Damaged</span>
                            </div>
                            <Download size={14} className="text-slate-500" />
                        </button>

                        <button onClick={() => setView('lost')} className="w-full bg-white/5 hover:bg-white/10 rounded-2xl p-5 flex items-center justify-between group">
                            <div className="flex items-center gap-4">
                                <Trash2 size={18} className="text-rose-400" />
                                <span className="text-[10px] font-black uppercase text-white tracking-widest">Lost Assets</span>
                            </div>
                            <Download size={14} className="text-slate-500" />
                        </button>

                        <button onClick={() => setView('summary')} className="w-full bg-white/5 hover:bg-white/10 rounded-2xl p-5 flex items-center justify-between group">
                            <div className="flex items-center gap-4">
                                <ClipboardList size={18} className="text-emerald-400" />
                                <span className="text-[10px] font-black uppercase text-white tracking-widest">Departmental Summary</span>
                            </div>
                            <Download size={14} className="text-slate-500" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HODReports;