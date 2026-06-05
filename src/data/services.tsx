import type { ReactNode } from 'react';

export interface Service {
  id: number;
  title: string;
  description: string;
  icon: ReactNode;
  items: string[];
}

export const SERVICES: Service[] = [
  {
    id: 1,
    title: 'Ginecología General',
    description: 'Control anual, detección temprana y tratamientos clínicos para cuidar de tu salud íntima en cada etapa.',
    icon: (
      <svg className="service-icon" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </svg>
    ),
    items: [
      'Control ginecológico anual.',
      'Citología cervical.',
      'Colposcopia.',
      'Diagnóstico y tratamiento de infecciones vaginales.',
      'Manejo de trastornos menstruales.',
      'Evaluación y tratamiento del Síndrome Ovárico Metabólico Poliendocrino (SOMP).',
      'Diagnóstico y manejo de miomatosis uterina.',
      'Diagnóstico y manejo de quistes ováricos.'
    ]
  },
  {
    id: 2,
    title: 'Cirugía Ginecológica',
    description: 'Procedimientos quirúrgicos especializados con técnicas modernas y mínimamente invasivas para tu pronta recuperación.',
    icon: (
      <svg className="service-icon" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.121 14.121L19 19M12 4v4m0 8v4m-8-8h4m8 0h4" />
        <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" />
      </svg>
    ),
    items: [
      'Histerectomía.',
      'Miomectomía.',
      'Resección de quistes ováricos.',
      'Conización cervical.',
      'Biopsias ginecológicas.'
    ]
  },
  {
    id: 3,
    title: 'Obstetricia',
    description: 'Cuidado integral del embarazo, control prenatal detallado y acompañamiento experto en el parto y posparto.',
    icon: (
      <svg className="service-icon" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
    items: [
      'Control prenatal.',
      'Ultrasonido obstétrico.',
      'Atención de parto.',
      'Cesáreas.',
      'Control posparto.'
    ]
  },
  {
    id: 4,
    title: 'Planificación Familiar',
    description: 'Asesoría anticonceptiva personalizada y colocación/retiro de métodos de larga duración altamente efectivos.',
    icon: (
      <svg className="service-icon" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3" />
      </svg>
    ),
    items: [
      'Asesoría anticonceptiva personalizada.',
      'Colocación y retiro de dispositivos intrauterinos (DIU).',
      'Colocación y retiro de implantes subdérmicos.'
    ]
  },
  {
    id: 5,
    title: 'Ginecología Estética Funcional y Regenerativa',
    description: 'Tratamientos avanzados con láser y terapias regenerativas para mejorar tu calidad de vida y bienestar íntimo.',
    icon: (
      <svg className="service-icon" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
      </svg>
    ),
    items: [
      'Rejuvenecimiento íntimo femenino.',
      'Tratamientos con láser ginecológico.',
      'Manejo de atrofia vaginal.',
      'Tratamiento de sequedad vaginal.',
      'Manejo de laxitud vaginal.',
      'Tratamiento de incontinencia urinaria leve.',
      'Manejo de dispareunia (dolor durante las relaciones sexuales).',
      'Regeneración vulvovaginal.',
      'Blanqueamiento íntimo.'
    ]
  },
  {
    id: 6,
    title: 'Prevención y Diagnóstico Especializado',
    description: 'Métodos avanzados de prevención como vacunación, tipificación de VPH y chequeos preventivos oportunos.',
    icon: (
      <svg className="service-icon" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    items: [
      'Vacunación contra el Virus del Papiloma Humano (VPH).',
      'PCR para Virus del Papiloma Humano (VPH).',
      'Detección temprana de cáncer de cuello uterino.',
      'Detección temprana de cáncer de mama.',
      'Chequeos ginecológicos preventivos.'
    ]
  }
];
