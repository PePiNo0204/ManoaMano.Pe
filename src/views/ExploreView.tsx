import React, { useState } from 'react';
import { Map, List, MapPin, Sparkles, Navigation } from 'lucide-react';
import type { Listing, ListingType } from '../types';
import { ListingCard } from '../components/ListingCard';
import { INITIAL_CATEGORIES } from '../data/initialData';

interface ExploreViewProps {
  listings: Listing[];
  onSelectListing: (listing: Listing) => void;
  onToggleFavorito: (listingId: string, e: React.MouseEvent) => void;
  initialTypeFilter?: ListingType | 'NEGOCIO' | null;
}

export const ExploreView: React.FC<ExploreViewProps> = ({
  listings,
  onSelectListing,
  onToggleFavorito,
  initialTypeFilter,
}) => {
  const [viewMode, setViewMode] = useState<'LISTA' | 'MAPA'>('LISTA');
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [selectedType, setSelectedType] = useState<string>(initialTypeFilter || 'TODOS');
  const [onlyNegotiable, setOnlyNegotiable] = useState(false);
  const [selectedPin, setSelectedPin] = useState<Listing | null>(null);
  const [sortBy, setSortBy] = useState<'RECIENTE' | 'MENOR_PRECIO' | 'MAYOR_PRECIO' | 'RATING'>('RECIENTE');

  // Filter listings
  const filteredListings = listings.filter((item) => {
    if (selectedCategory !== 'todos' && item.categoriaSlug !== selectedCategory) return false;
    if (selectedType !== 'TODOS' && selectedType !== 'NEGOCIO' && item.tipo !== selectedType) return false;
    if (onlyNegotiable && !item.esNegociable) return false;
    return true;
  }).sort((a, b) => {
    if (sortBy === 'MENOR_PRECIO') return a.precio - b.precio;
    if (sortBy === 'MAYOR_PRECIO') return b.precio - a.precio;
    if (sortBy === 'RATING') return b.vendedor.rating - a.vendedor.rating;
    return 0; // Default RECIENTE
  });

  return (
    <div className="tab-view explore-view">
      {/* Category Pills Bar */}
      <div className="categories-scroll-bar">
        {INITIAL_CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.slug;
          return (
            <button
              key={cat.id}
              type="button"
              className={`category-chip ${isSelected ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat.slug)}
            >
              {cat.nombre}
            </button>
          );
        })}
      </div>

      {/* Near You / Sub-header bar with Lista ↔ Mapa toggle */}
      <div className="explore-control-strip">
        <div className="near-you-title">
          <MapPin size={16} className="text-red" />
          <span>Cerca de ti en <strong>Bagua</strong> ({filteredListings.length} encontrados)</span>
        </div>

        <div className="view-toggle-container">
          <button
            type="button"
            className={`toggle-btn ${viewMode === 'LISTA' ? 'active' : ''}`}
            onClick={() => setViewMode('LISTA')}
          >
            <List size={15} />
            <span>Lista</span>
          </button>
          <button
            type="button"
            className={`toggle-btn ${viewMode === 'MAPA' ? 'active' : ''}`}
            onClick={() => setViewMode('MAPA')}
          >
            <Map size={15} />
            <span>Mapa</span>
          </button>
        </div>
      </div>

      {/* Filters & Sorting strip */}
      <div className="filters-strip">
        <div className="filter-chips-row">
          <button
            type="button"
            className={`filter-badge ${selectedType === 'TODOS' ? 'active' : ''}`}
            onClick={() => setSelectedType('TODOS')}
          >
            Todos
          </button>
          <button
            type="button"
            className={`filter-badge ${selectedType === 'PRODUCTO' ? 'active' : ''}`}
            onClick={() => setSelectedType('PRODUCTO')}
          >
            🛒 Productos
          </button>
          <button
            type="button"
            className={`filter-badge ${selectedType === 'SERVICIO' ? 'active' : ''}`}
            onClick={() => setSelectedType('SERVICIO')}
          >
            🔧 Servicios
          </button>
          <button
            type="button"
            className={`filter-badge ${selectedType === 'PROMOCION' ? 'active' : ''}`}
            onClick={() => setSelectedType('PROMOCION')}
          >
            🔥 Promociones
          </button>
          <button
            type="button"
            className={`filter-badge ${onlyNegotiable ? 'active' : ''}`}
            onClick={() => setOnlyNegotiable(!onlyNegotiable)}
          >
            🤝 Solo Negociables
          </button>
        </div>

        <div className="sort-dropdown-container">
          <select
            className="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
          >
            <option value="RECIENTE">Más recientes</option>
            <option value="MENOR_PRECIO">Menor precio</option>
            <option value="MAYOR_PRECIO">Mayor precio</option>
            <option value="RATING">Mejor calificados</option>
          </select>
        </div>
      </div>

      {/* Content depending on Lista vs Mapa */}
      {viewMode === 'LISTA' ? (
        <div className="explore-list-container">
          {filteredListings.length === 0 ? (
            <div className="empty-results-box">
              <Sparkles size={40} color="#94A3B8" />
              <h4>No se encontraron publicaciones con estos filtros</h4>
              <p>Prueba seleccionando otra categoría o cambiando los filtros.</p>
              <button
                type="button"
                className="btn-reset-filters"
                onClick={() => {
                  setSelectedCategory('todos');
                  setSelectedType('TODOS');
                  setOnlyNegotiable(false);
                }}
              >
                Restablecer Filtros
              </button>
            </div>
          ) : (
            <div className="listings-grid">
              {filteredListings.map((item) => (
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
      ) : (
        /* Interactive Map View for Bagua */
        <div className="bagua-interactive-map-container">
          <div className="map-canvas">
            {/* Map background styling representing Bagua grid */}
            <div className="map-grid-layer" />
            <div className="map-river-shape" title="Río Utcubamba / Río Marañón" />
            
            {/* Bagua Central Area Indicator */}
            <div className="map-center-label">
              <span>📍 Plaza de Armas de Bagua</span>
            </div>

            {/* Interactive Pins */}
            {filteredListings.map((item, idx) => {
              const offsets = [
                { top: '35%', left: '42%' },
                { top: '55%', left: '60%' },
                { top: '48%', left: '30%' },
                { top: '68%', left: '45%' },
                { top: '22%', left: '68%' },
                { top: '78%', left: '52%' },
              ];
              const pos = offsets[idx % offsets.length];
              const isSelected = selectedPin?.id === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  style={{ top: pos.top, left: pos.left }}
                  className={`map-pin-btn ${isSelected ? 'selected' : ''} ${item.tipo.toLowerCase()}`}
                  onClick={() => setSelectedPin(item)}
                >
                  <div className="pin-bubble">
                    <span className="pin-price">S/ {item.precio}</span>
                  </div>
                  <div className="pin-arrow" />
                </button>
              );
            })}

            <div className="map-floating-hint">
              <Navigation size={14} />
              <span>Toca un pin para ver el negocio o publicación en Bagua</span>
            </div>
          </div>

          {/* Floating Card for selected Pin */}
          {selectedPin && (
            <div className="map-floating-detail-card" onClick={() => onSelectListing(selectedPin)}>
              <button
                type="button"
                className="close-pin-card-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedPin(null);
                }}
              >
                ✕
              </button>
              <img src={selectedPin.fotos[0]} alt={selectedPin.titulo} className="pin-card-thumb" />
              <div className="pin-card-info">
                <span className="pin-card-cat">{selectedPin.categoria}</span>
                <h4 className="pin-card-title">{selectedPin.titulo}</h4>
                <div className="pin-card-footer">
                  <span className="pin-card-price">S/ {selectedPin.precio}</span>
                  <span className="pin-card-action">Ver anuncio →</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
