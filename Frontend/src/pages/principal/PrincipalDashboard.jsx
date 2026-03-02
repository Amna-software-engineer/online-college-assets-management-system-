import { ClipboardList, DollarSign, Package, Settings, Users } from 'lucide-react';
import React from 'react'
import { useSelector } from 'react-redux';
import StatsCards from '../../components/StatsCards';

const PrincipalDashboard = () => {
  const { assetsList } = useSelector(state => state?.assets);
  const { requestList } = useSelector(state => state?.requests);
  const { facultyList } = useSelector(state => state?.faculty);
  const totalAssetsValue = assetsList && assetsList?.reduce((total, asset) => total + asset?.price * asset?.quantity, 0) || 0;
  const totalLength = assetsList?.length;
  const funtionalAsset = assetsList?.filter(asset => asset?.condition === "New").length; console.log("funtionalAsset", funtionalAsset);

  const MaintenanceHealth = totalLength > 0 ? (funtionalAsset / totalLength) * 100 : 0; //formula= (functional assets /total assets)*100

  const totalUnits = assetsList?.reduce((total, curr) => total + (curr?.quantity || 0), 0) || 0;
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
    const deptAssets = [
        { label: 'IT & Electronics', val: assetsList?.filter(asset => asset?.category === "IT & Electronics").length, color: '#06b6d4' }, // bg-cyan-500
        { label: 'Furniture', val: assetsList?.filter(asset => asset?.category === "Furniture").length, color: '#34d399' },        // bg-emerald-400
        { label: 'Networking', val: assetsList?.filter(asset => asset?.category === "Networking").length, color: '#1e293b' },       // bg-slate-800
        { label: 'Lab Equipment', val: assetsList?.filter(asset => asset?.category === "Lab Equipment").length, color: '#475569' },    // bg-slate-600
        { label: 'Others', val: assetsList?.filter(asset => asset?.category === "Others").length, color: '#0d9488' },       // bg-teal-600
    ];
  return (
    <div className="space-y-10 animate-in fade-in duration-500">

      {/* 1. Top Stats Cards */}
      <StatsCards stats={stats} />
      PrincipalDashboard

    </div>
  )
}

export default PrincipalDashboard