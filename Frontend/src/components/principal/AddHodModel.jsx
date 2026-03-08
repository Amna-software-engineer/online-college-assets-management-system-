import React, { useEffect, useState } from 'react'
import { useRegister } from '../../api/auth.api'
import { useParams, useNavigate } from 'react-router-dom'
import { CheckCircle2, Mail, User, Lock, X, Search } from 'lucide-react'
import { useSelector } from 'react-redux'
import { useUpdateDept } from '../../api/department.api'

const AddHodModel = ({ isOpen, onClose, deptId, changeHod, seletectedHod }) => {
  const [selectedDepartment, setSelectedDepartment] = useState("All");
  const [selectedHOD, setSelectedHOD] = useState("All");
  const { deptList: departmentsList } = useSelector(state => state?.departments);
  const { facultyList } = useSelector(state => state?.faculty);
  const availableHods = facultyList?.filter(
    f => f.role === "HOD" && f.department === selectedDepartment
  )

  const navigate = useNavigate()
  const { updateDept } = useUpdateDept();

  useEffect(() => {
    if (changeHod && seletectedHod?.length > 0) {
      setSelectedDepartment(seletectedHod[0].department)
      setSelectedHOD(seletectedHod[0]._id)
    }
  }, [changeHod, seletectedHod])

  // handle assign hod
  const HandleSubmit = async () => {
    const departmentId = deptId || selectedDepartment
    await updateDept(departmentId, selectedHOD)
    onClose()
  }


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      {/* card/container */}
      <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100 transform transition-all scale-100">
        {/* header */}
        <div className="bg-[#008BA9] p-8 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
          <div className="flex items-center gap-4 mb-2">
            <div className="bg-white/20 p-3 rounded-2xl">
              <User size={24} />
            </div>
            <h3 className="text-xl font-black uppercase italic">
              {changeHod ? "Change Head of Department" : "Add Head of Department"}
            </h3>
          </div>
          <p className="text-white/70 text-[10px] font-bold uppercase tracking-widest">
            {changeHod
              ? "Replace current HOD for this department"
              : "Assign a new HOD to this department"}
          </p>
        </div>

        {/* form body */}
        <form
          onSubmit={(e) => { e.preventDefault(); HandleSubmit() }}
          className="p-10 space-y-6">
          {/* department */}
          <div className="space-y-2">
            <label htmlFor="department" className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Departement</label>

            <select
              name="department"
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              disabled={changeHod}
              className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:border-[#0088A8] text-sm"
            >
              <option value={"All"}>Choose Department</option>
              {departmentsList?.map(d =>
                <option key={d._id} value={d._id}>{d.name}</option>
              )}
            </select>

          </div>
          {/* HOD */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
              HOD
            </label>
            <select
              value={selectedHOD}
              onChange={(e) => setSelectedHOD(e.target.value)}
              className="w-full pl-4 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:border-[#0088A8]"
            >
              {availableHods?.length > 0 ? (
                <>
                  <option value="">Select HOD</option>
                  {availableHods.map(hod => (
                    <option key={hod._id} value={hod._id}>
                      {hod.name} ({hod.status})
                    </option>
                  ))}
                </>
              ) : (
                <option disabled>No HOD available</option>
              )}

            </select>
          </div>



          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-[#1E2D44] hover:bg-[#162131] text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.25em]"
          >
            {changeHod ? "Update HOD" : "Assign HOD"}
          </button>
        </form>
      </div>
    </div >
  )
}
export default AddHodModel