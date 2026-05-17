import React from 'react';

const TimelineMetrics = ({ data, title }) => {
  const maxValue = Math.max(0, ...data.map(d => d.value));

  return (
    <div className="bg-white p-6 rounded-[2rem] border border-gray-200 shadow-sm transition-all hover:shadow-md">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="space-y-1">
        {data.length > 0 ? data.map((item, idx) => (
          <div key={`${item.date}-${idx}`} className="flex items-center space-x-3 py-2 border-b border-slate-50 last:border-b-0">
            <span className="text-xs font-medium text-slate-500 w-24 truncate">{item.date}</span>
            <div className="flex-1 flex items-center space-x-3">
              <div className="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-indigo-500 h-2 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: maxValue > 0 ? `${(item.value / maxValue) * 100}%` : '0%' }}
                />
              </div>
              <span className="text-sm font-bold text-indigo-700 w-10 text-right">
                {item.value}
              </span>
            </div>
          </div>
        )) : (
          <div className="text-sm text-slate-400 py-4 text-center">Sin actividad registrada</div>
        )}
      </div>
    </div>
  );
};

export default TimelineMetrics;
