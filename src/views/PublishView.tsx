import React, { useState } from 'react';
import { 
  ShoppingBag, Wrench, Flame, ClipboardList, Camera, 
  CheckCircle2, ArrowRight, ArrowLeft, MapPin, Sparkles 
} from 'lucide-react';
import type { Listing, ListingType, ItemCondition, ServiceModality } from '../types';
import { CURRENT_USER } from '../data/initialData';

interface PublishViewProps {
  onListingCreated: (newListing: Listing) => void;
  onCancel: () => void;
}

export const PublishView: React.FC<PublishViewProps> = ({
  onListingCreated,
  onCancel,
}) => {
  const [selectedType, setSelectedType] = useState<ListingType | null>(null);
  const [step, setStep] = useState<'SELECT_TYPE' | 'FORM' | 'REVIEW' | 'SUCCESS'>('SELECT_TYPE');

  // Form states
  const [titulo, setTitulo] = useState('');
  const [categoria, setCategoria] = useState('Tecnología');
  const [categoriaSlug, setCategoriaSlug] = useState('tecnologia');
  const [descripcion, setDescripcion] = useState('');
  const [precio, setPrecio] = useState<string>('');
  const [precioAnterior, setPrecioAnterior] = useState<string>('');
  const [esNegociable, setEsNegociable] = useState(true);
  const [fotos, setFotos] = useState<string[]>([
    'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=800&q=80'
  ]);
  const [condicion, setCondicion] = useState<ItemCondition>('NUEVO');
  const [modalidad, setModalidad] = useState<ServiceModality>('AMBOS');
  const [experiencia, setExperiencia] = useState('3');
  const [zonaAtencion] = useState('Bagua, Amazonas y distritos cercanos');
  const [ciudadZona, setCiudadZona] = useState('Bagua Centro');

  const handleSelectType = (type: ListingType) => {
    setSelectedType(type);
    setStep('FORM');
    if (type === 'SERVICIO') {
      setCategoria('Servicios');
      setCategoriaSlug('servicios');
    } else if (type === 'PROMOCION') {
      setCategoria('Gastronomía');
      setCategoriaSlug('gastronomia');
    } else if (type === 'NECESIDAD') {
      setCategoria('Construcción');
      setCategoriaSlug('construccion');
    }
  };

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titulo.trim() || !precio) {
      alert('Por favor completa el título y el precio.');
      return;
    }

    const newListing: Listing = {
      id: `list_${Date.now()}`,
      userId: CURRENT_USER.id,
      vendedor: {
        id: CURRENT_USER.id,
        nombre: CURRENT_USER.nombreCompleto,
        nombreComercial: CURRENT_USER.nombreComercial,
        avatarUrl: CURRENT_USER.avatarUrl,
        rating: CURRENT_USER.ratingPromedio,
        resenasCount: CURRENT_USER.totalResenas,
        isVerified: CURRENT_USER.isVerified,
        insignias: CURRENT_USER.insignias,
        tiempoRespuesta: CURRENT_USER.tiempoRespuesta,
      },
      tipo: selectedType || 'PRODUCTO',
      titulo: titulo.trim(),
      descripcion: descripcion.trim() || 'Publicación realizada en Mano a Mano.pe Bagua.',
      categoria,
      categoriaSlug,
      precio: Number(precio),
      precioAnterior: precioAnterior ? Number(precioAnterior) : undefined,
      descuentoPorcentaje: precioAnterior && Number(precioAnterior) > Number(precio)
        ? Math.round(((Number(precioAnterior) - Number(precio)) / Number(precioAnterior)) * 100)
        : undefined,
      esNegociable,
      fotos,
      ubicacion: {
        pais: 'Perú',
        region: 'Amazonas',
        provincia: 'Bagua',
        distrito: 'Bagua',
        ciudadZona,
        lat: -5.6372,
        lng: -78.5311,
      },
      condicion: selectedType === 'PRODUCTO' ? condicion : 'NO_APLICA',
      modalidad: selectedType === 'SERVICIO' ? modalidad : undefined,
      zonaCobertura: selectedType === 'SERVICIO' ? zonaAtencion : undefined,
      experienciaAnos: selectedType === 'SERVICIO' ? Number(experiencia) : undefined,
      createdAt: 'Recién publicado',
      vistas: 1,
      isFavorito: false,
    };

    onListingCreated(newListing);
    setStep('SUCCESS');
  };

  const addDemoPhoto = () => {
    const demoPhotos = [
      'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=80',
    ];
    const nextPhoto = demoPhotos[fotos.length % demoPhotos.length];
    setFotos([...fotos, nextPhoto]);
  };

  return (
    <div className="tab-view publish-view">
      {step === 'SELECT_TYPE' && (
        <div className="publish-type-selector-screen">
          <div className="publish-header">
            <h2>¿Qué quieres publicar hoy?</h2>
            <p>Elige el tipo de publicación para conectar con clientes en Bagua y el Perú.</p>
          </div>

          <div className="publish-type-cards">
            {/* Producto */}
            <div className="type-selection-card" onClick={() => handleSelectType('PRODUCTO')}>
              <div className="type-card-icon blue">
                <ShoppingBag size={28} />
              </div>
              <div className="type-card-body">
                <h3>🛒 Publicar un Producto</h3>
                <p>Celulares, laptops, ropa, motos, artesanías, muebles y artículos varios.</p>
              </div>
              <ArrowRight size={20} className="type-arrow" />
            </div>

            {/* Servicio */}
            <div className="type-selection-card" onClick={() => handleSelectType('SERVICIO')}>
              <div className="type-card-icon green">
                <Wrench size={28} />
              </div>
              <div className="type-card-body">
                <h3>🔧 Ofrecer un Servicio</h3>
                <p>Técnicos, gasfitería, diseño, carpintería, asesorías, transporte y oficios.</p>
              </div>
              <ArrowRight size={20} className="type-arrow" />
            </div>

            {/* Promoción */}
            <div className="type-selection-card" onClick={() => handleSelectType('PROMOCION')}>
              <div className="type-card-icon red">
                <Flame size={28} />
              </div>
              <div className="type-card-body">
                <h3>🔥 Publicar una Promoción</h3>
                <p>Ofertas especiales, combos gastronómicos, liquidaciones y descuentos con tiempo limitado.</p>
              </div>
              <ArrowRight size={20} className="type-arrow" />
            </div>

            {/* Necesidad */}
            <div className="type-selection-card" onClick={() => handleSelectType('NECESIDAD')}>
              <div className="type-card-icon purple">
                <ClipboardList size={28} />
              </div>
              <div className="type-card-body">
                <h3>📋 Publicar una Necesidad</h3>
                <p>¿Buscas un especialista o producto específico? Publica tu necesidad y recibe propuestas.</p>
              </div>
              <ArrowRight size={20} className="type-arrow" />
            </div>
          </div>
        </div>
      )}

      {step === 'FORM' && (
        <div className="publish-form-screen">
          <div className="form-top-nav">
            <button type="button" className="btn-back-link" onClick={() => setStep('SELECT_TYPE')}>
              <ArrowLeft size={18} /> Cambiar Tipo
            </button>
            <span className="type-current-pill">
              Tipo: <strong>{selectedType}</strong>
            </span>
          </div>

          <form onSubmit={handlePublish} className="main-publish-form">
            {/* Photo Uploader */}
            <div className="form-group">
              <label>Fotografías ({fotos.length}/5)</label>
              <div className="photos-uploader-row">
                {fotos.map((img, idx) => (
                  <div key={img} className="photo-thumb-preview">
                    <img src={img} alt={`Preview ${idx + 1}`} />
                    {idx === 0 && <span className="primary-photo-tag">Principal</span>}
                  </div>
                ))}
                {fotos.length < 5 && (
                  <button type="button" className="add-photo-btn" onClick={addDemoPhoto}>
                    <Camera size={22} />
                    <span>Agregar Foto</span>
                  </button>
                )}
              </div>
            </div>

            {/* Title */}
            <div className="form-group">
              <label>
                {selectedType === 'SERVICIO' ? 'Nombre del Servicio' : selectedType === 'NECESIDAD' ? 'Título de lo que necesitas' : 'Título de la publicación'} *
              </label>
              <input
                type="text"
                className="input-field"
                placeholder={
                  selectedType === 'SERVICIO'
                    ? 'Ej: Mantenimiento y Reparación de Aires Acondicionados'
                    : selectedType === 'NECESIDAD'
                    ? 'Ej: Busco soldador para reja de casa en Bagua'
                    : 'Ej: Celular Samsung Galaxy S23 Ultra 256GB'
                }
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                required
              />
            </div>

            {/* Category */}
            <div className="form-group">
              <label>Categoría</label>
              <select
                className="input-field select-field"
                value={categoria}
                onChange={(e) => {
                  setCategoria(e.target.value);
                  setCategoriaSlug(e.target.value.toLowerCase().replace(/ /g, '-'));
                }}
              >
                <option value="Tecnología">Tecnología y Electrónica</option>
                <option value="Servicios">Servicios Profesionales y Técnicos</option>
                <option value="Gastronomía">Gastronomía y Comida</option>
                <option value="Hogar y Muebles">Hogar y Muebles</option>
                <option value="Automotriz / Motos">Automotriz / Motos</option>
                <option value="Agro y Campo">Agro y Productos del Valle</option>
                <option value="Construcción">Construcción y Mantenimiento</option>
                <option value="Belleza y Salud">Belleza y Cuidado Personal</option>
                <option value="Otros">Otros</option>
              </select>
            </div>

            {/* Price section */}
            <div className="form-row-2">
              <div className="form-group">
                <label>
                  {selectedType === 'SERVICIO' ? 'Precio Desde (S/)' : selectedType === 'NECESIDAD' ? 'Presupuesto (S/)' : 'Precio (S/)'} *
                </label>
                <div className="input-with-symbol">
                  <span className="symbol">S/</span>
                  <input
                    type="number"
                    className="input-field input-price"
                    placeholder="0.00"
                    value={precio}
                    onChange={(e) => setPrecio(e.target.value)}
                    required
                    min={1}
                  />
                </div>
              </div>

              {selectedType === 'PROMOCION' && (
                <div className="form-group">
                  <label>Precio Anterior (S/)</label>
                  <div className="input-with-symbol">
                    <span className="symbol">S/</span>
                    <input
                      type="number"
                      className="input-field"
                      placeholder="Precio sin descuento"
                      value={precioAnterior}
                      onChange={(e) => setPrecioAnterior(e.target.value)}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Negotiable toggle */}
            <div className="form-group checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={esNegociable}
                  onChange={(e) => setEsNegociable(e.target.checked)}
                />
                <span>🤝 Permitir que los compradores hagan ofertas y contraofertas</span>
              </label>
            </div>

            {/* Specific fields for Producto */}
            {selectedType === 'PRODUCTO' && (
              <div className="form-group">
                <label>Estado / Condición del Artículo</label>
                <select
                  className="input-field select-field"
                  value={condicion}
                  onChange={(e) => setCondicion(e.target.value as ItemCondition)}
                >
                  <option value="NUEVO">Nuevo en caja sellada</option>
                  <option value="USADO_COMO_NUEVO">Usado - Como nuevo (9.5/10)</option>
                  <option value="USADO_BUEN_ESTADO">Usado - Buen estado</option>
                  <option value="USADO_ACEPTABLE">Usado - Aceptable</option>
                </select>
              </div>
            )}

            {/* Specific fields for Servicio */}
            {selectedType === 'SERVICIO' && (
              <div className="form-row-2">
                <div className="form-group">
                  <label>Modalidad de Atención</label>
                  <select
                    className="input-field select-field"
                    value={modalidad}
                    onChange={(e) => setModalidad(e.target.value as ServiceModality)}
                  >
                    <option value="AMBOS">A domicilio y en taller</option>
                    <option value="A_DOMICILIO">Solo a domicilio</option>
                    <option value="ESTABLECIMIENTO">Solo en mi local/taller</option>
                    <option value="VIRTUAL">Atención virtual / remota</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Años de Experiencia</label>
                  <input
                    type="number"
                    className="input-field"
                    value={experiencia}
                    onChange={(e) => setExperiencia(e.target.value)}
                    min={1}
                  />
                </div>
              </div>
            )}

            {/* Description */}
            <div className="form-group">
              <label>Descripción detallada</label>
              <textarea
                className="input-field textarea-field"
                rows={4}
                placeholder="Describe las características, garantías, beneficios, forma de entrega en Bagua o condiciones del trato..."
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
              />
            </div>

            {/* Location in Bagua */}
            <div className="form-group">
              <label>Ubicación en Bagua / Zona de entrega</label>
              <div className="location-input-box">
                <MapPin size={18} className="text-red" />
                <input
                  type="text"
                  className="input-field input-noborder"
                  value={ciudadZona}
                  onChange={(e) => setCiudadZona(e.target.value)}
                  placeholder="Ej: Bagua Centro, Jr. 28 de Julio, La Peca"
                />
              </div>
            </div>

            {/* Submit CTA */}
            <div className="publish-action-buttons">
              <button type="submit" className="btn-primary-publish">
                <Sparkles size={18} />
                <span>Publicar Ahora en MANO A MANO.PE</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {step === 'SUCCESS' && (
        <div className="publish-success-screen">
          <CheckCircle2 size={64} color="#10B981" />
          <h2>¡Tu publicación está activa!</h2>
          <p>
            Ya es visible para todos los compradores en <strong>Bagua</strong> y en todo el Perú.
            Recibirás notificaciones cuando alguien te contacte o te haga una oferta.
          </p>
          <div className="success-actions">
            <button
              type="button"
              className="btn-action-primary"
              onClick={onCancel}
            >
              Ver en Inicio / Explorar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
