import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { CONTACT_FORM_FIELDS } from '../data/contactForm';
import type { ContactData, ContactFieldId } from '../data/contactForm';

export type ContactStep = 'form' | 'success' | 'error';

type ContactErrors = Partial<Record<ContactFieldId, string>>;

const createInitialData = (): ContactData => ({
  name: '',
  phone: '',
  email: '',
  message: '',
});

/**
 * useContact — Lógica (NO-UI) del formulario de contacto: estado, validación
 * (leída de CONTACT_FORM_FIELDS) y envío al backend propio, que valida y envía
 * el correo a la doctora vía Brevo. Mismo patrón que useBooking.
 */
export function useContact() {
  const [step, setStep] = useState<ContactStep>('form');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<ContactData>(createInitialData);
  const [errors, setErrors] = useState<ContactErrors>({});

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const name = e.target.name as ContactFieldId;
    setData((prev) => ({ ...prev, [name]: e.target.value }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[name];
      return next;
    });
  };

  const validate = (): ContactErrors => {
    const result: ContactErrors = {};
    for (const field of CONTACT_FORM_FIELDS) {
      const error = field.validate(data[field.id]);
      if (error) result[field.id] = error;
    }
    return result;
  };

  const reset = () => {
    setData(createInitialData());
    setErrors({});
    setStep('form');
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
      const res = await fetch(import.meta.env.VITE_CONTACT_EMAIL_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error();
      setData(createInitialData());
      setStep('success');
    } catch {
      setStep('error');
    } finally {
      setLoading(false);
    }
  };

  return { step, loading, data, errors, setStep, handleChange, submit, reset };
}

export type ContactController = ReturnType<typeof useContact>;
