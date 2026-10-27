import React from 'react';
import { Home, Dumbbell, TrendingUp, Calendar, User } from 'lucide-react';
import { useGym } from '../../context/GymContext';

export const ClientBottomNav: React.FC = () => {
  const { activeTab, setActiveTab } = useGym();

  const navItems = [
    { id: 'dashboard', label: 'Inicio', icon: Home },
    { id: 'routine', label: 'Mi rutina', icon: Dumbbell },
    { id: 'progress', label: 'Progreso', icon: TrendingUp },
    { id: 'classes', label: 'Clases', icon: Calendar },
    { id: 'profile', label: 'Perfil', icon: User },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#101014]/95 border-t border-neutral-800 backdrop-blur-lg px-2 py-1 safe-area-pb">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-lg transition-all ${
                isActive
                  ? 'text-[#DC1F32]'
                  : 'text-neutral-400 hover:text-neutral-200 active:scale-95'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
              <span className={`text-[10px] mt-0.5 font-medium ${isActive ? 'font-bold' : ''}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
