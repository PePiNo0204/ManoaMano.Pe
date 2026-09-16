export type ListingType = 'PRODUCTO' | 'SERVICIO' | 'PROMOCION' | 'NECESIDAD';

export type ItemCondition = 'NUEVO' | 'USADO_COMO_NUEVO' | 'USADO_BUEN_ESTADO' | 'USADO_ACEPTABLE' | 'NO_APLICA';

export type ServiceModality = 'ESTABLECIMIENTO' | 'A_DOMICILIO' | 'AMBOS' | 'VIRTUAL';

export type OfferStatus = 'PENDIENTE' | 'CONTRAOFERTADA' | 'ACEPTADA' | 'RECHAZADA' | 'CANCELADA';

export type DealStatus = 
  | 'SOLICITUD' 
  | 'COTIZACION' 
  | 'NEGOCIACION' 
  | 'ACEPTADO' 
  | 'EN_PROCESO' 
  | 'COMPLETADO' 
  | 'CANCELADO';

export type BadgeType = 'VERIFICADO' | 'VENDEDOR_DESTACADO' | 'PROVEEDOR_CONFIABLE' | 'COMPRADOR_CONFIABLE' | 'MUY_SOLICITADO';

export interface LocationInfo {
  pais: string;
  region: string;
  provincia: string;
  distrito: string;
  ciudadZona: string;
  direccion?: string;
  lat: number;
  lng: number;
}

export interface User {
  id: string;
  nombreCompleto: string;
  email: string;
  telefono: string;
  avatarUrl: string;
  ubicacion: LocationInfo;
  fechaRegistro: string;
  
  // Reputación
  ratingPromedio: number;
  totalResenas: number;
  tratosCompletados: number;
  insignias: BadgeType[];
  isVerified: boolean;
  tiempoRespuesta: string;
  
  // Modo Vendedor (en la misma cuenta)
  isSellerMode: boolean;
  nombreComercial?: string;
  descripcionComercial?: string;
  especialidades?: string[];
  horariosAtencion?: string;
  atiendeADomicilio?: boolean;
  zonaAtencion?: string;
}

export interface Listing {
  id: string;
  userId: string;
  vendedor: {
    id: string;
    nombre: string;
    nombreComercial?: string;
    avatarUrl: string;
    rating: number;
    resenasCount: number;
    isVerified: boolean;
    insignias: BadgeType[];
    tiempoRespuesta: string;
  };
  tipo: ListingType;
  titulo: string;
  descripcion: string;
  categoria: string;
  categoriaSlug: string;
  precio: number;
  precioAnterior?: number; // Para promociones
  esNegociable: boolean;
  fotos: string[];
  ubicacion: LocationInfo;
  
  // Producto
  condicion?: ItemCondition;
  stock?: number;
  
  // Servicio
  modalidad?: ServiceModality;
  zonaCobertura?: string;
  experienciaAnos?: number;
  
  // Promoción
  descuentoPorcentaje?: number;
  fechaFinPromo?: string;
  
  // Necesidad
  presupuestoLimite?: number;
  fechaLimite?: string;
  propuestasCount?: number;
  
  createdAt: string;
  vistas: number;
  isFavorito?: boolean;
}

export interface Offer {
  id: string;
  conversationId: string;
  listingId: string;
  emisorId: string;
  monto: number;
  mensaje?: string;
  estado: OfferStatus;
  createdAt: string;
}

export interface Deal {
  id: string;
  conversationId: string;
  listingId: string;
  listingTitulo: string;
  listingFoto: string;
  compradorId: string;
  compradorNombre: string;
  vendedorId: string;
  vendedorNombre: string;
  precioAcordado: number;
  estado: DealStatus;
  fechaAcuerdo: string;
  fechaCompletado?: string;
  isCalificadoPorComprador?: boolean;
  isCalificadoPorVendedor?: boolean;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  texto: string;
  imagenUrl?: string;
  offerData?: Offer;
  timestamp: string;
  leido: boolean;
}

export interface Conversation {
  id: string;
  listingId?: string;
  listing?: {
    id: string;
    titulo: string;
    precio: number;
    foto: string;
    ubicacion: string;
  };
  otroUsuario: {
    id: string;
    nombre: string;
    avatarUrl: string;
    isVerified: boolean;
  };
  ultimoMensaje: string;
  ultimoMensajeHora: string;
  noLeidos: number;
  estadoTrato?: DealStatus;
  activeDealId?: string;
}

export interface Review {
  id: string;
  dealId: string;
  autorId: string;
  autorNombre: string;
  autorAvatar: string;
  destinatarioId: string;
  puntuacionGeneral: number; // 1-5
  calidad: number;
  atencion: number;
  cumplimiento: number;
  comentario: string;
  createdAt: string;
}

export interface AppNotification {
  id: string;
  tipo: 'MENSAJE' | 'OFERTA' | 'TRATO' | 'RESENA' | 'PROMO';
  titulo: string;
  detalle: string;
  timestamp: string;
  leido: boolean;
  targetTab?: 'INICIO' | 'EXPLORAR' | 'PUBLICAR' | 'MENSAJES' | 'PERFIL';
  targetId?: string;
}
