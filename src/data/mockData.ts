import { Patient, Doctor } from '@/types/appointment';

export const mockPatients: Patient[] = [
  { id: '1', name: 'John Smith', phone: '(555) 123-4567' },
  { id: '2', name: 'Sarah Johnson', phone: '(555) 234-5678' },
  { id: '3', name: 'Michael Brown', phone: '(555) 345-6789' },
  { id: '4', name: 'Emily Davis', phone: '(555) 456-7890' },
  { id: '5', name: 'Robert Wilson', phone: '(555) 567-8901' },
  { id: '6', name: 'Lisa Anderson', phone: '(555) 678-9012' },
  { id: '7', name: 'David Miller', phone: '(555) 789-0123' },
  { id: '8', name: 'Jennifer Garcia', phone: '(555) 890-1234' },
  { id: '9', name: 'Christopher Martinez', phone: '(555) 901-2345' },
  { id: '10', name: 'Amanda Taylor', phone: '(555) 012-3456' },
];

export const mockDoctors: Doctor[] = [
  { id: '1', name: 'Dr. William Thompson', specialty: 'Family Medicine' },
  { id: '2', name: 'Dr. Maria Rodriguez', specialty: 'Cardiology' },
  { id: '3', name: 'Dr. James Kim', specialty: 'Orthopedics' },
  { id: '4', name: 'Dr. Susan Chen', specialty: 'Pediatrics' },
  { id: '5', name: 'Dr. Robert Lee', specialty: 'Dermatology' },
  { id: '6', name: 'Dr. Linda White', specialty: 'Neurology' },
  { id: '7', name: 'Dr. Mark Johnson', specialty: 'Internal Medicine' },
  { id: '8', name: 'Dr. Patricia Brown', specialty: 'Gynecology' },
];

export const mockCredentials = {
  email: 'staff@clinic.com',
  password: '123456'
};