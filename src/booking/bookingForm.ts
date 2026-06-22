import {
  validateMinLength,
  validatePhone,
  validateEmail,
  validateFutureDate,
  validateFutureDateTime,
  validateRequired,
  optional,
} from '../utils/validators';
import { BOOKING_RULES } from '../config/site';

export type BookingFieldId = 'nombre' | 'telefono' | 'email' | 'fecha' | 'hora' | 'motivo';

/** Forma de los datos del formulario de reserva. */
export interface BookingData {
  nombre: string;
  telefono: string;
  email: string;
  fecha: string;
  hora: string;
  motivo: string;
  tipo: string;
}

export interface BookingField {
  id: BookingFieldId;
  label: string;
  control: 'input' | 'textarea';
  type?: string;
  placeholder?: string;
  rows?: number;
  /**
   * Regla de validación. Recibe el valor del campo y el `data` completo (para
   * validaciones cruzadas). Devuelve un mensaje de error o null si es válido.
   */
  validate: (value: string, data: BookingData) => string | null;
}

/**
 * Definición declarativa de los campos del formulario de reserva.
 * Cada campo co-localiza su etiqueta, placeholder y su regla de validación,
 * por lo que el render (BookingModal) y la validación (useBooking) leen de aquí.
 */
export const BOOKING_FIELDS: BookingField[] = [
  {
    id: 'nombre',
    label: 'Nombre Completo',
    control: 'input',
    type: 'text',
    placeholder: 'Ej. María López',
    validate: (v) => validateMinLength(v, 3),
  },
  {
    id: 'telefono',
    label: 'Número de Teléfono',
    control: 'input',
    type: 'tel',
    placeholder: 'Ej. +504 9999-1111',
    validate: validatePhone,
  },
  {
    id: 'email',
    label: 'Correo Electrónico (opcional)',
    control: 'input',
    type: 'email',
    placeholder: 'maria@ejemplo.com',
    validate: optional(validateEmail),
  },
  {
    id: 'fecha',
    label: 'Fecha Deseada',
    control: 'input',
    type: 'date',
    validate: validateFutureDate,
  },
  {
    id: 'hora',
    label: 'Hora Deseada',
    control: 'input',
    type: 'time',
    validate: (v, data) =>
      validateFutureDateTime(data.fecha, v, BOOKING_RULES.minLeadHours, BOOKING_RULES.timezoneOffset),
  },
  {
    id: 'motivo',
    label: 'Motivo de Consulta / Síntomas',
    control: 'textarea',
    rows: 3,
    placeholder: 'Ej. Chequeo general rutinario, dolor de cabeza constante, etc.',
    validate: (v) => validateRequired(v, 'Motivo de consulta'),
  },
];

/** Acceso por id para renderizar campos puntuales manteniendo el layout explícito. */
export const BOOKING_FIELD_MAP = Object.fromEntries(
  BOOKING_FIELDS.map((field) => [field.id, field])
) as Record<BookingFieldId, BookingField>;
