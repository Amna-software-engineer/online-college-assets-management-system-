
import { Package, X } from 'lucide-react';
import React, { useState } from 'react'

const ViewDetailsModal = ({ isOpen, onClose, asset, assetDistribution }) => {
  if (!isOpen || !asset) return null;
  const { totalUnits, assignedUnits, availableUnits } = assetDistribution;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100">

        {/* Header */}
        <div className="bg-[#008BA9] p-8 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 hover:bg-white/10 rounded-full transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>

          <p className="text-[10px] font-semibold uppercase tracking-[0.25em] opacity-70">
            Asset Details
          </p>

          <h3 className="text-2xl font-bold mt-2 leading-tight">
            {asset.name}
          </h3>

          <p className="text-xs mt-2 opacity-80">
            ID: {asset._id.slice(-8).toUpperCase()}
          </p>
        </div>

        {/* Body */}
        <div className="p-8 space-y-8 max-h-[60vh] overflow-y-auto">

          {/* Basic Info */}
          {/* Basic Info */}
          <div className="space-y-6">

            {/* Category */}
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Category
              </p>
              <p className="text-sm font-semibold text-slate-800 mt-1">
                {asset.category}
              </p>
            </div>

            {/* Distribution Stats */}
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">
                Asset Distribution
              </p>

              <div className="grid grid-cols-3 gap-4 text-center">

                <div>
                  <p className="text-lg font-bold text-slate-800">
                    {totalUnits}
                  </p>
                  <p className="text-[10px] font-semibold uppercase text-slate-400 tracking-wider">
                    Total
                  </p>
                </div>

                <div>
                  <p className="text-lg font-bold text-cyan-600">
                    {assignedUnits}
                  </p>
                  <p className="text-[10px] font-semibold uppercase text-slate-400 tracking-wider">
                    Assigned
                  </p>
                </div>

                <div>
                  <p className="text-lg font-bold text-green-600">
                    {availableUnits}
                  </p>
                  <p className="text-[10px] font-semibold uppercase text-slate-400 tracking-wider">
                    Available
                  </p>
                </div>

              </div>
            </div>

          </div>

          {/* Timeline Section */}
          <div>
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-6">
              Activity Timeline
            </h4>

            {asset.history?.length > 0 ? (
              <div className="relative border-l-2 border-slate-200 pl-6 space-y-8">
                {asset.history.map((log, idx) => (
                  <div key={idx} className="relative">

                    {/* Dot */}
                    {/* Dot */}
                    <div
                      className={`absolute -left-[33px] top-1 w-4 h-4 rounded-full border-4 border-white shadow
                            ${log.action === "Initial Purchase"
                          ? "bg-purple-500"
                          : log.action === "Stock Updated"
                            ? "bg-cyan-500"
                            : log.action === "Transfer Out"
                              ? "bg-red-500"
                              : log.action === "Transfer In"
                                ? "bg-green-500"
                                : "bg-slate-400"
                        }`}
                    ></div>
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-semibold text-slate-800">
                          {log.action}
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                          {log.note}
                        </p>
                      </div>

                      <p className="text-xs text-slate-400 whitespace-nowrap ml-4">
                        {new Date(log.date).toLocaleDateString('en-GB', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </p>
                    </div>

                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-sm text-slate-400">
                  No activity history available
                </p>
              </div>
            )}
          </div>

        </div>

        {/* Footer */}
        <div className="p-6 bg-slate-50 flex justify-end border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-8 py-3 bg-slate-800 text-white text-xs font-semibold uppercase tracking-widest rounded-xl hover:bg-slate-900 transition-all active:scale-95"
          >
            Close Record
          </button>
        </div>

      </div>
    </div>
  );
};

export default ViewDetailsModal