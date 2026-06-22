import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { BOOKING_FIELDS } from './bookingForm';
import type { BookingData, BookingFieldId } from './bookingForm';
import { DEFAULT_CONSULTATION_TYPE } from '../config/site';

export type BookingStep = 'form' | 'success' | 'error';

type BookingErrors = Partial<Record<BookingFieldId, string>>;

const createInitialData = (): BookingData => ({
  nombre: '',
  telefono: '',
  email: '',
  fecha: '',
  hora: '',
  motivo: '',
  tipo: DEFAULT_CONSULTATION_TYPE,
});

/**
 * useBooking — Toda la lógica (NO-UI) del modal de reserva: estado del formulario,
 * apertura/cierre, validación (leída de BOOKING_FIELDS) y envío al backend.
 * El componente BookingModal solo consume este controlador.
 */
export function useBooking() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<BookingStep>('form');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<BookingData>(createInitialData);
  const [errors, setErrors] = useState<BookingErrors>({});

  /** Abre el modal. Permite precargar el motivo (ej. desde una tarjeta de servicio). */
  const open = (motivo?: string) => {
    if (motivo) setData((prev) => ({ ...prev, motivo }));
    setIsOpen(true);
  };

  const close = () => {
    setIsOpen(false);
    setStep('form');
    setLoading(false);
    setErrors({});
    setData(createInitialData());
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const name = e.target.name as keyof BookingData;
    setData((prev) => ({ ...prev, [name]: e.target.value }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[name as BookingFieldId];
      return next;
    });
  };

  const validate = (): BookingErrors => {
    const result: BookingErrors = {};
    for (const field of BOOKING_FIELDS) {
      const error = field.validate(data[field.id], data);
      if (error) result[field.id] = error;
    }
    return result;
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(import.meta.env.VITE_BOOKING_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error();
      setStep('success');
    } catch {
      setStep('error');
    } finally {
      setLoading(false);
    }
  };

  return { isOpen, step, loading, data, errors, open, close, setStep, handleChange, submit };
}

export type BookingController = ReturnType<typeof useBooking>;
