import React, { useState } from 'react';
import { X, Star, Award, CheckCircle2 } from 'lucide-react';
import type { Deal } from '../types';

interface ReviewModalProps {
  deal: Deal | null;
  onClose: () => void;
  onSubmitReview: (reviewData: {
    dealId: string;
    destinatarioId: string;
    puntuacionGeneral: number;
    calidad: number;
    atencion: number;
    cumplimiento: number;
    comentario: string;
  }) => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({
  deal,
  onClose,
  onSubmitReview,
}) => {
  const [general, setGeneral] = useState(5);
  const [calidad, setCalidad] = useState(5);
  const [atencion, setAtencion] = useState(5);
  const [cumplimiento, setCumplimiento] = useState(5);
  const [comentario, setComentario] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!deal) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitReview({
      dealId: deal.id,
      destinatarioId: deal.vendedorId,
      puntuacionGeneral: general,
      calidad,
      atencion,
      cumplimiento,
      comentario: comentario.trim() || 'Trato completado de forma excelente. Muy recomendado.',
    });
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 1500);
  };

  const renderStarSelector = (value: number, setValue: (val: number) => void) => (
    <div className="star-selector-row">
      {[1, 2, 3, 4, 5].map((s) => (
        <button
          key={s}
          type="button"
          className="star-btn"
          onClick={() => setValue(s)}
        >
          <Star
            size={24}
            fill={s <= value ? '#F5A623' : '#E2E8F0'}
            color={s <= value ? '#F5A623' : '#CBD5E1'}
          />
        </button>
      ))}
      <span className="star-val-label">{value} / 5</span>
    </div>
  );

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-sheet review-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header-simple">
          <h3>Calificar Trato Realizado</h3>
          <button type="button" className="circle-action-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {submitted ? (
          <div className="review-success-state">
            <CheckCircle2 size={56} color="#10B981" />
            <h3>¡Gracias por tu Calificación!</h3>
            <p>Tu opinión fortalece la reputación y confianza del comercio en Bagua y el Perú.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="review-form">
            <div className="review-deal-summary">
              <img src={deal.listingFoto} alt={deal.listingTitulo} className="review-deal-thumb" />
              <div>
                <strong>{deal.listingTitulo}</strong>
                <p>Trato con: {deal.vendedorNombre} • S/ {deal.precioAcordado}</p>
              </div>
            </div>

            <div className="rating-field">
              <label>Calificación General de la Experiencia</label>
              {renderStarSelector(general, setGeneral)}
            </div>

            <div className="metric-ratings-card">
              <div className="metric-row">
                <span>Calidad del Producto / Servicio:</span>
                {renderStarSelector(calidad, setCalidad)}
              </div>
              <div className="metric-row">
                <span>Atención y Comunicación:</span>
                {renderStarSelector(atencion, setAtencion)}
              </div>
              <div className="metric-row">
                <span>Puntualidad y Cumplimiento del Acuerdo:</span>
                {renderStarSelector(cumplimiento, setCumplimiento)}
              </div>
            </div>

            <div className="form-group">
              <label>Deja tu Comentario o Recomendación</label>
              <textarea
                className="review-textarea"
                rows={3}
                placeholder="Escribe cómo fue tu trato, la atención recibida y si lo recomiendas..."
                value={comentario}
                onChange={(e) => setComentario(e.target.value)}
              />
            </div>

            <button type="submit" className="btn-submit-review">
              <Award size={18} />
              <span>Publicar Reseña y Calificación</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
