import React, { useState } from 'react';
import { X, AlertTriangle, ShieldCheck } from 'lucide-react';
import type { Listing } from '../types';

interface ReportModalProps {
  listing: Listing | null;
  onClose: () => void;
  onSubmitReport: (reason: string, details: string) => void;
}

export const ReportModal: React.FC<ReportModalProps> = ({
  listing,
  onClose,
  onSubmitReport,
}) => {
  const [reason, setReason] = useState('ESTAFA');
  const [details, setDetails] = useState('');
  const [sent, setSent] = useState(false);

  if (!listing) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitReport(reason, details);
    setSent(true);
    setTimeout(() => {
      setSent(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-sheet report-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header-simple">
          <div className="header-title-flex">
            <AlertTriangle size={20} color="#DC2626" />
            <h3>Reportar Publicación</h3>
          </div>
          <button type="button" className="circle-action-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {sent ? (
          <div className="review-success-state">
            <ShieldCheck size={50} color="#10B981" />
            <h3>Reporte Enviado</h3>
            <p>Nuestro equipo de moderación en Bagua revisará este contenido de inmediato.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="report-form">
            <p className="report-lead">
              Reportando: <strong>{listing.titulo}</strong>
            </p>

            <div className="form-group">
              <label>Motivo del Reporte</label>
              <select
                className="report-select"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              >
                <option value="ESTAFA">Posible Estafa o Fraude</option>
                <option value="SPAM">Spam o Publicación Duplicada</option>
                <option value="PRODUCTO_PROHIBIDO">Producto o Servicio Prohibido</option>
                <option value="INFORMACION_FALSA">Información o Precio Engañoso</option>
                <option value="CONTENIDO_OFENSIVO">Contenido Ofensivo o Inapropiado</option>
                <option value="OTRO">Otro Motivo</option>
              </select>
            </div>

            <div className="form-group">
              <label>Detalles adicionales (opcional)</label>
              <textarea
                className="review-textarea"
                rows={3}
                placeholder="Explica brevemente la razón de tu reporte..."
                value={details}
                onChange={(e) => setDetails(e.target.value)}
              />
            </div>

            <button type="submit" className="btn-send-report">
              Enviar Reporte a Moderación
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
