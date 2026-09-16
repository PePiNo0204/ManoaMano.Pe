import React from 'react';
import { Heart, Star, MapPin, CheckCircle2, Flame, HandCoins } from 'lucide-react';
import type { Listing } from '../types';

interface ListingCardProps {
  listing: Listing;
  onSelect: (listing: Listing) => void;
  onToggleFavorito: (listingId: string, e: React.MouseEvent) => void;
}

export const ListingCard: React.FC<ListingCardProps> = ({
  listing,
  onSelect,
  onToggleFavorito,
}) => {
  const getTypeBadge = () => {
    switch (listing.tipo) {
      case 'PROMOCION':
        return (
          <span className="type-badge promo">
            <Flame size={12} /> {listing.descuentoPorcentaje ? `-${listing.descuentoPorcentaje}% OFERTA` : 'OFERTA'}
          </span>
        );
      case 'SERVICIO':
        return <span className="type-badge service">🔧 SERVICIO</span>;
      case 'NECESIDAD':
        return <span className="type-badge need">📋 SE BUSCA</span>;
      default:
        return <span className="type-badge product">🛒 PRODUCTO</span>;
    }
  };

  return (
    <div className="listing-card" onClick={() => onSelect(listing)}>
      {/* Image container */}
      <div className="listing-image-container">
        <img
          src={listing.fotos[0] || 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=400&q=80'}
          alt={listing.titulo}
          className="listing-image"
          loading="lazy"
        />
        
        {/* Floating Badges */}
        <div className="card-top-badges">
          {getTypeBadge()}
          <button
            type="button"
            className={`favorite-btn ${listing.isFavorito ? 'active' : ''}`}
            onClick={(e) => onToggleFavorito(listing.id, e)}
            aria-label="Guardar favorito"
          >
            <Heart size={16} fill={listing.isFavorito ? '#D91636' : 'none'} color={listing.isFavorito ? '#D91636' : '#FFFFFF'} />
          </button>
        </div>

        {listing.esNegociable && (
          <div className="negotiable-pill">
            <HandCoins size={12} />
            <span>Negociable</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="listing-card-body">
        <div className="card-pricing">
          <span className="current-price">
            {listing.tipo === 'SERVICIO' ? 'Desde ' : ''}
            S/ {listing.precio.toLocaleString('es-PE')}
          </span>
          {listing.precioAnterior && (
            <span className="original-price">S/ {listing.precioAnterior}</span>
          )}
        </div>

        <h3 className="card-title">{listing.titulo}</h3>

        <div className="card-location">
          <MapPin size={12} />
          <span>{listing.ubicacion.ciudadZona || `${listing.ubicacion.distrito}, ${listing.ubicacion.region}`}</span>
        </div>

        {/* Seller snippet */}
        <div className="card-seller-row">
          <div className="seller-meta">
            <span className="seller-name">{listing.vendedor.nombreComercial || listing.vendedor.nombre}</span>
            {listing.vendedor.isVerified && (
              <CheckCircle2 size={13} className="verified-badge-icon" />
            )}
          </div>
          <div className="seller-rating">
            <Star size={12} fill="#F5A623" color="#F5A623" />
            <span>{listing.vendedor.rating}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
