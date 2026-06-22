import { SITE_CONFIG } from '../config/site';

export interface ContactInfoItem {
  icon: string;
  title: string;
  content: string | string[];
}

export const CONTACT_INFO: ContactInfoItem[] = [
  {
    icon: '📍',
    title: 'Dirección del Consultorio',
    content: SITE_CONFIG.contact.address
  },
  {
    icon: '📞',
    title: 'Teléfono & WhatsApp',
    content: SITE_CONFIG.contact.phoneFormatted
  },
  {
    icon: '✉️',
    title: 'Correo Electrónico',
    content: SITE_CONFIG.contact.email
  },
  {
    icon: '⏰',
    title: 'Horarios de Atención',
    content: [...SITE_CONFIG.contact.hours]
  }
];
