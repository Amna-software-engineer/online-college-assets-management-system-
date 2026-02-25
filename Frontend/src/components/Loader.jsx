import React from 'react'
import { Loader2 } from 'lucide-react'

const Loader = () => {
  return (
    <div className="fixed inset-0 z-100 flex flex-col items-center justify-center bg-[#F1F5F9]/80 backdrop-blur-sm">
      <div className="bg-white rounded-[40px] shadow-2xl shadow-slate-200 p-10 border border-slate-100 animate-in fade-in zoom-in-95 duration-500 flex items-center justify-center flex-col">
        <div className="relative w-16 h-16 ">
          <div className="absolute inset-0 border-4 border-slate-100 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-[#0088A8] border-t-transparent rounded-full animate-spin"></div>
        </div>
        <div className="mt-6 text-center">
          <p className="text-[10px] font-black text-[#1E2D44] uppercase tracking-widest animate-pulse">
            Processing Request
          </p>
          <p className="text-[8px] font-bold text-[#0088A8] uppercase tracking-[0.3em] mt-1">
            Please Wait
          </p>
        </div>
      </div>
    </div>
  )
}

export default Loader