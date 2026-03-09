import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Download, Users, Trash2, ClipboardList, ShieldAlert, Search, Filter, TriangleAlert } from 'lucide-react';
import { CSVLink } from "react-csv";
import DataTable from '../../components/DataTable';

const PrincipalReports = () => {
    const { assetsList } = useSelector(state => state?.assets);
    const [view, setView] = useState('summary');
    const [selectedDept, setSelectedDept] = useState('All');

    const departments = ['All', ...new Set(assetsList?.map(a => a?.department?.name).filter(Boolean))];

    const filteredAssets = assetsList?.filter(asset => {
        const matchesDept = selectedDept === 'All' || asset?.department?.name === selectedDept;
        if (view === 'damaged') return matchesDept && asset?.condition === "Maintenance";
        if (view === 'lost') return matchesDept && asset?.condition === "Lost";
        if (view === 'assigned') return matchesDept && asset?.status === "Assigned";
        return matchesDept;
    });

    const reportTabs = [
        { id: 'summary', label: 'Summary', icon: <ClipboardList size={14} /> },
        { id: 'assigned', label: 'Assigned', icon: <Users size={14} /> },
        { id: 'damaged', label: 'Damaged', icon: <ShieldAlert size={14} /> },
        { id: 'lost', label: 'Lost', icon: <Trash2 size={14} /> }
    ];
 const csvData = assetsList?.map(a => ({
        "Asset Id": a?._id,
        "Category": a?.category,
        "Quantity": a?.quantity,
        "Status": a?.status,
        "Assigned To": a?.assignedTo?.name,
        "Price": a?.price,
        "Condition": a?.condition
    }))
    return (
        <div className="p-4 md:p-8 space-y-6 animate-in fade-in duration-500">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-black text-[#1E2D44] italic uppercase tracking-tighter">Centralized Reports</h2>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">College-wide Inventory Audit</p>
                </div>

                <CSVLink data={filteredAssets} filename={`College_Report_${view}.csv`}>
                    <button className="bg-[#008BA9] text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:shadow-lg transition-all">
                        <Download size={16} /> Export Master CSV
                    </button>
                </CSVLink>
            </div>

            {/* NEW: Horizontal Filter Bar (No more double sidebar!) */}
            <div className="bg-white rounded-[2.5rem] p-4 shadow-sm border border-slate-100 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
                    {reportTabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setView(tab.id)}
                            className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${view === tab.id
                                ? 'bg-[#1E2D44] text-white shadow-md'
                                : 'text-slate-400 hover:bg-slate-50'
                                }`}
                        >
                            {tab.icon} {tab.label}
                        </button>
                    ))}
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto border-t md:border-t-0 pt-4 md:pt-0">
                    <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
                        <Filter size={14} className="text-[#008BA9]" />
                        <select
                            onChange={(e) => setSelectedDept(e.target.value)}
                            className="bg-transparent text-[10px] font-black uppercase text-slate-600 outline-none cursor-pointer"
                        >
                            {departments.map(dept => <option key={dept} value={dept}>{dept}</option>)}
                        </select>
                    </div>

                    <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100 flex-1 md:flex-none">
                        <Search size={14} className="text-slate-300" />
                        <input type="text" placeholder="SEARCH ASSETS..." className="bg-transparent text-[10px] font-bold outline-none w-full md:w-32 uppercase" />
                    </div>
                </div>
            </div>

            {/* Data Table Area */}
            <div className="bg-white rounded-[3rem] shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-8 border-b border-slate-50 bg-slate-50/20 flex  justify-between">
                    <h3 className="text-sm font-black text-[#1E2D44] uppercase tracking-widest">
                        Showing <span className="text-[#008BA9]">{view}</span> for <span className="text-[#008BA9]">{selectedDept} Department</span>
                    </h3>
                    <CSVLink data={csvData} filename={`${view}-assets-report.csv`}>
                        <button className="bg-[#008BA9] text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 cursor-pointer hover:bg-[#008BA9]/90 transition-all">
                            <Download size={16} /> Export CSV
                        </button>
                    </CSVLink>
                </div>

                <DataTable
                    data={filteredAssets}
                    tableHeader={["Dept", "Asset Details", "Qty", "Price", "Condition", "Status"]}
                    renderRow={(asset, i) => (
                        <tr key={i} className={`group ${i % 2 === 0 ? "bg-white" : "bg-slate-50/30"} hover:bg-cyan-50/40 transition-colors`}>
                            <td className="py-5 px-8">
                                <span className="text-[9px] font-black text-[#008BA9] bg-cyan-50 px-3 py-1 rounded-lg uppercase italic">
                                    {asset?.department?.name || 'Stock'}
                                </span>
                            </td>
                            <td className="py-5 px-4">
                                <p className="text-sm font-black text-slate-800 uppercase italic leading-tight">{asset?.name}</p>
                                <p className="text-[9px] font-bold text-slate-400 mt-0.5 uppercase tracking-tighter">REF: {asset?._id.slice(-6)}</p>
                            </td>
                            <td className="py-5 px-4 font-black text-slate-700 italic">{asset?.quantity}</td>
                            <td className="py-5 px-4 font-bold text-slate-800 text-xs">RS. {asset?.price?.toLocaleString()}</td>
                            <td className="py-5 px-4">
                                <span className={`text-[9px] font-black px-3 py-1 rounded-full uppercase ${asset?.condition === 'New' ? 'bg-emerald-50 text-emerald-600' :
                                    asset?.condition === 'Damaged' ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-600'
                                    }`}> {asset?.condition} </span>
                            </td>
                            <td className="py-5 px-4 text-[10px] font-black uppercase text-slate-400 italic">
                                {asset?.status}
                            </td>
                        </tr>
                    )}
                />
            </div>
        </div>
    );
};

export default PrincipalReports;