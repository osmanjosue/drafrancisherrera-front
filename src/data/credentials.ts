export interface CredentialItem {
  title: string;
  institution: string;
  distinction?: string;
}

export interface CredentialCategory {
  title: string;
  icon: string;
  items: CredentialItem[];
}

export const CREDENTIALS: CredentialCategory[] = [
  {
    title: 'Formación Académica',
    icon: '🎓',
    items: [
      {
        title: 'Doctora en Medicina y Cirugía',
        institution: 'Universidad Nacional Autónoma de Honduras (UNAH), 2014.'
      },
      {
        title: 'Magíster Artium y Especialista en Ginecología y Obstetricia',
        institution: 'Universidad Mariano Gálvez de Guatemala, 2024.',
        distinction: 'Distinción Cum Laude'
      }
    ]
  },
  {
    title: 'Certificaciones Internacionales',
    icon: '🌐',
    items: [
      {
        title: 'Ginecología Láser y Estética',
        institution: 'Certificada por The American Board of Laser Surgery (ABLS), 2025.'
      },
      {
        title: 'Armonización Vulvar',
        institution: 'Curso Práctico Avanzado — SILGEF y The American Board of Laser Surgery (ABLS), Ciudad de México, 2025.'
      }
    ]
  },
  {
    title: 'Diplomados',
    icon: '📜',
    items: [
      {
        title: 'Ginecología Estética Funcional y Regenerativa',
        institution: 'Diplomado Avanzado — ACOG Guatemala.'
      },
      {
        title: 'Colposcopía, Vulva y VPH (160 horas)',
        institution: 'Diplomado Internacional — SAVEPH, UISEK, UAI e IFCPC, 2025.'
      },
      {
        title: 'Menopausia y Andropausia',
        institution: 'Diplomado Internacional de la Asociación Argentina de Menopausia y Andropausia (AAMA) — Actualmente cursando.'
      }
    ]
  }
];
