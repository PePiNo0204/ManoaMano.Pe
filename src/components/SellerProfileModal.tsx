import React from 'react';
import { X, Star, CheckCircle2, Award, Clock, MapPin, MessageSquare, Shield, Truck } from 'lucide-react';
import type { Listing, Review } from '../types';

interface SellerProfileModalProps {
  sellerId: string | null;
  listings: Listing[];
  reviews: Review[];
  onClose: () => void;
  onSelectListing: (listing: Listing) => void;
  onContactSeller: (sellerName: string, sellerId: string) => void;
}

export const SellerProfileModal: React.FC<SellerProfileModalProps> = ({
  sellerId,
  listings,
  reviews,
  onClose,
  onSelectListing,
  onContactSeller,
}) => {
  if (!sellerId) return null;

  // Find seller data from listings or defaults
  const sampleListing = listings.find((l) => l.vendedor.id === sellerId);
  const sellerName = sampleListing?.vendedor.nombreComercial || sampleListing?.vendedor.nombre || 'Vendedor Destacado';
  const sellerListings = listings.filter((l) => l.vendedor.id === sellerId);
  const sellerReviews = reviews.filter((r) => r.destinatarioId === sellerId);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-sheet seller-profile-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header bar */}
        <div className="profile-modal-header">
          <button type="button" className="circle-action-btn" onClick={onClose}>
            <X size={20} />
          </button>
          <h2>Perfil del Vendedor</h2>
          <div style={{ width: 40 }} />
        </div>

        <div className="seller-profile-content">
          {/* Avatar and name */}
          <div className="seller-hero-box">
            <img
              src={sampleListing?.vendedor.avatarUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80'}
              alt={sellerName}
              className="seller-big-avatar"
            />
            <div className="seller-main-title">
              <h3>{sellerName}</h3>
              <div className="verified-tag">
                <CheckCircle2 size={14} color="#10B981" />
                <span>Identidad Verificada en Bagua</span>
              </div>
            </div>

            {/* Badges */}
            <div className="seller-badges-cluster">
              <span className="badge-pill gold"><Award size={13} /> Vendedor Destacado</span>
              <span className="badge-pill green"><Shield size={13} /> Trato Seguro</span>
            </div>

            {/* Stats row */}
            <div className="seller-stats-strip">
              <div className="stat-box">
                <span className="stat-num">{sampleListing?.vendedor.rating || '4.9'} ⭐</span>
                <span className="stat-label">Calificación</span>
              </div>
              <div className="stat-divider" />
              <div className="stat-box">
                <span className="stat-num">{sampleListing?.vendedor.resenasCount || 24}</span>
                <span className="stat-label">Tratos Realizados</span>
              </div>
              <div className="stat-divider" />
              <div className="stat-box">
                <span className="stat-num">{sampleListing?.vendedor.tiempoRespuesta || '~10 min'}</span>
                <span className="stat-label">Respuesta</span>
              </div>
            </div>
          </div>

          {/* Business & Service Info */}
          <div className="seller-meta-card">
            <h4>Información de Atención</h4>
            <div className="meta-item">
              <MapPin size={16} className="text-red" />
              <span>Bagua, Amazonas (Atención en todo el valle y Utcubamba)</span>
            </div>
            <div className="meta-item">
              <Clock size={16} />
              <span>Lun a Sáb: 8:00 AM - 7:00 PM</span>
            </div>
            <div className="meta-item">
              <Truck size={16} />
              <span>Atención a domicilio y envíos coordinados</span>
            </div>
          </div>

          {/* Active Listings */}
          <div className="seller-listings-section">
            <h4>Publicaciones Activas ({sellerListings.length})</h4>
            <div className="seller-listings-grid">
              {sellerListings.map((item) => (
                <div key={item.id} className="mini-listing-card" onClick={() => onSelectListing(item)}>
                  <img src={item.fotos[0]} alt={item.titulo} />
                  <div className="mini-info">
                    <span className="mini-price">S/ {item.precio}</span>
                    <p className="mini-title">{item.titulo}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Reviews list */}
          <div className="seller-reviews-section">
            <h4>Reseñas de Compradores ({sellerReviews.length > 0 ? sellerReviews.length : 1})</h4>
            <div className="review-cards-list">
              {(sellerReviews.length > 0 ? sellerReviews : [
                {
                  id: 'rev_sample',
                  dealId: 'deal_demo',
                  autorId: 'u1',
                  autorNombre: 'Carlos Pinedo',
                  autorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
                  destinatarioId: sellerId,
                  puntuacionGeneral: 5,
                  calidad: 5,
                  atencion: 5,
                  cumplimiento: 5,
                  comentario: 'Trato 100% recomendado. Muy formal, puntual en la entrega y producto exactamente como en las fotos.',
                  createdAt: 'Hace 3 días',
                }
              ]).map((rev) => (
                <div key={rev.id} className="review-item-card">
                  <div className="rev-header">
                    <img src={rev.autorAvatar} alt={rev.autorNombre} className="rev-avatar" />
                    <div>
                      <strong>{rev.autorNombre}</strong>
                      <div className="rev-stars">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star key={s} size={12} fill="#F5A623" color="#F5A623" />
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
        </div>

        {/* Bottom CTA */}
        <div className="detail-action-footer">
          <button
            type="button"
            className="btn-action-contact full-width-btn"
            onClick={() => {
              onContactSeller(sellerName, sellerId);
              onClose();
            }}
          >
            <MessageSquare size={18} />
            <span>Contactar a {sellerName}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
