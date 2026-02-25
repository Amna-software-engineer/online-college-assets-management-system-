import React  from 'react';
import { LayoutDashboard, Package, Building2, ClipboardList, BarChart3, LogOut, Menu, X } from 'lucide-react';
import { useSelector } from 'react-redux';
import { NavLink, useNavigate } from 'react-router-dom';

const Sidebar = ({isOpen, onMenuClick}) => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth?.currUser);
  const role = user?.role || "HOD";

  const principalPages = [
    { label: 'Dashboard', icon: <LayoutDashboard size={20}/>, path: "/principal/dashboard" },
    { label: 'College Assets', icon: <Package size={20}/>, path: "/principal/college-assets" },
    { label: 'Departments', icon: <Building2 size={20}/>, path: "/principal/departments" },
    { label: 'Requests', icon: <ClipboardList size={20}/>, path: "/principal/requests" },
    { label: 'Reports', icon: <BarChart3 size={20}/>, path: "/principal/reports" },
  ];

  const hodPages = [
    { label: 'Dashboard', icon: <LayoutDashboard size={20}/>, path: "/hod/dashboard" },
    { label: 'Manage Assets', icon: <Package size={20}/>, path: "/hod/manage-assets" },
    { label: 'Request', icon: <ClipboardList size={20}/>, path: "/hod/request" },
    { label: 'Reports', icon: <BarChart3 size={20}/>, path: "/hod/reports" },
  ];

  const menuToShow = role === 'Principal' ? principalPages : hodPages;

  return (
    <>
      {/* --- Mobile Hamburger Button --- */}
      <button 
        onClick={() => onMenuClick()}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 text-white rounded-lg shadow-md"
      >
        {isOpen && <X size={24} /> }
      </button>

      {/* --- Overlay  --- */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() =>onMenuClick()}
        ></div>
      )}

      {/* --- Main Sidebar Container --- */}
      <div className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-[#1E2D44] text-white p-6 flex flex-col shadow-2xl transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
        lg:translate-x-0 lg:static lg:h-screen
      `}>

        {/* App Logo */}
        <div className="flex items-center gap-3 mb-10 px-2 mt-10 lg:mt-0">
          <img src="/logo.png" alt="App Logo" className="w-full object-contain" />
        </div>

        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4 ml-2 italic">
          Navigation
        </p>

        {/* Navigation Links */}
        <nav className="flex flex-col gap-2 overflow-y-auto">
          {menuToShow.map((item, index) => (
            <NavLink
              key={index}
              to={item.path}
              onClick={() => onMenuClick()} 
              className={({ isActive }) => `
                flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group
                ${isActive
                  ? 'bg-[#0088A8] text-white shadow-lg shadow-[#0088A8]/20 font-bold'
                  : 'text-slate-400 hover:bg-slate-800/40 hover:text-white'}
              `}
            >
              {({ isActive }) => (
                <>
                  <span className={`${isActive ? 'text-white' : 'text-slate-500 group-hover:text-[#0088A8]'}`}>
                    {item.icon}
                  </span>
                  <span className="text-sm font-bold tracking-wide uppercase italic">{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Logout Section at the Bottom */}
        <div className="mt-auto pt-6 border-t border-slate-700/50">
          <button
            onClick={() => {
              localStorage.clear();
              navigate("/login");
            }}
            className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all duration-300 group"
          >
            <span className="text-slate-500 group-hover:text-red-400">
              <LogOut size={20} />
            </span>
            <span className="text-xs font-black tracking-widest uppercase">Exit System</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;