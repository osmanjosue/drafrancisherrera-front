import type { ChangeEvent } from 'react';
import { BOOKING_FIELD_MAP } from './bookingForm';
import type { BookingField } from './bookingForm';
import type { BookingController } from './useBooking';
import { CONSULTATION_TYPES, SITE_CONFIG } from '../config/site';

interface BookingFieldRowProps {
  field: BookingField;
  value: string;
  error?: string;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

/** Renderiza un campo (input o textarea) con su etiqueta y mensaje de error. */
function BookingFieldRow({ field, value, error, onChange }: BookingFieldRowProps) {
  const inputId = `booking-${field.id}`;
  return (
    <div className={`form-group${error ? ' has-error' : ''}`}>
      <label htmlFor={inputId}>{field.label}</label>
      {field.control === 'textarea' ? (
        <textarea
          id={inputId}
          name={field.id}
          rows={field.rows}
          value={value}
          onChange={onChange}
          placeholder={field.placeholder}
        />
      ) : (
        <input
          id={inputId}
          name={field.id}
          type={field.type}
          value={value}
          onChange={onChange}
          placeholder={field.placeholder}
        />
      )}
      {error && <span className="form-error">{error}</span>}
    </div>
  );
}

interface BookingModalProps {
  booking: BookingController;
}

export function BookingModal({ booking }: BookingModalProps) {
  const { isOpen, step, loading, data, errors, close, setStep, handleChange, submit } = booking;

  if (!isOpen) return null;

  const field = (id: BookingField['id']) => (
    <BookingFieldRow
      field={BOOKING_FIELD_MAP[id]}
      value={data[id]}
      error={errors[id]}
      onChange={handleChange}
    />
  );

  return (
    <div className="modal-overlay" onClick={close}>
      <div className="modal-content glass-card" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={close}>×</button>

        {step === 'form' ? (
          <>
            <h3 className="modal-title">Agendar Tu Cita Médica</h3>
            <p className="modal-subtitle">
              Completa este breve formulario y confirmaremos tu espacio médico de inmediato.
            </p>

            <form onSubmit={submit} className="booking-form" noValidate>
              <div className="form-grid">
                {field('nombre')}
                {field('telefono')}
              </div>

              <div className="form-grid">
                {field('email')}
                {field('fecha')}
              </div>

              <div className="form-grid">
                {field('hora')}

                <div className="form-group">
                  <label htmlFor="booking-tipo">Tipo de Consulta</label>
                  <select id="booking-tipo" name="tipo" value={data.tipo} onChange={handleChange}>
                    {CONSULTATION_TYPES.map((t) => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {field('motivo')}

              <button type="submit" className="btn btn-primary w-full" disabled={loading}>
                {loading ? 'Enviando...' : 'Solicitar Agenda'}
              </button>
            </form>
          </>
        ) : step === 'error' ? (
          <div className="booking-success-view">
            <div className="success-icon error">!</div>
            <h3>Servicio no disponible</h3>
            <p>
              Nuestro sistema de agendamiento no se encuentra disponible en este momento.
              Disculpa las molestias.
            </p>
            <p className="success-details">
              Puedes agendar tu cita directamente por WhatsApp o llamada al{' '}
              <a
                className="whatsapp-link"
                href={SITE_CONFIG.whatsapp.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {SITE_CONFIG.contact.phoneFormatted}
              </a>
              . ¡Con gusto te atenderemos!
            </p>
            <button className="btn btn-primary" onClick={() => setStep('form')}>
              Intentar de nuevo
            </button>
          </div>
        ) : (
          <div className="booking-success-view">
            <div className="success-icon">✓</div>
            <h3>¡Solicitud Recibida Exitosamente!</h3>
            <p>
              Gracias por tu confianza, <strong>{data.nombre}</strong>. Hemos registrado tu
              solicitud para el día <strong>{data.fecha}</strong> a las <strong>{data.hora}</strong>{' '}
              de forma <strong>{data.tipo}</strong>.
            </p>
            <p className="success-details">
              Muy pronto nos pondremos en contacto contigo a través de WhatsApp para confirmar
              los detalles de tu cita. ¡Estamos para servirte!
            </p>
            <button className="btn btn-primary" onClick={close}>
              Entendido
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
