export interface Patient {
  id: string;
  name: string;
  phone?: string;
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  date: string; // YYYY-MM-DD format
  time: string; // HH:mm format
  duration?: number; // in minutes
  notes?: string;
}

export interface AppointmentWithDetails extends Appointment {
  patient: Patient;
  doctor: Doctor;
}