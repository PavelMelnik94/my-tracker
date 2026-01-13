import React from 'react';

interface StatCardProps {
  icon: string;
  value: string | number;
  label: string;
  color?: 'primary' | 'accent' | 'success' | 'warning';
  trend?: 'up' | 'down';
  trendValue?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  icon,
  value,
  label,
  color = 'primary',
  trend,
  trendValue,
}) => {
  const colorClasses = {
    primary: 'from-primary-500 to-primary-600',
    accent: 'from-accent-500 to-accent-600',
    success: 'from-green-500 to-emerald-600',
    warning: 'from-amber-500 to-orange-600',
  };

  return (
    <div className="stat-card group">
      <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br ${colorClasses[color]} shadow-lg mb-3 group-hover:scale-110 transition-transform duration-300`}>
        <span className="text-3xl">{icon}</span>
      </div>
      <div className="text-3xl font-bold text-gray-800 mb-1 gradient-text">
        {value}
      </div>
      <div className="text-sm text-gray-600 font-medium">
        {label}
      </div>
      {trend && trendValue && (
        <div className={`text-xs mt-2 font-semibold ${
          trend === 'up' ? 'text-green-600' : 'text-red-600'
        }`}>
          {trend === 'up' ? '↗' : '↘'} {trendValue}
        </div>
      )}
    </div>
  );
};
