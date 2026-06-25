import {
  validateMinLength,
  validatePhone,
  validateEmail,
  validateRequired,
  optional,
} from '../utils/validators';

export type ContactFieldId = 'name' | 'phone' | 'email' | 'message';

export interface ContactData {
  name: string;
  phone: string;
  email: string;
  message: string;
}

export interface FormField {
  id: ContactFieldId;
  label: string;
  type: string;
  placeholder: string;
  required: boolean;
  as: 'input' | 'textarea';
  rows?: number;
  /** Validador del campo. Reutiliza utils/validators (misma fuente que el backend). */
  validate: (value: string) => string | null;
}

export const CONTACT_FORM_FIELDS: FormField[] = [
  {
    id: 'name',
    label: 'Nombre Completo',
    type: 'text',
    placeholder: 'Ej. Juan Pérez',
    required: true,
    as: 'input',
    validate: (v) => validateMinLength(v, 3)
  },
  {
    id: 'phone',
    label: 'Teléfono',
    type: 'tel',
    placeholder: 'A este numero le llamaremos',
    required: true,
    as: 'input',
    validate: validatePhone
  },
  {
    id: 'email',
    label: 'Correo Electrónico (opcional)',
    type: 'email',
    placeholder: 'juan@ejemplo.com',
    required: false,
    as: 'input',
    validate: optional(validateEmail)
  },
  {
    id: 'message',
    label: 'Mensaje / Consulta',
    type: 'text',
    placeholder: 'Describe brevemente tu motivo de consulta...',
    required: true,
    as: 'textarea',
    rows: 4,
    validate: (v) => validateRequired(v, 'Mensaje')
  }
];
