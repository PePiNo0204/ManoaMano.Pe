import React, { useState } from 'react';
import { 
  Award, Star, CheckCircle2, Shield, Heart, 
  ShoppingBag, Store, Edit3, MapPin, Phone, Mail, 
  HelpCircle, LogOut, ChevronRight 
} from 'lucide-react';
import type { User as UserType, Listing, Deal, Review } from '../types';
import { ListingCard } from '../components/ListingCard';

interface ProfileViewProps {
  user: UserType;
  listings: Listing[];
  deals: Deal[];
  reviews: Review[];
  onSelectListing: (listing: Listing) => void;
  onToggleFavorito: (listingId: string, e: React.MouseEvent) => void;
  onUpdateUser: (updated: Partial<UserType>) => void;
  onOpenReviewModal: (deal: Deal) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  user,
  listings,
  deals,
  reviews,
  onSelectListing,
  onToggleFavorito,
  onUpdateUser,
  onOpenReviewModal,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'PUBLICACIONES' | 'TRATOS' | 'FAVORITOS' | 'REPUTACION' | 'CONFIG'>('PUBLICACIONES');
  const [sellerModeOpen, setSellerModeOpen] = useState(false);
  const [editNombreComercial, setEditNombreComercial] = useState(user.nombreComercial || '');
  const [editDescComercial, setEditDescComercial] = useState(user.descripcionComercial || '');
  const [editHorarios, setEditHorarios] = useState(user.horariosAtencion || 'Lun - Sáb: 8:00 AM - 7:00 PM');
  const [editDomicilio, setEditDomicilio] = useState(user.atiendeADomicilio || false);

  const myListings = listings.filter((l) => l.userId === user.id);
  const myFavorites = listings.filter((l) => l.isFavorito);

  const handleSaveSellerConfig = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({
      isSellerMode: true,
      nombreComercial: editNombreComercial,
      descripcionComercial: editDescComercial,
      horariosAtencion: editHorarios,
      atiendeADomicilio: editDomicilio,
    });
    setSellerModeOpen(false);
    alert('Configuración de Modo Vendedor actualizada con éxito.');
  };

  return (
    <div className="tab-view profile-view">
      {/* Profile Top Hero */}
      <div className="profile-hero-card">
        <div className="profile-hero-header">
          <div className="avatar-wrapper">
            <img src={user.avatarUrl} alt={user.nombreCompleto} className="profile-main-avatar" />
            {user.isVerified && <CheckCircle2 size={18} className="verified-badge-float" />}
          </div>

          <div className="profile-main-details">
            <div className="profile-name-row">
              <h3>{user.nombreCompleto}</h3>
            </div>
            
            {user.isSellerMode && user.nombreComercial && (
              <span className="business-name-tag">🏪 {user.nombreComercial}</span>
            )}

            <div className="profile-loc-time">
              <MapPin size={13} className="text-red" />
              <span>{user.ubicacion.ciudadZona} — {user.ubicacion.distrito}, {user.ubicacion.region}</span>
            </div>

            <span className="member-since">Miembro desde {user.fechaRegistro}</span>
          </div>
        </div>

        {/* Reputation Stats Strip */}
        <div className="reputation-summary-strip">
          <div className="rep-stat-col">
            <div className="rep-val-flex">
              <Star size={16} fill="#F5A623" color="#F5A623" />
              <strong>{user.ratingPromedio}</strong>
            </div>
            <span>Calificación</span>
          </div>
          <div className="rep-stat-divider" />
          <div className="rep-stat-col">
            <strong>{user.tratosCompletados}</strong>
            <span>Tratos Hechos</span>
          </div>
          <div className="rep-stat-divider" />
          <div className="rep-stat-col">
            <strong>{user.totalResenas}</strong>
            <span>Reseñas</span>
          </div>
        </div>

        {/* Seller Mode Banner & Toggle */}
        <div className="seller-mode-toggle-card">
          <div className="seller-mode-info">
            <Store size={20} color="#0B192C" />
            <div>
              <strong>🏪 Modo Vendedor / Proveedor</strong>
              <p>Tu cuenta única te permite comprar y vender simultáneamente.</p>
            </div>
          </div>
          <button
            type="button"
            className="btn-configure-seller"
            onClick={() => setSellerModeOpen(!sellerModeOpen)}
          >
            <Edit3 size={14} /> Configurar
          </button>
        </div>

        {/* Seller Mode Edit Form Drawer */}
        {sellerModeOpen && (
          <form onSubmit={handleSaveSellerConfig} className="seller-edit-form">
            <h4>Configurar tu Perfil de Vendedor en Bagua</h4>
            <div className="form-group">
              <label>Nombre Comercial / Negocio</label>
              <input
                type="text"
                className="input-field"
                value={editNombreComercial}
                onChange={(e) => setEditNombreComercial(e.target.value)}
                placeholder="Ej: Soluciones & Servicios Bagua"
              />
            </div>
            <div className="form-group">
              <label>Descripción de tus productos o servicios</label>
              <textarea
                className="input-field textarea-field"
                rows={2}
                value={editDescComercial}
                onChange={(e) => setEditDescComercial(e.target.value)}
              />
            </div>
            <div className="form-row-2">
              <div className="form-group">
                <label>Horario de Atención</label>
                <input
                  type="text"
                  className="input-field"
                  value={editHorarios}
                  onChange={(e) => setEditHorarios(e.target.value)}
                />
              </div>
              <div className="form-group checkbox-group" style={{ marginTop: 28 }}>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={editDomicilio}
                    onChange={(e) => setEditDomicilio(e.target.checked)}
                  />
                  <span>Atiendo a domicilio</span>
                </label>
              </div>
            </div>
            <button type="submit" className="btn-save-seller-mode">
              Guardar Cambios de Vendedor
            </button>
          </form>
        )}
      </div>

      {/* Profile Navigation Sub-tabs */}
      <div className="profile-sub-tabs">
        <button
          type="button"
          className={`sub-tab-btn ${activeSubTab === 'PUBLICACIONES' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('PUBLICACIONES')}
        >
          Mis Publicaciones ({myListings.length})
        </button>
        <button
          type="button"
          className={`sub-tab-btn ${activeSubTab === 'TRATOS' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('TRATOS')}
        >
          Mis Tratos ({deals.length})
        </button>
        <button
          type="button"
          className={`sub-tab-btn ${activeSubTab === 'FAVORITOS' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('FAVORITOS')}
        >
          ❤️ Favoritos ({myFavorites.length})
        </button>
        <button
          type="button"
          className={`sub-tab-btn ${activeSubTab === 'REPUTACION' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('REPUTACION')}
        >
          ⭐ Reputación
        </button>
        <button
          type="button"
          className={`sub-tab-btn ${activeSubTab === 'CONFIG' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('CONFIG')}
        >
          ⚙️ Ajustes
        </button>
      </div>

      {/* Sub-tab Content Area */}
      <div className="profile-tab-content">
        {/* Mis Publicaciones */}
        {activeSubTab === 'PUBLICACIONES' && (
          <div className="my-listings-subtab">
            {myListings.length === 0 ? (
              <div className="empty-subtab-box">
                <ShoppingBag size={40} color="#94A3B8" />
                <p>Aún no has creado publicaciones.</p>
              </div>
            ) : (
              <div className="listings-grid">
                {myListings.map((item) => (
                  <ListingCard
                    key={item.id}
                    listing={item}
                    onSelect={onSelectListing}
                    onToggleFavorito={onToggleFavorito}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Mis Tratos */}
        {activeSubTab === 'TRATOS' && (
          <div className="my-deals-subtab">
            {deals.map((deal) => (
              <div key={deal.id} className="deal-history-card">
                <img src={deal.listingFoto} alt={deal.listingTitulo} className="deal-card-thumb" />
                <div className="deal-card-body">
                  <div className="deal-title-row">
                    <strong>{deal.listingTitulo}</strong>
                    <span className={`deal-status-pill ${deal.estado.toLowerCase()}`}>
                      {deal.estado}
                    </span>
                  </div>
                  <p className="deal-parties">Con: {deal.vendedorNombre} • Acordado: S/ {deal.precioAcordado}</p>
                  <div className="deal-card-footer">
                    <span className="deal-date">{deal.fechaAcuerdo}</span>
                    {deal.estado === 'COMPLETADO' && !deal.isCalificadoPorComprador && (
                      <button
                        type="button"
                        className="btn-rate-mini"
                        onClick={() => onOpenReviewModal(deal)}
                      >
                        ⭐ Calificar Vendedor
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Favoritos */}
        {activeSubTab === 'FAVORITOS' && (
          <div className="my-favorites-subtab">
            {myFavorites.length === 0 ? (
              <div className="empty-subtab-box">
                <Heart size={40} color="#94A3B8" />
                <p>No tienes publicaciones guardadas en favoritos.</p>
              </div>
            ) : (
              <div className="listings-grid">
                {myFavorites.map((item) => (
                  <ListingCard
                    key={item.id}
                    listing={item}
                    onSelect={onSelectListing}
                    onToggleFavorito={onToggleFavorito}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Reputación y Reseñas */}
        {activeSubTab === 'REPUTACION' && (
          <div className="reputation-subtab">
            <div className="rep-overview-card">
              <div className="rep-big-score">
                <span className="big-num">{user.ratingPromedio}</span>
                <div className="big-stars">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} size={16} fill="#F5A623" color="#F5A623" />
                  ))}
                  <span>Basado en {user.totalResenas} tratos completados</span>
                </div>
              </div>
            </div>

            <h4>Insignias de Confianza Obtenidas</h4>
            <div className="badges-grid">
              <div className="badge-item-card">
                <Shield size={20} color="#10B981" />
                <div>
                  <strong>Identidad Verificada</strong>
                  <p>Documento y número de Bagua validado.</p>
                </div>
              </div>
              <div className="badge-item-card">
                <Award size={20} color="#F5A623" />
                <div>
                  <strong>Comprador y Vendedor Confiable</strong>
                  <p>100% de tratos cerrados positivamente.</p>
                </div>
              </div>
            </div>

            <h4>Reseñas Recibidas</h4>
            <div className="reviews-list">
              {reviews.map((rev) => (
                <div key={rev.id} className="review-item-card">
                  <div className="rev-header">
                    <img src={rev.autorAvatar} alt={rev.autorNombre} className="rev-avatar" />
                    <div>
                      <strong>{rev.autorNombre}</strong>
                      <div className="rev-stars">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star key={s} size={11} fill="#F5A623" color="#F5A623" />
                        ))}
                        <span className="rev-date">{rev.createdAt}</span>
                      </div>
                    </div>
                  </div>
                  <p className="rev-comment">"{rev.comentario}"</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Ajustes y Configuración */}
        {activeSubTab === 'CONFIG' && (
          <div className="settings-subtab">
            <div className="settings-group">
              <h4>Cuenta y Seguridad</h4>
              <div className="settings-item">
                <Phone size={18} />
                <div className="settings-item-text">
                  <strong>Teléfono vinculado</strong>
                  <span>{user.telefono}</span>
                </div>
                <ChevronRight size={16} />
              </div>
              <div className="settings-item">
                <Mail size={18} />
                <div className="settings-item-text">
                  <strong>Correo electrónico</strong>
                  <span>{user.email}</span>
                </div>
                <ChevronRight size={16} />
              </div>
            </div>

            <div className="settings-group">
              <h4>Ubicación Geográfica</h4>
              <div className="settings-item">
                <MapPin size={18} />
                <div className="settings-item-text">
                  <strong>Región y Provincia</strong>
                  <span>Bagua, Amazonas (Perú)</span>
                </div>
                <ChevronRight size={16} />
              </div>
            </div>

            <div className="settings-group">
              <h4>Soporte y Comunidad</h4>
              <div className="settings-item" onClick={() => alert('Soporte Mano a Mano.pe: contacto@manoamano.pe')}>
                <HelpCircle size={18} />
                <div className="settings-item-text">
                  <strong>Centro de Ayuda y Preguntas Frecuentes</strong>
                  <span>Guías para comprar, vender y hacer tratos</span>
                </div>
                <ChevronRight size={16} />
              </div>
            </div>

            <button
              type="button"
              className="btn-logout"
              onClick={() => alert('Sesión protegida en MANO A MANO.PE')}
            >
              <LogOut size={16} /> Cerrar Sesión
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
