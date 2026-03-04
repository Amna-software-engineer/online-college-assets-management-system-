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
  const colors = [ '#06b6d4', '#34d399', '#1e293b', '#475569', '#0d9488', '#f59e0b', '#ef4444', '#8b5cf6', '#10b981', '#3b82f6' ];
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
    { label: 'Pending Requests', value: requestList?.length || 0, icon: <ClipboardList className="text-red-600" />, bg: 'bg-red-50' },
    { label: 'Total Faculty', value: facultyList?.length || 0, icon: <Users className="text-indigo-600" />, bg: 'bg-indigo-50' },
  ];

  // chart data
  const deptAssets = deptList.map((dept, i) => (
    {
      label: dept.name,
      val: assetsList.reduce((total, currAsset) => {
        console.log(dept._id, currAsset.department);

        if (dept._id == currAsset.department) {
          total = total + currAsset.quantity;
          return total
        }

      }, 0),
      color: colors[i % colors.length]
    }
  ))
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
    ?.filter(asset => asset.assignedTo)
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



  return (
    <div className="space-y-10 animate-in fade-in duration-500">

      {/* 1. Top Stats Cards */}
      <StatsCards stats={stats} />

      {/* Category and Quick actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 2. Inventory Distribution (Visual Representation) */}
        <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-50 relative overflow-hidden">
          {deptAssets && deptAssets.length > 0 ? (
            <Doughnut
              data={
                {
                  // all labels should be in single chart
                  labels: deptList.map(dept => dept.name),
                  datasets: [
                    {
                      // vall vaules
                      data: deptAssets.map(a => a.val),
                      backgroundColor: deptAssets.map(a => a.color), //bgcolor for each category
                      borderColor: deptAssets.map(a => a.color),
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

          {/* 1. View College Assets */}
          <Link to={"/principal/college-assets"} className="w-full bg-white p-5 rounded-3xl border border-slate-100 flex items-center justify-between group hover:border-cyan-500 transition-all shadow-sm">
            <div className="flex items-center gap-4">
              <div className="bg-cyan-50 p-3 rounded-2xl text-cyan-600"><Package size={20} /></div>
              <div className="text-left">
                <p className="text-xs font-black text-slate-800 uppercase italic">College Assets</p>
                <p className="text-[10px] font-bold text-slate-400">View all assets in college</p>
              </div>
            </div>
            <ChevronRight size={16} className="text-slate-300 group-hover:text-cyan-500" />
          </Link>

          {/* 2. View Departments */}
          <Link to={"/principal/departments"} className="w-full bg-white p-5 rounded-3xl border border-slate-100 flex items-center justify-between group hover:border-emerald-500 transition-all shadow-sm">
            <div className="flex items-center gap-4">
              <div className="bg-emerald-50 p-3 rounded-2xl text-emerald-600"><Users size={20} /></div>
              <div className="text-left">
                <p className="text-xs font-black text-slate-800 uppercase italic">Departments</p>
                <p className="text-[10px] font-bold text-slate-400">Manage all departments</p>
              </div>
            </div>
            <ChevronRight size={16} className="text-slate-300 group-hover:text-emerald-500" />
          </Link>


          {/* 3. View Reports */}
          <Link to={"/principal/reports"} className="w-full bg-white p-5 rounded-3xl border border-slate-100 flex items-center justify-between group hover:border-red-500 transition-all shadow-sm">
            <div className="flex items-center gap-4">
              <div className="bg-red-50 p-3 rounded-2xl text-red-600"><BarChart2 size={20} /></div>
              <div className="text-left">
                <p className="text-xs font-black text-slate-800 uppercase italic">Reports</p>
                <p className="text-[10px] font-bold text-slate-400">Check asset reports & statistics</p>
              </div>
            </div>
            <ChevronRight size={16} className="text-slate-300 group-hover:text-red-500" />
          </Link>
        </div>
      </div>

      {/* 4. Activity Log Table */}
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
    </div>
  )
}
// Helper component for Icon
const ChevronRight = ({ size, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m9 18 6-6-6-6" />
  </svg>
);

export default PrincipalDashboard