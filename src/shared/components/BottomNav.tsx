import React from 'react';
import { Link, useLocation } from 'react-router-dom';

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
    <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-gray-200/50 safe-area-bottom z-50 shadow-lg">
      <div className="flex justify-around items-center h-20 max-w-4xl mx-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-all duration-300 relative group ${
                isActive ? 'text-primary-600' : 'text-gray-500 hover:text-primary-500'
              }`}
            >
              {isActive && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-gradient-primary rounded-full" />
              )}
              <span className={`text-2xl mb-1 transition-transform duration-300 ${
                isActive ? 'scale-110' : 'group-hover:scale-105'
              }`}>
                {item.icon}
              </span>
              <span className={`text-xs font-semibold transition-all duration-300 ${
                isActive ? 'text-primary-600' : ''
              }`}>
                {item.label}
              </span>
              {isActive && (
                <div className="absolute inset-0 bg-primary-50/50 rounded-2xl -z-10 scale-90" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
