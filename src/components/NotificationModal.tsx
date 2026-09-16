import React from 'react';
import { X, Bell, DollarSign, Handshake, Flame, MessageSquare, CheckCheck } from 'lucide-react';
import type { AppNotification } from '../types';

interface NotificationModalProps {
  notifications: AppNotification[];
  onClose: () => void;
  onSelectNotification: (notif: AppNotification) => void;
  onMarkAllAsRead: () => void;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({
  notifications,
  onClose,
  onSelectNotification,
  onMarkAllAsRead,
}) => {
  const getIcon = (tipo: AppNotification['tipo']) => {
    switch (tipo) {
      case 'OFERTA':
        return <div className="notif-icon-box gold"><DollarSign size={18} /></div>;
      case 'TRATO':
        return <div className="notif-icon-box green"><Handshake size={18} /></div>;
      case 'PROMO':
        return <div className="notif-icon-box red"><Flame size={18} /></div>;
      default:
        return <div className="notif-icon-box blue"><MessageSquare size={18} /></div>;
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-sheet notifications-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header-simple">
          <div className="header-title-flex">
            <Bell size={20} className="text-red" />
            <h3>Notificaciones</h3>
          </div>
          <div className="header-actions-flex">
            <button type="button" className="text-btn" onClick={onMarkAllAsRead}>
              <CheckCheck size={14} /> Marcar leídas
            </button>
            <button type="button" className="circle-action-btn" onClick={onClose}>
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="notifications-list">
          {notifications.length === 0 ? (
            <div className="empty-notif-state">
              <Bell size={40} color="#94A3B8" />
              <p>No tienes notificaciones pendientes</p>
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                className={`notif-item ${notif.leido ? 'read' : 'unread'}`}
                onClick={() => {
                  onSelectNotification(notif);
                  onClose();
                }}
              >
                {getIcon(notif.tipo)}
                <div className="notif-content">
                  <div className="notif-title-row">
                    <strong>{notif.titulo}</strong>
                    <span className="notif-time">{notif.timestamp}</span>
                  </div>
                  <p className="notif-desc">{notif.detalle}</p>
                </div>
                {!notif.leido && <span className="unread-dot" />}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
