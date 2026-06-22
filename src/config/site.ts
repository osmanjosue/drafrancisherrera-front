/**
 * site.ts — Fuente única de verdad de los datos de contacto y branding del sitio.
 *
 * Cambiar aquí el teléfono, correo, dirección o logo se refleja en TODO el sitio:
 * la sección de contacto, el widget de chat, el modal de reserva y los enlaces de
 * WhatsApp. No dupliques estos valores en componentes ni en otros archivos de data.
 */

/** Teléfono en crudo: código de país (504) + 8 dígitos, sin signos ni espacios. */
const PHONE_RAW = '50489979455';

/** Formatea un número hondureño crudo (504 + 8 dígitos) como "+504 XXXX-XXXX". */
const formatHonduras = (raw: string): string => {
  const country = raw.slice(0, 3);
  const local = raw.slice(3);
  return `+${country} ${local.slice(0, 4)}-${local.slice(4)}`;
};

const WHATSAPP_MESSAGE = 'Hola, vengo desde la web y necesito ayuda para agendar una cita.';

export const SITE_CONFIG = {
  /** Ruta del logo (en /public). Usada por la máscara CSS del header, hero y footer. */
  logoUrl: '/saludMujerLogo.svg',
  contact: {
    phoneRaw: PHONE_RAW,
    phoneFormatted: formatHonduras(PHONE_RAW),
    email: 'contacto@drafrancisherrera.com',
    address:
      'Tocoa, Colón, Barrio Las Flores, Plaza San Miguel (Clínica Santa Fe / Clínica Salud Mujer)',
    hours: [
      'Lunes a Viernes: 9:00 AM - 5:00 PM',
      'Sábados: 9:00 AM - 1:00 PM',
    ],
  },
  whatsapp: {
    phone: PHONE_RAW,
    defaultMessage: WHATSAPP_MESSAGE,
    url: `https://wa.me/${PHONE_RAW}`,
  },
} as const;

/**
 * Tipos de consulta disponibles en el modal de reserva.
 * A futuro, descomentar 'Online' lo habilita automáticamente en el formulario.
 */
export const CONSULTATION_TYPES = [
  { value: 'Presencial', label: 'Presencial (Plaza San Miguel - Clínica Santa Fe / Salud Mujer)' },
  // { value: 'Online', label: 'Online / Telemedicina' },
] as const;

export const DEFAULT_CONSULTATION_TYPE = CONSULTATION_TYPES[0].value;

/**
 * Reglas de negocio para agendar una cita.
 * - minLeadHours: margen mínimo de anticipación (horas) entre ahora y la cita.
 * - timezoneOffset: zona horaria fija del consultorio (Honduras, UTC-6, sin DST).
 *   Se usa para que la validación de hora coincida en front y back.
 */
export const BOOKING_RULES = {
  minLeadHours: 2,
  timezoneOffset: '-06:00',
} as const;
