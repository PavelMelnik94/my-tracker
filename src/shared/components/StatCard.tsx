import React from 'react';
import styles from './StatCard.module.scss';

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
  const colorClass = {
    primary: styles.iconPrimary,
    accent: styles.iconAccent,
    success: styles.iconSuccess,
    warning: styles.iconWarning,
  }[color];

  return (
    <div className={styles.statCard}>
      <div className={`${styles.iconWrapper} ${colorClass}`}>
        <span className={styles.icon}>{icon}</span>
      </div>
      <div className={styles.value}>
        {value}
      </div>
      <div className={styles.label}>
        {label}
      </div>
      {trend && trendValue && (
        <div className={`${styles.trend} ${
          trend === 'up' ? styles.trendUp : styles.trendDown
        }`}>
          {trend === 'up' ? '↗' : '↘'} {trendValue}
        </div>
      )}
    </div>
  );
};
