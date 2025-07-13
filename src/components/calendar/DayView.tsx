import React from 'react';
import { useAppointments } from '@/contexts/AppointmentContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Plus, Clock, User, Stethoscope } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DayViewProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  onAddAppointment: (date: Date) => void;
  onEditAppointment: (appointmentId: string) => void;
}

export const DayView: React.FC<DayViewProps> = ({
  selectedDate,
  onDateChange,
  onAddAppointment,
  onEditAppointment,
}) => {
  const { getAppointmentsByDate } = useAppointments();

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const formatDateForInput = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const formatDateDisplay = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const navigateDay = (direction: 'prev' | 'next') => {
    const newDate = new Date(selectedDate);
    if (direction === 'prev') {
      newDate.setDate(selectedDate.getDate() - 1);
    } else {
      newDate.setDate(selectedDate.getDate() + 1);
    }
    onDateChange(newDate);
  };

  const handleDateInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = new Date(e.target.value);
    if (!isNaN(newDate.getTime())) {
      onDateChange(newDate);
    }
  };

  const appointments = getAppointmentsByDate(formatDate(selectedDate));

  const isToday = () => {
    const today = new Date();
    return (
      selectedDate.getDate() === today.getDate() &&
      selectedDate.getMonth() === today.getMonth() &&
      selectedDate.getFullYear() === today.getFullYear()
    );
  };

  return (
    <div className="w-full">
      {/* Date Navigation */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-foreground">
          {formatDateDisplay(selectedDate)}
          {isToday() && (
            <Badge variant="secondary" className="ml-2">
              Today
            </Badge>
          )}
        </h2>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateDay('prev')}
            className="transition-smooth"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDateChange(new Date())}
            className="transition-smooth"
          >
            Today
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateDay('next')}
            className="transition-smooth"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Date Picker */}
      <div className="mb-6">
        <Label htmlFor="datePicker" className="text-sm font-medium">
          Jump to Date
        </Label>
        <Input
          id="datePicker"
          type="date"
          value={formatDateForInput(selectedDate)}
          onChange={handleDateInputChange}
          className="mt-1 w-full max-w-xs"
        />
      </div>

      {/* Add Appointment Button */}
      <div className="mb-6">
        <Button
          onClick={() => onAddAppointment(selectedDate)}
          className="w-full flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add New Appointment
        </Button>
      </div>

      {/* Appointments List */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">
          Appointments ({appointments.length})
        </h3>
        
        {appointments.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>No appointments scheduled for this day</p>
          </div>
        ) : (
          <div className="space-y-3">
            {appointments.map((appointment) => (
              <div
                key={appointment.id}
                className={cn(
                  'p-4 border border-border rounded-lg bg-card hover:bg-accent/50 transition-smooth cursor-pointer',
                  'shadow-sm hover:shadow-md'
                )}
                onClick={() => onEditAppointment(appointment.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="w-4 h-4 text-primary" />
                      <span className="font-semibold text-primary text-lg">
                        {appointment.time}
                      </span>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium">{appointment.patient.name}</span>
                        {appointment.patient.phone && (
                          <span className="text-sm text-muted-foreground">
                            • {appointment.patient.phone}
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Stethoscope className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{appointment.doctor.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {appointment.doctor.specialty}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <Badge variant="secondary" className="text-xs">
                      Tap to Edit
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};