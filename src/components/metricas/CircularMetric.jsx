import React from 'react';

const CircularMetric = ({ value, max = 100, label, color = 'text-blue-600', bgColor = 'bg-blue-100' }) => {
  const percentage = max > 0 ? Math.min((value / max) * 100, 100) : 0;
  const circumference = 2 * Math.PI * 45;
  const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`;

  const getStrokeColor = (colorClass) => {
    const colorMap = {
      'text-blue-600': '#2563eb',
      'text-green-600': '#059669',
      'text-purple-600': '#7c3aed',
      'text-orange-600': '#ea580c'
    };
    return colorMap[colorClass] || '#2563eb';
  };

  return (
    <div className="bg-white p-6 rounded-[2rem] border border-gray-200 shadow-sm hover:shadow-md transition-all flex flex-col items-center justify-center">
      <div className="relative w-24 h-24 mb-4">
        <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="#f1f5f9"
            strokeWidth="8"
            fill="none"
          />
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke={getStrokeColor(color)}
            strokeWidth="8"
            fill="none"
            strokeDasharray={strokeDasharray}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-2xl font-black tracking-tighter ${color}`}>
            {Math.round(percentage)}%
          </span>
        </div>
      </div>
      <h3 className="text-sm font-bold text-gray-800 text-center uppercase tracking-wider">{label}</h3>
      <p className="text-xs font-semibold text-slate-400 text-center mt-1">
        {value} de {max}
      </p>
    </div>
  );
};

export default CircularMetric;
