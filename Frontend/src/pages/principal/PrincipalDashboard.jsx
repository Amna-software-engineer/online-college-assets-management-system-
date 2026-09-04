import { ClipboardList, DollarSign, Package, Settings, Users, PlusCircle, AlertTriangle, UserPlus, BarChart2 } from 'lucide-react';
import React from 'react'
import { useSelector } from 'react-redux';
import StatsCards from '../../components/StatsCards';
import { Chart as ChartJS, defaults } from "chart.js/auto";
import { Doughnut } from "react-chartjs-2";
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import DataTable from '../../components/DataTable';

const PrincipalDashboard = () => {
  const { assetsList } = useSelector(state => state?.assets);
  const { requestList } = useSelector(state => state?.requests);
  const { facultyList } = useSelector(state => state?.faculty);
  const { deptList } = useSelector(state => state?.departments);

  const totalAssetsValue = assetsList && assetsList?.reduce((total, asset) => total + asset?.price * asset?.quantity, 0) || 0;
  const totalLength = assetsList?.length;
  const funtionalAsset = assetsList?.filter(asset => asset?.condition === "New").length; console.log("funtionalAsset", funtionalAsset);

  const MaintenanceHealth = totalLength > 0 ? (funtionalAsset / totalLength) * 100 : 0; //formula= (functional assets /total assets)*100

  const totalUnits = assetsList?.reduce((total, curr) => total + (curr?.quantity || 0), 0) || 0;
  const colors = ['#06b6d4', '#34d399', '#1e293b', '#475569', '#0d9488', '#f59e0b', '#ef4444', '#8b5cf6', '#10b981', '#3b82f6'];
  // Stats Data
  const stats = [
    { label: 'College Assets', value: totalUnits, icon: <Package className="text-cyan-600" />, bg: 'bg-cyan-50' },
    {
      label: 'Asset Value', value: Intl.NumberFormat(undefined, {
        notation: "compact",
        compactDisplay: "short",
        currency: "PKR",
        style: "currency"
      }).format(totalAssetsValue), icon: <DollarSign className="text-blue-600" />, bg: 'bg-blue-50'
    },
    { label: 'Maintenance', value: Math.round(MaintenanceHealth) + '%', icon: <Settings className="text-orange-600" />, bg: 'bg-orange-50' },
    { label: 'Pending Requests', value: requestList?.filter(req=> req?.status==="Pending").length || 0, icon: <ClipboardList className="text-red-600" />, bg: 'bg-red-50' },
    { label: 'Total Faculty', value: facultyList?.filter(f => f.role === "Faculty").length || 0, icon: <Users className="text-indigo-600" />, bg: 'bg-indigo-50' },
  ];

  // chart data
  const deptAssets = deptList.map((dept, i) => (
    {
      label: dept?.name,
      val: assetsList?.reduce((total, currAsset) => {
        console.log(dept?._id === currAsset?.department?._id);

        if (dept?._id === currAsset?.department?._id) {
          total = total + currAsset.quantity;
          return total
        }
        return total
      }, 0),
      color: colors[i % colors.length]
    }
  ))
  console.log("deptAssets", deptAssets);

  const activityLog = [
    ...requestList
      ?.filter(req => ["New Asset", "Maintenance"].includes(req.requestType))
      .map(req => ({
        type: 'Requested',
        asset: req?.itemName,
        user: `Prof. ${req?.RequestorId?.name || "Unknown"}`,
        time: req?.createdAt, // <-- original date
        displayTime: formatDistanceToNow(new Date(req?.createdAt), { addSuffix: true }),
        color: 'text-blue-600 bg-blue-50'
      })),
    ...assetsList
      ?.filter(asset => asset?.assignedTo)
      .map(asset => ({
        type: 'Assigned',
        asset: asset?.name,
        user: asset?.assignedTo?.name ? `Prof. ${asset?.assignedTo?.name}` : "Unassigned",
        time: asset?.createdAt,
        displayTime: formatDistanceToNow(new Date(asset?.createdAt), { addSuffix: true }),
        color: 'text-cyan-600 bg-cyan-50'
      })),
    ...assetsList
      ?.filter(asset => asset?.condition === "Damaged" || asset?.condition === "Lost")
      .map(asset => ({
        type: 'Reported',
        asset: asset?.name,
        user: asset?.assignedTo?.name ? `Prof. ${asset?.assignedTo?.name}` : "Unassigned",
        time: asset?.createdAt,
        displayTime: formatDistanceToNow(new Date(asset?.createdAt), { addSuffix: true }),
        color: 'text-red-600 bg-red-50'
      }))
  ]
    .sort((a, b) => new Date(b.time) - new Date(a.time)) //Sort by most recent and limit to 5 items
    .slice(0, 5);

  const getProfessionalData = () => {
    // 1. Assets ke mutabiq sort karein (Highest to Lowest)
    const sortedDepts = [...deptAssets].sort((a, b) => b.val - a.val);

    // 2. Pehle 5 departments lein
    const topFive = sortedDepts.slice(0, 5);

    // 3. Baqi sab ko "Others" mein calculate karein
    const othersVal = sortedDepts.slice(5).reduce((acc, curr) => acc + curr.val, 0);

    const finalData = [...topFive];
    if (othersVal > 0) {
      finalData.push({
        label: 'Others',
        val: othersVal,
        color: '#CBD5E1' // Neutral Gray
      });
    }

    return finalData;
  };

  const chartData = getProfessionalData();

  return (
    <div className="space-y-10 animate-in fade-in duration-500">

      {/* 1. Top Stats Cards */}
      <StatsCards stats={stats} />

      {/*2 Category and Quick actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/*  Inventory Distribution (clg Visual Representation) */}
        <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-50 relative overflow-hidden">
          {/* Header Section */}
          <div className="flex flex-col mb-6">
            <h3 className="text-base font-black text-slate-800 uppercase italic tracking-tighter leading-none">Inventory Distribution</h3>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Asset spread by department</p>
          </div>
          {chartData && chartData.length > 0 ? (
            /* MAIN CONTENT WRAPPER - chart and legend side by side */
            <div className="flex flex-col md:flex-row items-center gap-12 h-62.5">

              {/* LEFT: CHART SIDE */}
              <div className="relative w-full md:w-1/2 h-full">
                <Doughnut
                  data={{
                    labels: chartData.map(d => d.label || deptList.find(dept => dept._id === d.deptId)?.name),
                    datasets: [{
                      data: chartData.map(d => d.val),
                      backgroundColor: chartData.map(d => d.color),
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
                  <span className="text-[10px] font-black text-slate-300 uppercase italic">Total Assets</span>
                  <span className="text-3xl font-black text-slate-800 italic leading-none">{totalUnits || 0}</span>
                </div>
              </div>

              {/* RIGHT: LEGEND SIDE */}
              <div className="w-full md:w-1/2 space-y-3">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Top Departments</h4>

                {chartData.map((item, i) => (
                  <div key={i} className="flex items-center justify-between border-b border-slate-50 pb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-[11px] font-bold text-slate-700 uppercase truncate max-w-[120px]">
                        {item.label || deptList.find(d => d._id === item.deptId)?.name}
                      </span>
                    </div>
                    <span className="text-xs font-black text-slate-900 italic">{item.val}</span>
                  </div>
                ))}

                <Link to="/principal/departments" className="inline-block text-[9px] font-black text-cyan-500 uppercase mt-4 hover:tracking-widest transition-all">
                  View Detailed Breakdown →
                </Link>
              </div>
            </div>
          ) : (
            /* NO DATA STATE */
            <div className="h-[250px] flex items-center justify-center">
              <p className="text-[10px] font-bold text-slate-400 uppercase italic">No data available</p>
            </div>
          )}
        </div>
        {/* 3. Quick Actions */}
        <div className="flex flex-col h-full">
          <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest ml-2 mb-4">Quick Actions</h3>

          <div className="flex-1 flex flex-col gap-4">
            {/* 1. View College Assets */}
            <Link to={"/principal/college-assets"} className="flex-1 min-h-22.5 bg-white p-5 rounded-4xl border border-slate-100 flex items-center justify-between group hover:border-cyan-500 hover:shadow-lg hover:shadow-cyan-500/5 transition-all shadow-sm">
              <div className="flex items-center gap-4">
                <div className="bg-cyan-50 p-3 rounded-2xl text-cyan-600 group-hover:bg-cyan-600 group-hover:text-white transition-colors"><Package size={22} /></div>
                <div className="text-left">
                  <p className="text-xs font-black text-slate-800 uppercase italic">College Assets</p>
                  <p className="text-[10px] font-bold text-slate-400 leading-tight">Full inventory list</p>
                </div>
              </div>
              <ChevronRight size={18} className="text-slate-300 group-hover:text-cyan-500 transform group-hover:translate-x-1 transition-all" />
            </Link>

            {/* 2. View Departments */}
            <Link to={"/principal/departments"} className="flex-1 min-h-22.5 bg-white p-5 rounded-4xl border border-slate-100 flex items-center justify-between group hover:border-emerald-500 hover:shadow-lg hover:shadow-emerald-500/5 transition-all shadow-sm">
              <div className="flex items-center gap-4">
                <div className="bg-emerald-50 p-3 rounded-2xl text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors"><Users size={22} /></div>
                <div className="text-left">
                  <p className="text-xs font-black text-slate-800 uppercase italic">Departments</p>
                  <p className="text-[10px] font-bold text-slate-400 leading-tight">Manage faculty labs</p>
                </div>
              </div>
              <ChevronRight size={18} className="text-slate-300 group-hover:text-emerald-500 transform group-hover:translate-x-1 transition-all" />
            </Link>

            {/* 3. View Reports */}
            <Link to={"/principal/reports"} className="flex-1 min-h-22.5 bg-white p-5 rounded-4xl border border-slate-100 flex items-center justify-between group hover:border-red-500 hover:shadow-lg hover:shadow-red-500/5 transition-all shadow-sm">
              <div className="flex items-center gap-4">
                <div className="bg-red-50 p-3 rounded-2xl text-red-600 group-hover:bg-red-600 group-hover:text-white transition-colors"><BarChart2 size={22} /></div>
                <div className="text-left">
                  <p className="text-xs font-black text-slate-800 uppercase italic">Reports</p>
                  <p className="text-[10px] font-bold text-slate-400 leading-tight">Analytics & Stats</p>
                </div>
              </div>
              <ChevronRight size={18} className="text-slate-300 group-hover:text-red-500 transform group-hover:translate-x-1 transition-all" />
            </Link>
          </div>
        </div>
      </div>

      {/* 3. Activity Log Table */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-50">
        <div className="flex  p-8 justify-between items-center mb-6">
          <h3 className="text-lg font-black text-slate-800 uppercase italic">College Activity Log</h3>
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
              <td className="py-4 px-4 text-xs font-bold text-slate-400 italic ">{log.displayTime}</td>
            </tr>
          )}

        />

      </div>
    </div >
  )
}
// Helper component for Icon
const ChevronRight = ({ size, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m9 18 6-6-6-6" />
  </svg>
);

export default PrincipalDashboard