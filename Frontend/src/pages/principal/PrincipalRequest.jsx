import React, { useState } from 'react';
import { CheckCircle, XCircle, Eye, Clock, Package, UserPlus, AlertTriangle, Banknote, X, Calendar, User, Hash, FileText, Info } from 'lucide-react';
import { useSelector } from 'react-redux';
import Loader from '../../components/Loader';
import { useUpdateReqStatus, useUpdateRequest } from '../../api/request.api';
import DataTable from '../../components/DataTable';
import ViewDetailsModal from '../../components/HOD/ViewDetailsModal';

const PrincipalRequest = () => {
  const requestList = useSelector(state => state?.requests?.requestList);
  const { updateReqStatus, loading: actionLoading } = useUpdateReqStatus();

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
    await updateReqStatus({ status: newStatus }, id);
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Approved': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Rejected': return 'bg-rose-100 text-rose-700 border-rose-200';
      default: return 'bg-amber-100 text-amber-700 border-amber-200';
    }
  };
  const getPriorityDot = (priority) => {
    if (priority === 'High') return 'bg-red-500';
    if (priority === 'Medium') return 'bg-orange-400';
    return 'bg-blue-500';
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 mb-10 animate-in fade-in slide-in-from-bottom-4 duration-700">

      {/* 1. STATS OVERVIEW */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
        <h2 className="text-3xl md:text-4xl font-black text-slate-800 uppercase italic tracking-tighter leading-none">Requisitions</h2>
    </div>

    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-2 grid grid-cols-3 md:flex gap-2 w-full md:w-fit">
        {["pending", "approved", "rejected"].map((tab) => (
            <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 md:px-6 py-2.5 md:py-3 rounded-2xl text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap
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
                <p className="text-[10px] text-slate-400 font-mono mt-1 tracking-tighter truncate max-w-50">
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
              <td className="py-5 px-4 ">
                <div className="flex items-center gap-2">
                  {req?.priority && <div className={`w-2 h-2 rounded-full ${getPriorityDot(req?.priority)}`} />}
                  <span className="text-[10px] font-black uppercase text-slate-700">{req?.priority}</span>
                </div>
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
      {showDetails && selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">

          <div className="bg-white w-full max-w-xl rounded-2xl shadow-lg border border-slate-100 overflow-hidden">

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Request Details
                </p>
                <h3 className="text-lg font-black text-slate-800 uppercase">
                  {selectedRequest.itemName}
                </h3>
              </div>

              <button
                onClick={() => setShowDetails(false)}
                className="p-2 hover:bg-slate-100 rounded-lg text-slate-500"
              >
                <X size={18} />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-6">

              {/* Request Info */}
              <div className="grid grid-cols-2 gap-4">

                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">
                    Requested By
                  </p>
                  <p className="text-sm font-semibold text-slate-700 mt-1">
                    {selectedRequest.RequestorId?.name || "N/A"}
                  </p>
                </div>

                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">
                    Date
                  </p>
                  <p className="text-sm font-semibold text-slate-700 mt-1">
                    {new Date(selectedRequest.createdAt).toLocaleDateString()}
                  </p>
                </div>

              </div>

              {/* Specifications */}
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">
                  Specifications
                </p>

                <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 text-sm text-slate-600">
                  {selectedRequest.specifications || "No specifications provided"}
                </div>
              </div>

              {/* Reason */}
              {selectedRequest.reason && (
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">
                    Reason
                  </p>

                  <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 text-sm text-slate-600">
                    {selectedRequest.reason}
                  </div>
                </div>
              )}

              {/* Meta Info */}
              <div className="flex items-center justify-between pt-2">

                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">
                    Quantity
                  </p>
                  <span className="text-sm font-black text-cyan-700">
                    x{selectedRequest.quantity}
                  </span>
                </div>

                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">
                    Priority
                  </p>

                  <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase
          ${selectedRequest.priority === "High"
                      ? "bg-rose-50 text-rose-600"
                      : "bg-blue-50 text-blue-600"
                    }`}>
                    {selectedRequest.priority}
                  </span>
                </div>

                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">
                    Status
                  </p>

                  <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase
          ${selectedRequest.status === "Approved"
                      ? "bg-emerald-50 text-emerald-600"
                      : selectedRequest.status === "Rejected"
                        ? "bg-rose-50 text-rose-600"
                        : "bg-amber-50 text-amber-600"
                    }`}>
                    {selectedRequest.status}
                  </span>
                </div>

              </div>

            </div>

            {/* Footer Actions */}
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-slate-100">

              {selectedRequest.status === "Pending" && (
                <>
                  <button
                    onClick={() => {
                      handleAction(selectedRequest._id, "Rejected");
                      setShowDetails(false);
                    }}
                    className="px-4 py-2 bg-rose-50 text-rose-600 rounded-lg text-xs font-bold hover:bg-rose-100"
                  >
                    Reject
                  </button>

                  <button
                    onClick={() => {
                      handleAction(selectedRequest._id, "Approved");
                      setShowDetails(false);
                    }}
                    className="px-4 py-2 bg-cyan-600 text-white rounded-lg text-xs font-bold hover:bg-cyan-700"
                  >
                    Approve
                  </button>
                </>
              )}

              {selectedRequest.status !== "Pending" && (
                <button
                  onClick={() => setShowDetails(false)}
                  className="px-4 py-2 bg-slate-800 text-white rounded-lg text-xs font-bold"
                >
                  Close
                </button>
              )}

            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default PrincipalRequest;