class CalendarService {
  constructor() {
    this.storageKey = 'monsite_calendar';
    this.availabilityKey = 'monsite_availability';
    this.init();
  }

  init() {
    if (!localStorage.getItem(this.storageKey)) {
      localStorage.setItem(
        this.storageKey,
        JSON.stringify(this.getSampleAppointments())
      );
    }

    if (!localStorage.getItem(this.availabilityKey)) {
      localStorage.setItem(
        this.availabilityKey,
        JSON.stringify(this.getDefaultAvailability())
      );
    }
  }

  // Types de rendez-vous
  getAppointmentTypes() {
    return [
      {
        id: 'consultation',
        label: 'Consultation initiale',
        duration: 60,
        color: '#8b5cf6',
      },
      {
        id: 'presentation',
        label: 'Présentation projet',
        duration: 90,
        color: '#3b82f6',
      },
      {
        id: 'review',
        label: 'Révision/Feedback',
        duration: 45,
        color: '#10b981',
      },
      {
        id: 'formation',
        label: 'Formation client',
        duration: 120,
        color: '#f59e0b',
      },
      {
        id: 'support',
        label: 'Support technique',
        duration: 30,
        color: '#ef4444',
      },
      { id: 'meeting', label: 'Réunion suivi', duration: 60, color: '#ec4899' },
    ];
  }

  // Statuts des rendez-vous
  getAppointmentStatuses() {
    return [
      {
        id: 'pending',
        label: 'En attente',
        color: 'text-yellow-400',
        bgColor: 'bg-yellow-500/20',
      },
      {
        id: 'confirmed',
        label: 'Confirmé',
        color: 'text-green-400',
        bgColor: 'bg-green-500/20',
      },
      {
        id: 'in_progress',
        label: 'En cours',
        color: 'text-blue-400',
        bgColor: 'bg-blue-500/20',
      },
      {
        id: 'completed',
        label: 'Terminé',
        color: 'text-gray-400',
        bgColor: 'bg-gray-500/20',
      },
      {
        id: 'cancelled',
        label: 'Annulé',
        color: 'text-red-400',
        bgColor: 'bg-red-500/20',
      },
      {
        id: 'rescheduled',
        label: 'Reporté',
        color: 'text-orange-400',
        bgColor: 'bg-orange-500/20',
      },
    ];
  }

  // Récupérer tous les rendez-vous
  getAppointments() {
    try {
      return JSON.parse(localStorage.getItem(this.storageKey)) || [];
    } catch {
      return [];
    }
  }

  // Sauvegarder les rendez-vous
  saveAppointments(appointments) {
    localStorage.setItem(this.storageKey, JSON.stringify(appointments));

    // Déclencher notification
    if (window.notificationService) {
      window.notificationService.checkForNewData();
    }
  }

  // Créer un nouveau rendez-vous
  createAppointment(appointmentData) {
    const appointments = this.getAppointments();
    const appointmentType = this.getAppointmentTypes().find(
      (t) => t.id === appointmentData.type
    );

    const newAppointment = {
      id: this.generateId(),
      title: appointmentData.title || `${appointmentType?.label}`,
      description: appointmentData.description || '',
      type: appointmentData.type,
      status: 'pending',
      startTime: appointmentData.startTime,
      endTime:
        appointmentData.endTime ||
        this.calculateEndTime(
          appointmentData.startTime,
          appointmentType?.duration || 60
        ),
      client: {
        name: appointmentData.clientName || '',
        email: appointmentData.clientEmail || '',
        phone: appointmentData.clientPhone || '',
      },
      location: appointmentData.location || 'Visioconférence',
      projectId: appointmentData.projectId || null,
      notes: appointmentData.notes || '',
      reminders: appointmentData.reminders || [
        { time: 24, unit: 'hours', sent: false },
        { time: 1, unit: 'hour', sent: false },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'admin',
    };

    appointments.push(newAppointment);
    this.saveAppointments(appointments);

    // Notification
    if (window.notificationService) {
      window.notificationService.addNotification({
        type: 'appointment_created',
        title: 'Nouveau rendez-vous planifié',
        message: `${newAppointment.title} - ${this.formatDate(
          newAppointment.startTime
        )}`,
      });
    }

    return newAppointment;
  }

  // Mettre à jour un rendez-vous
  updateAppointment(appointmentId, updates) {
    const appointments = this.getAppointments();
    const appointmentIndex = appointments.findIndex(
      (a) => a.id === appointmentId
    );

    if (appointmentIndex === -1) return null;

    const updatedAppointment = {
      ...appointments[appointmentIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    appointments[appointmentIndex] = updatedAppointment;
    this.saveAppointments(appointments);

    return updatedAppointment;
  }

  // Changer le statut d'un rendez-vous
  changeStatus(appointmentId, newStatus, reason = '') {
    const appointment = this.updateAppointment(appointmentId, {
      status: newStatus,
      statusReason: reason,
    });

    if (appointment && window.notificationService) {
      const statusInfo = this.getAppointmentStatuses().find(
        (s) => s.id === newStatus
      );
      window.notificationService.addNotification({
        type: 'appointment_status_changed',
        title: 'Statut rendez-vous modifié',
        message: `${appointment.title} - ${statusInfo?.label}`,
      });
    }

    return appointment;
  }

  // Supprimer un rendez-vous
  deleteAppointment(appointmentId) {
    const appointments = this.getAppointments();
    const filteredAppointments = appointments.filter(
      (a) => a.id !== appointmentId
    );
    this.saveAppointments(filteredAppointments);

    return filteredAppointments.length !== appointments.length;
  }

  // Récupérer les rendez-vous pour une période
  getAppointmentsForPeriod(startDate, endDate) {
    const appointments = this.getAppointments();
    const start = new Date(startDate);
    const end = new Date(endDate);

    return appointments.filter((appointment) => {
      const appointmentDate = new Date(appointment.startTime);
      return appointmentDate >= start && appointmentDate <= end;
    });
  }

  // Récupérer les rendez-vous du jour
  getTodayAppointments() {
    const today = new Date();
    const startOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    const endOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + 1
    );

    return this.getAppointmentsForPeriod(startOfDay, endOfDay);
  }

  // Récupérer les prochains rendez-vous
  getUpcomingAppointments(limit = 5) {
    const appointments = this.getAppointments();
    const now = new Date();

    return appointments
      .filter((a) => new Date(a.startTime) > now && a.status !== 'cancelled')
      .sort((a, b) => new Date(a.startTime) - new Date(b.startTime))
      .slice(0, limit);
  }

  // Vérifier les conflits d'horaire
  checkConflicts(startTime, endTime, excludeId = null) {
    const appointments = this.getAppointments();
    const newStart = new Date(startTime);
    const newEnd = new Date(endTime);

    return appointments.filter((appointment) => {
      if (appointment.id === excludeId) return false;
      if (appointment.status === 'cancelled') return false;

      const existingStart = new Date(appointment.startTime);
      const existingEnd = new Date(appointment.endTime);

      return newStart < existingEnd && newEnd > existingStart;
    });
  }

  // Récupérer les créneaux disponibles pour un jour
  getAvailableSlots(date) {
    const availability = this.getAvailability();
    const dayOfWeek = new Date(date).getDay();
    const dayAvailability = availability.weeklySchedule[dayOfWeek];

    if (!dayAvailability || !dayAvailability.available) {
      return [];
    }

    const appointments = this.getAppointmentsForPeriod(
      new Date(date),
      new Date(new Date(date).getTime() + 24 * 60 * 60 * 1000)
    );

    const slots = [];
    const slotDuration = 30; // 30 minutes par créneau

    dayAvailability.hours.forEach((period) => {
      let currentTime = this.parseTime(period.start);
      const endTime = this.parseTime(period.end);

      while (currentTime < endTime) {
        const slotStart = new Date(date);
        slotStart.setHours(Math.floor(currentTime), (currentTime % 1) * 60);

        const slotEnd = new Date(slotStart.getTime() + slotDuration * 60000);

        // Vérifier les conflits
        const hasConflict = appointments.some((apt) => {
          const aptStart = new Date(apt.startTime);
          const aptEnd = new Date(apt.endTime);
          return slotStart < aptEnd && slotEnd > aptStart;
        });

        if (!hasConflict) {
          slots.push({
            start: slotStart.toISOString(),
            end: slotEnd.toISOString(),
            duration: slotDuration,
          });
        }

        currentTime += slotDuration / 60;
      }
    });

    return slots;
  }

  // Récupérer la disponibilité
  getAvailability() {
    try {
      return (
        JSON.parse(localStorage.getItem(this.availabilityKey)) ||
        this.getDefaultAvailability()
      );
    } catch {
      return this.getDefaultAvailability();
    }
  }

  // Sauvegarder la disponibilité
  saveAvailability(availability) {
    localStorage.setItem(this.availabilityKey, JSON.stringify(availability));
  }

  // Statistiques des rendez-vous
  getAppointmentStats() {
    const appointments = this.getAppointments();
    const now = new Date();
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    const thisMonthAppointments = appointments.filter((a) => {
      const date = new Date(a.startTime);
      return date >= thisMonth && date < nextMonth;
    });

    const statuses = this.getAppointmentStatuses();
    const statusCounts = statuses.reduce((acc, status) => {
      acc[status.id] = appointments.filter(
        (a) => a.status === status.id
      ).length;
      return acc;
    }, {});

    const types = this.getAppointmentTypes();
    const typeCounts = types.reduce((acc, type) => {
      acc[type.id] = appointments.filter((a) => a.type === type.id).length;
      return acc;
    }, {});

    return {
      total: appointments.length,
      thisMonth: thisMonthAppointments.length,
      upcoming: this.getUpcomingAppointments().length,
      today: this.getTodayAppointments().length,
      byStatus: statusCounts,
      byType: typeCounts,
      completionRate:
        appointments.length > 0
          ? Math.round((statusCounts.completed / appointments.length) * 100)
          : 0,
    };
  }

  // Rechercher des rendez-vous
  searchAppointments(query, filters = {}) {
    let appointments = this.getAppointments();

    // Recherche textuelle
    if (query) {
      const searchLower = query.toLowerCase();
      appointments = appointments.filter(
        (apt) =>
          apt.title.toLowerCase().includes(searchLower) ||
          apt.client.name.toLowerCase().includes(searchLower) ||
          apt.client.email.toLowerCase().includes(searchLower) ||
          apt.description.toLowerCase().includes(searchLower)
      );
    }

    // Filtres
    if (filters.status) {
      appointments = appointments.filter((a) => a.status === filters.status);
    }

    if (filters.type) {
      appointments = appointments.filter((a) => a.type === filters.type);
    }

    if (filters.dateRange) {
      const { start, end } = filters.dateRange;
      appointments = appointments.filter((a) => {
        const appointmentDate = new Date(a.startTime);
        return (
          appointmentDate >= new Date(start) && appointmentDate <= new Date(end)
        );
      });
    }

    return appointments;
  }

  // Utilitaires
  generateId() {
    return (
      'apt_' + Date.now().toString(36) + Math.random().toString(36).substr(2)
    );
  }

  calculateEndTime(startTime, durationMinutes) {
    const start = new Date(startTime);
    return new Date(start.getTime() + durationMinutes * 60000).toISOString();
  }

  parseTime(timeString) {
    const [hours, minutes] = timeString.split(':').map(Number);
    return hours + (minutes || 0) / 60;
  }

  formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  formatTime(dateString) {
    return new Date(dateString).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  // Données d'exemple
  getSampleAppointments() {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return [
      {
        id: 'apt_001',
        title: 'Consultation initiale - Site E-commerce',
        description:
          'Première réunion pour discuter des besoins du projet e-commerce',
        type: 'consultation',
        status: 'confirmed',
        startTime: new Date(
          tomorrow.getFullYear(),
          tomorrow.getMonth(),
          tomorrow.getDate(),
          14,
          0
        ).toISOString(),
        endTime: new Date(
          tomorrow.getFullYear(),
          tomorrow.getMonth(),
          tomorrow.getDate(),
          15,
          0
        ).toISOString(),
        client: {
          name: 'Marie Dubois',
          email: 'marie.dubois@fashion.com',
          phone: '+33 6 12 34 56 78',
        },
        location: 'Zoom - Lien envoyé par email',
        projectId: 'proj_001',
        notes: 'Préparer les exemples de sites similaires',
        reminders: [
          { time: 24, unit: 'hours', sent: false },
          { time: 1, unit: 'hour', sent: false },
        ],
        createdAt: today.toISOString(),
        updatedAt: today.toISOString(),
        createdBy: 'admin',
      },
    ];
  }

  getDefaultAvailability() {
    return {
      weeklySchedule: {
        0: { available: false, hours: [] }, // Dimanche
        1: {
          available: true,
          hours: [
            { start: '09:00', end: '12:00' },
            { start: '14:00', end: '18:00' },
          ],
        }, // Lundi
        2: {
          available: true,
          hours: [
            { start: '09:00', end: '12:00' },
            { start: '14:00', end: '18:00' },
          ],
        }, // Mardi
        3: {
          available: true,
          hours: [
            { start: '09:00', end: '12:00' },
            { start: '14:00', end: '18:00' },
          ],
        }, // Mercredi
        4: {
          available: true,
          hours: [
            { start: '09:00', end: '12:00' },
            { start: '14:00', end: '18:00' },
          ],
        }, // Jeudi
        5: {
          available: true,
          hours: [
            { start: '09:00', end: '12:00' },
            { start: '14:00', end: '17:00' },
          ],
        }, // Vendredi
        6: { available: false, hours: [] }, // Samedi
      },
      holidays: [],
      specialDates: {},
    };
  }
}

// Instance unique
const calendarService = new CalendarService();
export default calendarService;
