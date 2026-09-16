import React from 'react';
import { MapPin, Bell, Search, Handshake } from 'lucide-react';
import type { LocationInfo } from '../types';

interface NavbarProps {
  currentLocation: LocationInfo;
  unreadNotificationsCount: number;
  onOpenNotifications: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSelectLocation?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentLocation,
  unreadNotificationsCount,
  onOpenNotifications,
  searchQuery,
  onSearchChange,
}) => {
  return (
    <header className="app-header">
      <div className="header-top">
        {/* Brand Logo */}
        <div className="brand-container">
          <div className="brand-logo-icon">
            <Handshake size={22} color="#FFFFFF" />
          </div>
          <div className="brand-text">
            <div className="brand-title">
              <span>MANO A MANO</span>
              <span className="brand-pe-badge">.PE</span>
            </div>
            <span className="brand-slogan">Encuentra. Ofrece. Haz tu trato.</span>
          </div>
        </div>

        {/* Location & Notification actions */}
        <div className="header-actions">
          <div className="location-pill" title="Ubicación actual">
            <MapPin size={14} className="location-pin-icon" />
            <span className="location-text">
              {currentLocation.distrito}, {currentLocation.region}
            </span>
          </div>

          <button
            type="button"
            className="icon-btn notification-btn"
            onClick={onOpenNotifications}
            aria-label="Notificaciones"
          >
            <Bell size={20} />
            {unreadNotificationsCount > 0 && (
              <span className="badge-counter">{unreadNotificationsCount}</span>
            )}
          </button>
        </div>
      </div>

      {/* Global Search Bar */}
      <div className="search-bar-container">
        <Search size={18} className="search-icon" />
        <input
          type="text"
          className="search-input"
          placeholder="¿Qué estás buscando? (Celular, Técnico, Comida...)"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        {searchQuery && (
          <button
            type="button"
            className="clear-search-btn"
            onClick={() => onSearchChange('')}
          >
            ✕
          </button>
        )}
      </div>
    </header>
  );
};
