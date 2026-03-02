import React, { useState } from 'react';
import { Package, DollarSign, Settings, ClipboardList, Users, PlusCircle, AlertTriangle, UserPlus, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Chart as ChartJS, defaults } from "chart.js/auto";
import { Doughnut } from "react-chartjs-2";
import { formatDistanceToNow } from "date-fns";
import StatsCards from '../../components/StatsCards';


const HODDashboard = () => {
    const { assetsList } = useSelector(state => state?.assets);
    const { requestList } = useSelector(state => state?.requests);
    const { facultyList } = useSelector(state => state?.faculty);
    const totalAssetsValue = assetsList && assetsList?.reduce((total, asset) => total + asset?.price * asset?.quantity, 0) || 0;
    const totalLength = assetsList?.length;
    const funtionalAsset = assetsList?.filter(asset => asset?.condition === "New").length; console.log("funtionalAsset", funtionalAsset);

    const MaintenanceHealth = totalLength > 0 ? (funtionalAsset / totalLength) * 100 : 0; //formula= (functional assets /total assets)*100

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
        { label: 'Asset Value', value: Intl.NumberFormat(undefined,{
                            notation: "compact",
                            compactDisplay: "short",
                            currency:  "PKR",
                            style: "currency"
                        }).format(totalAssetsValue), icon: <DollarSign className="text-blue-600" />, bg: 'bg-blue-50' },
        { label: 'Maintenance', value: Math.round(MaintenanceHealth) + '%', icon: <Settings className="text-orange-600" />, bg: 'bg-orange-50' },
        { label: 'Requests', value: requestList?.length || 0, icon: <ClipboardList className="text-red-600" />, bg: 'bg-red-50' },
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

    return (
        <div className="space-y-10 animate-in fade-in duration-500">

            {/* 1. Top Stats Cards */}
            <StatsCards stats={stats} />
            {/* Category and Quick actions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* 2. Inventory Distribution (Visual Representation) */}
                <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-50 relative overflow-hidden">
                    {category && category.length > 0 ? (
                        <Doughnut
                            data={
                                {
                                    // all labels should be in single chart
                                    labels: category.map(cat => cat.label),
                                    datasets: [
                                        {
                                            // vall vaules
                                            data: category.map(cat => cat.val),
                                            backgroundColor: category.map(cat => cat.color), //bgcolor for each category
                                            borderColor: category.map(cat => cat.color),
                                            cutout: '60%'
                                        }
                                    ],
                                }}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: {
                                    title: { //chart title 
                                        display: true,
                                        text: "Inventory Distribution",
                                        color: '#1e293b',
                                        align: "start",  // Text color 
                                        font: {
                                            size: 18,       // Text size
                                            weight: 'bold'
                                        },

                                    },
                                    subtitle: {
                                        display: true,
                                        text: 'Current department asset spread',
                                        align: "start",
                                    },
                                    legend: {  //catogry text
                                        display: true,
                                        position: 'right',
                                        labels: {
                                            padding: 30
                                        }
                                    }
                                }
                            }
                            }
                        />
                    ) : (
                        <p className="text-center text-slate-400">No data available</p>
                    )}
                </div>

                {/* 3. Quick Actions */}
                <div className="space-y-4">
                    <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest ml-2">Quick Actions</h3>
                    <Link to={"/hod/request"} className="w-full bg-white p-5 rounded-3xl border border-slate-100 flex items-center justify-between group hover:border-cyan-500 transition-all shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="bg-cyan-50 p-3 rounded-2xl text-cyan-600"><PlusCircle size={20} /></div>
                            <div className="text-left">
                                <p className="text-xs font-black text-slate-800 uppercase italic">Request Asset</p>
                                <p className="text-[10px] font-bold text-slate-400">Submit new requirement</p>
                            </div>
                        </div>
                        <ChevronRight size={16} className="text-slate-300 group-hover:text-cyan-500" />
                    </Link>

                    <Link to={"/hod/reports"} className="w-full bg-white p-5 rounded-3xl border border-slate-100 flex items-center justify-between group hover:border-red-500 transition-all shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="bg-red-50 p-3 rounded-2xl text-red-600"><AlertTriangle size={20} /></div>
                            <div className="text-left">
                                <p className="text-xs font-black text-slate-800 uppercase italic">Report Damage</p>
                                <p className="text-[10px] font-bold text-slate-400">Mark item for repair</p>
                            </div>
                        </div>
                        <ChevronRight size={16} className="text-slate-300 group-hover:text-red-500" />
                    </Link>
                    <Link to={"/hod/manage-assets"} className="w-full bg-white p-5 rounded-3xl border border-slate-100 flex items-center justify-between group hover:border-cyan-500 transition-all shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="bg-cyan-50 p-3 rounded-2xl text-cyan-600"><UserPlus size={20} /></div>
                            <div className="text-left">
                                <p className="text-xs font-black text-slate-800 uppercase italic">Assign Item</p>
                                <p className="text-[10px] font-bold text-slate-400">Assign item to faculty</p>
                            </div>
                        </div>
                        <ChevronRight size={16} className="text-slate-300 group-hover:text-cyan-500" />
                    </Link>


                </div>

            </div>

            {/* 4. Activity Log Table */}
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-50">
                <div className="flex  p-8 justify-between items-center mb-6">
                    <h3 className="text-lg font-black text-slate-800 uppercase italic">Department Activity Log</h3>
                    {/* <button className="text-[10px] font-black text-[#008BA9] uppercase tracking-widest hover:underline">View All</button> */}
                </div>
                <div className="overflow-x-auto ">
                    <table className="w-full">
                        <thead className="bg-cyan-600 text-white px-6">
                            <tr className="uppercase tracking-widest text-left text-[10px] font-black">
                                <th className="py-5 px-6">Action Type</th>
                                <th className="py-5 px-6">Asset Name</th>
                                <th className="py-5 px-6">Authorized User</th>
                                <th className="py-5 px-6 text-right">Timeframe</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 px-6">
                            {activityLog.map((log, i) => (
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
                            ))}
                        </tbody>
                    </table>
                </div>
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