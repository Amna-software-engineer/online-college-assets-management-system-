import React, { useEffect, useState } from 'react'
import { useRegister } from '../../api/auth.api'
import { useParams, useNavigate } from 'react-router-dom'
import { CheckCircle2, Mail, User, Lock, X, Search } from 'lucide-react'
import { useSelector } from 'react-redux'
import { useUpdateDept } from '../../api/department.api'

const AddHodModel = ({ isOpen, onClose, deptId, changeHod, seletectedHod }) => {
  const [selectedDepartment, setSelectedDepartment] = useState("All");
  const [selectedHOD, setSelectedHOD] = useState(""); // Default empty string
  
  const { deptList: departmentsList } = useSelector(state => state?.departments);
  const { facultyList } = useSelector(state => state?.faculty);
  
  const { updateDept } = useUpdateDept();

  // Reset or Set values when Modal opens
  useEffect(() => {
    if (isOpen) {
      if (changeHod && seletectedHod?.length > 0) {
        // Change Mode: Pre-fill data
        setSelectedDepartment(deptId || seletectedHod[0].department);
        setSelectedHOD(seletectedHod[0]._id);
      } else {
        // Assign Mode: Reset data
        setSelectedDepartment(deptId || "All");
        setSelectedHOD("");
      }
    }
  }, [isOpen, changeHod, seletectedHod, deptId]);

  // Filter HODs based on selected department
  const availableHods = facultyList?.filter(
    f => f.role === "HOD" && f.department === selectedDepartment
  );

  const HandleSubmit = async () => {
    if (!selectedHOD || selectedHOD === "All") {
        alert("Please select an HOD");
        return;
    }
    const targetDeptId = deptId || selectedDepartment;
    await updateDept(targetDeptId, selectedHOD);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100">
        {/* Header */}
        <div className="bg-[#008BA9] p-8 text-white relative">
          <button onClick={onClose} className="absolute top-6 right-6 p-2 hover:bg-white/10 rounded-full transition-colors">
            <X size={20} />
          </button>
          <div className="flex items-center gap-4 mb-2">
            <div className="bg-white/20 p-3 rounded-2xl"><User size={24} /></div>
            <h3 className="text-xl font-black uppercase italic">
              {changeHod ? "Change HOD" : "Assign HOD"}
            </h3>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={(e) => { e.preventDefault(); HandleSubmit(); }} className="p-10 space-y-6">
          {/* Department Selection */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Department</label>
            <select
              value={selectedDepartment}
              onChange={(e) => {
                  setSelectedDepartment(e.target.value);
                  setSelectedHOD(""); // Reset HOD if dept changes
              }}
              disabled={changeHod || !!deptId} // Disable if changing existing or deptId provided
              className="w-full px-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm outline-none focus:border-[#008BA9]"
            >
              <option value="All">Choose Department</option>
              {departmentsList?.map(d => <option key={d._id} value={d._id}>{d.name}</option>)}
            </select>
          </div>

          {/* HOD Selection */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Select HOD</label>
            <select
              value={selectedHOD}
              onChange={(e) => setSelectedHOD(e.target.value)}
              className="w-full px-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm outline-none focus:border-[#008BA9]"
            >
              <option value="">-- Choose Professor --</option>
              {availableHods?.map(hod => (
                <option key={hod._id} value={hod._id}>
                  {hod.name} {hod.status}
                </option>
              ))}
            </select>
            {availableHods?.length === 0 && selectedDepartment !== "All" && (
                <p className="text-[9px] text-red-500 font-bold mt-1">No HODs found in this department.</p>
            )}
          </div>

          <button type="submit" className="w-full bg-[#1E2D44] hover:bg-[#162131] text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.25em] transition-all active:scale-95">
            {changeHod ? "Update HOD" : "Assign HOD"}
          </button>
        </form>
      </div>
    </div>
  );
};
export default AddHodModel