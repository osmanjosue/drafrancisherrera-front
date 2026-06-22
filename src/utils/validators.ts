const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[+]?[\d\s()-]{8,20}$/;
const PHONE_MIN_DIGITS = 8;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export const validateMinLength = (value: string, min: number): string | null => {
  if (!value || value.trim().length < min) {
    return `Debe tener al menos ${min} caracteres.`;
  }
  return null;
};

export const validatePhone = (value: string): string | null => {
  if (!value || !value.trim()) return 'Teléfono es requerido.';
  const digits = value.replace(/\D/g, '');
  if (digits.length < PHONE_MIN_DIGITS || !PHONE_RE.test(value)) {
    return 'Número de teléfono inválido (mínimo 8 dígitos).';
  }
  return null;
};

export const validateEmail = (value: string): string | null => {
  if (!value || !value.trim()) return 'Correo es requerido.';
  if (!EMAIL_RE.test(value)) return 'Correo electrónico inválido.';
  return null;
};

export const validateFutureDate = (value: string): string | null => {
  if (!value) return 'Fecha es requerida.';
  if (!DATE_RE.test(value)) return 'Formato de fecha inválido.';
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const selected = new Date(value + 'T00:00:00');
  if (selected < today) return 'La fecha no puede ser anterior a hoy.';
  return null;
};

const TIME_RE = /^\d{2}:\d{2}$/;

/**
 * Valida que la fecha+hora combinadas estén al menos `minLeadHours` horas en el
 * futuro. Interpreta la fecha+hora en la zona fija `tzOffset` (ej. '-06:00' para
 * Honduras) y compara contra el tiempo absoluto, para que front y back coincidan
 * sin importar la zona horaria del servidor.
 */
export const validateFutureDateTime = (
  date: string,
  time: string,
  minLeadHours: number,
  tzOffset: string
): string | null => {
  if (!date) return 'Fecha es requerida.';
  if (!time) return 'Hora es requerida.';
  if (!TIME_RE.test(time)) return 'Formato de hora inválido.';
  const when = new Date(`${date}T${time}:00${tzOffset}`);
  if (Number.isNaN(when.getTime())) return 'Fecha u hora inválida.';
  if (when.getTime() < Date.now() + minLeadHours * 60 * 60 * 1000) {
    return `Debes agendar con al menos ${minLeadHours} horas de anticipación.`;
  }
  return null;
};

export const validateRequired = (value: string, fieldName: string): string | null => {
  if (!value || !value.trim()) return `${fieldName} es requerido.`;
  return null;
};

/**
 * Hace opcional cualquier validador: si el campo está vacío lo da por válido;
 * si tiene contenido, aplica el validador original (ej. valida el formato).
 */
export const optional =
  (validator: (value: string) => string | null) =>
  (value: string): string | null => {
    if (!value || !value.trim()) return null;
    return validator(value);
  };
