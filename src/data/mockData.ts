import { Doctor, Patient } from '@/types/appointment';

export const mockPatients: Patient[] = [
  { id: '1', name: ' Santhos', phone: '9865142305' },
  { id: '2', name: 'Sarah ', phone: '7485236912' },
  { id: '3', name: 'Michael ', phone: '6374058025' },
  { id: '4', name: 'Davis', phone: '3698521547' },
  { id: '5', name: 'Raja', phone: '1234567890' },
  { id: '6', name: 'Lisa', phone: '8870074625' },
  { id: '7', name: 'Miller', phone: '6398745263' },
  { id: '8', name: 'Jennifer Garcia', phone: '3698527415' },
  { id: '9', name: 'Christopher Martinez', phone: '6398457452' },
  { id: '10', name: 'Anand', phone: '3698524712' },
];

export const mockDoctors: Doctor[] = [
  { id: '1', name: 'Dr. Sanjana', specialty: 'Family Medicine' },
  { id: '2', name: 'Dr. Maria Rodriguez', specialty: 'Cardiology' },
  { id: '3', name: 'Dr. Krishana', specialty: 'Orthopedics' },
  { id: '4', name: 'Dr. Susan Chen', specialty: 'Pediatrics' },
  { id: '5', name: 'Dr. Robert Lee', specialty: 'Dermatology' },
  { id: '6', name: 'Dr. Ragul', specialty: 'Neurology' },
  { id: '7', name: 'Dr. Sanjay', specialty: 'Internal Medicine' },
  { id: '8', name: 'Dr. Patricia Brown', specialty: 'Gynecology' },
];

export const mockCredentials = {
  email: 'staff@clinic.com',
  password: '123456'
};