
import React, { useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Search, Package, Database, UserCheck, Eye, Building2, ArrowLeftRight } from 'lucide-react';
import DataTable from '../../components/DataTable';
import ViewDetailsModal from '../../components/HOD/ViewDetailsModal';
import AddFacultyModal from '../../components/HOD/AddFacultyModal';
import AddStock from '../../components/principal/AddStock';
import TransferAssetModal from '../../components/HOD/TransferAssetModal';

const PrincipalClgAssets = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isTransferModelOpen, setIsTransferModelOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState("All");
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const { assetsList } = useSelector(state => state?.assets);
  const { deptList: departmentsList } = useSelector(state => state?.departments);

  // Stats Calculation (Global level)
  const totalUnits = assetsList?.reduce((total, curr) =>
    selectedAsset
      ? (selectedAsset?.name === curr?.name ? total + curr.quantity : total)
      : total + curr.quantity
    , 0) || 0;
  const assignedUnits = assetsList?.filter(a => a?.assignedTo ||  a?.department)
  .reduce((total, curr) => 
    selectedAsset
      ? (selectedAsset?.name === curr?.name ? total + curr.quantity : total)
      : total + curr.quantity
    , 0) || 0; 
    
  const availableUnits = totalUnits - assignedUnits;

  const stats = [
    { label: 'Total Assets', value: totalUnits, icon: <Package className="text-cyan-600" />, bg: 'bg-cyan-50' },
    { label: 'In Stock', value: availableUnits, icon: <Database className="text-emerald-600" />, bg: 'bg-emerald-50' },
    { label: 'Total Assigned', value: assignedUnits, icon: <UserCheck className="text-indigo-600" />, bg: 'bg-indigo-50' },
    { label: 'Departments', value: departmentsList?.length || 0, icon: <Building2 className="text-orange-600" />, bg: 'bg-orange-50' },
  ];
  //  Filter 
  const filteredAssets = assetsList?.filter(a => {
    const matchesSearch = a?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a?._id?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || a?.category === selectedCategory;
    // Principal can filter by Department
    const matchesDept = selectedDepartment === "All" || a?.department?._id === selectedDepartment;

    return matchesSearch && matchesCategory && matchesDept;
  });
  // category data
  const categories = ['IT & Electronics', 'Furniture', 'Networking', 'Lab Equipment', 'Others'];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((item, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-5">
            <div className={`p-4 rounded-2xl ${item.bg}`}>{item.icon}</div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{item.label}</p>
              <h3 className="text-2xl font-extrabold text-slate-800">{item.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="text"
            placeholder="Search by Asset Name or ID across college..."
            className="w-full pl-14 pr-6 py-4 bg-white border border-slate-200 rounded-2xl outline-none text-sm"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="bg-white border-2 border-slate-50 rounded-2xl px-6 py-4 text-[10px] font-black uppercase text-slate-600"
        >
          <option value="All">All Categories</option>
          {categories.map(cat => <option value={cat}>{cat}</option>)}
        </select>
      </div>

      {/* Department Selection (Faculty filter ki jagah) */}
      <div className="space-y-3">
        <div className='flex justify-between items-center px-2'>
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Filter By Department</h3>
          <button onClick={() => setIsModalOpen(true)} className="text-[10px] font-black text-cyan-600 uppercase cursor-pointer">+ Add Stock</button>

        </div>
        <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
          <div
            onClick={() => setSelectedDepartment("All")}
            className={`shrink-0 px-6 py-3 rounded-2xl border cursor-pointer font-bold text-xs transition-all
              ${selectedDepartment === "All" ? "bg-slate-800 text-white shadow-lg" : "bg-white text-slate-600 border-slate-100"}`}
          >
            All College
          </div>
          {departmentsList?.map((dept) => (
            <div
              key={dept._id}
              onClick={() => setSelectedDepartment(dept._id)}
              className={`shrink-0 flex items-center gap-3 px-6 py-3 rounded-2xl border transition-all cursor-pointer 
                ${selectedDepartment === dept._id ? "bg-cyan-600 text-white border-cyan-600 shadow-md" : "bg-white border-slate-100 hover:border-cyan-200"}`}
            >
              <span className="text-xs font-bold">{dept.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Asset Table */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-md overflow-hidden">
        <DataTable
          data={filteredAssets}
          tableHeader={["Asset", "Quantity", "Department", "Category", "Status", "Holder", "Actions"]}
          renderRow={(asset, i) => (
            <tr key={i} className="hover:bg-slate-50 transition-colors border-b border-slate-50">
              <td className="py-5 px-6">
                <p className="text-sm font-black text-slate-800 uppercase italic">{asset?.name}</p>
                <p className="text-[9px] text-slate-400 uppercase tracking-widest">ID: {asset?._id.slice(-6)}#</p>
              </td>
              {/* Qunatity  */}
              <td className="py-5 px-4">
                <span className="text-sm font-black text-slate-800 italic">
                  {asset.quantity}
                </span>
              </td>
              {/* Department  */}
              <td className="py-5 px-4">
                <span className="px-3 py-1 rounded-lg bg-slate-100 text-[10px] font-bold text-slate-600 uppercase">
                  {asset?.department?.name}
                </span>
              </td>
              {/* category */}
              <td className="py-5 px-4 text-[10px] font-bold text-slate-500 uppercase">{asset?.category}</td>
              {/* status */}
              <td className="py-5 px-4">
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${asset?.collegeStatus === "Available" ? "text-emerald-600 bg-emerald-50" : "text-blue-600 bg-blue-50"}`}>
                  {asset?.collegeStatus}
                </span>
              </td>
              {/* assignedTo */}
              <td className="py-5 px-4 text-[10px] font-black text-slate-700 italic">
                {asset?.assignedTo?.name || <span className="text-slate-300">Unassigned</span>}
              </td>
              {/* actions */}
              <td className="py-5 px-6 flex items-center justify-center gap-4 text-slate-400 group-hover:text-slate-700 transition-all">
                <Eye
                  size={18}
                  onClick={() => { setSelectedAsset(asset); setShowDetails(true); }}
                  className="text-slate-400 hover:text-cyan-600 cursor-pointer"
                />
                { <ArrowLeftRight onClick={() => {
                  setSelectedAsset(asset);
                  setIsTransferModelOpen(true);
                }} size={18} className = {`${asset?.collegeStatus === "Available" ? "block" : "opacity-0" } hover:text-blue-600  hover:scale-110 transition-transform cursor-pointer` }/>}

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
      <AddStock isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <TransferAssetModal isOpen={isTransferModelOpen} deptTransfer={true} onClose={() => setIsTransferModelOpen(false)} asset={selectedAsset} />

    </div>
  );
};

export default PrincipalClgAssets;