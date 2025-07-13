import React, { useState, useEffect } from 'react';
import { useAppointments } from '@/contexts/AppointmentContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Trash2, Save, AlertCircle, Clock, User, Stethoscope } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: Date;
  editingAppointmentId?: string | null;
}

export const AppointmentModal: React.FC<AppointmentModalProps> = ({
  isOpen,
  onClose,
  selectedDate,
  editingAppointmentId,
}) => {
  const {
    patients,
    doctors,
    addAppointment,
    updateAppointment,
    deleteAppointment,
    getAppointmentById,
    getAppointmentsByDate,
  } = useAppointments();

  const [formData, setFormData] = useState({
    patientId: '',
    doctorId: '',
    time: '',
    notes: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const isEditing = Boolean(editingAppointmentId);

  useEffect(() => {
    if (isEditing && editingAppointmentId) {
      const appointment = getAppointmentById(editingAppointmentId);
      if (appointment) {
        setFormData({
          patientId: appointment.patientId,
          doctorId: appointment.doctorId,
          time: appointment.time,
          notes: appointment.notes || '',
        });
      }
    } else {
      setFormData({
        patientId: '',
        doctorId: '',
        time: '',
        notes: '',
      });
    }
    setErrors({});
  }, [isEditing, editingAppointmentId, getAppointmentById]);

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.patientId) {
      newErrors.patientId = 'Please select a patient';
    }
    if (!formData.doctorId) {
      newErrors.doctorId = 'Please select a doctor';
    }
    if (!formData.time) {
      newErrors.time = 'Please select a time';
    }

    // Check for time conflicts (excluding current appointment if editing)
    if (formData.time && formData.doctorId) {
      const dateString = formatDate(selectedDate);
      const existingAppointments = getAppointmentsByDate(dateString);
      const conflictingAppointment = existingAppointments.find(
        (apt) =>
          apt.time === formData.time &&
          apt.doctor.id === formData.doctorId &&
          (!isEditing || apt.id !== editingAppointmentId)
      );

      if (conflictingAppointment) {
        newErrors.time = `Dr. ${conflictingAppointment.doctor.name} already has an appointment at this time`;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const appointmentData = {
        patientId: formData.patientId,
        doctorId: formData.doctorId,
        date: formatDate(selectedDate),
        time: formData.time,
        notes: formData.notes,
      };

      if (isEditing && editingAppointmentId) {
        updateAppointment(editingAppointmentId, appointmentData);
        toast({
          title: "Appointment Updated",
          description: "The appointment has been successfully updated.",
        });
      } else {
        addAppointment(appointmentData);
        toast({
          title: "Appointment Created",
          description: "The appointment has been successfully created.",
        });
      }

      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save appointment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!editingAppointmentId) return;

    if (window.confirm('Are you sure you want to delete this appointment?')) {
      setIsLoading(true);
      try {
        deleteAppointment(editingAppointmentId);
        toast({
          title: "Appointment Deleted",
          description: "The appointment has been successfully deleted.",
        });
        onClose();
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete appointment. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 8; hour < 18; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push(timeString);
      }
    }
    return slots;
  };

  const selectedPatient = patients.find(p => p.id === formData.patientId);
  const selectedDoctor = doctors.find(d => d.id === formData.doctorId);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            {isEditing ? 'Edit Appointment' : 'New Appointment'}
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            {selectedDate.toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Patient Selection */}
          <div className="space-y-2">
            <Label htmlFor="patient" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Patient
            </Label>
            <Select
              value={formData.patientId}
              onValueChange={(value) =>
                setFormData(prev => ({ ...prev, patientId: value }))
              }
            >
              <SelectTrigger className={errors.patientId ? 'border-destructive' : ''}>
                <SelectValue placeholder="Select a patient" />
              </SelectTrigger>
              <SelectContent>
                {patients.map((patient) => (
                  <SelectItem key={patient.id} value={patient.id}>
                    <div>
                      <div className="font-medium">{patient.name}</div>
                      {patient.phone && (
                        <div className="text-xs text-muted-foreground">{patient.phone}</div>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.patientId && (
              <p className="text-sm text-destructive">{errors.patientId}</p>
            )}
          </div>

          {/* Doctor Selection */}
          <div className="space-y-2">
            <Label htmlFor="doctor" className="flex items-center gap-2">
              <Stethoscope className="w-4 h-4" />
              Doctor
            </Label>
            <Select
              value={formData.doctorId}
              onValueChange={(value) =>
                setFormData(prev => ({ ...prev, doctorId: value }))
              }
            >
              <SelectTrigger className={errors.doctorId ? 'border-destructive' : ''}>
                <SelectValue placeholder="Select a doctor" />
              </SelectTrigger>
              <SelectContent>
                {doctors.map((doctor) => (
                  <SelectItem key={doctor.id} value={doctor.id}>
                    <div>
                      <div className="font-medium">{doctor.name}</div>
                      <div className="text-xs text-muted-foreground">{doctor.specialty}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.doctorId && (
              <p className="text-sm text-destructive">{errors.doctorId}</p>
            )}
          </div>

          {/* Time Selection */}
          <div className="space-y-2">
            <Label htmlFor="time" className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Time
            </Label>
            <Select
              value={formData.time}
              onValueChange={(value) =>
                setFormData(prev => ({ ...prev, time: value }))
              }
            >
              <SelectTrigger className={errors.time ? 'border-destructive' : ''}>
                <SelectValue placeholder="Select a time" />
              </SelectTrigger>
              <SelectContent>
                {generateTimeSlots().map((time) => (
                  <SelectItem key={time} value={time}>
                    {time}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.time && (
              <p className="text-sm text-destructive">{errors.time}</p>
            )}
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Add any additional notes..."
              value={formData.notes}
              onChange={(e) =>
                setFormData(prev => ({ ...prev, notes: e.target.value }))
              }
              rows={3}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4">
            {isEditing && (
              <Button
                type="button"
                variant="destructive"
                onClick={handleDelete}
                disabled={isLoading}
                className="flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </Button>
            )}
            <div className="flex-1" />
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="flex items-center gap-2">
              <Save className="w-4 h-4" />
              {isLoading ? 'Saving...' : isEditing ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};