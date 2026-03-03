import React from 'react';
import { Bell, ChevronRight, Menu, User } from 'lucide-react';
import { useSelector } from 'react-redux';

const Header = ({onMenuClick}) => {
   const user = useSelector((state) => state.auth?.currUser);
   const role = user?.role || "HOD";
 return (
    <div className="w-full flex flex-col">
      {/* Teal Top Bar */}
      <div className="w-full h-16 bg-[#008BA9] flex items-center justify-between px-4 md:px-8 text-white shadow-md relative">
        
        {/* Left Side: Mobile Menu + Title */}
        <div className="flex items-center gap-3">
          {/* 1. Mobile Hamburger */}
          <button 
            onClick={onMenuClick}
            className="lg:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <Menu size={24} strokeWidth={2.5} />
          </button>

          {/* 2. Vertical Line  */}
          <div className="h-8 w-0.75 bg-white/50 rounded-full hidden sm:block"></div>
          {/* 3. Title */}
          <h1 className="text-lg md:text-xl font-black italic tracking-widest uppercase truncate max-w--none">
            {role === 'Principal' ? 'Administration' : user.department.name + ' Department'}
          </h1>
        </div>

        {/* Right Side: Icons & Profile */}
        <div className="flex items-center gap-2 md:gap-6">
          <button className="relative p-1">
            <Bell size={20} md:size={22} strokeWidth={2.5} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-[#008BA9]"></span>
          </button>
          
          <div className="flex items-center gap-3">
            <div className="text-right leading-tight hidden sm:block">
              <p className="text-[11px] font-black uppercase tracking-tighter">
                {role === 'Principal' ? user?.name || 'Dr. Javed' : 'Prof. ' + (user?.name || 'Unknown')}
              </p>
              <p className="text-[9px] font-bold text-cyan-100 uppercase opacity-80">
                {role === 'Principal' ? 'Global Access' : 'Head of Department'}
              </p>
            </div>
            <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center text-[#008BA9] shadow-lg">
              <User size={20} strokeWidth={3} />
            </div>
          </div>
        </div>
      </div>
      
     
    </div>)
};

export default Header;