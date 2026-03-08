import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import {
    Search, Package, CheckCircle, AlertTriangle,
    Clock, Banknote, Mail, ShieldCheck, Eye, ArrowLeftRight, User
} from 'lucide-react';
import DataTable from '../../components/DataTable';
import TransferAssetModal from '../../components/HOD/TransferAssetModal';
import ViewDetailsModal from '../../components/HOD/ViewDetailsModal';
import AddDepartmentModal from '../../components/principal/AddDepartmentModal';
import AddHodModel from '../../components/principal/AddHodModel';

const PrincipalDepartments = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const { assetsList } = useSelector(state => state?.assets);
    const { deptList: departmentsList } = useSelector(state => state?.departments);
    const { facultyList } = useSelector(state => state?.faculty);
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [seletectedHOD, setseletectedHOD] = useState(false);
    const [showAddHod, setShowAddHod] = useState(false);
    const [newDeptId, setNewDeptId] = useState(null);
    const [showDetails, setShowDetails] = useState(false);
    const [selectedDepartment, setSelectedDepartment] = useState("All");
    const [selectedAsset, setSelectedAsset] = useState(null);
    const [isOpen, setIsOpen] = useState(false)
    const [isChangeHOD, setIsChangeHOD] = useState(false)

    const filteredAssets = assetsList?.filter(a => {
        const matchesSearch = a?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            a?._id?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === "All" || a?.category === selectedCategory;
        // Principal can filter by Department
        const matchesDept = selectedDepartment === "All" || a?.department?._id === selectedDepartment

        return matchesSearch && matchesCategory && matchesDept;
    });

    console.log("selectedDepartment", seletectedHOD, facultyList);
    // Stats Calculation (Global level)
    const totalAssets = filteredAssets?.reduce((t, a) => t + (a.quantity || 0), 0) || 0;
    const workingAssets = filteredAssets?.filter(a => a.condition === "New").length || 0;
    const damagedAssets = filteredAssets?.filter(a => a.condition === "Damaged").length || 0;
    const totalValue = filteredAssets?.reduce((t, a) => t + (a.price * a.quantity), 0) || 0;
    // Stats Logic
    const stats = [
        { label: 'Total Assets', value: totalAssets, icon: <Package size={20} className="text-slate-500" /> },
        { label: 'Working', value: workingAssets, icon: <CheckCircle size={20} className="text-emerald-500" /> },
        { label: 'Damaged', value: damagedAssets, icon: <AlertTriangle size={20} className="text-red-500" /> },
        {
            label: 'Value', value: Intl.NumberFormat(undefined, {
                notation: "compact",
                compactDisplay: "short",
                currency: "PKR",
                style: "currency"
            }).format(totalValue), icon: <Banknote size={20} className="text-cyan-500" />
        },
    ];

    const totalUnits = assetsList?.reduce((total, curr) =>
        selectedAsset
            ? (selectedAsset?.name === curr?.name ? total + curr.quantity : total)
            : total + curr.quantity
        , 0) || 0;
    const assignedUnits = assetsList?.filter(a => a?.assignedTo)
        .reduce((total, curr) =>
            selectedAsset
                ? (selectedAsset?.name === curr?.name ? total + curr.quantity : total)
                : total + curr.quantity
            , 0) || 0;

    const availableUnits = totalUnits - assignedUnits;

    return (
        <div className="max-w-5xl mx-auto space-y-8 mb-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* 1. ACTIONS & STATS ROW */}
            <div className="  space-y-8 rounded-[3rem]  ">
                {/* STATS OVERVIEW */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {stats.map((item, i) => (
                        <div key={i} className="bg-white p-5 rounded-3xl border border-slate-50 shadow-sm flex items-center gap-4 hover:shadow-md transition-all">
                            <div className="p-3 bg-slate-50 rounded-2xl text-slate-600">{item.icon}</div>
                            <div>
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{item.label}</p>
                                <h3 className="text-xl font-black text-slate-800 tracking-tight">{item.value}</h3>
                            </div>
                        </div>
                    ))}
                </div>
                {/* dept title & Search & Dpt Selection */}
                <div className="flex flex-col md:flex-row justify-between items-end gap-4">
                    <div>
                        <p className="text-[10px] font-black text-cyan-600 uppercase tracking-[0.3em] mb-1">Stock Management</p>
                        <h2 className="text-4xl font-black text-slate-800 uppercase italic tracking-tighter leading-none">
                        </h2>
                        <h2 className="text-4xl font-black text-slate-800 uppercase italic tracking-tighter leading-none">
                            {selectedDepartment !== "All"
                                ? departmentsList.find(d => d._id === selectedDepartment)?.name
                                : "All"}
                        </h2>
                    </div>

                    <div className="flex gap-3 w-full md:w-auto">
                        <select
                            value={selectedDepartment}
                            onChange={(e) => {
                                const deptId = e.target.value; // id store kar lo
                                setSelectedDepartment(deptId);

                                // filter by id
                                const filteredHODs = facultyList.filter(f => f.department === deptId && f.status === "Active");
                                setseletectedHOD(filteredHODs);
                            }}
                            className="bg-white border-2 border-slate-100 rounded-2xl px-4 py-3 text-[10px] font-black uppercase text-slate-700 outline-none focus:border-cyan-500 transition-all"
                        >
                            <option value="All">All College</option>
                            {departmentsList?.map(d =>
                                <option key={d._id} value={d._id}>{d.name}</option>
                            )}
                        </select>
                        <div className="relative flex-1 md:w-72">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                            <input
                                type="text"
                                placeholder="Search assets..."
                                className="w-full pl-12 pr-4 py-3.5 bg-white border-2 border-slate-100 rounded-2xl text-xs font-bold outline-none focus:border-cyan-500 shadow-sm"
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <button className="px-4 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl transition cursor-pointer" onClick={() => { setIsOpen(true); }}>Add Department</button>
                        <button className="px-4 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl transition cursor-pointer" onClick={() => { setShowAddHod(true); }}>Assin HOD</button>
                    </div>
                </div>
            </div>
            {/* 2.  CONTEXT CARDS (HOD & Audit) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* HOD INFO */}
                <div className="bg-[#1e293b] rounded-[2.5rem] p-6 text-white flex items-center justify-between shadow-xl relative overflow-hidden group">
                    <div className="absolute -right-4 -top-4 w-24 h-24 bg-cyan-500/10 rounded-full blur-2xl group-hover:bg-cyan-500/20 transition-all"></div>
                    <div className="flex items-center gap-5">
                        <div className="w-14 h-14 bg-slate-800 rounded-2xl flex items-center justify-center border border-slate-700 shadow-inner">
                            <User size={24} className="text-cyan-400" />
                        </div>
                        <div>
                            <p className="text-[8px] font-black text-cyan-500 uppercase tracking-widest">Head of Department</p>

                            {/* Name */}
                            <h4 className="text-lg font-black italic tracking-tight">
                                {seletectedHOD.length > 0
                                    ? `Prof. ${seletectedHOD[0].name}`
                                    : "No HOD Assigned"}
                            </h4>

                            {/* Email */}
                            <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-1 font-medium">
                                <Mail size={12} className="text-slate-500" />
                                <span>
                                    {seletectedHOD.length > 0
                                        ? seletectedHOD[0].email
                                        : "—"}
                                </span>
                            </div>
                        </div>
                    </div>
                    <button onClick={()=> {setIsChangeHOD(true); setShowAddHod(true)}} className="bg-slate-800 hover:bg-cyan-600 px-5 py-2.5 rounded-xl text-[9px] font-black uppercase border border-slate-700 transition-all active:scale-95 cursor-pointer">
                        Change HOD
                    </button>
                </div>
                {/* AUDIT STATUS */}
                <div className="bg-white border border-slate-100 rounded-[2.5rem] p-6 flex items-center justify-between shadow-sm group">
                    <div className="flex items-center gap-4">
                        <div className="p-4 bg-cyan-50 text-[#008BA9] rounded-2xl group-hover:bg-[#008BA9] group-hover:text-white transition-all duration-500">
                            <ShieldCheck size={26} />
                        </div>
                        <div>
                            <h4 className="font-black text-slate-800 uppercase italic text-xs tracking-tighter">Inventory Audit</h4>
                            <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-tighter">
                                Last Verified: <span className="text-emerald-500 font-black">18 Feb 2026</span>
                            </p>
                        </div>
                    </div>
                    <button className="bg-cyan-600 hover:bg-[#007894] text-white px-6 py-3 rounded-xl text-[9px] font-black uppercase shadow-lg shadow-cyan-100 transition-all active:scale-95 cursor-pointer">
                        Request Audit
                    </button>
                </div>

            </div>

            {/* 3. DATA TABLE */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-md overflow-hidden">
                <DataTable
                    data={filteredAssets}
                    tableHeader={["Asset Details", "Quantity", "Department", "Holder", "Condition", "Status", "Actions"]}
                    renderRow={(asset, i) => (
                        <tr key={i} className={`border-b border-slate-50 hover:bg-cyan-50/20 transition-all group ${i % 2 === 0 ? "bg-white" : "bg-slate-50/30"}`}>
                            <td className="py-6 px-8">
                                <p className="text-sm font-black text-slate-900 uppercase italic group-hover:text-cyan-700 transition-colors">{asset?.name}</p>
                                <p className="text-[10px] text-slate-400 font-mono mt-1 tracking-tighter">ID: {asset?._id?.slice(-8).toUpperCase()}</p>
                            </td>
                            {/* quantity */}
                            <td className="py-6 px-4">
                                <span className="text-xs font-black text-cyan-700 bg-cyan-50 px-3 py-1 rounded-lg">x{asset?.quantity || 1}</span>
                            </td>
                            {/* Department  */}
                            <td className="py-5 px-4">
                                <span className="px-3 py-1 rounded-lg bg-slate-100 text-[10px] font-bold text-slate-600 uppercase">
                                    {asset?.department?.name}
                                </span>
                            </td>
                            {/* Assigned  */}
                            <td className="py-5 px-4">
                                <p className="text-[10px] font-black text-slate-700  italic">
                                    {asset?.assignedTo?.name ? `Prof. ${asset?.assignedTo?.name}` : <span className="text-slate-300">Unassigned</span>}
                                </p>
                            </td>
                            {/* condition */}
                            <td className="py-5 px-4">
                                <span className={`flex items-center justify-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase ${asset?.condition === "New" ? "text-emerald-600 bg-emerald-50" :
                                    asset?.condition === "Maintenance" ? "text-blue-600 bg-blue-50" :
                                        asset?.condition === "Damaged" ? "text-orange-600 bg-orange-50" :
                                            "text-red-600 bg-red-50"}`}>
                                    {asset?.condition}
                                </span>
                            </td>
                            {/* status */}
                            <td className="py-5 px-4">
                                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold
                                   ${asset?.deptStatus === "Available"
                                        ? "bg-emerald-100 text-emerald-700"
                                        : asset?.deptStatus === "Assigned"
                                            ? "bg-blue-100 text-blue-700"
                                            : "bg-amber-100 text-amber-700"
                                    }`}>
                                    <span className={`w-1.5 h-1.5 rounded-full animate-pulse
                                    ${asset?.deptStatus === "Available" ? "bg-emerald-500" : asset?.deptStatus === "Assigned" ? "bg-blue-500" : "bg-amber-500"}`} />
                                    <span className="text-[10px] font-black uppercase italic">{asset?.deptStatus}</span>
                                </div>
                            </td>
                            {/* Actions */}
                            <td className="py-6 px-8">
                                <div className="flex gap-4 text-slate-300 group-hover:text-slate-500 transition-all">
                                    <Eye title="View Asset" size={18} className="hover:text-cyan-600 cursor-pointer transition-colors" onClick={() => { setSelectedAsset(asset); setShowDetails(true); }} />
                                </div>
                            </td>
                        </tr>
                    )}
                />
            </div>
            {/* Details Modal */}
            <ViewDetailsModal isOpen={showDetails} onClose={() => setShowDetails(false)} title="Principal Audit View" subTitle={selectedAsset?.name}>
                <div className="space-y-6">
                    <div className="grid grid-cols-3 gap-4">
                        {/* Category */}
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest"> Category </p>
                            <p className="text-sm font-semibold text-slate-800 mt-1"> {selectedAsset?.category} </p>
                        </div>
                    </div>

                    {/* Distribution Stats */}
                    <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4"> Asset Distribution </p>
                        <div className="grid grid-cols-3 gap-4 text-center">
                            <div>
                                <p className="text-lg font-bold text-slate-800"> {totalUnits} </p>
                                <p className="text-[10px] font-semibold uppercase text-slate-400 tracking-wider"> Total </p>
                            </div>
                            <div>
                                <p className="text-lg font-bold text-cyan-600"> {assignedUnits} </p>
                                <p className="text-[10px] font-semibold uppercase text-slate-400 tracking-wider"> Assigned </p>
                            </div>
                            <div>
                                <p className="text-lg font-bold text-green-600"> {availableUnits} </p>
                                <p className="text-[10px] font-semibold uppercase text-slate-400 tracking-wider"> Available </p>
                            </div>
                        </div>
                    </div>
                    {/* Timeline Section */}
                    <div>
                        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-6"> Activity Timeline </h4>
                        {selectedAsset?.history?.length > 0 ? (
                            <div className="relative border-l-2 border-slate-200 pl-6 space-y-8">
                                {selectedAsset?.history.map((log, idx) => (
                                    <div key={idx} className="relative">
                                        {/* Dot */}
                                        <div
                                            className={`absolute -left-8.25 top-1 w-4 h-4 rounded-full border-4 border-white shadow
                                        ${log.action === "Initial Purchase"
                                                    ? "bg-purple-500"
                                                    : log.action === "Stock Updated"
                                                        ? "bg-cyan-500"
                                                        : log.action === "Transfer Out"
                                                            ? "bg-red-500"
                                                            : log.action === "Transfer In"
                                                                ? "bg-green-500"
                                                                : "bg-slate-400"
                                                }`}
                                        ></div>
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="text-sm font-semibold text-slate-800"> {log.action} </p>
                                                <p className="text-xs text-slate-500 mt-1"> {log.note} </p>
                                            </div>
                                            <p className="text-xs text-slate-400 whitespace-nowrap ml-4"> {new Date(log.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })} </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-6 bg-slate-50 rounded-2xl border border-slate-100">
                                <p className="text-sm text-slate-400"> No activity history available </p>
                            </div>
                        )}
                    </div>
                </div>
            </ViewDetailsModal>
            <AddDepartmentModal isOpen={isOpen} onClose={() => setIsOpen(false)} setShowAddHod={setShowAddHod} setNewDeptId={setNewDeptId} />
            <AddHodModel isOpen={showAddHod} onClose={() => setShowAddHod(false)} deptId={newDeptId} changeHod={isChangeHOD} seletectedHod={seletectedHOD} />
        </div>
    );
};

export default PrincipalDepartments;