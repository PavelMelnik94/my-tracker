import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, UtensilsCrossed, Pill, Heart, BookOpen, BarChart3 } from 'lucide-react';
import { cn } from '../../shared/lib/utils';

const navItems = [
  { path: '/', icon: Home, label: 'Главная' },
  { path: '/meals', icon: UtensilsCrossed, label: 'Питание' },
  { path: '/supplements', icon: Pill, label: 'Добавки' },
  { path: '/wellbeing', icon: Heart, label: 'Здоровье' },
  { path: '/recipes', icon: BookOpen, label: 'Рецепты' },
  { path: '/analytics', icon: BarChart3, label: 'Аналитика' },
];

export const BottomNav: React.FC = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50 safe-area-bottom backdrop-blur-xl">
      <div className="grid grid-cols-6 h-16">
        {navItems.map(({ path, icon: Icon, label }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              cn(
                "flex flex-col items-center justify-center gap-1 text-xs transition-colors",
                isActive
                  ? "text-primary font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              )
            }
          >
            <Icon className="w-5 h-5" />
            <span className="text-[10px]">{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};
