import React, { useMemo, useState } from 'react';
import { toast } from "react-toastify";
import {
  Search, Filter, Download, MoreVertical, Eye, Edit3,
  RefreshCcw, Trash2, Users, ArrowLeftRight, UserMinus, X, Package, AlertTriangle,
  Database,
  UserCheck,
  Settings,
  Plus,
  Hash, LayoutGrid, ChevronDown
} from 'lucide-react';
import AddFacultyModal from '../../components/HOD/AddFacultyModal';
import RemoveAccessModal from '../../components/HOD/RemoveAccessModal';
import ViewDetailsModal from '../../components/HOD/ViewDetailsModal';
import { useSelector } from 'react-redux';
import { Doughnut } from 'react-chartjs-2';
import TransferAssetModal from '../../components/HOD/TransferAssetModal';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);



const HODManageAssets = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeMenu, setActiveMenu] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTransferModelOpen, setIsTransferModelOpen] = useState(false);
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [showRemoveAccesseModal, setShowRemoveAccesseModal] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const { assetsList } = useSelector(state => state?.assets);
  const { facultyList } = useSelector(state => state?.faculty);
  const [activeFacultyFilter, setActiveFacultyFilter] = useState(null);
  const [assetDistribution, setAssetDistribution] = useState({ totalUnits: 0, assignedUnits: 0, availableUnits: 0 });


  // category data
  const category = [
    { label: 'IT & Electronics', val: assetsList?.filter(asset => asset?.category === "IT & Electronics").length, color: '#06b6d4' }, // bg-cyan-500
    { label: 'Furniture', val: assetsList?.filter(asset => asset?.category === "Furniture").length, color: '#34d399' },        // bg-emerald-400
    { label: 'Networking', val: assetsList?.filter(asset => asset?.category === "Networking").length, color: '#1e293b' },       // bg-slate-800
    { label: 'Lab Equipment', val: assetsList?.filter(asset => asset?.category === "Lab Equipment").length, color: '#475569' },    // bg-slate-600
    { label: 'Others', val: assetsList?.filter(asset => asset?.category === "Others").length, color: '#0d9488' },       // bg-teal-600
  ];


  // stats cards data
  const totalUnits = assetsList?.reduce((total, curr) => total + (curr?.quantity || 0), 0) || 0;
  const assignedUnits = assetsList?.filter(a => a?.assignedTo).reduce((total, curr) => total + (curr?.quantity || 0), 0) || 0;
  const availableUnits = totalUnits - assignedUnits;
  const stats = [
    { label: 'Total Units', value: totalUnits, icon: <Package className="text-cyan-600" />, bg: 'bg-cyan-50' },
    { label: 'In Stock (Available)', value: availableUnits, icon: <Database className="text-emerald-600" />, bg: 'bg-emerald-50' },
    { label: 'Assigned', value: assignedUnits, icon: <UserCheck className="text-indigo-600" />, bg: 'bg-indigo-50' },
  ];
  //  Search & Filter
  const filteredAssets = useMemo(() => {
    return assetsList?.filter(a => {
      const matchesSearch = a?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a?._id?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === "All" || a?.category === selectedCategory;
      const matchesFacultyFilter = !activeFacultyFilter || (a?.assignedTo && a?.assignedTo._id === activeFacultyFilter);
      return matchesSearch && matchesCategory && matchesFacultyFilter;
    });
  }, [searchTerm, selectedCategory, assetsList, activeFacultyFilter]);


  const handleViewDetails = (asset) => {
    setSelectedAsset(asset);
    setShowDetails(true);
    setActiveMenu(null);
    // toast.success(`${asset.name}'s Details Loaded`);
  };

  const calculateAssetDistribtuion = (asset) => {
    const totalUnits=  assetsList?.filter(a=> a.name === asset.name && a.category === asset.category ).reduce((total, curr) => total + (curr?.quantity || 0), 0) || 0;
    const assignedUnits=  assetsList?.filter(a=> a.name === asset.name && a.category === asset.category && a.assignedTo).reduce((total, curr) => total + (curr?.quantity || 0), 0) || 0;
    console.log("total units ",totalUnits,assignedUnits);
    const availableUnits = totalUnits - assignedUnits;
   setAssetDistribution({ totalUnits, assignedUnits, availableUnits });
    
    // total units, assigned units, available units
  };
 ;
  const handleTransferAsset = (asset) => {
    console.log("asset tran ass", asset);
    setSelectedAsset(asset);
    setIsTransferModelOpen(true);
  }

  const handleRemoveAccessConfirm = () => {
    toast.error(`${selectedFaculty.name}'s access revoked!`, { icon: '🚫' });
    setShowRemoveAccesseModal(false);
  };



  return (
    <div className="p-2 lg:p-8 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* 1. Quick Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((item, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex items-center gap-5"
          >            <div className={`p-4 rounded-2xl ${item.bg}`}>{item.icon}</div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{item.label}</p>
              <h3 className="text-2xl font-extrabold text-slate-800 leading-none">
                {item.value}
              </h3>
            </div>
          </div>
        ))}
      </div>
      {/* 2. Search & Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1 group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="text"
            placeholder="Search assets..."
            className="w-full pl-14 pr-6 py-4 bg-white border border-slate-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500 outline-none transition-all text-sm font-medium"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Category Dropdown */}
        <select
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="bg-white border-2 border-slate-50 rounded-2xl px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-600 outline-none focus:border-cyan-500 transition-all cursor-pointer"
        >
          <option value="All">All Categories</option>
          {category?.map(cat => <option key={cat.label} value={cat.label}>{cat.label}</option>)}
        </select>
      </div>
      {/* 3. Faculty Filter */}
      <div className="space-y-3">
        <div className="flex justify-between items-center px-2">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Department Faculty</h3>
          <button onClick={() => setIsModalOpen(true)} className="text-[10px] font-black text-cyan-600 uppercase">+ Add Faculty</button>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
          {facultyList?.map((faculty, i) => (
            <div
              key={i}
              onClick={() => setActiveFacultyFilter(faculty?._id)}
              className={`shrink-0 flex items-center gap-3 p-2 pr-4 rounded-2xl border transition-all cursor-pointer group ${activeFacultyFilter === faculty?._id ? "bg-cyan-50 border-cyan-300 shadow-md" : "bg-white border-slate-100 hover:border-cyan-200"} `} >
              <div className="w-8 h-8 rounded-xl bg-slate-800 text-cyan-400 flex items-center justify-center font-black text-[10px]">
                {faculty?.name[0].toUpperCase()}
              </div>
              <span className="text-xs font-bold text-slate-700">{faculty?.name}</span>
            </div>
          ))}
          <div className={`shrink-0 flex items-center justify-center p-2 pr-4 rounded-2xl border cursor-pointer  bg-slate-800 text-white `} onClick={() => setActiveFacultyFilter(null)}> Clear
          </div>

        </div>
      </div>
      {/*4. Asset List Table */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#008BA9] text-white">
              <tr className="text-left text-[10px] font-black uppercase tracking-widest">
                <th className="py-5 px-6">Asset Identification</th>
                <th className="py-5 px-4">Category</th>
                <th className="py-5 px-4">Qty</th>
                <th className="py-5 px-4">Status</th>
                <th className="py-5 px-4">Assigend To</th>
                <th className="py-5 px-4">Value</th>
                <th className="py-5 px-4">Health</th>
                <th className="py-5 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredAssets.length > 0 ? filteredAssets.map((asset, i) => (
                <tr key={i} className={`transition-colors group ${i % 2 === 0 ? "bg-white" : "bg-slate-50/40"} hover:bg-cyan-50/40`}
                >
                  {/* 1. Identification */}
                  <td className="py-5 px-6">
                    <p className="text-sm font-black text-slate-800 uppercase italic leading-tight tracking-tight">
                      {asset?.name}
                    </p>
                    <p className="text-[9px] font-bold text-slate-400 mt-1 tracking-widest">
                      ID: {asset?._id.slice(-6).toUpperCase()}#
                    </p>
                  </td>

                  {/* 2. Category */}
                  <td className="py-5 px-4">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">
                      {asset?.category}
                    </span>
                  </td>

                  {/* 3. Quantity */}
                  <td className="py-5 px-4">
                    <span className="text-sm font-black text-slate-800 italic">
                      {asset.quantity}
                    </span>
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
                    <p className="text-[10px] font-black text-slate-700 uppercase italic">
                      {asset?.assignedTo?.name || <span className="text-slate-300">Unassigned</span>}
                    </p>
                  </td>

                  {/* 6. Price/Value */}
                  <td className="py-5 px-4">
                    <span className="text-sm font-black text-slate-800">
                      RS. {asset?.price?.toLocaleString()}
                    </span>
                  </td>

                  {/* 7. Health (Fixed Condition) */}
                  <td className="py-5 px-4">
                    <span className={`flex items-center justify-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase ${asset?.condition === "New" ? "text-emerald-600 bg-emerald-50" :
                      asset?.condition === "Maintenance" ? "text-blue-600 bg-blue-50" :
                        asset?.condition === "Damaged" ? "text-orange-600 bg-orange-50" :
                          "text-red-600 bg-red-50"}`}>
                      {asset?.condition}
                    </span>
                  </td>

                  {/* 8. Actions */}
                  <td className="py-5 px-6">
                    <div className="flex items-center justify-center gap-4 text-slate-400 group-hover:text-slate-700 transition-all">
                      <Eye size={18} onClick={() => { handleViewDetails(asset);  calculateAssetDistribtuion(asset); }} className="hover:text-cyan-600 cursor-pointer transition-colors" />

                      <ArrowLeftRight onClick={() => handleTransferAsset(asset)} size={18} className="hover:text-blue-600  hover:scale-110 transition-transform cursor-pointer" />
                      {/* <Trash2 size={18} className="hover:text-red-600 hover:scale-110 transition-transform cursor-pointer" /> */}
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="8" className="py-20 text-center">
                    <div className="flex flex-col items-center opacity-20">
                      <Package size={48} />
                      <p className="mt-2 text-sm font-black uppercase">No assets found</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>


           


              
        {/* Modals Rendering */}
        <ViewDetailsModal isOpen={showDetails} onClose={() => setShowDetails(false)} asset={selectedAsset} assetDistribution={assetDistribution} />
        <RemoveAccessModal isOpen={showRemoveAccesseModal} onClose={() => setShowRemoveAccesseModal(false)} faculty={selectedFaculty} onConfirm={handleRemoveAccessConfirm} />
        <AddFacultyModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        <TransferAssetModal isOpen={isTransferModelOpen} onClose={() => setIsTransferModelOpen(false)} asset={selectedAsset} facultyList={facultyList} />
      </div>
    </div>
  );
}


export default HODManageAssets;


