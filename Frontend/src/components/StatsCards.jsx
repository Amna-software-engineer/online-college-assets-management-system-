import React from 'react'

const StatsCards = ({ stats }) => {
  return (
   <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-50 flex flex-col items-center text-center group hover:shadow-md transition-all">
                        <div className={`${stat.bg} p-3 rounded-2xl mb-4 group-hover:scale-110 transition-transform`}>
                            {stat.icon}
                        </div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                        <h3 className="text-xl font-black text-slate-800 italic uppercase">{stat.value}</h3>
                    </div>
                ))}
            </div>
  )
}

export default StatsCards