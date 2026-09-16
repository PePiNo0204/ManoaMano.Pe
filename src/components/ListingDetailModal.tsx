import React, { useState } from 'react';
import { 
  X, Heart, Share2, MapPin, CheckCircle2, Star, ShieldCheck, 
  MessageCircle, DollarSign, Clock, Truck, AlertTriangle 
} from 'lucide-react';
import type { Listing } from '../types';

interface ListingDetailModalProps {
  listing: Listing | null;
  onClose: () => void;
  onContactSeller: (listing: Listing) => void;
  onMakeOffer: (listing: Listing, offerAmount: number) => void;
  onViewSellerProfile: (sellerId: string) => void;
  onToggleFavorito: (listingId: string, e: React.MouseEvent) => void;
  onReport: (listing: Listing) => void;
}

export const ListingDetailModal: React.FC<ListingDetailModalProps> = ({
  listing,
  onClose,
  onContactSeller,
  onMakeOffer,
  onViewSellerProfile,
  onToggleFavorito,
  onReport,
}) => {
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const [showOfferInput, setShowOfferInput] = useState(false);
  const [customOffer, setCustomOffer] = useState<number>(0);

  if (!listing) return null;

  const handleStartOffer = () => {
    setCustomOffer(Math.round(listing.precio * 0.9));
    setShowOfferInput(true);
  };

  const handleConfirmOffer = () => {
    if (customOffer > 0) {
      onMakeOffer(listing, customOffer);
      setShowOfferInput(false);
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-sheet listing-detail-modal" onClick={(e) => e.stopPropagation()}>
        {/* Top Header Actions */}
        <div className="modal-floating-header">
          <button type="button" className="circle-action-btn" onClick={onClose}>
            <X size={20} />
          </button>
          <div className="modal-right-actions">
            <button 
              type="button" 
              className={`circle-action-btn ${listing.isFavorito ? 'active-fav' : ''}`}
              onClick={(e) => onToggleFavorito(listing.id, e)}
            >
              <Heart size={20} fill={listing.isFavorito ? '#D91636' : 'none'} color={listing.isFavorito ? '#D91636' : '#FFFFFF'} />
            </button>
            <button 
              type="button" 
              className="circle-action-btn"
              onClick={() => alert(`Enlace copiado: https://manoamano.pe/p/${listing.id}`)}
            >
              <Share2 size={20} />
            </button>
          </div>
        </div>

        {/* Image Gallery */}
        <div className="detail-gallery-container">
          <img
            src={listing.fotos[activePhotoIdx] || listing.fotos[0]}
            alt={listing.titulo}
            className="detail-main-img"
          />
          {listing.fotos.length > 1 && (
            <div className="gallery-thumbnails">
              {listing.fotos.map((img, idx) => (
                <button
                  key={img}
                  type="button"
                  className={`thumb-btn ${activePhotoIdx === idx ? 'active' : ''}`}
                  onClick={() => setActivePhotoIdx(idx)}
                >
                  <img src={img} alt={`Foto ${idx + 1}`} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Content Body */}
        <div className="detail-scrollable-body">
          {/* Tags & Price */}
          <div className="detail-header-info">
            <div className="detail-badges-row">
              <span className="badge-category">{listing.categoria}</span>
              {listing.condicion && listing.condicion !== 'NO_APLICA' && (
                <span className="badge-condition">
                  {listing.condicion.replace(/_/g, ' ')}
                </span>
              )}
              {listing.esNegociable && (
                <span className="badge-negotiable">🤝 Precio Negociable</span>
              )}
            </div>

            <div className="detail-price-box">
              <span className="detail-price">
                {listing.tipo === 'SERVICIO' ? 'Desde ' : ''}
                S/ {listing.precio.toLocaleString('es-PE')}
              </span>
              {listing.precioAnterior && (
                <span className="detail-old-price">S/ {listing.precioAnterior}</span>
              )}
            </div>

            <h1 className="detail-title">{listing.titulo}</h1>

            <div className="detail-location-row">
              <MapPin size={16} className="text-red" />
              <span>
                {listing.ubicacion.ciudadZona} — {listing.ubicacion.distrito}, {listing.ubicacion.provincia}, {listing.ubicacion.region}
              </span>
            </div>
          </div>

          {/* Service / Product Specific details */}
          {listing.tipo === 'SERVICIO' && (
            <div className="specs-card">
              <h4>Detalles del Servicio</h4>
              <div className="specs-grid">
                <div className="spec-item">
                  <Truck size={16} />
                  <span><strong>Modalidad:</strong> {listing.modalidad || 'A domicilio y taller'}</span>
                </div>
                <div className="spec-item">
                  <Clock size={16} />
                  <span><strong>Experiencia:</strong> {listing.experienciaAnos || 5}+ años</span>
                </div>
                <div className="spec-item full-width">
                  <MapPin size={16} />
                  <span><strong>Cobertura:</strong> {listing.zonaCobertura || 'Bagua y distritos cercanos'}</span>
                </div>
              </div>
            </div>
          )}

          {/* Description */}
          <div className="detail-section">
            <h3>Descripción</h3>
            <p className="detail-description">{listing.descripcion}</p>
          </div>

          {/* Seller Card */}
          <div className="seller-box" onClick={() => onViewSellerProfile(listing.vendedor.id)}>
            <div className="seller-box-left">
              <img src={listing.vendedor.avatarUrl} alt={listing.vendedor.nombre} className="seller-avatar-lg" />
              <div className="seller-text-info">
                <div className="seller-title-row">
                  <h4>{listing.vendedor.nombreComercial || listing.vendedor.nombre}</h4>
                  {listing.vendedor.isVerified && (
                    <CheckCircle2 size={16} className="verified-badge-icon" />
                  )}
                </div>
                <div className="seller-stats-sub">
                  <div className="rating-pill">
                    <Star size={13} fill="#F5A623" color="#F5A623" />
                    <span>{listing.vendedor.rating}</span>
                  </div>
                  <span className="dot">•</span>
                  <span>{listing.vendedor.resenasCount} reseñas</span>
                  <span className="dot">•</span>
                  <span className="time-resp">Resp. {listing.vendedor.tiempoRespuesta}</span>
                </div>
              </div>
            </div>
            <button type="button" className="view-seller-btn">
              Ver perfil
            </button>
          </div>

          {/* Guarantee / Safe Deal banner */}
          <div className="safe-deal-banner">
            <ShieldCheck size={24} className="safe-icon" />
            <div>
              <strong>Trato Directo y Seguro en Bagua</strong>
              <p>Acuerda tu precio por chat, revisa el producto y califica al vendedor tras completar el trato.</p>
            </div>
          </div>

          {/* Report Button */}
          <button type="button" className="report-link-btn" onClick={() => onReport(listing)}>
            <AlertTriangle size={14} /> Reportar publicación sospechosa
          </button>
        </div>

        {/* Sticky Action Footer */}
        <div className="detail-action-footer">
          {showOfferInput ? (
            <div className="offer-input-drawer">
              <div className="offer-input-header">
                <span>¿Cuánto ofreces pagar? (Publicado: S/ {listing.precio})</span>
                <button type="button" onClick={() => setShowOfferInput(false)}>✕</button>
              </div>
              <div className="offer-input-row">
                <div className="currency-symbol">S/</div>
                <input
                  type="number"
                  className="offer-number-input"
                  value={customOffer}
                  onChange={(e) => setCustomOffer(Number(e.target.value))}
                  min={1}
                />
                <button type="button" className="btn-confirm-offer" onClick={handleConfirmOffer}>
                  Enviar Oferta
                </button>
              </div>
            </div>
          ) : (
            <div className="footer-buttons-group">
              <button
                type="button"
                className="btn-action-contact"
                onClick={() => {
                  onContactSeller(listing);
                  onClose();
                }}
              >
                <MessageCircle size={18} />
                <span>Contactar</span>
              </button>

              <button
                type="button"
                className="btn-action-offer"
                onClick={handleStartOffer}
              >
                <DollarSign size={18} />
                <span>Hacer Oferta</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
