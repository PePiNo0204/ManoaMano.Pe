-- ==============================================================================
-- MANO A MANO.PE — SEED DATA INICIAL (BAGUA, AMAZONAS & PERÚ)
-- ==============================================================================

TRUNCATE TABLE reviews, deals, offers, messages, conversations, listing_images, listings, categories, users, locations CASCADE;

-- 1. Insertar Ubicaciones en Bagua y Amazonas
INSERT INTO locations (id, pais, region, provincia, distrito, ciudad_zona, direccion, latitud, longitud)
VALUES
('a0000000-0000-0000-0000-000000000001', 'Perú', 'Amazonas', 'Bagua', 'Bagua', 'Bagua Centro', 'Jr. 28 de Julio 340', -5.63720000, -78.53110000),
('a0000000-0000-0000-0000-000000000002', 'Perú', 'Amazonas', 'Bagua', 'Bagua', 'Av. Circunvalación', 'Av. Circunvalación 120', -5.63500000, -78.52900000),
('a0000000-0000-0000-0000-000000000003', 'Perú', 'Amazonas', 'Bagua', 'Bagua', 'Jr. Comercio', 'Jr. Comercio 450', -5.63920000, -78.53350000),
('a0000000-0000-0000-0000-000000000004', 'Perú', 'Amazonas', 'Bagua', 'La Peca', 'Sector El Parral', 'Valle La Peca', -5.61500000, -78.43500000),
('a0000000-0000-0000-0000-000000000005', 'Perú', 'Amazonas', 'Bagua', 'Bagua', 'Av. Héroes del Cenepa', 'Av. Héroes del Cenepa 890', -5.64100000, -78.53500000);

-- 2. Insertar Categorías
INSERT INTO categories (id, nombre, slug, tipo, orden)
VALUES
('c0000000-0000-0000-0000-000000000001', 'Tecnología y Celulares', 'tecnologia', 'PRODUCTO', 1),
('c0000000-0000-0000-0000-000000000002', 'Servicios Técnicos y Profesionales', 'servicios', 'SERVICIO', 2),
('c0000000-0000-0000-0000-000000000003', 'Gastronomía y Comida', 'gastronomia', 'PROMOCION', 3),
('c0000000-0000-0000-0000-000000000004', 'Construcción y Mantenimiento', 'construccion', 'NECESIDAD', 4),
('c0000000-0000-0000-0000-000000000005', 'Agro y Productos del Valle', 'agricultura', 'PRODUCTO', 5),
('c0000000-0000-0000-0000-000000000006', 'Automotriz y Motos', 'automotriz', 'PRODUCTO', 6),
('c0000000-0000-0000-0000-000000000007', 'Hogar y Muebles', 'hogar', 'PRODUCTO', 7);

-- 3. Insertar Usuarios
INSERT INTO users (id, email, telefono, nombre_completo, avatar_url, location_id, is_seller_mode, nombre_comercial, descripcion_comercial, especialidades, horarios_atencion, atiende_a_domicilio, rating_promedio, total_resenas, tratos_completados, insignias, is_verified)
VALUES
('11111111-1111-1111-1111-111111111101', 'carlos.pinedo@untrm.edu.pe', '+51 941 872 310', 'Carlos Pinedo', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80', 'a0000000-0000-0000-0000-000000000001', TRUE, 'Soluciones Digitales Bagua', 'Soporte técnico, apps y asesoría en Bagua', '{"Soporte Técnico", "Apps", "Comercio"}', 'Lun-Sáb: 8am-7pm', TRUE, 4.9, 18, 24, '{"VERIFICADO", "COMPRADOR_CONFIABLE", "PROVEEDOR_CONFIABLE"}', TRUE),
('11111111-1111-1111-1111-111111111102', 'marcos.vilchez@gmail.com', '+51 974 551 230', 'Marcos Vílchez', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80', 'a0000000-0000-0000-0000-000000000001', TRUE, 'TechBagua Store', 'Venta de laptops y celulares con garantía', '{"Laptops", "Celulares"}', 'Lun-Sáb: 9am-8pm', FALSE, 4.9, 42, 50, '{"VERIFICADO", "VENDEDOR_DESTACADO"}', TRUE),
('11111111-1111-1111-1111-111111111103', 'wilson.huaman@hotmail.com', '+51 948 112 459', 'Wilson Huamán', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80', 'a0000000-0000-0000-0000-000000000002', TRUE, 'Refrigeración & Clima Amazonas', 'Servicio técnico especializado a domicilio', '{"Refrigeración", "Aire Acondicionado"}', '24/7 Emergencias', TRUE, 5.0, 68, 80, '{"VERIFICADO", "PROVEEDOR_CONFIABLE", "MUY_SOLICITADO"}', TRUE),
('11111111-1111-1111-1111-111111111104', 'lucia.santillan@gmail.com', '+51 942 334 112', 'Lucía Santillán', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80', 'a0000000-0000-0000-0000-000000000003', TRUE, 'El Rincón Amazónico', 'Comida típica de Bagua y la selva peruana', '{"Cecina", "Tacacho", "Juane"}', 'Todos los días: 11am-10pm', TRUE, 4.8, 95, 120, '{"VERIFICADO", "VENDEDOR_DESTACADO"}', TRUE);

-- 4. Insertar Publicaciones
INSERT INTO listings (id, user_id, category_id, location_id, tipo, titulo, descripcion, precio, precio_anterior, descuento_porcentaje, es_negociable, condicion, stock, modalidad, zona_cobertura, experiencia_anos, status)
VALUES
('22222222-2222-2222-2222-222222222201', '11111111-1111-1111-1111-111111111102', 'c0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'PRODUCTO', 'Laptop Lenovo ThinkPad T14 Gen 2 - Core i7 16GB SSD 512GB', 'En excelente estado 9.5/10. Batería al 95%. Incluye cargador original Type-C y mouse de regalo.', 1500.00, NULL, NULL, TRUE, 'USADO_COMO_NUEVO', 1, NULL, NULL, NULL, 'ACTIVO'),
('22222222-2222-2222-2222-222222222202', '11111111-1111-1111-1111-111111111103', 'c0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000002', 'SERVICIO', 'Servicio Técnico de Refrigeradoras, Congeladoras y A/C', 'Mantenimiento preventivo y correctivo en Bagua y alrededores. Repuestos originales con garantía.', 60.00, NULL, NULL, TRUE, 'NO_APLICA', 1, 'A_DOMICILIO', 'Bagua, Cajaruro, La Peca y Utcubamba', 8, 'ACTIVO'),
('22222222-2222-2222-2222-222222222203', '11111111-1111-1111-1111-111111111104', 'c0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000003', 'PROMOCION', 'Combo Familiar: Cecina con Tacacho + Juane + Jarra Camu Camu', 'Promoción especial para 3 personas: 2 Platos de Cecina con Tacacho + 1 Juane + Jarra 1L.', 48.00, 65.00, 26, FALSE, 'NO_APLICA', 10, 'ESTABLECIMIENTO', NULL, NULL, 'ACTIVO');

-- 5. Insertar Imágenes
INSERT INTO listing_images (listing_id, image_url, es_principal, orden)
VALUES
('22222222-2222-2222-2222-222222222201', 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=800&q=80', TRUE, 1),
('22222222-2222-2222-2222-222222222202', 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&w=800&q=80', TRUE, 1),
('22222222-2222-2222-2222-222222222203', 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80', TRUE, 1);

-- 6. Insertar Conversaciones, Ofertas y Tratos
INSERT INTO conversations (id, listing_id, comprador_id, vendedor_id, ultimo_mensaje, estado_trato)
VALUES
('55555555-5555-5555-5555-555555555501', '22222222-2222-2222-2222-222222222201', '11111111-1111-1111-1111-111111111101', '11111111-1111-1111-1111-111111111102', 'Te la puedo dejar en S/ 1,400 si cerramos hoy.', 'NEGOCIACION'),
('55555555-5555-5555-5555-555555555502', '22222222-2222-2222-2222-222222222202', '11111111-1111-1111-1111-111111111101', '11111111-1111-1111-1111-111111111103', '¡Trato completado! Muchas gracias por la confianza.', 'COMPLETADO');

INSERT INTO deals (id, listing_id, comprador_id, vendedor_id, precio_acordado, estado, is_calificado_por_comprador)
VALUES
('66666666-6666-6666-6666-666666666601', '22222222-2222-2222-2222-222222222202', '11111111-1111-1111-1111-111111111101', '11111111-1111-1111-1111-111111111103', 60.00, 'COMPLETADO', TRUE);

INSERT INTO reviews (deal_id, autor_id, destinatario_id, puntuacion_general, calidad, atencion, cumplimiento, comentario)
VALUES
('66666666-6666-6666-6666-666666666601', '11111111-1111-1111-1111-111111111101', '11111111-1111-1111-1111-111111111103', 5, 5, 5, 5, 'Excelente servicio, muy puntual en mi casa en Bagua y dejó el equipo operativo.');
