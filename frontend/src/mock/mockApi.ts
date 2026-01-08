import { APPOINTMENTS, BARBERS, SERVICES } from "./data";
import type { Appointment, AppointmentStatus, Barber } from "./data";
export type { Appointment, AppointmentStatus, Barber };

const DELAY_MS = 800;

const delay = <T>(data: T): Promise<T> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(data);
        }, DELAY_MS);
    });
};

export interface ClientDashboardData {
    upcomingAppointments: Appointment[];
    loyaltyPoints: number;
    totalVisits: number;
    memberStatus: string;
}

export interface BarberDashboardData {
    todayAppointments: Appointment[];
    totalEarningsToday: number;
    upcomingschedule: Appointment[];
    rating: number;
}

export interface AdminDashboardData {
    totalRevenue: number;
    totalBookings: number;
    activeBarbers: number;
    recentActivity: Appointment[];
}

export const mockApi = {
    getClientDashboard: async (): Promise<ClientDashboardData> => {
        return delay({
            upcomingAppointments: APPOINTMENTS.filter(a => a.status === 'confirmed' || a.status === 'pending').slice(0, 2),
            loyaltyPoints: 120,
            totalVisits: 12,
            memberStatus: 'Gold Member'
        });
    },

    getBarberDashboard: async (): Promise<BarberDashboardData> => {
        const today = new Date().toISOString().split('T')[0];
        const todayCommon = APPOINTMENTS.filter(a => a.date >= today); // Just a mock approximation

        return delay({
            todayAppointments: todayCommon.slice(0, 5),
            totalEarningsToday: 185,
            upcomingschedule: todayCommon,
            rating: 4.8
        });
    },

    getAdminDashboard: async (): Promise<AdminDashboardData> => {
        return delay({
            totalRevenue: 12450,
            totalBookings: 142,
            activeBarbers: 3,
            recentActivity: APPOINTMENTS.slice(0, 5)
        });
    },

    listAppointmentsByRole: async (role: 'client' | 'barber' | 'admin', userId?: string): Promise<Appointment[]> => {
        let filtered = [...APPOINTMENTS];

        if (role === 'client' && userId) {
            filtered = filtered.filter(a => a.clientId === userId);
        } else if (role === 'barber' && userId) {
            filtered = filtered.filter(a => a.barberId === userId);
        }

        // Admin sees all
        return delay(filtered);
    },

    updateAppointmentStatus: async (id: string, status: AppointmentStatus): Promise<Appointment> => {
        const apt = APPOINTMENTS.find(a => a.id === id);
        if (!apt) {
            throw new Error("Appointment not found");
        }

        // In a real app we'd clone or update the DB. Here we mutate the mock data for specific demo persistence within session
        apt.status = status;

        return delay({ ...apt });
    },

    getBarbers: async (): Promise<Barber[]> => {
        return delay(BARBERS);
    },

    getServices: async () => {
        return delay(SERVICES);
    }
};
