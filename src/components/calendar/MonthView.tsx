import React from 'react';
import { useAppointments } from '@/contexts/AppointmentContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MonthViewProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  onAddAppointment: (date: Date) => void;
  onEditAppointment: (appointmentId: string) => void;
}

export const MonthView: React.FC<MonthViewProps> = ({
  selectedDate,
  onDateSelect,
  onAddAppointment,
  onEditAppointment,
}) => {
  const { getAppointmentsByDate } = useAppointments();

  const currentYear = selectedDate.getFullYear();
  const currentMonth = selectedDate.getMonth();

  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
  const firstDayOfWeek = firstDayOfMonth.getDay();
  const daysInMonth = lastDayOfMonth.getDate();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(selectedDate);
    if (direction === 'prev') {
      newDate.setMonth(currentMonth - 1);
    } else {
      newDate.setMonth(currentMonth + 1);
    }
    onDateSelect(newDate);
  };

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const isToday = (day: number) => {
    const today = new Date();
    return (
      today.getDate() === day &&
      today.getMonth() === currentMonth &&
      today.getFullYear() === currentYear
    );
  };

  const getDayDate = (day: number) => {
    return new Date(currentYear, currentMonth, day);
  };

  const renderCalendarDay = (day: number) => {
    const dayDate = getDayDate(day);
    const dateString = formatDate(dayDate);
    const appointments = getAppointmentsByDate(dateString);
    const isCurrentDay = isToday(day);

    return (
      <div
        key={day}
        className={cn(
          'min-h-[120px] border border-border p-2 bg-card hover:bg-accent/50 transition-smooth cursor-pointer relative group',
          isCurrentDay && 'bg-primary/10 border-primary'
        )}
        onClick={() => onDateSelect(dayDate)}
      >
        <div className="flex items-start justify-between mb-2">
          <span
            className={cn(
              'text-sm font-medium',
              isCurrentDay ? 'text-primary font-bold' : 'text-foreground'
            )}
          >
            {day}
          </span>
          <Button
            size="sm"
            variant="ghost"
            className="opacity-0 group-hover:opacity-100 w-6 h-6 p-0 transition-smooth"
            onClick={(e) => {
              e.stopPropagation();
              onAddAppointment(dayDate);
            }}
          >
            <Plus className="w-3 h-3" />
          </Button>
        </div>
        
        <div className="space-y-1">
          {appointments.slice(0, 3).map((appointment) => (
            <div
              key={appointment.id}
              className="text-xs p-1 rounded bg-primary/20 hover:bg-primary/30 transition-smooth cursor-pointer truncate"
              onClick={(e) => {
                e.stopPropagation();
                onEditAppointment(appointment.id);
              }}
            >
              <div className="font-medium truncate">{appointment.time}</div>
              <div className="truncate text-muted-foreground">
                {appointment.patient.name}
              </div>
            </div>
          ))}
          {appointments.length > 3 && (
            <div className="text-xs text-muted-foreground text-center">
              +{appointments.length - 3} more
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderEmptyDay = (index: number) => (
    <div key={`empty-${index}`} className="min-h-[120px] border border-border p-2 bg-muted/20" />
  );

  return (
    <div className="w-full">
      {/* Month Navigation */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-foreground">
          {monthNames[currentMonth]} {currentYear}
        </h2>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateMonth('prev')}
            className="transition-smooth"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDateSelect(new Date())}
            className="transition-smooth"
          >
            Today
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateMonth('next')}
            className="transition-smooth"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-0 border border-border rounded-lg overflow-hidden">
        {/* Day Names Header */}
        {dayNames.map((dayName) => (
          <div
            key={dayName}
            className="bg-muted p-3 text-center text-sm font-medium text-muted-foreground border-b border-border"
          >
            {dayName}
          </div>
        ))}

        {/* Empty cells for days before the month starts */}
        {Array.from({ length: firstDayOfWeek }, (_, index) => renderEmptyDay(index))}

        {/* Days of the month */}
        {Array.from({ length: daysInMonth }, (_, index) => renderCalendarDay(index + 1))}
      </div>
    </div>
  );
};