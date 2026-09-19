import React from 'react';

const ProgressBar = ({ progress = 0, size = 'md', showLabel = true, color = 'brand' }) => {
  const clamped = Math.min(100, Math.max(0, Math.round(progress)));

  const heightClasses = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4'
  };

  const bgClasses = {
    brand: 'bg-brand-600',
    emerald: 'bg-emerald-500',
    amber: 'bg-amber-500',
    accent: 'bg-accent-500'
  };

  const selectedBg = clamped === 100 ? 'bg-emerald-500' : bgClasses[color] || bgClasses.brand;

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between items-center mb-1 text-xs font-semibold text-slate-600">
          <span>Progress</span>
          <span className={clamped === 100 ? 'text-emerald-600' : 'text-slate-700'}>
            {clamped}% {clamped === 100 && '• Completed'}
          </span>
        </div>
      )}
      <div className={`w-full bg-slate-100 rounded-full overflow-hidden ${heightClasses[size] || heightClasses.md}`}>
        <div
          className={`${selectedBg} h-full rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
