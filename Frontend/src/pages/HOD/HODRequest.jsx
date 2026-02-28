import React, { act, useState } from 'react';
import { PlusCircle, Send, Info, Eye, AlertCircle, Pen } from 'lucide-react';
import { useSelector } from 'react-redux';
import Loader from '../../components/Loader';
import { useRequestAsset } from '../../api/request.api';
import { useNavigate } from 'react-router-dom';
import ViewDetailsModal from '../../components/HOD/ViewDetailsModal';

const HODRequest = () => {
  const user = useSelector(state => state?.auth?.currUser);
  const requestList = useSelector(state => state?.requests?.requestList);
  const navigate = useNavigate();
  const { requestAsset, loading } = useRequestAsset();
  const categories = ['IT & Electronics', 'Furniture', 'Networking', 'Lab Equipment', 'Others'];
  const [activeTab, setActiveTab] = useState("history");
  const [showDetails, setShowDetails] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [formData, setFormData] = useState({
    requestType: "New Asset",
    RequestorId: user?.userId,
    department: user?.department,
    status: "Pending",
    category: "",
    itemName: "",
    specifications: "",
    priority: "Low",
    quantity: 1,
    reason: ""
  });

  const handleSubmit = async (data) => {
    data.RequestorId = user?.userId;
    data.department = user?.department;
    console.log("data handleSubmit", data);
    
    const response = await requestAsset(data);
    if (response?.success) setActiveTab("history");
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Approved': return 'bg-green-100 text-green-700 border-green-200';
      case 'Rejected': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-amber-100 text-amber-700 border-amber-200';
    }
  };

  const getPriorityDot = (priority) => {
    if (priority === 'High') return 'bg-red-500';
    if (priority === 'Medium') return 'bg-orange-400';
    return 'bg-blue-500';
  }

  if (loading) return <Loader />;

  return (
    <div className="max-w-5xl mx-auto space-y-8 mb-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Top Menu Tabs */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-2 flex gap-2 w-fit">
        <button
          onClick={() => setActiveTab("history")}
          className={`px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all
       ${activeTab === "history" ? "bg-cyan-600 text-white shadow-md" : "text-slate-500 hover:bg-slate-100"}`} >
          View History
        </button>

        <button
          onClick={() => setActiveTab("reports")}
          className={`px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all
            ${activeTab === "reports" ? "bg-cyan-600 text-white shadow-md" : "text-slate-500 hover:bg-slate-100"}`} >
          Reports
        </button>

        <button
          onClick={() => setActiveTab("faculty")}
          className={`px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all
            ${activeTab === "faculty" ? "bg-cyan-600 text-white shadow-md" : "text-slate-500 hover:bg-slate-100"}`} >
          Faculty List
        </button>

         <button
           onClick={() => setActiveTab("request")}
           className={`px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all
        ${activeTab === "request" ? "bg-cyan-600 text-white shadow-md" : "text-slate-500 hover:bg-slate-100"}`} >
           Request Asset
         </button>

      </div>
      {/* Request tables */}
       {(activeTab === "history" || activeTab === "reports") &&<div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-black italic uppercase text-slate-800">My {activeTab === "history" ? "Request" : "Maintenance"} History</h3>
          <span className="text-[10px] font-bold bg-slate-100 px-3 py-1 rounded-full text-slate-500 uppercase">
            Total: {requestList?.length || 0}
          </span>
        </div>
        {/* Request List Table */}
       
          <div div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-cyan-600 text-white">
                <tr className='uppercase tracking-widest text-left text-[10px] font-black'>
                  <th className="py-5 px-6">Asset & Specs</th>
                  <th className="p-6 text-center">Qty</th>
                  <th className="p-6">Priority</th>
                  <th className="p-6">Status</th>
                  <th className="p-6 text-right">Date</th>
                  <th className="p-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {requestList?.length > 0 ?
                  (requestList?.filter((req) => {
                    if (activeTab === "history") return req.requestType === "New Asset";
                    if (activeTab === "reports") return req.requestType === "Maintenance";
                    return false;
                  }).map((req, index) => (
                    <tr key={index} className={`transition-colors group ${index % 2 === 0 ? "bg-white" : "bg-slate-50/50"} hover:bg-cyan-50/30`}>
                      <td className="p-6">
                        <p className="text-sm font-black text-slate-900 italic uppercase">{req.itemName}</p>
                        <p className="text-[10px] font-bold text-slate-500 truncate max-w-50 mt-1">
                          {req.specifications || "No specs provided"}
                        </p>
                      </td>
                      <td className="p-6 text-center">
                        <span className="text-xs font-black text-cyan-700 bg-cyan-50 px-2 py-1 rounded-lg">
                          x{req.quantity}
                        </span>
                      </td>
                      <td className="p-6">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${getPriorityDot(req?.priority)}`} />
                          <span className="text-[10px] font-black uppercase text-slate-700">{req.priority}</span>
                        </div>
                      </td>
                      <td className="p-6">
                        <span className={`px-3 py-1.5 rounded-xl border text-[9px] font-black uppercase italic ${getStatusStyle(req.status)}`}>
                          {req.status}
                        </span>
                      </td>
                      <td className="p-6 text-right">
                        <p className="text-[10px] font-bold text-slate-500"> {new Date(req.createdAt).toLocaleDateString('en-GB')} </p>
                      </td>
                      {req?.status === "Pending" && <td className="p-6">
                        <div className="flex items-center justify-center gap-4 text-slate-400 group-hover:text-slate-700 transition-all">
                          <Pen size={18} onClick={() => { setSelectedRequest(req); setShowDetails(true); }} className="hover:text-cyan-600 cursor-pointer transition-colors" />
                        </div>
                      </td>}
                    </tr>)
                  )
                  ) : (
                    <tr>
                      <td colSpan="6" className="p-20 text-center">
                        <div className="flex flex-col items-center gap-2 opacity-30">
                          <AlertCircle size={40} />
                          <p className="text-[10px] font-black uppercase italic">No requests found</p>
                        </div>
                      </td>
                    </tr>
                  )}
              </tbody>
            </table>
       </div>
       
          </div>
        }
        {/* faculty tabel */}
        {activeTab === "faculty" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
          <h3 className="text-xl font-black italic uppercase text-slate-800">My Faculty Request History</h3>
          <span className="text-[10px] font-bold bg-slate-100 px-3 py-1 rounded-full text-slate-500 uppercase">
            Total: {requestList?.length || 0}
          </span>
        </div>
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-cyan-600 text-white">
                <tr className="uppercase tracking-widest text-left text-[10px] font-black">
                  <th className="py-5 px-6">Faculty Name</th>
                  <th className="p-6 text-center">Email</th>
                  <th className="p-6">Department</th>
                  <th className="p-6">Status</th>
                  <th className="p-6 text-right">Date</th>
                  {/* {requestList.some(req => req.requestType === "Faculty" && req.status === "Pending") && <th className="p-6 text-right">Actions</th>} */}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {requestList?.filter(req => req.requestType === "Faculty Request").length > 0 ? (
                  requestList
                    .filter(req => req.requestType === "Faculty Request")
                    .map((req, index) => (
                      <tr key={index} className={`transition-colors group ${index % 2 === 0 ? "bg-white" : "bg-slate-50/50"} hover:bg-cyan-50/30`}>
                        <td className="p-6 font-black">{req.itemName}</td> {/* name field */}
                        <td className="p-6 text-center">{req.email}</td>
                        <td className="p-6">{req.department}</td>
                        <td className="p-6">
                          <span className={`px-3 py-1.5 rounded-xl border text-[9px] font-black uppercase italic ${getStatusStyle(req.status)}`}>
                            {req.status}
                          </span>
                        </td>
                        <td className="p-6 text-right">{new Date(req.createdAt).toLocaleDateString("en-GB")}</td>
                        {/* {req.status === "Pending" && (
                        <td className="p-6">
                          <div className="flex items-center justify-center gap-4 text-slate-400 group-hover:text-slate-700 transition-all">
                            <Pen size={18} onClick={() => { setSelectedRequest(req); setShowDetails(true); }} className="hover:text-cyan-600 cursor-pointer transition-colors" />
                          </div>
                        </td>
                      )} */}
                      </tr>
                    ))
                ) : (
                  <tr>
                    <td colSpan="6" className="p-20 text-center">
                      <div className="flex flex-col items-center gap-2 opacity-30">
                        <AlertCircle size={40} />
                        <p className="text-[10px] font-black uppercase italic">No faculty requests found</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
            
          </div>
        )}
        {/* Request Form */}
        {activeTab === "request" && <div className='space-y-6'>
          <h3 className="text-lg font-black text-slate-800 italic">Asset Requisition Form</h3>
          <div className="bg-white rounded-[2.5rem] shadow-md border border-slate-100 overflow-hidden">
            <div className="p-8 md:p-12">
              <div className="flex items-center gap-3 mb-10 text-cyan-600">
                <PlusCircle size={28} strokeWidth={2.5} />
                <h3 className="text-xl font-black italic uppercase">New Asset Requisition</h3>
              </div>
              <form className="grid grid-cols-1 md:grid-cols-2 gap-8" onSubmit={(e) => { e.preventDefault(); handleSubmit(formData); }}>
                {/* Item Name */}
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Item Name / Model</label>
                  <input
                    type="text" required
                    placeholder="e.g. Dell Latitude 5420"
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold text-slate-700 focus:border-[#008BA9] focus:outline-none transition-all"
                    value={formData.itemName}
                    onChange={(e) => setFormData({ ...formData, itemName: e.target.value })}
                  />
                </div>
                {/* Category */}
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Asset Category</label>
                  <select
                    required
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold text-slate-700 focus:border-[#008BA9] focus:outline-none appearance-none transition-all"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    <option value="">Select Category</option>
                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>

                {/* Quantity */}
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Quantity</label>
                  <input
                    type="number" min="1" max="100" required
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold text-slate-700 focus:border-[#008BA9] focus:outline-none transition-all"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  />
                </div>

                {/* Priority */}
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Urgency</label>
                  <select
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold text-slate-700 focus:border-[#008BA9] focus:outline-none appearance-none transition-all"
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>

                {/* Specifications */}
                <div className="flex flex-col gap-2 md:col-span-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Specifications</label>
                  <textarea
                    required
                    placeholder="RAM, Processor, Color, Size etc..."
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold text-slate-700 focus:border-[#008BA9] focus:outline-none transition-all min-h-[80px]"
                    value={formData.specifications}
                    onChange={(e) => setFormData({ ...formData, specifications: e.target.value })}
                  />
                </div>

                {/* Reason */}
                <div className="flex flex-col gap-2 md:col-span-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Purpose / Reason</label>
                  <input
                    type="text"
                    placeholder="Why is this asset needed?"
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold text-slate-700 focus:border-[#008BA9] focus:outline-none transition-all"
                    value={formData.reason}
                    onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  />
                </div>

                {/* Info Message */}
                <div className="md:col-span-2 bg-cyan-50/50 p-4 rounded-2xl flex items-start gap-4 border border-cyan-100">
                  <Info className="text-[#008BA9] shrink-0" size={20} />
                  <p className="text-[10px] font-bold text-cyan-700 uppercase leading-relaxed">
                    Unit: <span className="font-black italic underline">{formData.department}</span>. Specifications will be reviewed by the Principal for approval.
                  </p>
                </div>

                {/* Submit */}
                <div className="md:col-span-2 pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#008BA9] text-white py-5 rounded-3xl shadow-xl shadow-cyan-100 flex items-center justify-center gap-3 hover:bg-[#007894] transition-all transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="text-sm font-black uppercase tracking-[0.2em] italic">Send Request</span>
                    <Send size={18} />
                  </button>
                </div>

              </form>
            </div>
          </div>
        </div>}

        {/* Modal Rendering */}
        <ViewDetailsModal
          isOpen={showDetails}
          onClose={() => setShowDetails(false)}
          title={selectedRequest?.itemName}
          subTitle={`${selectedRequest?.department} • ${selectedRequest?.priority} Priority`}
        >
          <div className="space-y-8">
            {/* Status Summary */}
            <div className="flex justify-between bg-slate-50 p-5 rounded-2xl border border-slate-200">
              {/* Quantity */}
              <div className="flex flex-col items-center">
                <p className="text-lg font-bold text-slate-800">{selectedRequest?.quantity}</p>
                <p className="text-[10px] font-semibold uppercase text-slate-400 tracking-wider">Units</p>
              </div>
              {/* Status */}
              <div className="flex flex-col items-center">
                <span className={`px-4 py-1.5 rounded-xl border text-xs font-black uppercase italic ${getStatusStyle(selectedRequest?.status)}`}>
                  {selectedRequest?.status}
                </span>
                <p className="text-[10px] font-semibold uppercase text-slate-400 tracking-wider mt-1">Status</p>
              </div>
              {/* Requested On */}
              <div className="flex flex-col items-center">
                <p className="text-lg font-semibold text-slate-700">
                  {new Date(selectedRequest?.createdAt).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
                <p className="text-[10px] font-semibold uppercase text-slate-400 tracking-wider mt-1">Requested On</p>
              </div>
            </div>
            {/* Reason */}
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Reason for Request</p>
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                <p className="text-sm text-slate-700 leading-relaxed">{selectedRequest?.reason}</p>
              </div>
            </div>
            {/* Specifications */}
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Technical Specifications</p>
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{selectedRequest?.specifications || "No specific technical details provided."}</p>
              </div>
            </div>
          </div>
        </ViewDetailsModal>
      </div>
  );
};

      export default HODRequest;