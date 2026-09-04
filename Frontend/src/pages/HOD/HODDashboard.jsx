import React, { useState } from 'react';
import { Package, DollarSign, Settings, ClipboardList, Users, PlusCircle, AlertTriangle, UserPlus, ArrowUpRight, ShieldAlert, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Chart as ChartJS, defaults } from "chart.js/auto";
import { Doughnut } from "react-chartjs-2";
import { formatDistanceToNow } from "date-fns";
import StatsCards from '../../components/StatsCards';
import DataTable from '../../components/DataTable';
import { useGetAllDept, useVerifyAudit } from '../../api/department.api';


const HODDashboard = () => {
    const { assetsList } = useSelector(state => state?.assets);
    const { requestList } = useSelector(state => state?.requests);
    const { facultyList } = useSelector(state => state?.faculty);
    const { deptList: departmentsList } = useSelector(state => state?.departments);
    const { currUser: user } = useSelector(state => state?.auth);
    const totalAssetsValue = assetsList && assetsList?.reduce((total, asset) => total + asset?.price * asset?.quantity, 0) || 0;
    const totalLength = assetsList?.length;
    const funtionalAsset = assetsList?.filter(asset => asset?.condition === "New").length; console.log("funtionalAsset", funtionalAsset);
    const [showAuditModal, setShowAuditModal] = useState(false);
    const MaintenanceHealth = totalLength > 0 ? (funtionalAsset / totalLength) * 100 : 0; //formula= (functional assets /total assets)*100
    const { loading: auditLoading, verifyAudit } = useVerifyAudit();
    const { getDepts } = useGetAllDept();
    // chart data
    const category = [
        { label: 'IT & Electronics', val: assetsList?.filter(asset => asset?.category === "IT & Electronics").length, color: '#06b6d4' }, // bg-cyan-500
        { label: 'Furniture', val: assetsList?.filter(asset => asset?.category === "Furniture").length, color: '#34d399' },        // bg-emerald-400
        { label: 'Networking', val: assetsList?.filter(asset => asset?.category === "Networking").length, color: '#1e293b' },       // bg-slate-800
        { label: 'Lab Equipment', val: assetsList?.filter(asset => asset?.category === "Lab Equipment").length, color: '#475569' },    // bg-slate-600
        { label: 'Others', val: assetsList?.filter(asset => asset?.category === "Others").length, color: '#0d9488' },       // bg-teal-600
    ];

    const totalUnits = assetsList?.reduce((total, curr) => total + (curr?.quantity || 0), 0) || 0;
    // Stats Data
    const stats = [
        { label: 'Total Assets', value: totalUnits, icon: <Package className="text-cyan-600" />, bg: 'bg-cyan-50' },
        {
            label: 'Asset Value', value: Intl.NumberFormat(undefined, {
                notation: "compact",
                compactDisplay: "short",
                currency: "PKR",
                style: "currency"
            }).format(totalAssetsValue), icon: <DollarSign className="text-blue-600" />, bg: 'bg-blue-50'
        },
        { label: 'Maintenance', value: Math.round(MaintenanceHealth) + '%', icon: <Settings className="text-orange-600" />, bg: 'bg-orange-50' },
        { label: 'Requests', value: requestList?.filter(req=> req?.status==="Pending").length || 0, icon: <ClipboardList className="text-red-600" />, bg: 'bg-red-50' },
        { label: 'Faculty', value: facultyList?.length || 0, icon: <Users className="text-indigo-600" />, bg: 'bg-indigo-50' },
    ];

    //  Activity Log
    const activityLog = [
        ...requestList?.map(req => (
            {
                type: 'Requested', asset: req?.itemName, user: `Prof. ${req?.RequestorId?.name}`, time: formatDistanceToNow(new Date(req?.createdAt), { addSuffix: true }), color: 'text-blue-600 bg-blue-50'
            }
        )),
        ...assetsList?.map(asset => ({
            // assignedTo
            type: 'Assigned', asset: asset?.name, user: asset?.assignedTo?.name ? `Prof. ${asset?.assignedTo?.name}` : "Unassigned", time: formatDistanceToNow(new Date(asset?.createdAt)), color: 'text-cyan-600 bg-cyan-50'
        })),
        ...assetsList?.filter(asset => asset?.condition === "Damaged" || asset?.condition === "Lost").map(asset => ({
            type: 'Reported', asset: asset?.name, user: asset?.assignedTo?.name ? `Prof. ${asset?.assignedTo?.name}` : "Unassigned", time: formatDistanceToNow(new Date(asset?.createdAt)), color: 'text-red-600 bg-red-50'
        }))

    ].sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 5); // Sort by most recent and limit to 5 items

    const currentDeptData = departmentsList?.find(d => d?._id === user?.department?._id);
    // handler to confirm audit
    const handleConfirmAudit = async () => {
        try {
            // Assume you have a hook called useVerifyAudit
            await verifyAudit(currentDeptData._id, totalUnits);
            setShowAuditModal(false);
            // Refresh department data to hide the alert
            await getDepts();
        } catch (err) {
            console.error("Audit verification failed", err);
        }
    };
    return (
        <div className="space-y-10 animate-in fade-in duration-500">

            {/* 1. Top Stats Cards */}
            <StatsCards stats={stats} />
            {/* --- AUDIT ALERT SECTION --- */}
            {currentDeptData?.auditStatus === 'Requested' && (
                <div className="bg-amber-50 border-l-4 border-amber-500 p-6 rounded-r-[2rem] flex justify-between items-center shadow-sm animate-pulse">
                    <div className="flex items-center gap-4">
                        <div className="bg-amber-100 p-3 rounded-2xl text-amber-600">
                            <ShieldAlert size={24} />
                        </div>
                        <div>
                            <h3 className="text-amber-800 font-black text-sm uppercase italic tracking-tight">Audit Requested by Principal</h3>
                            <p className="text-amber-700/70 text-[10px] font-bold uppercase">Please verify the physical stock and confirm the audit for this month.</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setShowAuditModal(true)}
                        className="bg-amber-500 text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase hover:bg-amber-600 transition-all shadow-md active:scale-95"
                    >
                        Verify Now
                    </button>
                </div>
            )}
            {/* AUDIT VERIFICATION MODAL */}
            {showAuditModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-md rounded-[3rem] shadow-2xl border border-slate-100 overflow-hidden transition-all transform scale-100">

                        {/* Header with Icon */}
                        <div className="bg-amber-50 p-8 flex flex-col items-center text-center">
                            <div className="bg-white p-4 rounded-3xl shadow-sm text-amber-500 mb-4">
                                <ShieldCheck size={40} />
                            </div>
                            <h2 className="text-xl font-black text-slate-800 uppercase italic tracking-tighter">
                                Confirm Inventory Audit
                            </h2>
                            <p className="text-[10px] font-bold text-amber-700/60 mt-1 uppercase tracking-widest">
                                Official Verification Process
                            </p>
                        </div>

                        {/* Body */}
                        <div className="p-8 space-y-6">
                            <p className="text-sm text-slate-500 font-medium leading-relaxed text-center">
                                I, <span className="text-slate-800 font-black italic">Prof. {user?.name}</span>, hereby confirm that I have physically inspected all assets assigned to the <span className="text-cyan-600 font-black underline decoration-cyan-200 underline-offset-4">{currentDeptData?.name}</span> department.
                            </p>

                            <div className="bg-slate-50 p-4 rounded-2xl border border-dashed border-slate-200">
                                <ul className="space-y-2">
                                    <li className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                        All assets are physically present
                                    </li>
                                    <li className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                        Current status is accurately logged
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Footer Actions */}
                        <div className="p-8 pt-0 flex gap-3">
                            <button
                                onClick={() => setShowAuditModal(false)}
                                className="flex-1 px-6 py-4 rounded-2xl text-[10px] font-black text-slate-400 uppercase hover:bg-slate-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirmAudit} // Call your hook here
                                disabled={auditLoading}
                                className="flex-[2] bg-slate-900 text-white px-6 py-4 rounded-2xl text-[10px] font-black uppercase shadow-xl shadow-slate-200 hover:bg-slate-800 transition-all active:scale-95 disabled:bg-slate-300"
                            >
                                {auditLoading ? "Verifying..." : "Confirm & Sign Audit"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* Category and Quick actions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* 2. Inventory Distribution (Visual Representation) */}
                <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-50 relative overflow-hidden">

                    {/* Header Section */}
                    <div className="flex flex-col mb-6">
                        <h3 className="text-base font-black text-slate-800 uppercase italic tracking-tighter leading-none">Inventory Distribution</h3>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Current department asset spread</p>
                    </div>

                    {category && category.length > 0 ? (
                        <div className="flex flex-col md:flex-row items-center gap-12 h-[250px]">

                            {/* LEFT: CHART SIDE */}
                            <div className="relative w-full md:w-1/2 h-full">
                                <Doughnut
                                    data={{
                                        labels: category.map(cat => cat.label),
                                        datasets: [{
                                            data: category.map(cat => cat.val),
                                            backgroundColor: category.map(cat => cat.color),
                                            cutout: '85%', 
                                            borderRadius: 10,
                                            spacing: 4
                                        }]
                                    }}
                                    options={{
                                        responsive: true,
                                        maintainAspectRatio: false,
                                        plugins: { legend: { display: false } }
                                    }}
                                />
                                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-4">
                                    <span className="text-[10px] font-black text-slate-300 uppercase italic">Dept Assets</span>
                                    <span className="text-3xl font-black text-slate-800 italic leading-none">{category.reduce((a, b) => a + b.val, 0)}</span>
                                </div>
                            </div>

                            {/* RIGHT: LEGEND SIDE - All categories visible */}
                            <div className="w-full md:w-1/2 space-y-3">
                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Categories</h4>

                                {category.map((item, i) => (
                                    <div key={i} className="flex items-center justify-between border-b border-slate-50 pb-2">
                                        <div className="flex items-center gap-3">
                                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                                            <span className="text-[11px] font-bold text-slate-700 uppercase">
                                                {item.label}
                                            </span>
                                        </div>
                                        <span className="text-xs font-black text-slate-900 italic">{item.val}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="h-[250px] flex items-center justify-center">
                            <p className="text-[10px] font-bold text-slate-400 uppercase italic">No data available</p>
                        </div>
                    )}
                </div>

                {/* 3. Quick Actions - Aligned to Chart Height */}
                <div className="flex flex-col h-full">
                    <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest ml-2 mb-4">Quick Actions</h3>

                    <div className="flex-1 flex flex-col gap-4">
                        {/* Request Asset */}
                        <Link to={"/hod/request"} className="flex-1 min-h-[90px] bg-white p-5 rounded-[2rem] border border-slate-100 flex items-center justify-between group hover:border-cyan-500 hover:shadow-lg transition-all shadow-sm">
                            <div className="flex items-center gap-4">
                                <div className="bg-cyan-50 p-3 rounded-2xl text-cyan-600 group-hover:bg-cyan-600 group-hover:text-white transition-all"><PlusCircle size={22} /></div>
                                <div className="text-left">
                                    <p className="text-xs font-black text-slate-800 uppercase italic">Request Asset</p>
                                    <p className="text-[10px] font-bold text-slate-400 leading-tight">Submit new requirement</p>
                                </div>
                            </div>
                            <ChevronRight size={18} className="text-slate-300 group-hover:text-cyan-500 transform group-hover:translate-x-1 transition-all" />
                        </Link>

                        {/* Report Damage */}
                        <Link to={"/hod/reports"} className="flex-1 min-h-[90px] bg-white p-5 rounded-[2rem] border border-slate-100 flex items-center justify-between group hover:border-red-500 hover:shadow-lg transition-all shadow-sm">
                            <div className="flex items-center gap-4">
                                <div className="bg-red-50 p-3 rounded-2xl text-red-600 group-hover:bg-red-600 group-hover:text-white transition-all"><AlertTriangle size={22} /></div>
                                <div className="text-left">
                                    <p className="text-xs font-black text-slate-800 uppercase italic">Report Damage</p>
                                    <p className="text-[10px] font-bold text-slate-400 leading-tight">Mark item for repair</p>
                                </div>
                            </div>
                            <ChevronRight size={18} className="text-slate-300 group-hover:text-red-500 transform group-hover:translate-x-1 transition-all" />
                        </Link>

                        {/* Assign Item */}
                        <Link to={"/hod/manage-assets"} className="flex-1 min-h-[90px] bg-white p-5 rounded-[2rem] border border-slate-100 flex items-center justify-between group hover:border-indigo-500 hover:shadow-lg transition-all shadow-sm">
                            <div className="flex items-center gap-4">
                                <div className="bg-indigo-50 p-3 rounded-2xl text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all"><UserPlus size={22} /></div>
                                <div className="text-left">
                                    <p className="text-xs font-black text-slate-800 uppercase italic">Assign Item</p>
                                    <p className="text-[10px] font-bold text-slate-400 leading-tight">Assign item to faculty</p>
                                </div>
                            </div>
                            <ChevronRight size={18} className="text-slate-300 group-hover:text-indigo-500 transform group-hover:translate-x-1 transition-all" />
                        </Link>
                    </div>
                </div>
            </div>

            {/* 4. Activity Log Table */}
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-50">
                <div className="flex  p-8 justify-between items-center mb-6">
                    <h3 className="text-lg font-black text-slate-800 uppercase italic">Department Activity Log</h3>
                    {/* <button className="text-[10px] font-black text-[#008BA9] uppercase tracking-widest hover:underline">View All</button> */}
                </div>
                <DataTable
                    data={activityLog}
                    tableHeader={["Action Type", "Asset Name", "Authorized User", "Timeframe"]}
                    renderRow={(log, i) => (
                        <tr key={i} className="group hover:bg-slate-50/50 transition-colors">
                            <td className="py-4 px-6">
                                <span className={`text-[9px] font-black px-3 py-1.5 rounded-lg uppercase ${log.color}`}>
                                    {log.type}
                                </span>
                            </td>
                            <td className="py-4 px-4 text-sm font-black text-slate-700 uppercase italic">{log.asset}</td>
                            <td className="py-4 px-4 text-xs font-bold text-slate-500"> {log.user}</td>
                            <td className="py-4 px-4 text-xs font-bold text-slate-400 italic text-right">{log.time}</td>
                        </tr>
                    )}

                />

            </div>
        </div>
    );
};

// Helper component for Icon
const ChevronRight = ({ size, className }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="m9 18 6-6-6-6" />
    </svg>
);

export default HODDashboard;