import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import type { AppointmentStatus } from "../mock/data"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function formatDateTime(dateStr: string, timeStr?: string) {
    if (!dateStr) return 'N/A';

    const date = new Date(dateStr);
    const formattedDate = new Intl.DateTimeFormat('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
    }).format(date);

    if (timeStr) {
        // Simple time formatting if needed, though usually timeStr is already HH:MM
        return `${formattedDate} at ${timeStr}`;
    }

    return formattedDate;
}

export function formatCurrency(amount: number) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(amount);
}

export function getStatusBadgeClass(status: AppointmentStatus) {
    switch (status) {
        case 'confirmed':
            return 'bg-green-100 text-green-700 hover:bg-green-100/80';
        case 'pending':
            return 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100/80';
        case 'completed':
            return 'bg-blue-100 text-blue-700 hover:bg-blue-100/80';
        case 'cancelled':
            return 'bg-red-100 text-red-700 hover:bg-red-100/80';
        default:
            return 'bg-slate-100 text-slate-700';
    }
}
