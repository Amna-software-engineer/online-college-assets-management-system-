import { useState } from "react";
import { Mail, Lock, ArrowRight, Loader2, Leaf } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { UseLogin } from "../api/auth.api";
import Loader from "../components/Loader";
import { useGetAllAsset, useGetAllFaculty } from "../api/asset.api";
import { useGetAllRequest } from "../api/request.api";
import { useGetAllDept } from "../api/department.api";


const LoginForm = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const { login, loading, error } = UseLogin();
    const navigate = useNavigate();
    const { getAssets } = useGetAllAsset();
    const { getRequests } = useGetAllRequest();
    const { getFaculty } = useGetAllFaculty();
    const { getDepts } = useGetAllDept();

    const HandleSubmit = async (formData) => {
        const response = await login(formData.email, formData.password);
        console.log("response ", response);
        if (response?.success) {

            if (response?.user?.role === "Principal") {
                navigate("/principal/dashboard");
                  await Promise.all([ getAssets(),  getRequests(),  getFaculty(), getDepts()])
            } else if (response?.user?.role === "HOD") {
                   response?.user?.status ==="Blocked" ? navigate("/hod-info"):  navigate("/hod/dashboard");
               await Promise.all([ getAssets(),  getRequests(),  getFaculty()])
                
            }else{
                navigate("/login");
            }
        }
        console.log(response);
        console.log(error);



    }
    if (loading) {
        return <Loader />
    }
    return (

        <div className="min-h-screen flex items-center justify-center bg-[#F1F5F9] font-sans p-6">
            <div className="w-full max-w-112.5 bg-white rounded-[40px] shadow-2xl shadow-slate-200 overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-500">
                {/* Header Section */}
                <div className="bg-[#1E2D44] p-10 text-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#0088A8]/20 rounded-full -mr-16 -mt-16"></div>
                    <div className="relative z-10">
                        <h2 className="text-2xl font-black text-white italic tracking-tighter uppercase">Portal Login</h2>
                        <p className="text-[10px] font-bold text-[#0088A8] uppercase tracking-[0.3em] mt-1">Institutional Access</p>
                    </div>
                </div>

                {/* Form Section */}
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        HandleSubmit(formData);
                    }}
                    className="p-10 space-y-6"
                >
                    <div className="space-y-4">
                        {/* Email Field */}
                        <div className="space-y-2">
                            <label htmlFor="email" className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                                Official Email
                            </label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#0088A8] transition-colors" size={18} />
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="admin@institution.edu"
                                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:border-[#0088A8] focus:ring-4 focus:ring-[#0088A8]/5 transition-all font-medium text-slate-700 placeholder:text-slate-300"
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div className="space-y-2">
                            <label htmlFor="password" className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                                Password
                            </label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#0088A8] transition-colors" size={18} />
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    placeholder="••••••••"
                                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:border-[#0088A8] focus:ring-4 focus:ring-[#0088A8]/5 transition-all font-medium text-slate-700 placeholder:text-slate-300"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Forgot Access Button */}
                    <button
                        type="button"
                        className="text-[10px] font-black text-[#0088A8] uppercase tracking-widest hover:underline text-left"
                    >
                        Forgot Access?
                    </button>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full bg-[#0088A8] hover:bg-[#007794] text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.25em] shadow-xl shadow-[#0088A8]/20 transition-all active:scale-95 flex items-center justify-center gap-3 italic"
                    >
                        Authorize Entry <ArrowRight size={18} />
                    </button>

                    <div className="pt-4 text-center">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            No account? <Link to={"/register"} className="text-[#0088A8] font-black hover:underline ml-1 italic">Register Unit</Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    )

};

export default LoginForm;
