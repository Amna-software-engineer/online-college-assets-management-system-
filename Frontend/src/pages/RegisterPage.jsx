import { Building2, CheckCircle2, ChevronDown, Lock, Mail, ShieldCheck, User } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useRegister } from "../api/auth.api";
import Loader from "../components/Loader";
import { useSelector } from "react-redux";
import { useGetAllDept } from "../api/department.api";
import HodInfoPage from "./HOD/HodInfo";

const RegisterPage = () => {
  const { deptList: departmentsList } = useSelector(state => state?.departments);
  const { getDepts } = useGetAllDept();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
    department: ""
  });
  useEffect(() => {
    (async () => {
      await getDepts();
    })()
  }, [])

  const { register, loading } = useRegister();
  const navigate = useNavigate();
  const HandleSubmit = async (formData) => {
    if (formData.department === "All") {
      toast.error("Please select a department");
      return;
    }
    const response = await register(formData);
    console.log(response);
    if (response?.success) {
      
    response.user.status ==="Blocked" ? navigate("/hod-info"): navigate("/login")
    }
    console.log(formData);

  }
  if (loading) {
    return <Loader />
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F1F5F9] font-sans p-6">
      <div className="w-full max-w-125 bg-white rounded-[40px] shadow-2xl shadow-slate-200 overflow-hidden border border-slate-100 animate-in fade-in slide-in-from-right-8 duration-500">
        <div className="bg-[#0088A8] p-10 text-white relative">
          <div className="text-center">
            <h2 className="text-3xl font-black italic tracking-tight uppercase leading-none">Register Unit</h2>
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] mt-2 opacity-70">New Administrative Account</p>
          </div>
        </div>

        {/* Registration Form Container */}
        <form
          onSubmit={(e) => { e.preventDefault(); HandleSubmit(formData) }}
          className="p-10 space-y-5"
        >
          {/* Grid for Name and Role */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="Name" className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#0088A8]" size={16} />
                <input
                  id="Name"
                  name="Name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => (setFormData({ ...formData, name: e.target.value }))}
                  required
                  placeholder="Dr. Sarah"
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:border-[#0088A8] text-sm"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="role" className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Role</label>
              <div className="relative group">
                <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#0088A8]" size={16} />
                <input
                  id="role"
                  name="role"
                  type="text"
                  value={formData.role}
                  onChange={(e) => (setFormData({ ...formData, role: e.target.value }))}
                  required
                  placeholder="HOD / Admin"
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:border-[#0088A8] text-sm"
                />
              </div>
            </div>
          </div>

          {/* Department Selection */}
          <div className="space-y-2">
            <label htmlFor="department" className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Department</label>
            <div className="relative group">
              <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#0088A8]" size={16} />
              <select
                id="department"
                name="department"
                value={formData.department}
                required
                onChange={(e) => (setFormData({ ...formData, department: e.target.value }))}
                className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:border-[#0088A8] text-sm font-bold text-slate-700 appearance-none cursor-pointer"
              >
                <option value={"All"}>Choose Department</option>
                {departmentsList?.map(d =>
                  <option key={d._id} value={d._id}>{d.name}</option>)}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-300">
                <ChevronDown size={14} />
              </div>
            </div>
          </div>

          {/* Email Field */}
          <div className="space-y-2">
            <label htmlFor="regEmail" className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Official Email</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#0088A8]" size={16} />
              <input
                id="regEmail"
                name="email"
                type="email"
                value={formData.email}
                onChange={(e) => (setFormData({ ...formData, email: e.target.value }))}
                required
                placeholder="official@institution.edu"
                className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:border-[#0088A8] text-sm"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <label htmlFor="regPassword" className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Access Password</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#0088A8]" size={16} />
              <input
                id="regPassword"
                name="password"
                type="password"
                value={formData.password}
                onChange={(e) => (setFormData({ ...formData, password: e.target.value }))}
                required
                placeholder="••••••••"
                className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:border-[#0088A8] text-sm"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-[#1E2D44] hover:bg-[#162131] text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.25em] shadow-xl shadow-slate-200 transition-all active:scale-95 flex items-center justify-center gap-3 mt-4"
          >
            Initialize Account <CheckCircle2 size={18} />
          </button>

          <p className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Already authorized? <Link to={"/login"} className="text-[#0088A8] font-black hover:underline italic">Sign In</Link>
          </p>
        </form>
      </div>
    </div>
  )

};

export default RegisterPage;
