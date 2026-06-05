export interface DoctorInfo {
  name: string;
  fullName: string;
  colegiacion: string[];
  specialties: string[];
  experience: string[];
  patients: string;
  quote: string;
}

export const DOCTOR_INFO: DoctorInfo = {
  name: 'Dra. Francis Herrera',
  fullName: 'Dra. Francis Lizeth Herrera',
  colegiacion: [
    'Colegio Médico de Honduras',
    'No. 9908'
  ],
  specialties: [
    'Médica y Cirujana General',
    'Especialista en Ginecología y Obstetricia',
    'Ginecología Estética Funcional y Regenerativa'
  ],
  experience: [
    '12 años de experiencia como Médica General',
    '3 años de experiencia como Especialista en Ginecología y Obstetricia'
  ],
  patients: 'Más de 1,000 pacientes atendidas',
  quote: '“Salud femenina, equilibrio hormonal y bienestar íntimo con respaldo científico y atención humana.”'
};
