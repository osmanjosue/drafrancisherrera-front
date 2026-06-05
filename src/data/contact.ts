export interface ContactInfoItem {
  icon: string;
  title: string;
  content: string | string[];
}

export const CONTACT_INFO: ContactInfoItem[] = [
  {
    icon: '📍',
    title: 'Dirección del Consultorio',
    content: 'Tocoa, Colón, Barrio Las Flores, Plaza San Miguel (Clínica Santa Fe / Clínica Salud Mujer)'
  },
  {
    icon: '📞',
    title: 'Teléfono & WhatsApp',
    content: '+504 8997-9455'
  },
  {
    icon: '✉️',
    title: 'Correo Electrónico',
    content: 'contacto@drafrancisherrera.com'
  },
  {
    icon: '⏰',
    title: 'Horarios de Atención',
    content: [
      'Lunes a Viernes: 9:00 AM - 5:00 PM',
      'Sábados: 9:00 AM - 1:00 PM'
    ]
  }
];
