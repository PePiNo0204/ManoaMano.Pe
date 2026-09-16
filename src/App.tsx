import React, { useState } from 'react';
import { 
  INITIAL_LISTINGS, INITIAL_CONVERSATIONS, INITIAL_MESSAGES, 
  INITIAL_DEALS, INITIAL_NOTIFICATIONS, INITIAL_REVIEWS, CURRENT_USER 
} from './data/initialData';
import type { 
  Listing, Conversation, ChatMessage, Deal, 
  AppNotification, Review, User, ListingType, Offer 
} from './types';
import { Navbar } from './components/Navbar';
import { BottomNav, type TabType } from './components/BottomNav';
import { HomeView } from './views/HomeView';
import { ExploreView } from './views/ExploreView';
import { PublishView } from './views/PublishView';
import { MessagesView } from './views/MessagesView';
import { ProfileView } from './views/ProfileView';
import { ListingDetailModal } from './components/ListingDetailModal';
import { SellerProfileModal } from './components/SellerProfileModal';
import { NotificationModal } from './components/NotificationModal';
import { ReviewModal } from './components/ReviewModal';
import { ReportModal } from './components/ReportModal';

export function App() {
  // Navigation & State
  const [activeTab, setActiveTab] = useState<TabType>('INICIO');
  const [user, setUser] = useState<User>(CURRENT_USER);
  const [listings, setListings] = useState<Listing[]>(INITIAL_LISTINGS);
  const [conversations, setConversations] = useState<Conversation[]>(INITIAL_CONVERSATIONS);
  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>(INITIAL_MESSAGES);
  const [deals, setDeals] = useState<Deal[]>(INITIAL_DEALS);
  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);

  // Modals & Active selections
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [selectedSellerId, setSelectedSellerId] = useState<string | null>(null);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);
  const [activeDealForReview, setActiveDealForReview] = useState<Deal | null>(null);
  const [reportingListing, setReportingListing] = useState<Listing | null>(null);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [exploreTypeFilter, setExploreTypeFilter] = useState<ListingType | 'NEGOCIO' | null>(null);

  // Handlers
  const handleToggleFavorito = (listingId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setListings((prev) =>
      prev.map((item) =>
        item.id === listingId ? { ...item, isFavorito: !item.isFavorito } : item
      )
    );
  };

  const handleCreateListing = (newListing: Listing) => {
    setListings((prev) => [newListing, ...prev]);
    const newNotif: AppNotification = {
      id: `notif_${Date.now()}`,
      tipo: 'PROMO',
      titulo: '✨ Publicación Creada con Éxito',
      detalle: `Tu publicación "${newListing.titulo}" ya está disponible en Bagua.`,
      timestamp: 'Ahora',
      leido: false,
      targetTab: 'INICIO',
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  // Flow: Publicación -> Contactar -> Chat
  const handleContactSeller = (listing: Listing) => {
    let existingConv = conversations.find((c) => c.listingId === listing.id);
    if (!existingConv) {
      existingConv = {
        id: `conv_${Date.now()}`,
        listingId: listing.id,
        listing: {
          id: listing.id,
          titulo: listing.titulo,
          precio: listing.precio,
          foto: listing.fotos[0],
          ubicacion: listing.ubicacion.ciudadZona || 'Bagua',
        },
        otroUsuario: {
          id: listing.vendedor.id,
          nombre: listing.vendedor.nombreComercial || listing.vendedor.nombre,
          avatarUrl: listing.vendedor.avatarUrl,
          isVerified: listing.vendedor.isVerified,
        },
        ultimoMensaje: `Hola, estoy interesado en "${listing.titulo}".`,
        ultimoMensajeHora: 'Ahora',
        noLeidos: 0,
        estadoTrato: 'SOLICITUD',
      };
      setConversations((prev) => [existingConv!, ...prev]);
      setMessages((prev) => ({
        ...prev,
        [existingConv!.id]: [
          {
            id: `msg_${Date.now()}`,
            conversationId: existingConv!.id,
            senderId: user.id,
            texto: `Hola, estoy interesado en tu publicación "${listing.titulo}". ¿Sigue disponible?`,
            timestamp: 'Ahora',
            leido: true,
          }
        ],
      }));
    }

    setActiveConversationId(existingConv.id);
    setActiveTab('MENSAJES');
  };

  // Flow: Publicación -> Hacer Oferta -> Chat con Oferta
  const handleMakeOffer = (listing: Listing, offerAmount: number) => {
    let existingConv = conversations.find((c) => c.listingId === listing.id);
    const convId = existingConv ? existingConv.id : `conv_${Date.now()}`;

    const newOffer: Offer = {
      id: `off_${Date.now()}`,
      conversationId: convId,
      listingId: listing.id,
      emisorId: user.id,
      monto: offerAmount,
      mensaje: `Oferta inicial: S/ ${offerAmount.toLocaleString('es-PE')}`,
      estado: 'PENDIENTE',
      createdAt: 'Ahora',
    };

    const newMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      conversationId: convId,
      senderId: user.id,
      texto: `Hola, te envío una oferta de S/ ${offerAmount.toLocaleString('es-PE')} por "${listing.titulo}".`,
      offerData: newOffer,
      timestamp: 'Ahora',
      leido: true,
    };

    if (!existingConv) {
      existingConv = {
        id: convId,
        listingId: listing.id,
        listing: {
          id: listing.id,
          titulo: listing.titulo,
          precio: listing.precio,
          foto: listing.fotos[0],
          ubicacion: listing.ubicacion.ciudadZona || 'Bagua',
        },
        otroUsuario: {
          id: listing.vendedor.id,
          nombre: listing.vendedor.nombreComercial || listing.vendedor.nombre,
          avatarUrl: listing.vendedor.avatarUrl,
          isVerified: listing.vendedor.isVerified,
        },
        ultimoMensaje: `Oferta enviada: S/ ${offerAmount}`,
        ultimoMensajeHora: 'Ahora',
        noLeidos: 0,
        estadoTrato: 'NEGOCIACION',
      };
      setConversations((prev) => [existingConv!, ...prev]);
      setMessages((prev) => ({ ...prev, [convId]: [newMsg] }));
    } else {
      setMessages((prev) => ({
        ...prev,
        [convId]: [...(prev[convId] || []), newMsg],
      }));
      setConversations((prev) =>
        prev.map((c) =>
          c.id === convId
            ? { ...c, ultimoMensaje: `Oferta enviada: S/ ${offerAmount}`, estadoTrato: 'NEGOCIACION' }
            : c
        )
      );
    }

    setActiveConversationId(convId);
    setActiveTab('MENSAJES');
  };

  const handleSendMessage = (convId: string, text: string, offer?: Offer) => {
    const newMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      conversationId: convId,
      senderId: user.id,
      texto: text,
      offerData: offer,
      timestamp: 'Ahora',
      leido: true,
    };

    setMessages((prev) => ({
      ...prev,
      [convId]: [...(prev[convId] || []), newMsg],
    }));

    setConversations((prev) =>
      prev.map((c) =>
        c.id === convId
          ? {
              ...c,
              ultimoMensaje: text,
              ultimoMensajeHora: 'Ahora',
              estadoTrato: offer ? 'NEGOCIACION' : c.estadoTrato,
            }
          : c
      )
    );
  };

  // Flow: Oferta Aceptada -> Genera TRATO
  const handleAcceptOffer = (convId: string, _offerId: string, amount: number) => {
    const conv = conversations.find((c) => c.id === convId);
    if (!conv) return;

    const newDeal: Deal = {
      id: `deal_${Date.now()}`,
      conversationId: convId,
      listingId: conv.listingId || 'list_001',
      listingTitulo: conv.listing?.titulo || 'Publicación',
      listingFoto: conv.listing?.foto || 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=400&q=80',
      compradorId: user.id,
      compradorNombre: user.nombreCompleto,
      vendedorId: conv.otroUsuario.id,
      vendedorNombre: conv.otroUsuario.nombre,
      precioAcordado: amount,
      estado: 'ACEPTADO',
      fechaAcuerdo: 'Hoy',
    };

    setDeals((prev) => [newDeal, ...prev]);

    setConversations((prev) =>
      prev.map((c) =>
        c.id === convId
          ? { ...c, estadoTrato: 'ACEPTADO', activeDealId: newDeal.id, ultimoMensaje: `🤝 ¡Trato Aceptado por S/ ${amount}!` }
          : c
      )
    );

    const systemMsg: ChatMessage = {
      id: `msg_sys_${Date.now()}`,
      conversationId: convId,
      senderId: user.id,
      texto: `🤝 ¡Oferta de S/ ${amount.toLocaleString('es-PE')} ACEPTADA! Se ha generado el Trato oficial. Coordinen la entrega en Bagua.`,
      timestamp: 'Ahora',
      leido: true,
    };

    setMessages((prev) => ({
      ...prev,
      [convId]: [...(prev[convId] || []), systemMsg],
    }));

    setNotifications((prev) => [
      {
        id: `notif_${Date.now()}`,
        tipo: 'TRATO',
        titulo: '🤝 ¡Trato Aceptado!',
        detalle: `Se acordó el precio de S/ ${amount} con ${conv.otroUsuario.nombre}.`,
        timestamp: 'Ahora',
        leido: false,
        targetTab: 'MENSAJES',
        targetId: convId,
      },
      ...prev,
    ]);
  };

  const handleRejectOffer = (convId: string, offerId: string) => {
    setMessages((prev) => ({
      ...prev,
      [convId]: (prev[convId] || []).map((m) =>
        m.offerData?.id === offerId
          ? { ...m, offerData: { ...m.offerData, estado: 'RECHAZADA' } }
          : m
      ),
    }));
  };

  // Flow: Trato -> Completar -> Desbloquea Calificar
  const handleCompleteDeal = (dealId: string) => {
    const targetDeal = deals.find((d) => d.id === dealId);
    if (!targetDeal) return;

    setDeals((prev) =>
      prev.map((d) =>
        d.id === dealId
          ? { ...d, estado: 'COMPLETADO', fechaCompletado: 'Hoy' }
          : d
      )
    );

    setConversations((prev) =>
      prev.map((c) =>
        c.id === targetDeal.conversationId
          ? { ...c, estadoTrato: 'COMPLETADO', ultimoMensaje: '✅ Trato Completado con Éxito.' }
          : c
      )
    );

    setActiveDealForReview(targetDeal);
  };

  const handleSubmitReview = (reviewData: {
    dealId: string;
    destinatarioId: string;
    puntuacionGeneral: number;
    calidad: number;
    atencion: number;
    cumplimiento: number;
    comentario: string;
  }) => {
    const newRev: Review = {
      id: `rev_${Date.now()}`,
      dealId: reviewData.dealId,
      autorId: user.id,
      autorNombre: user.nombreCompleto,
      autorAvatar: user.avatarUrl,
      destinatarioId: reviewData.destinatarioId,
      puntuacionGeneral: reviewData.puntuacionGeneral,
      calidad: reviewData.calidad,
      atencion: reviewData.atencion,
      cumplimiento: reviewData.cumplimiento,
      comentario: reviewData.comentario,
      createdAt: 'Hoy',
    };

    setReviews((prev) => [newRev, ...prev]);
    setDeals((prev) =>
      prev.map((d) =>
        d.id === reviewData.dealId ? { ...d, isCalificadoPorComprador: true } : d
      )
    );
  };

  const unreadNotifsCount = notifications.filter((n) => !n.leido).length;
  const unreadMessagesCount = conversations.reduce((acc, c) => acc + c.noLeidos, 0);

  // Filter listings by global search
  const displayedListings = listings.filter((item) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.titulo.toLowerCase().includes(q) ||
      item.descripcion.toLowerCase().includes(q) ||
      item.categoria.toLowerCase().includes(q) ||
      item.ubicacion.ciudadZona.toLowerCase().includes(q)
    );
  });

  return (
    <div className="app-viewport-wrapper">
      {/* Top Navbar */}
      <Navbar
        currentLocation={user.ubicacion}
        unreadNotificationsCount={unreadNotifsCount}
        onOpenNotifications={() => setShowNotificationsModal(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Main Tab Content */}
      <main className="main-content-scroll">
        {activeTab === 'INICIO' && (
          <HomeView
            listings={displayedListings}
            onSelectListing={setSelectedListing}
            onToggleFavorito={handleToggleFavorito}
            onSelectCategoryFilter={(_slug) => {
              setActiveTab('EXPLORAR');
            }}
            onSelectTypeFilter={(type) => {
              setExploreTypeFilter(type);
              setActiveTab('EXPLORAR');
            }}
          />
        )}

        {activeTab === 'EXPLORAR' && (
          <ExploreView
            listings={displayedListings}
            onSelectListing={setSelectedListing}
            onToggleFavorito={handleToggleFavorito}
            initialTypeFilter={exploreTypeFilter}
          />
        )}

        {activeTab === 'PUBLICAR' && (
          <PublishView
            onListingCreated={(newListing) => {
              handleCreateListing(newListing);
              setSelectedListing(newListing);
              setActiveTab('INICIO');
            }}
            onCancel={() => setActiveTab('INICIO')}
          />
        )}

        {activeTab === 'MENSAJES' && (
          <MessagesView
            conversations={conversations}
            messages={messages}
            deals={deals}
            currentUserId={user.id}
            activeConversationId={activeConversationId}
            onSelectConversation={setActiveConversationId}
            onSendMessage={handleSendMessage}
            onAcceptOffer={handleAcceptOffer}
            onRejectOffer={handleRejectOffer}
            onCompleteDeal={handleCompleteDeal}
            onOpenReviewModal={(deal) => setActiveDealForReview(deal)}
          />
        )}

        {activeTab === 'PERFIL' && (
          <ProfileView
            user={user}
            listings={listings}
            deals={deals}
            reviews={reviews}
            onSelectListing={setSelectedListing}
            onToggleFavorito={handleToggleFavorito}
            onUpdateUser={(updated) => setUser((prev) => ({ ...prev, ...updated }))}
            onOpenReviewModal={(deal) => setActiveDealForReview(deal)}
          />
        )}
      </main>

      {/* Bottom 5-Tab Bar */}
      <BottomNav
        activeTab={activeTab}
        onChangeTab={(tab) => {
          setActiveTab(tab);
          if (tab !== 'MENSAJES') {
            setActiveConversationId(null);
          }
        }}
        unreadMessagesCount={unreadMessagesCount}
      />

      {/* Modals */}
      <ListingDetailModal
        listing={selectedListing}
        onClose={() => setSelectedListing(null)}
        onContactSeller={handleContactSeller}
        onMakeOffer={handleMakeOffer}
        onViewSellerProfile={(sellerId) => {
          setSelectedListing(null);
          setSelectedSellerId(sellerId);
        }}
        onToggleFavorito={handleToggleFavorito}
        onReport={(listing) => setReportingListing(listing)}
      />

      <SellerProfileModal
        sellerId={selectedSellerId}
        listings={listings}
        reviews={reviews}
        onClose={() => setSelectedSellerId(null)}
        onSelectListing={(item) => {
          setSelectedSellerId(null);
          setSelectedListing(item);
        }}
        onContactSeller={(_sellerName, sellerId) => {
          const sample = listings.find((l) => l.vendedor.id === sellerId);
          if (sample) handleContactSeller(sample);
        }}
      />

      {showNotificationsModal && (
        <NotificationModal
          notifications={notifications}
          onClose={() => setShowNotificationsModal(false)}
          onSelectNotification={(notif) => {
            if (notif.targetTab) setActiveTab(notif.targetTab);
            if (notif.targetId && notif.targetTab === 'MENSAJES') {
              setActiveConversationId(notif.targetId);
            }
          }}
          onMarkAllAsRead={() => {
            setNotifications((prev) => prev.map((n) => ({ ...n, leido: true })));
          }}
        />
      )}

      {activeDealForReview && (
        <ReviewModal
          deal={activeDealForReview}
          onClose={() => setActiveDealForReview(null)}
          onSubmitReview={handleSubmitReview}
        />
      )}

      {reportingListing && (
        <ReportModal
          listing={reportingListing}
          onClose={() => setReportingListing(null)}
          onSubmitReport={(reason, _details) => {
            alert(`Reporte por "${reason}" registrado. Gracias por mantener la seguridad en Bagua.`);
          }}
        />
      )}
    </div>
  );
}

export default App;
