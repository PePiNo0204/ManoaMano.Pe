import React, { useState } from 'react';
import { 
  Send, DollarSign, Handshake, ArrowLeft, CheckCircle2, 
  Star, Check, X
} from 'lucide-react';
import type { Conversation, ChatMessage, Deal, DealStatus, Offer } from '../types';

interface MessagesViewProps {
  conversations: Conversation[];
  messages: Record<string, ChatMessage[]>;
  deals: Deal[];
  currentUserId: string;
  activeConversationId: string | null;
  onSelectConversation: (convId: string | null) => void;
  onSendMessage: (convId: string, text: string, offer?: Offer) => void;
  onAcceptOffer: (convId: string, offerId: string, amount: number) => void;
  onRejectOffer: (convId: string, offerId: string) => void;
  onCompleteDeal: (dealId: string) => void;
  onOpenReviewModal: (deal: Deal) => void;
}

export const MessagesView: React.FC<MessagesViewProps> = ({
  conversations,
  messages,
  deals,
  currentUserId,
  activeConversationId,
  onSelectConversation,
  onSendMessage,
  onAcceptOffer,
  onRejectOffer,
  onCompleteDeal,
  onOpenReviewModal,
}) => {
  const [inputText, setInputText] = useState('');
  const [showOfferDrawer, setShowOfferDrawer] = useState(false);
  const [offerAmount, setOfferAmount] = useState<number>(0);

  const activeConv = conversations.find((c) => c.id === activeConversationId);
  const activeMessages = activeConversationId ? messages[activeConversationId] || [] : [];
  const activeDeal = deals.find((d) => d.conversationId === activeConversationId);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeConversationId) return;
    onSendMessage(activeConversationId, inputText.trim());
    setInputText('');
  };

  const handleCreateOffer = (e: React.FormEvent) => {
    e.preventDefault();
    if (offerAmount <= 0 || !activeConversationId) return;

    const newOffer: Offer = {
      id: `off_${Date.now()}`,
      conversationId: activeConversationId,
      listingId: activeConv?.listingId || 'list_001',
      emisorId: currentUserId,
      monto: offerAmount,
      mensaje: `Propuesta de Oferta: S/ ${offerAmount}`,
      estado: 'PENDIENTE',
      createdAt: 'Ahora',
    };

    onSendMessage(activeConversationId, `He enviado una oferta de S/ ${offerAmount.toLocaleString('es-PE')}. ¿Qué opinas?`, newOffer);
    setShowOfferDrawer(false);
    setOfferAmount(0);
  };

  const getDealBadgeClass = (status?: DealStatus) => {
    switch (status) {
      case 'COMPLETADO': return 'deal-badge completed';
      case 'ACEPTADO':
      case 'EN_PROCESO': return 'deal-badge in-progress';
      case 'NEGOCIACION': return 'deal-badge negotiation';
      default: return 'deal-badge default';
    }
  };

  // If in Chat Room
  if (activeConv) {
    return (
      <div className="tab-view chat-room-view">
        {/* Chat Top Header */}
        <div className="chat-room-header">
          <button type="button" className="btn-back-chat" onClick={() => onSelectConversation(null)}>
            <ArrowLeft size={20} />
          </button>
          
          <img src={activeConv.otroUsuario.avatarUrl} alt={activeConv.otroUsuario.nombre} className="chat-avatar" />
          
          <div className="chat-header-user">
            <h4>{activeConv.otroUsuario.nombre}</h4>
            <span className="online-indicator">● En línea en Bagua</span>
          </div>

          <div className="chat-header-actions">
            {activeConv.estadoTrato && (
              <span className={getDealBadgeClass(activeConv.estadoTrato)}>
                {activeConv.estadoTrato}
              </span>
            )}
          </div>
        </div>

        {/* Linked Item Banner */}
        {activeConv.listing && (
          <div className="chat-linked-listing-card">
            <img src={activeConv.listing.foto} alt={activeConv.listing.titulo} className="listing-thumb-sm" />
            <div className="listing-details-col">
              <span className="listing-title-sm">{activeConv.listing.titulo}</span>
              <span className="listing-price-sm">Precio publicado: S/ {activeConv.listing.precio}</span>
            </div>
            <button
              type="button"
              className="btn-hacer-oferta-sm"
              onClick={() => {
                setOfferAmount(Math.round(activeConv.listing!.precio * 0.9));
                setShowOfferDrawer(true);
              }}
            >
              <DollarSign size={15} /> Ofertar
            </button>
          </div>
        )}

        {/* Deal Status Stepper if Deal is active */}
        {activeDeal && (
          <div className="deal-progress-banner">
            <div className="deal-status-info">
              <Handshake size={18} color="#10B981" />
              <div>
                <strong>Trato Acordado: S/ {activeDeal.precioAcordado}</strong>
                <p>Estado actual: <strong>{activeDeal.estado}</strong></p>
              </div>
            </div>

            {activeDeal.estado !== 'COMPLETADO' ? (
              <button
                type="button"
                className="btn-complete-deal"
                onClick={() => onCompleteDeal(activeDeal.id)}
              >
                <CheckCircle2 size={16} /> Marcar Completado
              </button>
            ) : (
              <button
                type="button"
                className="btn-rate-deal-cta"
                onClick={() => onOpenReviewModal(activeDeal)}
              >
                <Star size={16} fill="#FFFFFF" /> Calificar Vendedor
              </button>
            )}
          </div>
        )}

        {/* Messages Stream */}
        <div className="chat-messages-stream">
          {activeMessages.map((msg) => {
            const isMe = msg.senderId === currentUserId;
            return (
              <div key={msg.id} className={`message-bubble-row ${isMe ? 'my-message' : 'their-message'}`}>
                <div className="bubble-content">
                  <p>{msg.texto}</p>

                  {/* If message contains an Offer card */}
                  {msg.offerData && (
                    <div className="chat-offer-card">
                      <div className="offer-header">
                        <DollarSign size={18} className="text-gold" />
                        <strong>Oferta Propuesta: S/ {msg.offerData.monto}</strong>
                      </div>
                      <p className="offer-state-text">
                        Estado: <strong>{msg.offerData.estado}</strong>
                      </p>

                      {/* Action buttons if I received the offer */}
                      {!isMe && msg.offerData.estado === 'PENDIENTE' && (
                        <div className="offer-action-buttons">
                          <button
                            type="button"
                            className="btn-accept-offer"
                            onClick={() => onAcceptOffer(activeConv.id, msg.offerData!.id, msg.offerData!.monto)}
                          >
                            <Check size={14} /> Aceptar Oferta
                          </button>
                          <button
                            type="button"
                            className="btn-counter-offer"
                            onClick={() => {
                              setOfferAmount(msg.offerData!.monto + 50);
                              setShowOfferDrawer(true);
                            }}
                          >
                            Contraofertar
                          </button>
                          <button
                            type="button"
                            className="btn-reject-offer"
                            onClick={() => onRejectOffer(activeConv.id, msg.offerData!.id)}
                          >
                            <X size={14} /> Rechazar
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  <span className="msg-time">{msg.timestamp}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Offer Drawer Modal if open */}
        {showOfferDrawer && (
          <div className="chat-offer-drawer">
            <div className="drawer-header">
              <span>Hacer una Oferta / Contraoferta</span>
              <button type="button" onClick={() => setShowOfferDrawer(false)}>✕</button>
            </div>
            <form onSubmit={handleCreateOffer} className="drawer-form">
              <div className="input-with-symbol">
                <span className="symbol">S/</span>
                <input
                  type="number"
                  className="input-field"
                  value={offerAmount}
                  onChange={(e) => setOfferAmount(Number(e.target.value))}
                  min={1}
                  required
                />
              </div>
              <button type="submit" className="btn-send-offer-confirm">
                Enviar Oferta al Chat
              </button>
            </form>
          </div>
        )}

        {/* Input Bar */}
        <form onSubmit={handleSend} className="chat-input-bar">
          <button
            type="button"
            className="chat-action-tool-btn"
            onClick={() => {
              setOfferAmount(activeConv.listing ? Math.round(activeConv.listing.precio * 0.9) : 100);
              setShowOfferDrawer(true);
            }}
            title="Hacer oferta"
          >
            <DollarSign size={20} color="#F5A623" />
          </button>
          
          <input
            type="text"
            className="chat-text-input"
            placeholder="Escribe un mensaje o haz tu trato..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />

          <button type="submit" className="chat-send-btn" disabled={!inputText.trim()}>
            <Send size={18} />
          </button>
        </form>
      </div>
    );
  }

  // Inbox list view
  return (
    <div className="tab-view messages-inbox-view">
      <div className="inbox-header">
        <h2>Bandeja de Mensajes y Tratos</h2>
        <p>Conversaciones directas, historial de ofertas y acuerdos activos en Bagua.</p>
      </div>

      <div className="conversations-list">
        {conversations.length === 0 ? (
          <div className="empty-inbox-state">
            <Handshake size={48} color="#94A3B8" />
            <h3>No tienes conversaciones activas</h3>
            <p>Explora publicaciones y presiona "Contactar" o "Hacer Oferta" para iniciar tu primer trato.</p>
          </div>
        ) : (
          conversations.map((conv) => (
            <div
              key={conv.id}
              className={`conversation-item ${conv.noLeidos > 0 ? 'unread' : ''}`}
              onClick={() => onSelectConversation(conv.id)}
            >
              <img src={conv.otroUsuario.avatarUrl} alt={conv.otroUsuario.nombre} className="inbox-avatar" />
              <div className="inbox-item-body">
                <div className="inbox-top-row">
                  <h4 className="inbox-user-name">{conv.otroUsuario.nombre}</h4>
                  <span className="inbox-time">{conv.ultimoMensajeHora}</span>
                </div>

                {conv.listing && (
                  <div className="inbox-listing-tag">
                    <span>📌 {conv.listing.titulo} (S/ {conv.listing.precio})</span>
                  </div>
                )}

                <p className="inbox-last-msg">{conv.ultimoMensaje}</p>

                <div className="inbox-bottom-row">
                  {conv.estadoTrato && (
                    <span className={getDealBadgeClass(conv.estadoTrato)}>
                      {conv.estadoTrato === 'NEGOCIACION' && '🟠 En Negociación'}
                      {conv.estadoTrato === 'ACEPTADO' && '🟢 Trato Aceptado'}
                      {conv.estadoTrato === 'EN_PROCESO' && '🔵 En Proceso'}
                      {conv.estadoTrato === 'COMPLETADO' && '✅ Completado'}
                    </span>
                  )}
                  {conv.noLeidos > 0 && <span className="unread-count-pill">{conv.noLeidos}</span>}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
