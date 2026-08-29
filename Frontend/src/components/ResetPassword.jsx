import { useState } from "react";
import { User, Lock, ArrowRight } from "lucide-react";
import { useSearchParams } from "react-router-dom";
// import useResetPassword from "../hooks/useResetPassword";
import Loader from "../components/Loader";
import { useResetPassword } from "../api/auth.api";

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    const { resetPassword, loading } = useResetPassword();

    const [formData, setFormData] = useState({
        name: "",
        password: "",
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        await resetPassword(token, formData.name, formData.password);
    };

    if (loading) return <Loader />;

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#F1F5F9] font-sans p-6">
            <div className="w-full max-w-112.5 bg-white rounded-[40px] shadow-2xl shadow-slate-200 overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-500">

                {/* Header */}
                <div className="bg-[#1E2D44] p-10 text-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#0088A8]/20 rounded-full -mr-16 -mt-16"></div>
                    <div className="relative z-10">
                        <h2 className="text-2xl font-black text-white italic tracking-tighter uppercase">
                            Setup Account
                        </h2>
                        <p className="text-[10px] font-bold text-[#0088A8] uppercase tracking-[0.3em] mt-1">
                            Set Your Name & Password
                        </p>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-10 space-y-6">
                    <div className="space-y-4">

                        {/* Name */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                                Full Name
                            </label>
                            <div className="relative group">
                                <User
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#0088A8] transition-colors"
                                    size={18}
                                />
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Enter your full name"
                                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:border-[#0088A8] focus:ring-4 focus:ring-[#0088A8]/5 transition-all font-medium text-slate-700 placeholder:text-slate-300"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                                New Password
                            </label>
                            <div className="relative group">
                                <Lock
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#0088A8] transition-colors"
                                    size={18}
                                />
                                <input
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

                    {/* Button */}
                    <button
                        type="submit"
                        className="w-full bg-[#0088A8] hover:bg-[#007794] text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.25em] shadow-xl shadow-[#0088A8]/20 transition-all active:scale-95 flex items-center justify-center gap-3 italic"
                    >
                        Save & Login <ArrowRight size={18} />
                    </button>
                </form>

            </div>
        </div>
    );
};

export default ResetPassword;