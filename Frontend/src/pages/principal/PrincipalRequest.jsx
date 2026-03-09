import React, { useState } from 'react';
import { CheckCircle, XCircle, Eye, Clock, Package, UserPlus, AlertTriangle, Banknote } from 'lucide-react';
import { useSelector } from 'react-redux';
import Loader from '../../components/Loader';
import { useUpdateRequest } from '../../api/request.api';
import DataTable from '../../components/DataTable';
import ViewDetailsModal from '../../components/HOD/ViewDetailsModal';

const PrincipalRequest = () => {
  const requestList = useSelector(state => state?.requests?.requestList);
  const { updateRequest, loading: actionLoading } = useUpdateRequest();

  const [activeTab, setActiveTab] = useState("pending");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  // Stats Calculation
  const pendingRequests = requestList?.filter(req => req.status === "Pending") || [];
  const approvedRequests = requestList?.filter(req => req.status === "Approved") || [];
  const rejectedRequests = requestList?.filter(req => req.status === "Rejected") || [];
  const totalRequests = requestList?.length || 0;

  const stats = [
    { label: 'Total Requests', value: totalRequests, icon: <Package size={20} className="text-slate-500" /> },
    { label: 'Pending', value: pendingRequests.length, icon: <Clock size={20} className="text-amber-500" /> },
    { label: 'Approved', value: approvedRequests.length, icon: <CheckCircle size={20} className="text-emerald-500" /> },
    { label: 'Rejected', value: rejectedRequests.length, icon: <XCircle size={20} className="text-red-500" /> },
  ];

  const handleAction = async (id, newStatus) => {
    await updateRequest({ status: newStatus }, id);
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Approved': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Rejected': return 'bg-rose-100 text-rose-700 border-rose-200';
      default: return 'bg-amber-100 text-amber-700 border-amber-200';
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 mb-10 animate-in fade-in slide-in-from-bottom-4 duration-700">

      {/* 1. STATS OVERVIEW */}
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

      {/* 2. HEADER & TABS */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <p className="text-[10px] font-black text-cyan-600 uppercase tracking-[0.3em] mb-1">Request Management</p>
          <h2 className="text-4xl font-black text-slate-800 uppercase italic tracking-tighter leading-none">Requisitions</h2>
        </div>
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-2 flex gap-2 w-fit">
          {["pending", "approved", "rejected"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all
                ${activeTab === tab ? "bg-cyan-600 text-white shadow-md" : "text-slate-500 hover:bg-slate-100"}`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* 3. DATA TABLE */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-md overflow-hidden">
        <DataTable
          data={requestList?.filter(req => req.status.toLowerCase() === activeTab)}
          tableHeader={["Request Details", "Qty", "Department", "Priority", "Status", "Actions"]}
          renderRow={(req, i) => (
            <tr key={i} className={`border-b border-slate-50 hover:bg-cyan-50/20 transition-all group ${i % 2 === 0 ? "bg-white" : "bg-slate-50/30"}`}>

              {/* Request Details */}
              <td className="py-6 px-8">
                <p className="text-sm font-black text-slate-900 uppercase italic group-hover:text-cyan-700 transition-colors">
                  {req?.itemName}
                </p>
                <p className="text-[10px] text-slate-400 font-mono mt-1 tracking-tighter">
                  Spec: {req?.specifications || "NO SPECS"}
                </p>
              </td>

              {/* Quantity */}
              <td className="py-6 px-4">
                <span className="text-xs font-black text-cyan-700 bg-cyan-50 px-3 py-1 rounded-lg">
                  x{req?.quantity || 1}
                </span>
              </td>

              {/* Department */}
              <td className="py-5 px-4">
                <div className="flex flex-col">
                  <span className="px-3 py-1 rounded-lg bg-slate-100 text-[10px] font-bold text-slate-600 uppercase w-fit">
                    {req?.department?.name || "N/A"}
                  </span>
                  <p className="text-[9px] font-black text-slate-400 mt-1 ml-1 uppercase">
                    HOD: {req?.RequestorId?.name}
                  </p>
                </div>
              </td>

              {/* Priority */}
              <td className="py-5 px-4">
                <span className={`flex items-center justify-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase
      ${req.priority === "High"
                    ? "text-rose-600 bg-rose-50"
                    : "text-blue-600 bg-blue-50"
                  }`}>
                  {req.priority}
                </span>
              </td>

              {/* Status */}
              <td className="py-5 px-4">
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold
      ${req.status === "Approved"
                    ? "bg-emerald-100 text-emerald-700"
                    : req.status === "Rejected"
                      ? "bg-rose-100 text-rose-700"
                      : "bg-amber-100 text-amber-700"
                  }`}>

                  <span className={`w-1.5 h-1.5 rounded-full animate-pulse
        ${req.status === "Approved"
                      ? "bg-emerald-500"
                      : req.status === "Rejected"
                        ? "bg-rose-500"
                        : "bg-amber-500"
                    }`} />

                  <span className="text-[10px] font-black uppercase italic">
                    {req.status}
                  </span>
                </div>
              </td>

              {/* Actions */}
              <td className="py-6 px-8">
                <div className="flex gap-4 text-slate-300 group-hover:text-slate-500 transition-all">

                  <Eye
                    size={18}
                    className="hover:text-cyan-600 cursor-pointer transition-colors"
                    onClick={() => {
                      setSelectedRequest(req);
                      setShowDetails(true);
                    }}
                  />

                  {req.status === "Pending" && (
                    <>
                      <CheckCircle
                        size={18}
                        className="hover:text-emerald-500 cursor-pointer transition-colors"
                        onClick={() => handleAction(req._id, "Approved")}
                      />

                      <XCircle
                        size={18}
                        className="hover:text-rose-500 cursor-pointer transition-colors"
                        onClick={() => handleAction(req._id, "Rejected")}
                      />
                    </>
                  )}

                </div>
              </td>

            </tr>
          )}
        />

        {/* Empty State Logic */}
        {requestList?.filter(req => req.status.toLowerCase() === activeTab).length === 0 && (
          <div className="py-20 flex flex-col items-center opacity-40">
            <Clock size={48} className="text-slate-300 mb-4" />
            <p className="text-xs font-black uppercase italic tracking-widest text-slate-400">No {activeTab} requests found</p>
          </div>
        )}
      </div>

      {showDetails && (
        <ViewDetailsModal
          request={selectedRequest}
          onClose={() => setShowDetails(false)}
        />
      )}
    </div>
  );
};

export default PrincipalRequest;