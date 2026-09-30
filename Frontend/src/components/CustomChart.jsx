import React from 'react';

function CustomChart({ type = 'line', data = [], xKey = 'label', yKey = 'value', colors = ['#4f46e5'] }) {
  if (!data || data.length === 0) {
    return <div className="text-slate-400 py-6 text-center text-sm">No chart data available</div>;
  }

  // 1. Find the highest value in the data to establish a 100% scale
  const numericValues = data.map(item => Number(item[yKey]) || 0);
  const maxValue = Math.max(...numericValues, 1); // Avoid division by zero

  // ALTERNATIVE A: Vertical Columns (for Bar Charts)
  if (type === 'bar') {
    return (
      <div className="flex flex-col gap-5 w-full py-2">
        {/* The visual container aligning columns at the bottom */}
        <div className="flex items-end justify-around h-[180px] border-b border-slate-200 pb-2.5">
          {data.map((item, idx) => {
            const val = Number(item[yKey]) || 0;
            // Calculate percentage height of this column relative to the maximum value
            const heightPercent = (val / maxValue) * 100;

            return (
              <div 
                key={idx} 
                className="flex flex-col items-center w-[60px] h-full justify-end"
              >
                {/* Visual Bar Column */}
                <div 
                  style={{ height: `${heightPercent}%` }}
                  className="w-[30px] bg-indigo-600 hover:bg-indigo-500 rounded-t-lg transition-all duration-500 relative flex justify-center group cursor-pointer"
                >
                  {/* Value text above the column */}
                  <span className="absolute -top-6 text-xs text-slate-800 font-bold">
                    {val}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* X-Axis labels underneath the columns */}
        <div className="flex justify-around text-xs text-slate-500 font-medium">
          {data.map((item, idx) => (
            <span key={idx} className="w-[60px] text-center truncate">
              {item[xKey]}
            </span>
          ))}
        </div>
      </div>
    );
  }

  // ALTERNATIVE B: Horizontal Progress Bars (for Line/Time-series Charts)
  return (
    <div className="flex flex-col gap-4 w-full py-2">
      {data.map((item, idx) => {
        const val = Number(item[yKey]) || 0;
        // Calculate percentage width of the progress fill relative to the maximum value
        const widthPercent = (val / maxValue) * 100;

        return (
          <div key={idx} className="flex flex-col gap-1.5">
            {/* Label Row */}
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-500">{item[xKey]}</span>
              <span className="text-slate-800">₹{val.toLocaleString()}</span>
            </div>
            
            {/* Track Background */}
            <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
              {/* Dynamic Fill Bar */}
              <div 
                style={{ width: `${widthPercent}%` }}
                className="h-full bg-indigo-600 rounded-full transition-all duration-500" 
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default CustomChart;
