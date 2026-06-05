export interface FormField {
  id: 'name' | 'phone' | 'email' | 'message';
  label: string;
  type: string;
  placeholder: string;
  required: boolean;
  as: 'input' | 'textarea';
  rows?: number;
}

export const CONTACT_FORM_FIELDS: FormField[] = [
  {
    id: 'name',
    label: 'Nombre Completo',
    type: 'text',
    placeholder: 'Ej. Juan Pérez',
    required: true,
    as: 'input'
  },
  {
    id: 'phone',
    label: 'Teléfono',
    type: 'tel',
    placeholder: 'A este numero le llamaremos',
    required: true,
    as: 'input'
  },
  {
    id: 'email',
    label: 'Correo Electrónico',
    type: 'email',
    placeholder: 'juan@ejemplo.com',
    required: false,
    as: 'input'
  },
  {
    id: 'message',
    label: 'Mensaje / Consulta',
    type: 'text',
    placeholder: 'Describe brevemente tu motivo de consulta...',
    required: true,
    as: 'textarea',
    rows: 4
  }
];
