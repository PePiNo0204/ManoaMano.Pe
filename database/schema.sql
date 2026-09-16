-- ==============================================================================
-- MANO A MANO.PE — ESQUEMA COMPLETO DE BASE DE DATOS POSTGRESQL
-- Eslogan: "Encuentra. Ofrece. Haz tu trato."
-- Enfoque inicial: Bagua, Amazonas, Perú (Escalable a nivel nacional)
-- ==============================================================================

-- 1. Habilitar extensión para UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Limpieza previa si existen tablas
DROP TABLE IF EXISTS reports CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS favorites CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS deals CASCADE;
DROP TABLE IF EXISTS offers CASCADE;
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS conversations CASCADE;
DROP TABLE IF EXISTS listing_images CASCADE;
DROP TABLE IF EXISTS listings CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS locations CASCADE;

-- 3. Tipos ENUM (Estados y Clasificaciones)
DROP TYPE IF EXISTS listing_type_enum CASCADE;
DROP TYPE IF EXISTS listing_status_enum CASCADE;
DROP TYPE IF EXISTS item_condition_enum CASCADE;
DROP TYPE IF EXISTS service_modality_enum CASCADE;
DROP TYPE IF EXISTS offer_status_enum CASCADE;
DROP TYPE IF EXISTS deal_status_enum CASCADE;
DROP TYPE IF EXISTS badge_type_enum CASCADE;
DROP TYPE IF EXISTS report_reason_enum CASCADE;

CREATE TYPE listing_type_enum AS ENUM ('PRODUCTO', 'SERVICIO', 'PROMOCION', 'NECESIDAD');
CREATE TYPE listing_status_enum AS ENUM ('ACTIVO', 'PAUSADO', 'EN_TRATO', 'VENDIDO', 'CERRADO');
CREATE TYPE item_condition_enum AS ENUM ('NUEVO', 'USADO_COMO_NUEVO', 'USADO_BUEN_ESTADO', 'USADO_ACEPTABLE', 'NO_APLICA');
CREATE TYPE service_modality_enum AS ENUM ('ESTABLECIMIENTO', 'A_DOMICILIO', 'AMBOS', 'VIRTUAL');
CREATE TYPE offer_status_enum AS ENUM ('PENDIENTE', 'CONTRAOFERTADA', 'ACEPTADA', 'RECHAZADA', 'CANCELADA');
CREATE TYPE deal_status_enum AS ENUM ('SOLICITUD', 'COTIZACION', 'NEGOCIACION', 'ACEPTADO', 'EN_PROCESO', 'COMPLETADO', 'CANCELADO');
CREATE TYPE badge_type_enum AS ENUM ('VERIFICADO', 'VENDEDOR_DESTACADO', 'PROVEEDOR_CONFIABLE', 'COMPRADOR_CONFIABLE', 'MUY_SOLICITADO');
CREATE TYPE report_reason_enum AS ENUM ('ESTAFA', 'SPAM', 'CONTENIDO_OFENSIVO', 'PRODUCTO_PROHIBIDO', 'INFORMACION_FALSA', 'ACOSO', 'OTRO');

-- 4. Tabla de Ubicaciones Geográficas (Escalabilidad Perú)
CREATE TABLE locations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pais VARCHAR(50) DEFAULT 'Perú',
    region VARCHAR(50) NOT NULL,          -- Ej: Amazonas
    provincia VARCHAR(50) NOT NULL,       -- Ej: Bagua / Utcubamba
    distrito VARCHAR(50) NOT NULL,        -- Ej: Bagua / La Peca / Cajaruro
    ciudad_zona VARCHAR(100),             -- Ej: Bagua Centro, Jr. 28 de Julio
    direccion TEXT,
    latitud NUMERIC(10, 8),
    longitud NUMERIC(11, 8),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Tabla de Usuarios y Perfiles (Cuenta Única Comprador/Vendedor)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    telefono VARCHAR(20) UNIQUE,
    password_hash TEXT,
    nombre_completo VARCHAR(150) NOT NULL,
    avatar_url TEXT,
    location_id UUID REFERENCES locations(id) ON DELETE SET NULL,
    
    -- Modo Vendedor (Misma cuenta)
    is_seller_mode BOOLEAN DEFAULT FALSE,
    nombre_comercial VARCHAR(150),
    descripcion_comercial TEXT,
    especialidades TEXT[] DEFAULT '{}',
    horarios_atencion VARCHAR(150),
    atiende_a_domicilio BOOLEAN DEFAULT FALSE,
    zona_atencion TEXT,
    
    -- Reputación y Confianza
    rating_promedio NUMERIC(3, 2) DEFAULT 5.00,
    total_resenas INT DEFAULT 0,
    tratos_completados INT DEFAULT 0,
    insignias badge_type_enum[] DEFAULT '{"VERIFICADO"}',
    is_verified BOOLEAN DEFAULT TRUE,
    tiempo_respuesta VARCHAR(50) DEFAULT '~15 min',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Tabla de Categorías
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    icono_svg TEXT,
    tipo listing_type_enum DEFAULT 'PRODUCTO',
    parent_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    orden INT DEFAULT 0
);

-- 7. Tabla de Publicaciones (Productos, Servicios, Promos, Necesidades)
CREATE TABLE listings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES categories(id),
    location_id UUID REFERENCES locations(id) ON DELETE SET NULL,
    
    tipo listing_type_enum NOT NULL,
    titulo VARCHAR(250) NOT NULL,
    descripcion TEXT NOT NULL,
    
    -- Precios y Trato
    precio NUMERIC(12, 2) NOT NULL,
    precio_anterior NUMERIC(12, 2),
    descuento_porcentaje INT,
    es_negociable BOOLEAN DEFAULT TRUE,
    
    -- Producto
    condicion item_condition_enum DEFAULT 'NO_APLICA',
    stock INT DEFAULT 1,
    
    -- Servicio
    modalidad service_modality_enum DEFAULT 'ESTABLECIMIENTO',
    zona_cobertura TEXT,
    experiencia_anos INT,
    
    -- Promoción / Necesidad
    fecha_fin_promo TIMESTAMPTZ,
    presupuesto_limite NUMERIC(12, 2),
    fecha_limite TIMESTAMPTZ,
    propuestas_count INT DEFAULT 0,
    
    status listing_status_enum DEFAULT 'ACTIVO',
    vistas INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Galería de Imágenes de Publicaciones
CREATE TABLE listing_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    es_principal BOOLEAN DEFAULT FALSE,
    orden INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Conversaciones (Chat vinculable a una publicación)
CREATE TABLE conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    listing_id UUID REFERENCES listings(id) ON DELETE SET NULL,
    comprador_id UUID NOT NULL REFERENCES users(id),
    vendedor_id UUID NOT NULL REFERENCES users(id),
    ultimo_mensaje TEXT,
    ultimo_mensaje_at TIMESTAMPTZ DEFAULT NOW(),
    estado_trato deal_status_enum DEFAULT 'SOLICITUD',
    no_leidos_comprador INT DEFAULT 0,
    no_leidos_vendedor INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Mensajes de Chat
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES users(id),
    texto TEXT,
    imagen_url TEXT,
    es_leido BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. Ofertas y Contraofertas
CREATE TABLE offers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    listing_id UUID NOT NULL REFERENCES listings(id),
    emisor_id UUID NOT NULL REFERENCES users(id),
    receptor_id UUID NOT NULL REFERENCES users(id),
    monto_ofertado NUMERIC(12, 2) NOT NULL,
    mensaje TEXT,
    estado offer_status_enum DEFAULT 'PENDIENTE',
    parent_offer_id UUID REFERENCES offers(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. Tratos Oficiales (Generados tras oferta aceptada)
CREATE TABLE deals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    offer_id UUID UNIQUE REFERENCES offers(id) ON DELETE SET NULL,
    conversation_id UUID REFERENCES conversations(id) ON DELETE SET NULL,
    listing_id UUID NOT NULL REFERENCES listings(id),
    comprador_id UUID NOT NULL REFERENCES users(id),
    vendedor_id UUID NOT NULL REFERENCES users(id),
    precio_acordado NUMERIC(12, 2) NOT NULL,
    estado deal_status_enum DEFAULT 'ACEPTADO',
    notas_entrega TEXT,
    is_calificado_por_comprador BOOLEAN DEFAULT FALSE,
    is_calificado_por_vendedor BOOLEAN DEFAULT FALSE,
    completado_at TIMESTAMPTZ,
    cancelado_at TIMESTAMPTZ,
    motivo_cancelacion TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. Reseñas y Calificaciones (Solo tras Trato Completado)
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    deal_id UUID NOT NULL REFERENCES deals(id) ON DELETE CASCADE,
    autor_id UUID NOT NULL REFERENCES users(id),
    destinatario_id UUID NOT NULL REFERENCES users(id),
    puntuacion_general INT CHECK (puntuacion_general BETWEEN 1 AND 5) NOT NULL,
    calidad INT CHECK (calidad BETWEEN 1 AND 5) DEFAULT 5,
    atencion INT CHECK (atencion BETWEEN 1 AND 5) DEFAULT 5,
    cumplimiento INT CHECK (cumplimiento BETWEEN 1 AND 5) DEFAULT 5,
    comentario TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(deal_id, autor_id)
);

-- 14. Favoritos
CREATE TABLE favorites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    listing_id UUID REFERENCES listings(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, listing_id)
);

-- 15. Notificaciones
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    tipo VARCHAR(50) NOT NULL,
    titulo VARCHAR(200) NOT NULL,
    detalle TEXT NOT NULL,
    data_payload JSONB,
    es_leida BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 16. Reportes y Moderación
CREATE TABLE reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    denunciante_id UUID NOT NULL REFERENCES users(id),
    usuario_reportado_id UUID REFERENCES users(id) ON DELETE SET NULL,
    listing_id UUID REFERENCES listings(id) ON DELETE SET NULL,
    motivo report_reason_enum NOT NULL,
    detalles TEXT,
    estado VARCHAR(30) DEFAULT 'PENDIENTE',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 17. Índices de Rendimiento
CREATE INDEX idx_listings_user ON listings(user_id);
CREATE INDEX idx_listings_category ON listings(category_id);
CREATE INDEX idx_listings_location ON listings(location_id);
CREATE INDEX idx_listings_tipo ON listings(tipo);
CREATE INDEX idx_listings_precio ON listings(precio);
CREATE INDEX idx_conversations_parties ON conversations(comprador_id, vendedor_id);
CREATE INDEX idx_messages_conversation ON messages(conversation_id);
CREATE INDEX idx_deals_parties ON deals(comprador_id, vendedor_id);
CREATE INDEX idx_reviews_destinatario ON reviews(destinatario_id);
