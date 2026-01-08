export type UserRole = 'client' | 'barber' | 'admin';

export interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    avatar?: string;
}

export interface Service {
    id: string;
    name: string;
    duration: number; // in minutes
    price: number;
    description: string;
}

export interface Barber extends User {
    role: 'barber';
    rating: number;
    reviewCount: number;
    specialties: string[];
    bio: string;
    isAvailable: boolean;
}

export type AppointmentStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export interface Appointment {
    id: string;
    clientId: string;
    clientName: string;
    barberId: string;
    barberName: string;
    serviceId: string;
    serviceName: string;
    date: string; // ISO date string
    time: string;
    price: number;
    status: AppointmentStatus;
}

export const USERS: User[] = [
    {
        id: 'u1',
        name: 'Alex Johnson',
        email: 'alex@example.com',
        role: 'client',
        avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=100'
    },
    {
        id: 'u2',
        name: 'Sarah Connor',
        email: 'sarah@example.com',
        role: 'client'
    },
    {
        id: 'a1',
        name: 'Admin User',
        email: 'admin@gentlemanscut.com',
        role: 'admin'
    }
];

export const SERVICES: Service[] = [
    {
        id: 's1',
        name: 'Classic Haircut',
        duration: 45,
        price: 35,
        description: 'Traditional cut with scissors and clipper work, wash included.'
    },
    {
        id: 's2',
        name: 'Beard Trim & Shape',
        duration: 30,
        price: 25,
        description: 'Expert shaping with razor outline and hot towel finish.'
    },
    {
        id: 's3',
        name: 'The Gentleman Special',
        duration: 75,
        price: 55,
        description: 'Full haircut + beard trim + hot towel shave.'
    },
    {
        id: 's4',
        name: 'Buzz Cut',
        duration: 20,
        price: 20,
        description: 'One guard all over, quick and clean.'
    }
];

export const BARBERS: Barber[] = [
    {
        id: 'b1',
        name: 'Michael Chang',
        email: 'michael@gentlemanscut.com',
        role: 'barber',
        rating: 4.9,
        reviewCount: 124,
        specialties: ['Fades', 'Asian Hair', 'Scissor Cut'],
        bio: 'Master barber with 10 years of experience. Precision is my middle name.',
        isAvailable: true,
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100'
    },
    {
        id: 'b2',
        name: 'David Miller',
        email: 'david@gentlemanscut.com',
        role: 'barber',
        rating: 4.7,
        reviewCount: 89,
        specialties: ['Beards', 'Classic Cuts', 'Hot Towel'],
        bio: 'Specializing in classic styles and beard grooming.',
        isAvailable: true,
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100'
    },
    {
        id: 'b3',
        name: 'Jessica Davis',
        email: 'jess@gentlemanscut.com',
        role: 'barber',
        rating: 5.0,
        reviewCount: 42,
        specialties: ['Modern Styles', 'Designs', 'Kids'],
        bio: 'Fresh styles for the modern gentleman. I love creative designs.',
        isAvailable: false,
        avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=100'
    }
];

// Helper to generate a date string for "Tomorrow" or "Next Week"
const getFutureDate = (days: number) => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toISOString().split('T')[0];
};

export const APPOINTMENTS: Appointment[] = [
    {
        id: 'apt1',
        clientId: 'u1',
        clientName: 'Alex Johnson',
        barberId: 'b1',
        barberName: 'Michael Chang',
        serviceId: 's3',
        serviceName: 'The Gentleman Special',
        date: getFutureDate(1),
        time: '10:00',
        price: 55,
        status: 'confirmed'
    },
    {
        id: 'apt2',
        clientId: 'u2',
        clientName: 'Sarah Connor',
        barberId: 'b2',
        barberName: 'David Miller',
        serviceId: 's1',
        serviceName: 'Classic Haircut',
        date: getFutureDate(0), // Today
        time: '14:30',
        price: 35,
        status: 'pending'
    },
    {
        id: 'apt3',
        clientId: 'u1',
        clientName: 'Alex Johnson',
        barberId: 'b1',
        barberName: 'Michael Chang',
        serviceId: 's2',
        serviceName: 'Beard Trim & Shape',
        date: getFutureDate(-2), // Past
        time: '16:00',
        price: 25,
        status: 'completed'
    },
    {
        id: 'apt4',
        clientId: 'u3', // Random new client
        clientName: 'Tom Hardy',
        barberId: 'b3',
        barberName: 'Jessica Davis',
        serviceId: 's1',
        serviceName: 'Classic Haircut',
        date: getFutureDate(3),
        time: '11:00',
        price: 35,
        status: 'cancelled'
    }
];
