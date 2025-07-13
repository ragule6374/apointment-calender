import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Appointment, AppointmentWithDetails, Patient, Doctor } from '@/types/appointment';
import { mockPatients, mockDoctors } from '@/data/mockData';

interface AppointmentContextType {
  appointments: Appointment[];
  patients: Patient[];
  doctors: Doctor[];
  addAppointment: (appointment: Omit<Appointment, 'id'>) => void;
  updateAppointment: (id: string, appointment: Partial<Appointment>) => void;
  deleteAppointment: (id: string) => void;
  getAppointmentsByDate: (date: string) => AppointmentWithDetails[];
  getAppointmentById: (id: string) => AppointmentWithDetails | undefined;
}

const AppointmentContext = createContext<AppointmentContextType | undefined>(undefined);

export const useAppointments = () => {
  const context = useContext(AppointmentContext);
  if (context === undefined) {
    throw new Error('useAppointments must be used within an AppointmentProvider');
  }
  return context;
};

interface AppointmentProviderProps {
  children: ReactNode;
}

export const AppointmentProvider: React.FC<AppointmentProviderProps> = ({ children }) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [patients] = useState<Patient[]>(mockPatients);
  const [doctors] = useState<Doctor[]>(mockDoctors);

  // Load appointments from localStorage on mount
  useEffect(() => {
    const savedAppointments = localStorage.getItem('clinic-appointments');
    if (savedAppointments) {
      try {
        setAppointments(JSON.parse(savedAppointments));
      } catch (error) {
        console.error('Error loading appointments from localStorage:', error);
      }
    }
  }, []);

  // Save appointments to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('clinic-appointments', JSON.stringify(appointments));
  }, [appointments]);

  const addAppointment = (appointmentData: Omit<Appointment, 'id'>) => {
    const newAppointment: Appointment = {
      ...appointmentData,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    };
    setAppointments(prev => [...prev, newAppointment]);
  };

  const updateAppointment = (id: string, appointmentData: Partial<Appointment>) => {
    setAppointments(prev =>
      prev.map(apt => apt.id === id ? { ...apt, ...appointmentData } : apt)
    );
  };

  const deleteAppointment = (id: string) => {
    setAppointments(prev => prev.filter(apt => apt.id !== id));
  };

  const getAppointmentsByDate = (date: string): AppointmentWithDetails[] => {
    return appointments
      .filter(apt => apt.date === date)
      .map(apt => {
        const patient = patients.find(p => p.id === apt.patientId);
        const doctor = doctors.find(d => d.id === apt.doctorId);
        return {
          ...apt,
          patient: patient!,
          doctor: doctor!,
        };
      })
      .filter(apt => apt.patient && apt.doctor)
      .sort((a, b) => a.time.localeCompare(b.time));
  };

  const getAppointmentById = (id: string): AppointmentWithDetails | undefined => {
    const appointment = appointments.find(apt => apt.id === id);
    if (!appointment) return undefined;

    const patient = patients.find(p => p.id === appointment.patientId);
    const doctor = doctors.find(d => d.id === appointment.doctorId);

    if (!patient || !doctor) return undefined;

    return {
      ...appointment,
      patient,
      doctor,
    };
  };

  return (
    <AppointmentContext.Provider
      value={{
        appointments,
        patients,
        doctors,
        addAppointment,
        updateAppointment,
        deleteAppointment,
        getAppointmentsByDate,
        getAppointmentById,
      }}
    >
      {children}
    </AppointmentContext.Provider>
  );
};