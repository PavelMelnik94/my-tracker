import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './BottomNav.module.scss';

interface NavItem {
  path: string;
  label: string;
  icon: string;
}

const navItems: NavItem[] = [
  { path: '/', label: 'Главная', icon: '🏠' },
  { path: '/meals', label: 'Питание', icon: '🍽️' },
  { path: '/supplements', label: 'Добавки', icon: '💊' },
  { path: '/analytics', label: 'Прогресс', icon: '📊' },
  { path: '/recipes', label: 'Рецепты', icon: '🥗' },
];

export const BottomNav: React.FC = () => {
  const location = useLocation();

  return (
    <nav className={styles.nav}>
      <div className={styles.container}>
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`${styles.navLink} ${
                isActive ? styles.navLinkActive : ''
              }`}
            >
              {isActive && (
                <div className={styles.activeIndicator} />
              )}
              <span className={styles.icon}>
                {item.icon}
              </span>
              <span className={styles.label}>
                {item.label}
              </span>
              {isActive && (
                <div className={styles.activeBackground} />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
