import React from "react";
import { XCircle } from "lucide-react"; // red warning icon
import { useSelector } from "react-redux";

const HodInfoPage = () => {
  const { currentUser } = useSelector(state => state.auth);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="bg-black w-full max-w-md p-10 rounded-3xl shadow-2xl border-2 border-red-600 text-center animate-in fade-in duration-500">
        <div className="flex flex-col items-center gap-4">
          <XCircle className="text-red-600 w-16 h-16" />
          <h2 className="text-2xl font-black uppercase text-white tracking-wider">
            HOD Registration Status
          </h2>
          <p className="text-red-400 font-semibold mt-2 text-sm">
            {currentUser?.departmentName 
              ? `This department already has an active HOD (${currentUser.departmentName}). You are currently blocked.` 
              : "You are currently blocked. Wait for principal approval."}
          </p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-6 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-full shadow-lg uppercase tracking-wide transition-all"
          >
            Refresh
          </button>
        </div>
      </div>
    </div>
  );
};

export default HodInfoPage;