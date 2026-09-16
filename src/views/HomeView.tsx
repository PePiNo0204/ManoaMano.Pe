import React from 'react';
import { 
  ShoppingBag, Wrench, Flame, ClipboardList, Store, 
  Sparkles, Handshake, ShieldCheck
} from 'lucide-react';
import type { Listing, ListingType } from '../types';
import { ListingCard } from '../components/ListingCard';

interface HomeViewProps {
  listings: Listing[];
  onSelectListing: (listing: Listing) => void;
  onToggleFavorito: (listingId: string, e: React.MouseEvent) => void;
  onSelectCategoryFilter: (categorySlug: string) => void;
  onSelectTypeFilter: (type: ListingType | 'NEGOCIO') => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  listings,
  onSelectListing,
  onToggleFavorito,
  onSelectTypeFilter,
}) => {
  const promos = listings.filter((l) => l.tipo === 'PROMOCION');
  const services = listings.filter((l) => l.tipo === 'SERVICIO');
  const products = listings.filter((l) => l.tipo === 'PRODUCTO');
  const needs = listings.filter((l) => l.tipo === 'NECESIDAD');

  return (
    <div className="tab-view home-view">
      {/* Hero Welcome Banner */}
      <div className="hero-banner">
        <div className="hero-content">
          <div className="hero-badge">
            <Handshake size={14} />
            <span>Marketplace Local Bagua & Perú</span>
          </div>
          <h2>Encuentra. Ofrece. Haz tu trato directo.</h2>
          <p>Compra, vende y contrata servicios con confianza y reputación real en tu ciudad.</p>
        </div>
      </div>

      {/* 5 Quick Main Categories */}
      <div className="quick-categories-section">
        <div className="section-header">
          <h3>Categorías Rápidas</h3>
        </div>
        <div className="quick-categories-row">
          <button
            type="button"
            className="quick-cat-btn"
            onClick={() => onSelectTypeFilter('PRODUCTO')}
          >
            <div className="quick-cat-icon blue">
              <ShoppingBag size={22} />
            </div>
            <span>Productos</span>
          </button>

          <button
            type="button"
            className="quick-cat-btn"
            onClick={() => onSelectTypeFilter('SERVICIO')}
          >
            <div className="quick-cat-icon green">
              <Wrench size={22} />
            </div>
            <span>Servicios</span>
          </button>

          <button
            type="button"
            className="quick-cat-btn"
            onClick={() => onSelectTypeFilter('PROMOCION')}
          >
            <div className="quick-cat-icon red">
              <Flame size={22} />
            </div>
            <span>Promos 🔥</span>
          </button>

          <button
            type="button"
            className="quick-cat-btn"
            onClick={() => onSelectTypeFilter('NECESIDAD')}
          >
            <div className="quick-cat-icon purple">
              <ClipboardList size={22} />
            </div>
            <span>Necesidades</span>
          </button>

          <button
            type="button"
            className="quick-cat-btn"
            onClick={() => onSelectTypeFilter('NEGOCIO')}
          >
            <div className="quick-cat-icon amber">
              <Store size={22} />
            </div>
            <span>Negocios</span>
          </button>
        </div>
      </div>

      {/* Promotions Highlight */}
      {promos.length > 0 && (
        <div className="feed-section">
          <div className="section-header">
            <div className="section-title-flex">
              <Flame size={20} color="#D91636" />
              <h3>Promociones y Ofertas del Día</h3>
            </div>
          </div>
          <div className="listings-grid">
            {promos.map((listing) => (
              <ListingCard
                key={listing.id}
                listing={listing}
                onSelect={onSelectListing}
                onToggleFavorito={onToggleFavorito}
              />
            ))}
          </div>
        </div>
      )}

      {/* Recommended Feed */}
      <div className="feed-section">
        <div className="section-header">
          <div className="section-title-flex">
            <Sparkles size={20} color="#F5A623" />
            <h3>Recomendado para ti en Bagua</h3>
          </div>
        </div>
        <div className="listings-grid">
          {products.slice(0, 4).map((listing) => (
            <ListingCard
              key={listing.id}
              listing={listing}
              onSelect={onSelectListing}
              onToggleFavorito={onToggleFavorito}
            />
          ))}
        </div>
      </div>

      {/* Services in Bagua */}
      <div className="feed-section">
        <div className="section-header">
          <div className="section-title-flex">
            <Wrench size={20} color="#10B981" />
            <h3>Servicios Populares y Técnicos</h3>
          </div>
        </div>
        <div className="listings-grid">
          {services.map((listing) => (
            <ListingCard
              key={listing.id}
              listing={listing}
              onSelect={onSelectListing}
              onToggleFavorito={onToggleFavorito}
            />
          ))}
        </div>
      </div>

      {/* Solicitudes de la comunidad */}
      {needs.length > 0 && (
        <div className="feed-section">
          <div className="section-header">
            <div className="section-title-flex">
              <ClipboardList size={20} color="#8B5CF6" />
              <h3>Necesidades Publicadas (Oportunidad de trabajo)</h3>
            </div>
          </div>
          <div className="listings-grid">
            {needs.map((listing) => (
              <ListingCard
                key={listing.id}
                listing={listing}
                onSelect={onSelectListing}
                onToggleFavorito={onToggleFavorito}
              />
            ))}
          </div>
        </div>
      )}

      {/* Trust & Guarantee Banner */}
      <div className="bagua-trust-card">
        <ShieldCheck size={32} color="#0B192C" />
        <div className="trust-text">
          <h4>Comercio Seguro en Amazonas</h4>
          <p>Toda compra o servicio en MANO A MANO.PE genera un trato protegido por reputación comunitaria.</p>
        </div>
      </div>
    </div>
  );
};
