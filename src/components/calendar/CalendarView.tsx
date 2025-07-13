import React, { useState } from 'react';
import { useAppointments } from '@/contexts/AppointmentContext';
import { MonthView } from './MonthView';
import { DayView } from './DayView';
import { AppointmentModal } from './AppointmentModal';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarDays, LogOut, Plus, Users, UserCheck } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';

export const CalendarView: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAppointmentId, setEditingAppointmentId] = useState<string | null>(null);
  const { getAppointmentsByDate, appointments } = useAppointments();
  const { logout } = useAuth();
  const isMobile = useIsMobile();

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    if (isMobile) {
      // On mobile, selecting a date doesn't automatically open the modal
      return;
    }
  };

  const handleAddAppointment = (date?: Date) => {
    if (date) {
      setSelectedDate(date);
    }
    setEditingAppointmentId(null);
    setIsModalOpen(true);
  };

  const handleEditAppointment = (appointmentId: string) => {
    setEditingAppointmentId(appointmentId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingAppointmentId(null);
  };

  const todayAppointments = getAppointmentsByDate(formatDate(new Date()));
  const totalAppointments = appointments.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-accent/10">
      {/* Header */}
      <header className="bg-card border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <CalendarDays className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Appointment Calendar</h1>
                <p className="text-sm text-muted-foreground">Clinic Staff Portal</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button
                onClick={() => handleAddAppointment()}
                className="flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                New Appointment
              </Button>
              <Button variant="outline" onClick={logout} className="flex items-center gap-2">
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today's Appointments</CardTitle>
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{todayAppointments.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Appointments</CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{totalAppointments}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Patients</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                {new Set(appointments.map(apt => apt.patientId)).size}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Calendar */}
        <Card className="shadow-elegant">
          <CardContent className="p-6">
            {isMobile ? (
              <DayView
                selectedDate={selectedDate}
                onDateChange={setSelectedDate}
                onAddAppointment={handleAddAppointment}
                onEditAppointment={handleEditAppointment}
              />
            ) : (
              <MonthView
                selectedDate={selectedDate}
                onDateSelect={handleDateSelect}
                onAddAppointment={handleAddAppointment}
                onEditAppointment={handleEditAppointment}
              />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Appointment Modal */}
      <AppointmentModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        selectedDate={selectedDate}
        editingAppointmentId={editingAppointmentId}
      />
    </div>
  );
};