import { Package } from 'lucide-react'
import React from 'react'

const DataTable = ({data,renderRow,tableHeader}) => {
  return (
    <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#008BA9] text-white">
              <tr className="text-left text-[10px] font-black uppercase tracking-widest">
                {tableHeader.map((header, i) => (
                  <th key={i} className={`py-5 px-${header === "Actions" ? "6" : "4"}`}>
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {data.length > 0 ? data.map((item, i) => (renderRow(item, i) )) : (
                <tr>
                  <td colSpan="8" className="py-20 text-center">
                    <div className="flex flex-col items-center opacity-20">
                      <Package size={48} />
                      <p className="mt-2 text-sm font-black uppercase">No assets found</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
  )
}

export default DataTable