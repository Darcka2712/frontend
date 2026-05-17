import React from 'react';

const BarChart = ({ data, title, color = 'bg-blue-500' }) => {
  const maxValue = Math.max(0, ...data.map(d => d.value));

  return (
    <div className="bg-white p-6 rounded-[2rem] border border-gray-200 shadow-sm transition-all hover:shadow-md">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="space-y-3">
        {data.length > 0 ? data.map((item, idx) => (
          <div key={`${item.label}-${idx}`} className="flex items-center space-x-3">
            <div className="w-24 text-sm font-medium text-gray-600 truncate">{item.label}</div>
            <div className="flex-1">
              <div className="bg-gray-100 rounded-full h-3 overflow-hidden">
                <div
                  className={`h-3 rounded-full transition-all duration-1000 ease-out ${color}`}
                  style={{ width: maxValue > 0 ? `${(item.value / maxValue) * 100}%` : '0%' }}
                />
              </div>
            </div>
            <div className="w-12 text-sm font-bold text-gray-700 text-right">{item.value}</div>
          </div>
        )) : (
          <div className="text-sm text-slate-400 py-4 text-center">No hay datos suficientes</div>
        )}
      </div>
    </div>
  );
};

export default BarChart;
