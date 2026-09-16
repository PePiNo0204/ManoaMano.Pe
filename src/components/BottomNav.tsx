import React from 'react';
import { Home, Compass, PlusCircle, MessageSquare, User } from 'lucide-react';

export type TabType = 'INICIO' | 'EXPLORAR' | 'PUBLICAR' | 'MENSAJES' | 'PERFIL';

interface BottomNavProps {
  activeTab: TabType;
  onChangeTab: (tab: TabType) => void;
  unreadMessagesCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onChangeTab,
  unreadMessagesCount,
}) => {
  const navItems = [
    { id: 'INICIO' as TabType, label: 'Inicio', icon: Home },
    { id: 'EXPLORAR' as TabType, label: 'Explorar', icon: Compass },
    { id: 'PUBLICAR' as TabType, label: 'Publicar', icon: PlusCircle, isHighlight: true },
    { id: 'MENSAJES' as TabType, label: 'Mensajes', icon: MessageSquare, badge: unreadMessagesCount },
    { id: 'PERFIL' as TabType, label: 'Perfil', icon: User },
  ];

  return (
    <nav className="bottom-nav">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        
        if (item.isHighlight) {
          return (
            <button
              key={item.id}
              type="button"
              className={`nav-tab-publish ${isActive ? 'active' : ''}`}
              onClick={() => onChangeTab(item.id)}
              aria-label="Publicar anuncio"
            >
              <div className="publish-circle">
                <Icon size={28} color="#FFFFFF" strokeWidth={2.4} />
              </div>
              <span className="publish-label">{item.label}</span>
            </button>
          );
        }

        return (
          <button
            key={item.id}
            type="button"
            className={`nav-tab-item ${isActive ? 'active' : ''}`}
            onClick={() => onChangeTab(item.id)}
          >
            <div className="nav-icon-wrapper">
              <Icon size={22} strokeWidth={isActive ? 2.5 : 1.8} />
              {item.badge !== undefined && item.badge > 0 && (
                <span className="nav-badge">{item.badge}</span>
              )}
            </div>
            <span className="nav-label">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
